import logging

from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    MetricsCollectedEvent,
    RoomInputOptions,
    WorkerOptions,
    cli,
    metrics,
    tokenize,
    function_tool,
    RunContext
)
from livekit.plugins import murf, silero, google, deepgram, noise_cancellation
from livekit.plugins.turn_detector.multilingual import MultilingualModel
from cart_manager import CartManager

logger = logging.getLogger("agent")

load_dotenv(".env.local")


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are a friendly food and grocery ordering assistant for QuickMart. The user is interacting with you via voice.
            
            Your role:
            - Help users order groceries and food items
            - Add, remove, or update items in their cart
            - Handle recipe-based requests like "ingredients for pasta" or "what I need for a sandwich"
            - Confirm every cart action verbally
            - Ask for quantity if not specified (default to 1)
            - Show cart contents when asked
            - Place orders when user says they're done
            
            Be conversational, friendly, and efficient. Keep responses concise without emojis or special formatting.
            Always confirm what you've added or changed in the cart.""",
        )
        self.cart_manager = CartManager()

    @function_tool
    async def add_item_to_cart(self, context: RunContext, item_name: str, quantity: int = 1):
        """Add an item to the shopping cart.
        
        Args:
            item_name: Name of the item to add (e.g., "milk", "bread", "eggs")
            quantity: Number of items to add (default: 1)
        """
        logger.info(f"Adding {quantity} x {item_name} to cart")
        result = self.cart_manager.add_to_cart(item_name, quantity)
        return result["message"]

    @function_tool
    async def remove_item_from_cart(self, context: RunContext, item_name: str):
        """Remove an item completely from the shopping cart.
        
        Args:
            item_name: Name of the item to remove
        """
        logger.info(f"Removing {item_name} from cart")
        result = self.cart_manager.remove_from_cart(item_name)
        return result["message"]

    @function_tool
    async def update_item_quantity(self, context: RunContext, item_name: str, quantity: int):
        """Update the quantity of an item in the cart.
        
        Args:
            item_name: Name of the item to update
            quantity: New quantity (use 0 to remove)
        """
        logger.info(f"Updating {item_name} quantity to {quantity}")
        result = self.cart_manager.update_quantity(item_name, quantity)
        return result["message"]

    @function_tool
    async def add_recipe_ingredients(self, context: RunContext, recipe_name: str):
        """Add all ingredients needed for a recipe or dish.
        
        Use this when user asks for "ingredients for X" or "what I need for X".
        
        Args:
            recipe_name: Name of the recipe (e.g., "pasta", "sandwich", "omelette", "breakfast")
        """
        logger.info(f"Adding ingredients for {recipe_name}")
        result = self.cart_manager.add_recipe_items(recipe_name)
        return result["message"]

    @function_tool
    async def show_cart(self, context: RunContext):
        """Show all items currently in the shopping cart with total price.
        
        Use this when user asks "what's in my cart" or "show my cart".
        """
        logger.info("Showing cart contents")
        cart_data = self.cart_manager.get_cart()
        
        if not cart_data["items"]:
            return cart_data["message"]
        
        items_list = []
        for item in cart_data["items"]:
            items_list.append(f"{item['quantity']} x {item['name']} at ₹{item['price']} each")
        
        items_str = ", ".join(items_list)
        return f"Your cart has: {items_str}. Total: ₹{cart_data['total']}"

    @function_tool
    async def place_order(self, context: RunContext, customer_name: str = "Guest"):
        """Place the order and save it. Use this when user says they're done or wants to place the order.
        
        Args:
            customer_name: Customer's name (default: "Guest")
        """
        logger.info(f"Placing order for {customer_name}")
        result = self.cart_manager.place_order(customer_name)
        return result["message"]

    @function_tool
    async def clear_cart(self, context: RunContext):
        """Clear all items from the cart. Use this if user wants to start over.
        """
        logger.info("Clearing cart")
        result = self.cart_manager.clear_cart()
        return result["message"]


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    # Logging setup
    # Add any other context you want in all log entries here
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # Set up a voice AI pipeline using OpenAI, Cartesia, AssemblyAI, and the LiveKit turn detector
    session = AgentSession(
        # Speech-to-text (STT) is your agent's ears, turning the user's speech into text that the LLM can understand
        # See all available models at https://docs.livekit.io/agents/models/stt/
        stt=deepgram.STT(model="nova-3"),
        # A Large Language Model (LLM) is your agent's brain, processing user input and generating a response
        # See all available models at https://docs.livekit.io/agents/models/llm/
        llm=google.LLM(
                model="gemini-2.5-flash",
            ),
        # Text-to-speech (TTS) is your agent's voice, turning the LLM's text into speech that the user can hear
        # See all available models as well as voice selections at https://docs.livekit.io/agents/models/tts/
        tts=murf.TTS(
                voice="en-US-matthew", 
                style="Conversation",
                tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
                text_pacing=True
            ),
        # VAD and turn detection are used to determine when the user is speaking and when the agent should respond
        # See more at https://docs.livekit.io/agents/build/turns
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        # allow the LLM to generate a response while waiting for the end of turn
        # See more at https://docs.livekit.io/agents/build/audio/#preemptive-generation
        preemptive_generation=True,
    )

    # To use a realtime model instead of a voice pipeline, use the following session setup instead.
    # (Note: This is for the OpenAI Realtime API. For other providers, see https://docs.livekit.io/agents/models/realtime/))
    # 1. Install livekit-agents[openai]
    # 2. Set OPENAI_API_KEY in .env.local
    # 3. Add `from livekit.plugins import openai` to the top of this file
    # 4. Use the following session setup instead of the version above
    # session = AgentSession(
    #     llm=openai.realtime.RealtimeModel(voice="marin")
    # )

    # Metrics collection, to measure pipeline performance
    # For more information, see https://docs.livekit.io/agents/build/metrics/
    usage_collector = metrics.UsageCollector()

    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: {summary}")

    ctx.add_shutdown_callback(log_usage)

    # # Add a virtual avatar to the session, if desired
    # # For other providers, see https://docs.livekit.io/agents/models/avatar/
    # avatar = hedra.AvatarSession(
    #   avatar_id="...",  # See https://docs.livekit.io/agents/models/avatar/plugins/hedra
    # )
    # # Start the avatar and wait for it to join
    # await avatar.start(session, room=ctx.room)

    # Start the session, which initializes the voice pipeline and warms up the models
    await session.start(
        agent=Assistant(),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            # For telephony applications, use `BVCTelephony` for best results
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # Join the room and connect to the user
    await ctx.connect()
    
    # Send automatic greeting when agent joins
    await session.say("Hello! Welcome to QuickMart. I'm your voice shopping assistant. I can help you add items to your cart, suggest ingredients for recipes, or place your order. How can I help you today?")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
