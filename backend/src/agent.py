import logging
import asyncio

from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    MetricsCollectedEvent,
    RoomInputOptions,
    RoomOutputOptions,
    WorkerOptions,
    cli,
    metrics,
    tokenize,
    function_tool,
    RunContext
)
from livekit.plugins import murf, silero, google, deepgram, noise_cancellation
from livekit.plugins.turn_detector.multilingual import MultilingualModel
from game_master import GameMaster

logger = logging.getLogger("agent")

load_dotenv(".env.local")


class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are a Voice-Only Game Master (GM) running an interactive D&D-style adventure.

UNIVERSE:
A floating city called "Aetherfall" drifts above an endless storm.
Below the city is the Abyss — a violent world of lightning, ancient machines, and hidden civilizations.
Above it float shattered islands held together by magic.

TONE:
Epic, mysterious, emotional, immersive.

ROLE:
You are the narrator, world engine, and NPC controller.
The player controls only their own actions by speaking.

RULES:
1. Always speak in second person ("You walk", "You hear").
2. Always remember names, places, items using chat history.
3. Every reply must:
   - Describe the environment
   - Respond to the player's previous action
   - Introduce consequence or change
   - End with ONE clear question
4. Never make decisions for the player.
5. Never explain rules unless asked.
6. Never mention "AI" or "system".
7. Failure is possible. Choices matter.
8. No long monologues — keep replies punchy and cinematic.
9. Do not repeat scenes.
10. The story must evolve toward discovery, conflict, and resolution.

PLAYER STATUS (TRACK IN MEMORY):
- Health starts at "Stable"
- Inventory starts empty
- Location updates continuously
- NPC relations change based on dialogue
- Secrets / clues accumulate

STORY STRUCTURE:
The story must progress through:
1. Awakening
2. Discovery
3. Threat
4. Choice
5. Outcome

TOOLS:
Use your tools to track game state:
- Call roll_dice() or make_attribute_check() for risky actions
- Update HP with update_player_hp() after damage or healing
- Add/remove items with inventory tools
- Record important events with record_event()
- Track NPCs with add_npc()
- Update location with update_location()

