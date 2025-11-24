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
from todoist_handler import TodoistHandler
from notion_handler import NotionHandler

logger = logging.getLogger("agent")

load_dotenv(".env.local")


class WellnessCompanion(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are a calm, supportive wellness check-in companion. Guide users through a brief daily check-in.

WORKFLOW:
1. Ask: "How are you feeling today?" → When they answer, call record_mood(mood)
2. Ask: "What's your energy like?" → When they answer, call record_energy(energy)  
3. Ask about goals (see GOAL GUIDANCE below) → When they answer, call record_objectives(objectives)
4. After recap, when user confirms → call save_wellness_entry()
5. After saving, ask: "Would you like me to create tasks in Todoist? And should I save this to Notion?"
   - If user says yes to tasks → call create_tasks_from_goals()
   - If user says yes to Notion → call save_to_notion()
   - If user says yes to both → call both functions
   - If user says no → thank them and end conversation

WEEKLY REFLECTION:
When user asks about their week, call get_weekly_summary(). Trigger phrases:
- "How was my week?"
- "Show me my weekly summary"
- "How am I doing this week?"
- "What were my moods this week?"
- "How's my progress?"

TASK CREATION:
When user asks to create tasks, call create_tasks_from_goals(). Trigger phrases:
- "Turn these goals into tasks"
- "Add these to my to-do list"
- "Create tasks for these"
- "Add to Todoist"
- "Make these into tasks"

SAVE TO NOTION:
When user asks to save to Notion, call save_to_notion(). Trigger phrases:
- "Save this to Notion"
- "Add to Notion"
- "Save to my Notion"
- "Put this in Notion"

GOAL GUIDANCE:
When asking about goals, guide users toward small, practical, achievable actions rather than emotional states.

Say: "Let's set 1-3 small, realistic goals for today. These should be simple actions you can actually do, not emotional outcomes."

If the user gives a vague or emotional goal like "I want to be happy" or "I want to feel better," gently help them convert it into a specific action:
- "That makes sense. What's one small action you could take today that might help you feel a little more grounded or supported?"
- "Let's think of a practical step you can take toward that. Maybe a short walk, finishing a small task, taking a break, drinking water, or anything small that feels doable. What would you like to pick?"

Your goal is to help the user define 1-3 actionable steps they can do today. Avoid judging their emotional goal — help them turn it into something concrete and manageable.

TONE:
- Warm, calm, and supportive
- Keep responses short and natural
- Use phrases like "Thanks for sharing" and "That makes sense"
- Never give medical advice

IMPORTANT: Always call the function tools when the user provides information. The functions will handle the next steps.""",
        )
        
        # Initialize wellness state
        self.wellness_state = {
            "mood": "",
            "energy": "",
            "objectives": [],
            "summary": ""
        }
        
        # Load previous entries
        self.previous_entries = self._load_previous_entries()

    def _load_previous_entries(self) -> list:
        """Load previous wellness entries from JSON file."""
        wellness_file = "wellness_data/wellness_log.json"
        try:
            if os.path.exists(wellness_file):
                with open(wellness_file, 'r') as f:
                    return json.load(f)
        except Exception as e:
            logger.error(f"Error loading wellness log: {e}")
        return []
    
    async def on_enter(self) -> None:
        """Called when the agent starts - greet the user"""
        # Start with a simple, warm greeting and first question
        greeting = "Hi! Let's do a quick check-in. How are you feeling today?"
        
        # Optionally reference previous entry
        if self.previous_entries:
            last_entry = self.previous_entries[-1]
            if "energy" in last_entry and last_entry["energy"]:
                energy_level = last_entry['energy']
                # Don't duplicate "energy" if it's already in the value
                if "energy" in energy_level.lower():
                    greeting = f"Hi! Good to see you again. Last time you mentioned {energy_level}. How are you feeling today?"
                else:
                    greeting = f"Hi! Good to see you again. Last time you mentioned {energy_level} energy. How are you feeling today?"
        
        await self.session.say(greeting)
    
    @function_tool()
    async def record_mood(self, context: RunContext, mood: str) -> str:
        """Record the user's current mood.
        
        Args:
            mood: User's mood description (e.g., "good", "tired", "stressed", "happy", "anxious")
        """
        self.wellness_state["mood"] = mood
        logger.info(f"Recorded mood: {mood}")
        # Acknowledge and move to next question
        return "Thanks for sharing that. What's your energy like right now?"

    @function_tool()
    async def record_energy(self, context: RunContext, energy: str) -> str:
        """Record the user's energy level.
        
        Args:
            energy: User's energy level (e.g., "high", "low", "medium", "drained", "energized")
        """
        self.wellness_state["energy"] = energy
        logger.info(f"Recorded energy: {energy}")
        # Acknowledge and move to goals with actionable framing
        return "That makes sense. Let's set 1 to 3 small, realistic goals for today. These should be simple actions you can actually do. What would you like to get done?"

    @function_tool()
    async def record_objectives(self, context: RunContext, objectives: str) -> str:
        """Record the user's daily objectives or goals.
        
        Args:
            objectives: Comma-separated list of goals (e.g., "finish report, go for a walk, call mom")
        """
        objectives_list = [obj.strip() for obj in objectives.split(",")]
        self.wellness_state["objectives"] = objectives_list
        logger.info(f"Recorded objectives: {objectives_list}")
        
        # Check if we have everything
        if self.wellness_state["mood"] and self.wellness_state["energy"]:
            # Provide recap
            objectives_text = ", ".join(self.wellness_state["objectives"])
            energy_text = self.wellness_state['energy']
            
            # Don't duplicate "energy" if it's already in the value
            if "energy" in energy_text.lower():
                energy_phrase = energy_text
            else:
                energy_phrase = f"{energy_text} energy"
            
            recap = (
                f"You're doing well by checking in. "
                f"So you're feeling {self.wellness_state['mood']} with {energy_phrase}, "
                f"and your goals today are: {objectives_text}. Does that sound right?"
            )
            return recap
        
        return "Thanks for sharing. Let me know if there's anything else."

    @function_tool()
    async def provide_recap(self, context: RunContext) -> str:
        """Provide a recap of the wellness check-in before saving."""
        
        if not self.wellness_state["mood"] or not self.wellness_state["energy"]:
            return "I still need to know your mood and energy level. Can you share those?"
        
        if not self.wellness_state["objectives"]:
            return "What about your goals for today? Anything you'd like to accomplish?"
        
        # Build recap
        objectives_text = ", ".join(self.wellness_state["objectives"])
        energy_text = self.wellness_state['energy']
        
        # Don't duplicate "energy" if it's already in the value
        if "energy" in energy_text.lower():
            energy_phrase = energy_text
        else:
            energy_phrase = f"{energy_text} energy"
        
        recap = (
            f"You're feeling {self.wellness_state['mood']} with {energy_phrase}. "
            f"Your goals today are: {objectives_text}. "
            f"Does this sound right?"
        )
        
        logger.info(f"Wellness recap: {self.wellness_state}")
        return recap

    @function_tool()
    async def save_wellness_entry(self, context: RunContext) -> str:
        """Save the wellness check-in entry to JSON file.
        Call this after the user confirms the recap is correct."""
        
        # Validate required fields
        if not all([
            self.wellness_state["mood"],
            self.wellness_state["energy"],
            self.wellness_state["objectives"]
        ]):
            return "I need mood, energy, and at least one goal before I can save this check-in."
        
        # Create summary
        summary = f"Feeling {self.wellness_state['mood']} with {self.wellness_state['energy']} energy. Goals: {', '.join(self.wellness_state['objectives'])}"
        
        # Prepare entry
        entry = {
            "datetime": datetime.now().isoformat(),
            "mood": self.wellness_state["mood"],
            "energy": self.wellness_state["energy"],
            "objectives": self.wellness_state["objectives"],
            "summary": summary
        }
        
        # Ensure wellness_data directory exists
        os.makedirs("wellness_data", exist_ok=True)
        wellness_file = "wellness_data/wellness_log.json"
        
        # Load existing entries
        entries = []
        if os.path.exists(wellness_file):
            try:
                with open(wellness_file, 'r') as f:
                    entries = json.load(f)
            except Exception as e:
                logger.error(f"Error loading wellness log: {e}")
        
        # Append new entry
        entries.append(entry)
        
        # Save to file
        with open(wellness_file, 'w') as f:
            json.dump(entries, f, indent=2)
        
        # Log the JSON output
        json_str = json.dumps(entry, separators=(',', ':'))
        logger.info(f"WELLNESS_ENTRY_JSON: {json_str}")
        logger.info(f"Wellness entry saved")
        
        # Send JSON as data message to frontend
        try:
            await self.session.room.local_participant.publish_data(
                json_str.encode('utf-8'),
                reliable=True
            )
            logger.info("✅ Wellness entry sent via data message")
        except Exception as e:
            logger.error(f"❌ Failed to send wellness entry: {e}")
        
        # Reset state for next check-in
        self.wellness_state = {
            "mood": "",
            "energy": "",
            "objectives": [],
            "summary": ""
        }
        
        # Ask if user wants to create tasks and save to Notion
        return "Perfect! Your check-in is saved. Would you like me to create tasks in Todoist for your goals? And should I save this to Notion?"

    @function_tool()
    async def emit_intent(self, context: RunContext, intent: str) -> str:
        """Emit an intent signal for the backend to detect and process with MCP tools.
        
        Args:
            intent: The intent to emit (e.g., "CREATE_TASKS", "SAVE_TO_NOTION", "CREATE_REMINDER", "WEEKLY_REFLECTION", "MARK_TASK_DONE")
        """
        logger.info(f"INTENT:{intent}")
        
        # Send intent as data message to frontend/backend
        try:
            intent_message = f"INTENT:{intent}"
            await self.session.room.local_participant.publish_data(
                intent_message.encode('utf-8'),
                reliable=True
            )
            logger.info(f"✅ Intent emitted: {intent}")
        except Exception as e:
            logger.error(f"❌ Failed to emit intent: {e}")
        
        # Return appropriate confirmation based on intent
        responses = {
            "CREATE_TASKS": "I'll help you turn those goals into tasks.",
            "SAVE_TO_NOTION": "I'll save this to your Notion workspace.",
            "CREATE_REMINDER": "I'll set up that reminder for you.",
            "WEEKLY_REFLECTION": "Let me pull up your weekly summary.",
            "MARK_TASK_DONE": "Great! I'll mark that as complete."
        }
        
        return responses.get(intent, "Got it, processing that request.")

    @function_tool()
    async def get_weekly_summary(self, context: RunContext) -> str:
        """Get a summary of wellness entries from the past week.
        Call this when user asks about their mood, energy, or goals over the past week."""
        
        from datetime import timedelta
        from collections import Counter
        
        wellness_file = "wellness_data/wellness_log.json"
        
        # Load all entries
        entries = []
        if os.path.exists(wellness_file):
            try:
                with open(wellness_file, 'r') as f:
                    entries = json.load(f)
            except Exception as e:
                logger.error(f"Error loading wellness log: {e}")
                return "I couldn't load your wellness history right now."
        
        if not entries:
            return "You don't have any wellness entries yet. Let's start tracking!"
        
        # Filter entries from the past 7 days
        now = datetime.now()
        week_ago = now - timedelta(days=7)
        
        recent_entries = []
        for entry in entries:
            try:
                entry_date = datetime.fromisoformat(entry["datetime"])
                if entry_date >= week_ago:
                    recent_entries.append(entry)
            except Exception:
                continue
        
        if not recent_entries:
            return "You don't have any entries from the past week. Let's start fresh today!"
        
        # Analyze the week
        moods = [e.get("mood", "") for e in recent_entries if e.get("mood")]
        energies = [e.get("energy", "") for e in recent_entries if e.get("energy")]
        all_objectives = []
        for e in recent_entries:
            all_objectives.extend(e.get("objectives", []))
        
        # Count frequencies
        mood_counts = Counter(moods)
        energy_counts = Counter(energies)
        most_common_mood = mood_counts.most_common(1)[0] if mood_counts else None
        most_common_energy = energy_counts.most_common(1)[0] if energy_counts else None
        
        # Calculate streak
        streak = len(recent_entries)
        
        # Build conversational summary
        summary_parts = []
        
        # Check-in frequency
        if streak == 1:
            summary_parts.append("You've checked in once this week.")
        elif streak >= 5:
            summary_parts.append(f"Great job! You've checked in {streak} times this week.")
        else:
            summary_parts.append(f"You've checked in {streak} times this week.")
        
        # Most common mood
        if most_common_mood:
            mood_name, mood_count = most_common_mood
            if mood_count > 1:
                summary_parts.append(f"You've been feeling {mood_name} most often.")
            else:
                summary_parts.append(f"Your mood has been {mood_name}.")
        
        # Most common energy
        if most_common_energy:
            energy_name, energy_count = most_common_energy
            if energy_count > 1:
                summary_parts.append(f"Your energy has been {energy_name} most of the time.")
            else:
                summary_parts.append(f"Your energy level was {energy_name}.")
        
        # Goals
        if all_objectives:
            summary_parts.append(f"You set {len(all_objectives)} goals total.")
        
        # Encouragement
        if streak >= 3:
            summary_parts.append("You're building a good habit!")
        
        summary = " ".join(summary_parts)
        
        logger.info(f"Weekly summary generated: {len(recent_entries)} entries")
        logger.info(f"WEEKLY_SUMMARY: {summary}")
        
        # Emit intent for tracking
        await self.emit_intent(context, "WEEKLY_REFLECTION")
        
        return summary

    @function_tool()
    async def create_tasks_from_goals(self, context: RunContext) -> str:
        """Create Todoist tasks from the user's current wellness goals.
        Call this when user asks to turn goals into tasks, add to todo list, create tasks, etc."""
        
        # Step 1: Get current objectives
        objectives = self.wellness_state.get("objectives", [])
        
        # Step 2: If no current objectives, try to load from latest entry
        if not objectives:
            objectives = self._get_latest_objectives()
        
        # Step 3: Validate we have objectives
        if not objectives:
            return "I don't see any goals to create tasks from. Would you like to set some goals first?"
        
        # Step 4: Initialize Todoist handler
        try:
            api_token = os.getenv("TODOIST_API_TOKEN")
            project_id = os.getenv("TODOIST_PROJECT_ID")
            
            if not api_token:
                logger.error("TODOIST_API_TOKEN not found in environment")
                return "I'm having trouble connecting to Todoist right now."
            
            logger.info(f"Creating Todoist tasks for {len(objectives)} objectives")
            handler = TodoistHandler(api_token, project_id)
            
            # Step 5: Create tasks
            result = await handler.create_tasks(objectives)
            
            # Step 6: Log success
            logger.info(f"✅ Created {result['created']} Todoist tasks")
            
            # Step 7: Emit intent for tracking
            await self.emit_intent(context, "CREATE_TASKS")
            
            # Step 8: Return confirmation
            task_count = result['created']
            if task_count == 0:
                return "I had trouble creating those tasks. Please check your Todoist connection."
            elif task_count == 1:
                return "Perfect! Your task has been saved to Todoist. You're all set!"
            else:
                return f"Great! All {task_count} tasks have been saved to your Todoist. You're all set!"
                
        except Exception as e:
            logger.error(f"❌ Error creating Todoist tasks: {e}")
            return "I had trouble creating those tasks. Please try again later."

    def _get_latest_objectives(self) -> list[str]:
        """Get objectives from the most recent wellness entry."""
        wellness_file = "wellness_data/wellness_log.json"
        
        if not os.path.exists(wellness_file):
            return []
        
        try:
            with open(wellness_file, 'r') as f:
                entries = json.load(f)
            
            if entries:
                latest = entries[-1]
                return latest.get("objectives", [])
        except Exception as e:
            logger.error(f"Error loading latest objectives: {e}")
        
        return []

    @function_tool()
    async def save_to_notion(self, context: RunContext) -> str:
        """Save the latest wellness check-in to Notion database.
        Call this when user asks to save to Notion, add to Notion, etc."""
        
        # Step 1: Get latest entry
        entry = self._get_latest_entry()
        
        # Step 2: Validate we have data
        if not entry:
            return "I don't see a check-in to save. Would you like to do a check-in first?"
        
        # Step 3: Initialize Notion handler
        try:
            api_key = os.getenv("NOTION_API_KEY")
            database_id = os.getenv("NOTION_DATABASE_ID")
            
            if not api_key or not database_id:
                logger.error("Notion credentials not found in environment")
                return "I'm having trouble connecting to Notion right now."
            
            logger.info("Saving wellness entry to Notion")
            handler = NotionHandler(api_key, database_id)
            
            # Step 4: Save to Notion
            result = await handler.save_wellness_entry(entry)
            
            # Step 5: Check result
            if result["success"]:
                logger.info(f"✅ Saved to Notion: {result['page_id']}")
                
                # Step 6: Emit intent
                await self.emit_intent(context, "SAVE_TO_NOTION")
                
                return "Perfect! Your wellness check-in has been saved to Notion. Everything is backed up!"
            else:
                logger.error(f"Failed to save to Notion: {result.get('error')}")
                return "I had trouble saving to Notion. Please try again later."
                
        except Exception as e:
            logger.error(f"❌ Error saving to Notion: {e}")
            return "I had trouble saving to Notion. Please try again later."

    def _get_latest_entry(self) -> dict:
        """Get the most recent wellness entry."""
        wellness_file = "wellness_data/wellness_log.json"
        
        if not os.path.exists(wellness_file):
            return None
        
        try:
            with open(wellness_file, 'r') as f:
                entries = json.load(f)
            
            if entries:
                return entries[-1]
        except Exception as e:
            logger.error(f"Error loading latest entry: {e}")
        
        return None


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
        agent=WellnessCompanion(),
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
