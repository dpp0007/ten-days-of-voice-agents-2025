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
import json
import os
from datetime import datetime
from typing import Optional
from livekit.plugins import murf, silero, google, deepgram, noise_cancellation
from livekit.plugins.turn_detector.multilingual import MultilingualModel

logger = logging.getLogger("agent")

load_dotenv(".env.local")


class CoffeeBarista(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are a multilingual, witty virtual barista for BLUE TOKAI COFFEE ROASTERS. Your single goal is to take coffee orders via conversation, fill an internal order state, confirm it with the customer, and then save the final order.

PERSONA & TONE:
- You are friendly, slightly witty, and warm with an Indian English speaking style
- Use a conversational, upbeat tone with occasional playful comments
- Speak ONLY in English - no Hindi or Hinglish words
- Keep jokes light and never be rude or harsh
- Examples: "What would you like today – a strong espresso or a chill cold brew?" or "Got it, one medium latte coming right up!"

BRAND CONTEXT:
- You work at BLUE TOKAI COFFEE ROASTERS
- Reference "our roasts", "Blue Tokai brews", "signature cold brews"
- Menu: Espresso, Americano, Cappuccino, Latte, Flat White, Mocha, Cold Brew, Iced Latte, Frappé, Hot Chocolate
- Accept custom drinks too

LANGUAGE BEHAVIOR:
- Speak ONLY in English with an Indian conversational style
- Use natural Indian English expressions and phrasing
- Be warm and friendly but stick to English only
- Examples: "What would you like today?", "That's great!", "One medium latte", "What's your name?"
- Keep it conversational and fun but entirely in English

ORDER STATE MANAGEMENT:
You maintain an internal order with these fields:
- drinkType: type of coffee drink
- size: "small", "medium", or "large"
- milk: "regular", "skim", "oat", "soy", "almond"
- extras: array of extras like "extra shot", "vanilla syrup", "caramel drizzle", "whipped cream"
- name: customer's name

CONVERSATION FLOW:
1. Ask for name first: "What's your name?"
2. Ask drink type: "What are you in the mood for today? Latte, cappuccino, cold brew?"
3. Ask size: If not specified, default to "medium" but confirm: "What size would you like - small, medium, or large?"
4. Ask milk: If not specified, default to "regular milk" but confirm: "What kind of milk would you prefer? Regular, oat, almond, soy?"
5. Ask extras: "Would you like any extras? Extra shot, vanilla syrup, whipped cream?"
6. Recap the complete order clearly in English
7. Ask for confirmation: "Does that sound good? Should I confirm this order?"
8. After confirmation, use the save_order tool

CLARIFYING QUESTIONS:
- Ask one or two things at a time to keep it natural
- If user provides multiple details at once, extract them and only ask about missing fields
- If user changes their mind, update only that field

ERROR HANDLING:
- If input is unclear, politely ask again
- If user is off-topic too long, gently bring them back: "I'm loving this chat, but let's get your coffee order sorted out!"

IMPORTANT:
- Keep responses natural and conversational for voice interaction
- Don't use complex formatting, emojis, or markdown in your speech
- Use the function tools to manage order state
- Only call save_order after explicit user confirmation""",
        )
        
        # Initialize order state
        self.order_state = {
            "drinkType": "",
            "size": "",
            "milk": "",
            "extras": [],
            "name": ""
        }

    async def on_enter(self) -> None:
        """Called when the agent starts - greet the customer"""
        await self.session.say("Hello! Welcome to Blue Tokai Coffee Roasters. I'm your virtual barista today. What's your name, and what kind of coffee are you in the mood for?")
    
    def _generate_html_receipt(self, order_data: dict) -> str:
        """Generate an HTML receipt visualization for the order."""
        
        # Determine cup size for visualization
        cup_heights = {"small": "100px", "medium": "140px", "large": "180px"}
        cup_height = cup_heights.get(order_data["size"], "140px")
        
        # Check if it's a cold drink
        is_cold = any(word in order_data["drinkType"].lower() for word in ["iced", "cold", "frappe"])
        cup_color = "#87CEEB" if is_cold else "#8B4513"
        
        # Check for whipped cream
        has_whipped_cream = any("whipped" in extra.lower() for extra in order_data.get("extras", []))
        
        # Build extras list
        extras_html = ""
        if order_data.get("extras"):
            extras_items = "".join([f"<li>{extra}</li>" for extra in order_data["extras"]])
            extras_html = f"<div style='margin-top: 10px;'><strong>Extras:</strong><ul style='margin: 5px 0; padding-left: 20px;'>{extras_items}</ul></div>"
        
        # Whipped cream topping
        whipped_cream_html = ""
        if has_whipped_cream:
            whipped_cream_html = """
            <div style='position: absolute; top: -20px; left: 50%; transform: translateX(-50%); 
                        width: 80px; height: 30px; background: #FFFACD; 
                        border-radius: 50% 50% 0 0; border: 2px solid #F5DEB3;'></div>
            """
        
        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blue Tokai Order - {order_data['name']}</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }}
        .receipt {{
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 500px;
            width: 100%;
        }}
        .header {{
            text-align: center;
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }}
        .header h1 {{
            color: #667eea;
            margin: 0;
            font-size: 28px;
        }}
        .header p {{
            color: #666;
            margin: 5px 0 0 0;
            font-size: 14px;
        }}
        .cup-container {{
            display: flex;
            justify-content: center;
            margin: 30px 0;
            position: relative;
        }}
        .cup {{
            position: relative;
            width: 100px;
            height: {cup_height};
            background: {cup_color};
            border-radius: 0 0 20px 20px;
            border: 3px solid #333;
            box-shadow: inset 0 -20px 30px rgba(0,0,0,0.2);
        }}
        .order-details {{
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }}
        .order-row {{
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #dee2e6;
        }}
        .order-row:last-child {{
            border-bottom: none;
        }}
        .label {{
            font-weight: 600;
            color: #495057;
        }}
        .value {{
            color: #212529;
            text-transform: capitalize;
        }}
        .footer {{
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #dee2e6;
        }}
        .footer h2 {{
            color: #667eea;
            margin: 0 0 10px 0;
            font-size: 24px;
        }}
        .footer p {{
            color: #666;
            margin: 5px 0;
            font-size: 14px;
        }}
        .timestamp {{
            text-align: center;
            color: #999;
            font-size: 12px;
            margin-top: 20px;
        }}
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <h1>☕ BLUE TOKAI</h1>
            <p>Coffee Roasters</p>
        </div>
        
        <div class="cup-container">
            <div class="cup">
                {whipped_cream_html}
            </div>
        </div>
        
        <div class="order-details">
            <div class="order-row">
                <span class="label">Customer:</span>
                <span class="value">{order_data['name']}</span>
            </div>
            <div class="order-row">
                <span class="label">Drink:</span>
                <span class="value">{order_data['drinkType']}</span>
            </div>
            <div class="order-row">
                <span class="label">Size:</span>
                <span class="value">{order_data['size']}</span>
            </div>
            <div class="order-row">
                <span class="label">Milk:</span>
                <span class="value">{order_data['milk']}</span>
            </div>
            {extras_html}
        </div>
        
        <div class="footer">
            <h2>Order Confirmed!</h2>
            <p>Your coffee will be ready shortly</p>
            <p style="color: #667eea; font-weight: 600;">Enjoy your brew! ☕</p>
        </div>
        
        <div class="timestamp">
            Order placed: {order_data['timestamp']}
        </div>
    </div>
</body>
</html>
"""
        return html

    @function_tool()
    async def set_name(self, context: RunContext, name: str) -> str:
        """Set the customer's name for the order.
        
        Args:
            name: Customer's name
        """
        self.order_state["name"] = name
        logger.info(f"Set name: {name}")
        
        if not self.order_state["drinkType"]:
            return f"Nice to meet you, {name}! What are you in the mood for? Latte, cappuccino, cold brew, mocha, something else?"
        return f"Got it, {name}!"

    @function_tool()
    async def set_drink_type(self, context: RunContext, drink_type: str) -> str:
        """Set the drink type in the order.
        
        Args:
            drink_type: The type of coffee drink (e.g., latte, cappuccino, espresso, americano, mocha, cold brew, iced latte)
        """
        self.order_state["drinkType"] = drink_type
        logger.info(f"Set drink type: {drink_type}")
        
        if not self.order_state["size"]:
            return f"Great choice! What size would you like - small, medium, or large?"
        return f"Changed to {drink_type}!"

    @function_tool()
    async def set_size(self, context: RunContext, size: str) -> str:
        """Set the size of the drink.
        
        Args:
            size: The size of the drink - must be "small", "medium", or "large"
        """
        size = size.lower()
        if size not in ["small", "medium", "large"]:
            size = "medium"
        
        self.order_state["size"] = size
        logger.info(f"Set size: {size}")
        
        if not self.order_state["milk"]:
            return f"Perfect, a {size} {self.order_state['drinkType']}. What kind of milk - regular, oat, almond, soy, or skim?"
        return f"Changed to {size}!"

    @function_tool()
    async def set_milk(self, context: RunContext, milk: str) -> str:
        """Set the milk preference.
        
        Args:
            milk: Type of milk - "regular", "skim", "oat", "almond", "soy", or "none"
        """
        self.order_state["milk"] = milk.lower()
        logger.info(f"Set milk: {milk}")
        
        if not self.order_state["extras"] and self.order_state["name"]:
            return f"Great! {milk} milk it is. Koi extras chahiye? Extra shot, vanilla syrup, caramel, whipped cream? Ya simple hi?"
        return f"Changed to {milk} milk!"

    @function_tool()
    async def add_extras(self, context: RunContext, extras: str) -> str:
        """Add extras to the order.
        
        Args:
            extras: Comma-separated list of extras (e.g., "extra shot, vanilla syrup, whipped cream")
        """
        extras_list = [e.strip() for e in extras.split(",")]
        self.order_state["extras"] = extras_list
        logger.info(f"Set extras: {extras_list}")
        return f"Added {', '.join(extras_list)}!"

    @function_tool()
    async def no_extras(self, context: RunContext) -> str:
        """Call this when customer doesn't want any extras."""
        self.order_state["extras"] = []
        logger.info("No extras requested")
        return "No problem, keeping it simple!"
    
    @function_tool()
    async def confirm_order(self, context: RunContext) -> str:
        """Confirm the complete order with the customer before saving. Call this to recap all order details."""
        
        # Check if all required fields are filled
        missing = []
        if not self.order_state["name"]:
            missing.append("name")
        if not self.order_state["drinkType"]:
            missing.append("drink type")
        if not self.order_state["size"]:
            missing.append("size")
        if not self.order_state["milk"]:
            missing.append("milk preference")
        
        if missing:
            return f"I still need: {', '.join(missing)}. Let me know those details."
        
        # Build confirmation message
        extras_text = ""
        if self.order_state["extras"]:
            extras_text = f" with {', '.join(self.order_state['extras'])}"
        
        confirmation = (
            f"Alright, here's your order: "
            f"A {self.order_state['size']} {self.order_state['drinkType']} "
            f"with {self.order_state['milk']} milk{extras_text} "
            f"for {self.order_state['name']}. "
            f"Sab theek hai? Should I lock this in?"
        )
        
        logger.info(f"Order confirmation: {self.order_state}")
        return confirmation

    @function_tool()
    async def save_order(self, context: RunContext) -> str:
        """Save the complete order to a JSON file. ONLY call this after the customer has explicitly confirmed the order."""
        
        # Validate all fields are filled
        if not all([
            self.order_state["name"],
            self.order_state["drinkType"],
            self.order_state["size"],
            self.order_state["milk"]
        ]):
            return "I can't save the order yet - some details are missing. Let me confirm everything first."
        
        # Create orders directory if it doesn't exist
        orders_dir = "orders"
        os.makedirs(orders_dir, exist_ok=True)
        
        # Generate filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{orders_dir}/order_{timestamp}_{self.order_state['name']}.json"
        
        # Prepare order data
        order_data = {
            **self.order_state,
            "timestamp": datetime.now().isoformat(),
            "status": "confirmed"
        }
        
        # Save to JSON file
        with open(filename, 'w') as f:
            json.dump(order_data, f, indent=2)
        
        # Log the machine-readable format
        json_str = json.dumps(self.order_state, separators=(',', ':'))
        logger.info(f"SAVE_ORDER_JSON: {json_str}")
        logger.info(f"Order saved to {filename}")
        
        # Generate HTML visualization
        html_filename = f"{orders_dir}/order_{timestamp}_{self.order_state['name']}.html"
        html_content = self._generate_html_receipt(order_data)
        with open(html_filename, 'w', encoding='utf-8') as f:
            f.write(html_content)
        logger.info(f"HTML_SNIPPET:")
        logger.info(html_content)
        logger.info(f"END_HTML_SNIPPET")
        logger.info(f"HTML receipt saved to {html_filename}")
        
        # Reset order state for next customer
        self.order_state = {
            "drinkType": "",
            "size": "",
            "milk": "",
            "extras": [],
            "name": ""
        }
        
        return f"Perfect! Your Blue Tokai order is locked in. Your {order_data['size']} {order_data['drinkType']} will be ready shortly. Thank you, {order_data['name']}! Enjoy your brew!"


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
                voice="anisha", 
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
        agent=CoffeeBarista(),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            # For telephony applications, use `BVCTelephony` for best results
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # Join the room and connect to the user
    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
