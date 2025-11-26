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

# Load FAQ data
FAQ_DATA = {}
try:
    with open("faq.json", "r", encoding="utf-8") as f:
        FAQ_DATA = json.load(f)
    logger.info("✅ FAQ data loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to load FAQ data: {e}")

# Load meeting slots
MEETING_SLOTS = {}
try:
    with open("slots.json", "r", encoding="utf-8") as f:
        MEETING_SLOTS = json.load(f)
    logger.info("✅ Meeting slots loaded successfully")
except Exception as e:
    logger.error(f"❌ Failed to load meeting slots: {e}")


class B2BLeadSDR(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are Alex, a professional and friendly Sales Development Representative (SDR) for B2B Lead Generator, an AI-powered B2B lead generation platform.

PERSONA & TONE:
- Professional yet warm and conversational
- Speak in clear, natural English
- Be consultative, not pushy
- Focus on understanding the prospect's needs
- Keep responses concise for voice interaction

YOUR GOAL:
Qualify leads by understanding their business needs and collecting key information naturally through conversation.

CONVERSATION FLOW:
1. GREETING: "Hi, this is Alex from B2B Lead Generator. How can I help you today?"
2. DISCOVERY: Ask what problem they're trying to solve or what brought them here
3. QUALIFICATION: Keep conversation focused on understanding their needs
4. INFORMATION GATHERING: Naturally collect lead details during conversation
5. FAQ ANSWERING: Answer questions using company information
6. CLOSING: Summarize and confirm next steps

LEAD INFORMATION TO COLLECT (naturally, not like a form):
- name: Their full name
- company: Company name
- email: Email address
- role: Their job title/role
- use_case: What they want to use the platform for
- team_size: Size of their team (small/medium/large or number)
- timeline: When they're looking to start (now/soon/later)

FAQ HANDLING:
- When asked about the product, services, pricing, or company, use the answer_faq tool
- Only provide information from the FAQ data
- If you don't know something, say: "That's a great question — my team will be better suited to answer that."

MEETING SCHEDULING:
- When user mentions: demo, call, schedule, meeting, appointment, book
- Use show_available_slots tool to display available times
- After user selects a time, use book_meeting tool with their selection
- Confirm the booking with meeting details

EXIT DETECTION:
Listen for clear exit phrases like: "that's all", "I'm done", "goodbye", "no more questions"
ONLY call end_call tool ONCE when the user is clearly ending the conversation
Do NOT call end_call for casual "thanks" during the conversation
After calling end_call once, do not call it again in the same session

IMPORTANT RULES:
- Ask 1-2 questions at a time, keep it conversational
- Don't rush through questions like a checklist
- If they provide multiple details at once, extract and store them
- Use the function tools to store information as you collect it
- Keep responses natural and brief for voice interaction
- Don't use markdown, emojis, or complex formatting in speech""",
        )
        
        # Initialize lead state
        self.lead_state = {
            "name": "",
            "company": "",
            "email": "",
            "role": "",
            "use_case": "",
            "team_size": "",
            "timeline": ""
        }
        self.conversation_started = False
        self.lead_saved = False  # Flag to prevent duplicate saves

    async def on_enter(self) -> None:
        """Called when the agent starts - greet the prospect"""
        self.conversation_started = True
        await self.session.say("Hi, this is Alex from B2B Lead Generator. How can I help you today?")
    
    def _search_faq(self, query: str) -> Optional[str]:
        """Search FAQ data for relevant answer using keyword matching."""
        query_lower = query.lower()
        
        # Search in FAQs
        for faq in FAQ_DATA.get("faqs", []):
            question_lower = faq["question"].lower()
            # Simple keyword matching
            if any(word in question_lower for word in query_lower.split() if len(word) > 3):
                return faq["answer"]
        
        # Search in services
        for service in FAQ_DATA.get("services", []):
            if any(word in service["name"].lower() or word in service["description"].lower() 
                   for word in query_lower.split() if len(word) > 3):
                return f"{service['name']}: {service['description']}"
        
        # Check for pricing queries
        if any(word in query_lower for word in ["price", "pricing", "cost", "plan", "tier"]):
            pricing = FAQ_DATA.get("pricing", {})
            return f"We have three plans: Starter at {pricing['starter']['price']}, Professional at {pricing['professional']['price']}, and Enterprise with custom pricing. Would you like details on any specific plan?"
        
        return None
    
    def _generate_lead_summary_html(self, lead_data: dict) -> str:
        """Generate an HTML visualization for the lead summary."""
        
        # Build lead details rows
        details_html = ""
        for key, value in lead_data.items():
            if key not in ["timestamp", "lead_id"] and value:
                label = key.replace("_", " ").title()
                details_html += f"""
            <div class="lead-row">
                <span class="label">{label}:</span>
                <span class="value">{value}</span>
            </div>
"""
        
        html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lead Summary - {lead_data.get('name', 'Unknown')}</title>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f58634 0%, #ff6b35 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }}
        .lead-card {{
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 600px;
            width: 100%;
        }}
        .header {{
            text-align: center;
            border-bottom: 3px solid #f58634;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }}
        .header h1 {{
            color: #f58634;
            margin: 0;
            font-size: 28px;
        }}
        .header p {{
            color: #666;
            margin: 5px 0 0 0;
            font-size: 14px;
        }}
        .lead-id {{
            background: #f58634;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 1px;
            margin: 15px 0;
            display: inline-block;
        }}
        .lead-details {{
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }}
        .lead-row {{
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #dee2e6;
        }}
        .lead-row:last-child {{
            border-bottom: none;
        }}
        .label {{
            font-weight: 600;
            color: #495057;
        }}
        .value {{
            color: #212529;
            text-align: right;
            max-width: 60%;
        }}
        .footer {{
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #dee2e6;
        }}
        .footer h2 {{
            color: #f58634;
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
    <div class="lead-card">
        <div class="header">
            <h1>🎯 B2B Lead Generator</h1>
            <p>Lead Qualification Summary</p>
            <div class="lead-id">Lead ID: {lead_data.get('lead_id', 'N/A')}</div>
        </div>
        
        <div class="lead-details">
            {details_html}
        </div>
        
        <div class="footer">
            <h2>Lead Captured!</h2>
            <p>Our team will follow up shortly</p>
            <p style="color: #f58634; font-weight: 600;">Thank you for your interest! 🚀</p>
        </div>
        
        <div class="timestamp">
            Captured: {lead_data.get('timestamp', 'N/A')}
        </div>
    </div>
</body>
</html>
"""
        return html

    @function_tool()
    async def store_lead_info(self, context: RunContext, field: str, value: str) -> str:
        """Store a piece of lead information. Call this as you naturally collect information during conversation.
        
        Args:
            field: The field name - must be one of: name, company, email, role, use_case, team_size, timeline
            value: The value to store for this field
        """
        if field in self.lead_state:
            self.lead_state[field] = value
            logger.info(f"Stored {field}: {value}")
            return f"Got it, {value} noted."
        return f"I can't store that field. Valid fields are: {', '.join(self.lead_state.keys())}"

    @function_tool()
    async def answer_faq(self, context: RunContext, question: str) -> str:
        """Answer a question about the company, product, services, or pricing using FAQ data.
        
        Args:
            question: The user's question about the company/product
        """
        answer = self._search_faq(question)
        
        if answer:
            logger.info(f"FAQ answered: {question[:50]}...")
            return answer
        else:
            logger.info(f"FAQ not found for: {question[:50]}...")
            return "That's a great question — my team will be better suited to answer that. I can connect you with them after we finish here."

    @function_tool()
    async def show_available_slots(self, context: RunContext) -> str:
        """Show available meeting slots when user wants to schedule a demo or meeting.
        Call this when user mentions: demo, call, schedule, meeting, appointment, book.
        """
        available = [slot for slot in MEETING_SLOTS.get("available_slots", []) if slot.get("available", False)]
        
        if not available:
            return "I'm sorry, we don't have any available slots at the moment. Let me have someone from our team reach out to you directly."
        
        # Build response with available slots
        slots_text = "Great! I have the following times available for a demo:\n\n"
        for i, slot in enumerate(available[:5], 1):  # Show max 5 slots
            slots_text += f"{i}. {slot['display']}\n"
        
        slots_text += "\nWhich time works best for you? Just tell me the number or the time."
        
        logger.info(f"Showed {len(available[:5])} available meeting slots")
        return slots_text
    
    @function_tool()
    async def book_meeting(self, context: RunContext, slot_selection: str) -> str:
        """Book a meeting slot for the user. 
        
        Args:
            slot_selection: The slot number (1-7) or time description the user selected
        """
        # Parse user selection
        selected_slot = None
        available = [slot for slot in MEETING_SLOTS.get("available_slots", []) if slot.get("available", False)]
        
        # Try to match by number
        try:
            slot_num = int(slot_selection)
            if 1 <= slot_num <= len(available):
                selected_slot = available[slot_num - 1]
        except ValueError:
            # Try to match by text
            selection_lower = slot_selection.lower()
            for slot in available:
                if selection_lower in slot['display'].lower():
                    selected_slot = slot
                    break
        
        if not selected_slot:
            return "I couldn't find that time slot. Could you please select from the available times I mentioned?"
        
        # Check if we have required lead info
        if not self.lead_state.get("name") or not self.lead_state.get("email"):
            return "To book the meeting, I'll need your name and email. Could you provide those?"
        
        # SAFEGUARD: Ensure directory and file exist
        meetings_dir = "meetings"
        meetings_file = self._ensure_directory_and_file(meetings_dir, "meetings.json")
        
        # Generate meeting ID
        import random
        import string
        date_part = datetime.now().strftime("%Y%m%d")
        random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        meeting_id = f"MTG-{date_part}-{random_part}"
        
        # Prepare meeting data
        meeting_data = {
            "meeting_id": meeting_id,
            "name": self.lead_state.get("name", ""),
            "email": self.lead_state.get("email", ""),
            "company": self.lead_state.get("company", ""),
            "role": self.lead_state.get("role", ""),
            "slot_id": selected_slot["id"],
            "meeting_time": selected_slot["datetime"],
            "meeting_display": selected_slot["display"],
            "booked_at": datetime.now().isoformat(),
            "status": "confirmed"
        }
        
        # Load existing meetings safely
        existing_meetings = []
        try:
            with open(meetings_file, 'r') as f:
                existing_meetings = json.load(f)
                if not isinstance(existing_meetings, list):
                    existing_meetings = []
        except Exception as e:
            logger.warning(f"⚠️ Could not load existing meetings, starting fresh: {e}")
            existing_meetings = []
        
        # Append new meeting
        existing_meetings.append(meeting_data)
        
        # Save with error handling
        try:
            with open(meetings_file, 'w') as f:
                json.dump(existing_meetings, f, indent=2)
            logger.info(f"✅ Meeting saved to {meetings_file}")
        except Exception as e:
            logger.error(f"❌ Failed to save meeting: {e}")
            # Continue anyway - don't fail the conversation
        
        # Also save individual meeting file (with error handling)
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            safe_name = self.lead_state.get('name', 'unknown').replace('/', '_').replace('\\', '_')
            individual_file = f"{meetings_dir}/meeting_{timestamp}_{safe_name}.json"
            with open(individual_file, 'w') as f:
                json.dump(meeting_data, f, indent=2)
            logger.info(f"✅ Individual meeting file saved: {individual_file}")
        except Exception as e:
            logger.warning(f"⚠️ Could not save individual meeting file: {e}")
        
        logger.info(f"MEETING_BOOKED: {meeting_id}")
        logger.info(f"MEETING_JSON: {json.dumps(meeting_data, separators=(',', ':'))}")
        
        # Mark slot as unavailable (update slots.json)
        try:
            for slot in MEETING_SLOTS.get("available_slots", []):
                if slot["id"] == selected_slot["id"]:
                    slot["available"] = False
            
            with open("slots.json", 'w') as f:
                json.dump(MEETING_SLOTS, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to update slots: {e}")
        
        confirmation = f"Perfect! I've scheduled a demo for {selected_slot['display']}. You'll receive a calendar invite at {self.lead_state.get('email')}. Meeting ID: {meeting_id}. Looking forward to speaking with you!"
        
        return confirmation

    def _ensure_directory_and_file(self, directory: str, filename: str) -> str:
        """Safeguard: Ensure directory and file exist before writing.
        
        Args:
            directory: Directory path (e.g., "leads")
            filename: Filename (e.g., "leads.json")
            
        Returns:
            Full file path
        """
        # Create directory if it doesn't exist
        try:
            os.makedirs(directory, exist_ok=True)
            logger.info(f"✅ Directory ensured: {directory}")
        except Exception as e:
            logger.error(f"❌ Failed to create directory {directory}: {e}")
            raise
        
        # Full file path
        file_path = os.path.join(directory, filename)
        
        # Create file with empty array if it doesn't exist
        if not os.path.exists(file_path):
            try:
                with open(file_path, 'w') as f:
                    json.dump([], f, indent=2)
                logger.info(f"✅ File created: {file_path}")
            except Exception as e:
                logger.error(f"❌ Failed to create file {file_path}: {e}")
                raise
        
        # Verify file is readable and has valid JSON
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
                if not isinstance(data, list):
                    # Fix corrupted file
                    with open(file_path, 'w') as fw:
                        json.dump([], fw, indent=2)
                    logger.warning(f"⚠️ Fixed corrupted file: {file_path}")
        except json.JSONDecodeError:
            # Fix corrupted JSON
            with open(file_path, 'w') as f:
                json.dump([], f, indent=2)
            logger.warning(f"⚠️ Fixed invalid JSON in: {file_path}")
        except Exception as e:
            logger.error(f"❌ Failed to verify file {file_path}: {e}")
            raise
        
        return file_path

    @function_tool()
    async def end_call(self, context: RunContext) -> str:
        """Call this when the user indicates they're done (says thanks, bye, done, that's all, etc.). 
        This will summarize the lead and save it."""
        
        # Prevent duplicate saves
        if self.lead_saved:
            logger.info("⚠️ Lead already saved, skipping duplicate save")
            return "Thank you! I've already captured your information. Have a great day!"
        
        # Check if we have any lead data worth saving
        has_data = any([
            self.lead_state.get("name"),
            self.lead_state.get("company"),
            self.lead_state.get("email")
        ])
        
        if not has_data:
            logger.info("⚠️ No lead data to save")
            return "Thank you for your time! Feel free to reach out anytime."
        
        # Mark as saved to prevent duplicates
        self.lead_saved = True
        
        # Generate lead ID
        import random
        import string
        date_part = datetime.now().strftime("%Y%m%d")
        random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        lead_id = f"LEAD-{date_part}-{random_part}"
        
        # Prepare lead data
        lead_data = {
            **self.lead_state,
            "lead_id": lead_id,
            "timestamp": datetime.now().isoformat()
        }
        
        # SAFEGUARD: Ensure directory and file exist
        leads_dir = "leads"
        leads_file = self._ensure_directory_and_file(leads_dir, "leads.json")
        
        # Load existing leads safely
        existing_leads = []
        try:
            with open(leads_file, 'r') as f:
                existing_leads = json.load(f)
                if not isinstance(existing_leads, list):
                    existing_leads = []
        except Exception as e:
            logger.warning(f"⚠️ Could not load existing leads, starting fresh: {e}")
            existing_leads = []
        
        # Append new lead
        existing_leads.append(lead_data)
        
        # Save with error handling
        try:
            with open(leads_file, 'w') as f:
                json.dump(existing_leads, f, indent=2)
            logger.info(f"✅ Lead saved to {leads_file}")
        except Exception as e:
            logger.error(f"❌ Failed to save lead: {e}")
            # Continue anyway - don't fail the conversation
        
        # Also save individual lead file (with error handling)
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            safe_name = self.lead_state.get('name', 'unknown').replace('/', '_').replace('\\', '_')
            individual_file = f"{leads_dir}/lead_{timestamp}_{safe_name}.json"
            with open(individual_file, 'w') as f:
                json.dump(lead_data, f, indent=2)
            logger.info(f"✅ Individual lead file saved: {individual_file}")
        except Exception as e:
            logger.warning(f"⚠️ Could not save individual lead file: {e}")
        
        logger.info(f"LEAD_SAVED: {lead_id}")
        logger.info(f"LEAD_JSON: {json.dumps(lead_data, separators=(',', ':'))}")
        
        # Generate HTML summary
        html_content = self._generate_lead_summary_html(lead_data)
        html_filename = f"{leads_dir}/lead_{timestamp}_{self.lead_state.get('name', 'unknown')}.html"
        with open(html_filename, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        # Send HTML to frontend
        html_message = f"HTML_SNIPPET:{html_content}END_HTML_SNIPPET"
        try:
            await self.session.room.local_participant.publish_data(
                html_message.encode('utf-8'),
                reliable=True
            )
            logger.info("✅ Lead HTML sent to frontend")
        except Exception as e:
            logger.error(f"❌ Failed to send lead HTML: {e}")
        
        # Build verbal summary
        summary_parts = []
        if self.lead_state["name"]:
            summary_parts.append(f"I spoke with {self.lead_state['name']}")
        if self.lead_state["company"]:
            summary_parts.append(f"from {self.lead_state['company']}")
        if self.lead_state["role"]:
            summary_parts.append(f"who is a {self.lead_state['role']}")
        if self.lead_state["use_case"]:
            summary_parts.append(f"They're interested in {self.lead_state['use_case']}")
        if self.lead_state["timeline"]:
            summary_parts.append(f"Timeline: {self.lead_state['timeline']}")
        
        summary = ". ".join(summary_parts) if summary_parts else "I've captured the lead information"
        
        # Reset lead state
        self.lead_state = {
            "name": "",
            "company": "",
            "email": "",
            "role": "",
            "use_case": "",
            "team_size": "",
            "timeline": ""
        }
        
        return f"Perfect! {summary}. Our team will follow up with you shortly. Thank you for your time! HTML_SNIPPET:{html_content}END_HTML_SNIPPET"


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
        agent=B2BLeadSDR(),
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
