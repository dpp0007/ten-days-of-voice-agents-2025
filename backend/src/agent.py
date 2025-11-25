import logging
import json
import os
from typing import Optional, List, Dict
from datetime import datetime

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

logger = logging.getLogger("tutor_agent")
load_dotenv(".env.local")


class ActiveRecallCoach(Agent):
    def __init__(self, session: AgentSession) -> None:
        super().__init__(
            instructions="""You are "Teach-the-Tutor," an Active Recall Voice Coach using Murf Falcon voices.

CRITICAL RULES:
- ALWAYS accept BOTH text and voice input from users
- Do NOT hallucinate concepts or create new topics
- Do NOT generate your own questions - ONLY use sample_question from JSON
- Do NOT mention dashboards, progress boards, min/max/avg analytics
- Stay concise and conversational for voice interaction

AVAILABLE CONCEPTS (from JSON):
- variables, loops, functions, conditionals, lists

THREE MODES WITH STRICT VOICE ASSIGNMENT:
1. LEARN MODE → Voice: Matthew → Explain using summary
2. QUIZ MODE → Voice: Alicia → Ask sample_question, score answer 0-100
3. TEACH_BACK MODE → Voice: Ken → User explains, score 0-100

STARTUP BEHAVIOR:
1. Load learner_history.json from shared-data/
2. If previous session exists (last_concept and last_mode):
   - Greet: "Welcome back! Last time you were learning <concept> in <mode> mode. Would you like to continue or choose another mode?"
3. If no previous session:
   - Greet: "Hello! I'm Teach-the-Tutor. Which mode would you like to start with — learn, quiz, or teach-back?"
4. After mode selection, ask: "Great! Which concept would you like to work on?"
5. NEVER teach automatically. NEVER assume a concept until selected.

PERSISTENT STORAGE:
- After every quiz or teach-back, save to learner_history.json:
  • concept_id, mode, current_score, previous_score, average_score, timestamp
- Update last_concept and last_mode for next session
- Store average_score for frontend use (DO NOT speak about it)
- Only speak current_score and previous_score in conversation

MODE BEHAVIORS:

LEARN MODE (Matthew):
- Explain concept using its summary
- Keep explanation short and structured
- End by asking: "Would you like to switch to quiz or teach-back next?"

QUIZ MODE (Alicia):
- Ask the concept's sample_question
- Accept BOTH voice and text answers
- Score from 0-100
- Speak ONLY: current score, previous score (if exists), one motivational line
- DO NOT mention min, max, avg, dashboard, or analytics
- After scoring, ask if user wants another quiz or wants to switch mode

TEACH_BACK MODE (Ken):
- Ask user to explain the concept
- Compare explanation to summary
- Score 0-100
- Give 1-2 line feedback
- Mention: current score, previous score, motivation
- Ask user what they want next

SCORING STORAGE (SIMPLE):
For each concept store ONLY:
- last_score (previous attempt)
- current_score (this attempt)
NO average. NO min. NO max. NO dashboards. NO progress board announcements.

MODE SWITCHING:
Users can switch anytime: "Switch to quiz", "Let's do teach-back", "Now teach loops"
When switching:
1. Change session_state
2. Call switch_voice function tool to change TTS voice
3. Announce: "Switching to <mode>. <voice-name> will continue."

MENTOR PERSONALITY:
- Supportive, motivating, conversational
- Examples: "Great progress!", "You're improving!", "Let's challenge you!"
- MOTIVATE based on last vs current score
- Keep replies short

Always use function tools to manage state, scoring, and voice switching.""",
        )
        
        # Store session reference for voice switching
        self.agent_session = session
        
        # Load concepts from JSON
        self.concepts = self._load_concepts()
        
        # Load learner history from persistent storage
        self.history_path = "shared-data/learner_history.json"
        self.learner_history = self._load_learner_history()
        
        # Initialize session state with simplified scoring
        self.session_state = {
            "current_mode": None,  # learn, quiz, teach_back
            "current_concept": None,  # Will be set by user choice
            "mastery": {}  # {concept_id: {last_score: number, current_score: number}}
        }
    
    def _load_concepts(self) -> dict:
        """Load concepts from the JSON file."""
        json_path = "shared-data/day4_tutor_content.json"
        try:
            with open(json_path, 'r') as f:
                data = json.load(f)
                concepts_dict = {c["id"]: c for c in data["concepts"]}
                logger.info(f"Loaded {len(concepts_dict)} concepts from {json_path}")
                return concepts_dict
        except Exception as e:
            logger.error(f"Failed to load concepts: {e}")
            return {}
    
    def _get_concept(self, concept_id: str) -> Optional[dict]:
        """Get a concept by ID."""
        return self.concepts.get(concept_id)
    
    def _load_learner_history(self) -> dict:
        """Load learner history from JSON file."""
        try:
            if os.path.exists(self.history_path):
                with open(self.history_path, 'r') as f:
                    history = json.load(f)
                    logger.info(f"Loaded learner history from {self.history_path}")
                    return history
            else:
                logger.info("No existing learner history found, initializing new")
                return {
                    "last_concept": None,
                    "last_mode": None,
                    "concepts": {}  # {concept_id: {attempts: [], average_score: number}}
                }
        except Exception as e:
            logger.error(f"Failed to load learner history: {e}")
            return {
                "last_concept": None,
                "last_mode": None,
                "concepts": {}
            }
    
    def _save_learner_history(self):
        """Save learner history to JSON file."""
        try:
            # Ensure directory exists
            os.makedirs(os.path.dirname(self.history_path), exist_ok=True)
            
            with open(self.history_path, 'w') as f:
                json.dump(self.learner_history, f, indent=2)
            logger.info(f"Saved learner history to {self.history_path}")
        except Exception as e:
            logger.error(f"Failed to save learner history: {e}")
    
    def _record_attempt(self, concept_id: str, mode: str, score: int, previous_score: Optional[int]):
        """Record an attempt in learner history."""
        # Initialize concept if not exists
        if concept_id not in self.learner_history["concepts"]:
            self.learner_history["concepts"][concept_id] = {
                "attempts": [],
                "average_score": 0
            }
        
        concept_data = self.learner_history["concepts"][concept_id]
        
        # Add new attempt
        attempt = {
            "mode": mode,
            "current_score": score,
            "previous_score": previous_score,
            "timestamp": datetime.now().isoformat()
        }
        concept_data["attempts"].append(attempt)
        
        # Calculate average score
        all_scores = [a["current_score"] for a in concept_data["attempts"]]
        concept_data["average_score"] = sum(all_scores) / len(all_scores)
        
        # Update last concept and mode
        self.learner_history["last_concept"] = concept_id
        self.learner_history["last_mode"] = mode
        
        # Save to file
        self._save_learner_history()
        
        logger.info(f"Recorded attempt: {concept_id} ({mode}) - score: {score}, avg: {concept_data['average_score']:.1f}")
    
    def _init_mastery(self, concept_id: str):
        """Initialize mastery tracking for a concept."""
        if concept_id not in self.session_state["mastery"]:
            self.session_state["mastery"][concept_id] = {
                "last_score": None,
                "current_score": None
            }
    
    def _update_mastery(self, concept_id: str, score: int):
        """Update mastery tracking with new score."""
        self._init_mastery(concept_id)
        mastery = self.session_state["mastery"][concept_id]
        
        # Move current to last, set new current
        mastery["last_score"] = mastery["current_score"]
        mastery["current_score"] = score
        
        logger.info(f"Updated mastery for {concept_id}: current={score}, last={mastery['last_score']}")
    
    def _get_mastery_stats(self, concept_id: str) -> Dict:
        """Get mastery statistics for a concept."""
        self._init_mastery(concept_id)
        return self.session_state["mastery"][concept_id]
    
    async def _switch_voice(self, voice: str):
        """Switch the TTS voice dynamically."""
        try:
            # Create new TTS with the specified voice
            new_tts = murf.TTS(
                voice=voice.lower(),
                style="Conversation",
                tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
                text_pacing=True
            )
            # Update the session's TTS
            self.agent_session._tts = new_tts
            logger.info(f"✅ Switched TTS voice to: {voice}")
        except Exception as e:
            logger.error(f"❌ Failed to switch voice to {voice}: {e}")
    
    async def on_enter(self) -> None:
        """Called when the agent starts - check for previous session and greet."""
        # Check if there's a previous session
        last_concept = self.learner_history.get("last_concept")
        last_mode = self.learner_history.get("last_mode")
        
        if last_concept and last_mode:
            concept = self._get_concept(last_concept)
            if concept:
                greeting = (
                    f"Welcome back! Last time you were learning {concept['title']} in {last_mode} mode. "
                    f"Would you like to continue or choose another mode?"
                )
            else:
                greeting = (
                    f"Hello! I'm Teach-the-Tutor, your Active Recall Coach. "
                    f"Which mode would you like to start with — learn, quiz, or teach-back?"
                )
        else:
            greeting = (
                f"Hello! I'm Teach-the-Tutor, your Active Recall Coach. "
                f"Which mode would you like to start with — learn, quiz, or teach-back?"
            )
        
        await self.session.say(greeting)

    @function_tool()
    async def switch_mode(self, context: RunContext, mode: str) -> str:
        """Switch to a different learning mode and change TTS voice.
        
        Args:
            mode: The mode to switch to - must be "learn", "quiz", or "teach_back"
        """
        mode = mode.lower().replace("-", "_").replace(" ", "_")
        
        if mode not in ["learn", "quiz", "teach_back"]:
            return f"I don't recognize that mode. Please choose: learn, quiz, or teach_back."
        
        self.session_state["current_mode"] = mode
        
        # Voice mapping
        voice_map = {"learn": "matthew", "quiz": "alicia", "teach_back": "ken"}
        voice_name_display = {"learn": "Matthew", "quiz": "Alicia", "teach_back": "Ken"}
        
        # Switch TTS voice
        await self._switch_voice(voice_map[mode])
        
        # If no concept selected yet, ask for it
        if not self.session_state["current_concept"]:
            concept_list = ", ".join(self.concepts.keys())
            return f"Great! Which concept would you like to work on? Available concepts: {concept_list}"
        
        concept = self._get_concept(self.session_state["current_concept"])
        
        logger.info(f"Switched to {mode} mode with voice {voice_name_display[mode]}")
        
        # Execute mode behavior
        if mode == "learn":
            return f"Switching to learn mode. {voice_name_display[mode]} will continue. Let me explain {concept['title']}. {concept['summary']} Would you like to switch to quiz or teach-back next?"
        
        elif mode == "quiz":
            return f"Switching to quiz mode. {voice_name_display[mode]} will continue. Here's your question about {concept['title']}: {concept['sample_question']}"
        
        elif mode == "teach_back":
            return f"Switching to teach-back mode. {voice_name_display[mode]} will continue. Now it's your turn! Please explain {concept['title']} back to me in your own words."
    
    @function_tool()
    async def switch_concept(self, context: RunContext, concept_id: str) -> str:
        """Switch to a different concept.
        
        Args:
            concept_id: The concept ID to switch to (e.g., "variables", "loops", "functions")
        """
        concept_id = concept_id.lower()
        
        concept = self._get_concept(concept_id)
        if not concept:
            available = ", ".join(self.concepts.keys())
            return f"I don't have that concept. Available concepts are: {available}"
        
        self.session_state["current_concept"] = concept_id
        logger.info(f"Switched to concept: {concept_id}")
        
        # If no mode set, ask which mode
        if not self.session_state["current_mode"]:
            return f"Great! Let's work on {concept['title']}. Which mode would you like — learn, quiz, or teach-back?"
        
        # Otherwise, apply current mode to new concept
        mode = self.session_state["current_mode"]
        
        if mode == "learn":
            return f"Now let's learn about {concept['title']}. {concept['summary']} Would you like to switch to quiz or teach-back next?"
        elif mode == "quiz":
            return f"Quiz time for {concept['title']}: {concept['sample_question']}"
        elif mode == "teach_back":
            return f"Teach me about {concept['title']}. Please explain it in your own words."
    
    @function_tool()
    async def score_answer(self, context: RunContext, user_answer: str, score: int, feedback: str) -> str:
        """Score a quiz or teach-back answer with persistent tracking.
        
        Args:
            user_answer: The user's answer (for logging)
            score: Score from 0-100
            feedback: 1-2 sentence qualitative feedback
        """
        mode = self.session_state["current_mode"]
        concept_id = self.session_state["current_concept"]
        
        if not concept_id or mode not in ["quiz", "teach_back"]:
            return "Something went wrong. Please select a concept and mode first."
        
        # Clamp score to 0-100
        score = max(0, min(100, score))
        
        # Update mastery tracking (simple: last_score, current_score)
        self._update_mastery(concept_id, score)
        stats = self._get_mastery_stats(concept_id)
        
        # Record attempt in persistent storage
        self._record_attempt(concept_id, mode, score, stats["last_score"])
        
        # Build response with ONLY current and previous score
        response = f"{feedback} Your score is {score}. "
        
        if stats["last_score"] is not None:
            response += f"Your previous score was {stats['last_score']}. "
            
            # Add motivation based on improvement
            if score > stats["last_score"]:
                response += "Great improvement! "
            elif score == stats["last_score"]:
                response += "Consistent performance! "
            else:
                response += "Keep practicing! "
        
        response += "What would you like to do next? Another quiz, teach-back, or switch concept?"
        
        logger.info(f"Scored {mode} for {concept_id}: {score}/100 (previous: {stats['last_score']})")
        return response
    

    
    @function_tool()
    async def get_current_state(self, context: RunContext) -> str:
        """Get the current mode and concept."""
        mode = self.session_state["current_mode"] or "none"
        concept = self.session_state["current_concept"] or "none"
        return f"Current mode: {mode}, Current concept: {concept}"


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    session = AgentSession(
        stt=deepgram.STT(model="nova-3"),
        llm=google.LLM(model="gemini-2.5-flash"),
        tts=murf.TTS(
            voice="matthew",  # Default voice
            style="Conversation",
            tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
            text_pacing=True
        ),
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        preemptive_generation=True,
    )

    usage_collector = metrics.UsageCollector()

    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: {summary}")

    ctx.add_shutdown_callback(log_usage)

    # Pass session to agent for voice switching
    await session.start(
        agent=ActiveRecallCoach(session),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