Voice style: cinematic narrator, calm but intense, dramatic pauses, immersive tone.""",
        )
        self.game_master = GameMaster()

    @function_tool
    async def roll_dice(self, context: RunContext, sides: int = 20, modifier: int = 0):
        """Roll dice for random outcomes. Use for combat, skill checks, or any risky action.
        
        Args:
            sides: Number of sides on the die (default: 20 for d20)
            modifier: Bonus or penalty to add to the roll (default: 0)
        """
        logger.info(f"Rolling d{sides} with modifier {modifier}")
        result = self.game_master.roll_dice(sides, modifier)
        self.game_master.increment_turn()
        return f"Rolled {result['roll']} + {result['modifier']} = {result['total']}. Result: {result['result']}"

    @function_tool
    async def make_attribute_check(self, context: RunContext, attribute: str, difficulty: int = 10):
        """Make a skill check using player attributes. Use when player attempts something challenging.
        
        Args:
            attribute: Which attribute to test - "strength", "intelligence", or "luck"
            difficulty: How hard the check is (10=normal, 15=hard, 20=very hard)
        """
        logger.info(f"Making {attribute} check, difficulty {difficulty}")
        result = self.game_master.make_check(attribute, difficulty)
        self.game_master.increment_turn()
        
        success_text = "Success!" if result["success"] else "Failure!"
        return f"{attribute.capitalize()} check: Rolled {result['roll']} + {result['modifier']} = {result['total']} vs DC {difficulty}. {success_text} ({result['result']})"

    @function_tool
    async def update_player_hp(self, context: RunContext, amount: int):
        """Change player's HP. Use positive for healing, negative for damage.
        
        Args:
            amount: HP to add (positive) or remove (negative)
        """
        logger.info(f"Updating HP by {amount}")
        result = self.game_master.update_player_hp(amount)
        return result

    @function_tool
    async def add_to_inventory(self, context: RunContext, item: str):
        """Add an item to the player's inventory when they find or receive something.
        
        Args:
            item: Name of the item to add (e.g., "magic sword", "healing potion", "ancient key")
        """
        logger.info(f"Adding {item} to inventory")
        result = self.game_master.add_to_inventory(item)
        return result

    @function_tool
    async def remove_from_inventory(self, context: RunContext, item: str):
        """Remove an item from inventory when player uses or loses it.
        
        Args:
            item: Name of the item to remove
        """
        logger.info(f"Removing {item} from inventory")
        result = self.game_master.remove_from_inventory(item)
        return result

    @function_tool
    async def check_inventory(self, context: RunContext):
        """Show what the player is carrying. Use when player asks about their items or inventory.
        """
        logger.info("Checking inventory")
        result = self.game_master.get_inventory()
        return result

    @function_tool
    async def show_character_sheet(self, context: RunContext):
        """Display full character information: HP, stats, and inventory.
        """
        logger.info("Showing character sheet")
        result = self.game_master.get_character_sheet()
        return result

    @function_tool
    async def update_location(self, context: RunContext, location_name: str, description: str):
        """Update the current location when player moves to a new area.
        
        Args:
            location_name: Name of the new location
            description: Brief description of the location
        """
        logger.info(f"Moving to {location_name}")
        result = self.game_master.update_location(location_name, description)
        return result

    @function_tool
    async def add_npc(self, context: RunContext, name: str, role: str, attitude: str = "neutral"):
        """Record an NPC the player meets.
        
        Args:
            name: NPC's name
            role: What they are (e.g., "merchant", "guard", "wizard")
            attitude: How they feel about player - "friendly", "hostile", or "neutral"
        """
        logger.info(f"Adding NPC: {name}")
        result = self.game_master.add_npc(name, role, attitude)
        return result

    @function_tool
    async def record_event(self, context: RunContext, event: str):
        """Record an important story event for continuity.
        
        Args:
            event: Description of what happened (e.g., "defeated the goblin chief", "found the secret passage")
        """
        logger.info(f"Recording event: {event}")
        self.game_master.add_event(event)
        return f"Event recorded: {event}"

    @function_tool
    async def add_quest(self, context: RunContext, quest: str):
        """Give the player a new quest or objective.
        
        Args:
            quest: Description of the quest
        """
        logger.info(f"Adding quest: {quest}")
        result = self.game_master.add_quest(quest)
        return result

    @function_tool
    async def complete_quest(self, context: RunContext, quest: str):
        """Mark a quest as completed when player achieves the objective.
        
        Args:
            quest: The quest that was completed
        """
        logger.info(f"Completing quest: {quest}")
        result = self.game_master.complete_quest(quest)
        return result

    @function_tool
    async def reset_game(self, context: RunContext):
        """Start a completely new adventure. Use when player wants to restart.
        """
        logger.info("Resetting game")
        result = self.game_master.reset_game()
        return result

    @function_tool
    async def save_progress(self, context: RunContext):
        """Save the current game progress. Use when player asks to save their game.
        """
        logger.info("Manually saving game progress")
        result = self.game_master.save_game("manual_save.json")
        return result + " Your progress has been saved."

    @function_tool
    async def load_progress(self, context: RunContext):
        """Load previously saved game progress. Use when player asks to load their saved game.
        """
        logger.info("Loading saved game progress")
        result = self.game_master.load_game("manual_save.json")
        return result


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
    
    # Auto-save functionality
    game_master_instance = None
    auto_save_task = None
    
    async def periodic_save():
        """Save game progress every 5 minutes"""
        while True:
            try:
                await asyncio.sleep(300)  # 5 minutes
                if game_master_instance:
                    game_master_instance.save_game("autosave.json")
                    logger.info("Auto-save completed (5-minute interval)")
            except asyncio.CancelledError:
                logger.info("Periodic save task cancelled")
                break
            except Exception as e:
                logger.error(f"Error during periodic save: {e}")
    
    async def save_on_shutdown():
        """Save game when session ends or player disconnects"""
        if game_master_instance:
            try:
                game_master_instance.save_game("autosave.json")
                logger.info("Game saved on shutdown/disconnect")
            except Exception as e:
                logger.error(f"Error saving on shutdown: {e}")
        
        # Cancel periodic save task
        if auto_save_task and not auto_save_task.done():
            auto_save_task.cancel()
            try:
                await auto_save_task
            except asyncio.CancelledError:
                pass
    
    ctx.add_shutdown_callback(save_on_shutdown)

    # # Add a virtual avatar to the session, if desired
    # # For other providers, see https://docs.livekit.io/agents/models/avatar/
    # avatar = hedra.AvatarSession(
    #   avatar_id="...",  # See https://docs.livekit.io/agents/models/avatar/plugins/hedra
    # )
    # # Start the avatar and wait for it to join
    # await avatar.start(session, room=ctx.room)

    # Create assistant instance and get reference to game master
    assistant = Assistant()
    game_master_instance = assistant.game_master
    
    # Start the session, which initializes the voice pipeline and warms up the models
    await session.start(
        agent=assistant,
        room=ctx.room,
        room_input_options=RoomInputOptions(
            # For telephony applications, use `BVCTelephony` for best results
            noise_cancellation=noise_cancellation.BVC(),
        ),
        room_output_options=RoomOutputOptions(
            # Enable transcription publishing so agent responses appear as text in chat
            transcription_enabled=True,
        ),
    )

    # Join the room and connect to the user
    await ctx.connect()
    
    logger.info(f"Agent connected to room: {ctx.room.name}")
    logger.info(f"Transcription enabled in output options")
    logger.info(f"Room participants: {len(ctx.room.remote_participants)}")
    
    # Start periodic auto-save task
    auto_save_task = asyncio.create_task(periodic_save())
    logger.info("Auto-save enabled: Every 5 minutes + on disconnect")
    
    # Send automatic greeting when agent joins - immersive opening
    await session.say("You awaken on cold marble. Wind howls through shattered pillars. Below you, an endless storm churns with violet lightning. Above, broken islands float in silence. Your arm burns. A glowing mark pulses beneath your skin. You don't remember who you are. What do you do?")
    
    logger.info("Greeting sent successfully")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
