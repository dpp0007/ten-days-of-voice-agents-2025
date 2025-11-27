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
from fraud_db import get_fraud_db

logger = logging.getLogger("agent")
load_dotenv(".env.local")


class FraudAlertAssistant(Agent):
    """Bank Fraud Alert Voice Agent - Identity Verification & Transaction Confirmation"""
    
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are a fraud prevention agent from the customer's bank.

YOUR EXACT FLOW:
1. Introduce yourself: "This is the fraud department from your bank calling about a suspicious transaction."
2. Ask: "May I have your name please?"
3. Load their fraud case from database
4. Ask the security question from database
5. Ask: "For verification, what are the last 4 digits of your card?"
6. Read transaction details clearly:
   - Say the amount as "X thousand Y hundred" or "X hundred Y dollars" (e.g., "5 thousand 4 hundred 99 dollars and 99 cents")
   - Merchant name
   - Card ending digits
   - Transaction time and location
7. Ask: "Did you make this transaction? Please answer yes or no."
8. Update database based on answer
9. End politely explaining the outcome

IMPORTANT: When reading dollar amounts, speak them clearly with proper thousands separators.

VERIFICATION RULES:
- Security answer must match database exactly
- Card digits must match database exactly
- If verification fails, end call immediately
- Do not proceed without successful verification

RESPONSE RULES:
- YES = mark confirmed_safe
- NO = mark confirmed_fraud, explain card will be blocked
- Keep all responses brief and professional
- No emojis, no asterisks, no complex formatting""",
        )
        self.fraud_case = None
        self.verification_passed = False
        self.customer_name = None
    
    @function_tool
    async def load_fraud_case(self, context: RunContext, username: str):
        """Load fraud case from database by customer name.
        
        Args:
            username: Customer's name
        """
        if not username or not username.strip():
            return "I didn't catch your name. Could you please repeat it?"
        
        username_clean = username.strip()
        db = get_fraud_db()
        case = db.get_case_by_username(username_clean)
        
        if case:
            self.fraud_case = case
            self.customer_name = case["userName"]
            # Format amount properly for speech
            amount = case['transactionAmount']
            amount_str = f"${amount:,.2f}"  # Format with commas: $5,499.99
            logger.info(f"Case loaded: {username_clean} | Card: *{case['cardEnding']} | Amount: {amount_str} | Security Q: {case['securityQuestion']}")
            return f"Case loaded for {case['userName']}. Transaction amount: {amount_str}. Merchant: {case['transactionName']}. Security question: {case['securityQuestion']}"
        else:
            return f"No fraud alert found for {username_clean}. Please verify the name."
    
    @function_tool
    async def verify_security_answer(self, context: RunContext, answer: str):
        """Verify customer's security answer against database.
        
        Args:
            answer: Customer's answer to security question
        """
        if not self.fraud_case:
            return "ERROR: No case loaded"
        
        if not answer or not answer.strip():
            return "I didn't catch that. Please repeat your answer."
        
        correct_answer = self.fraud_case["securityAnswer"].lower().strip()
        user_answer = answer.lower().strip()
        
        if user_answer == correct_answer:
            self.verification_passed = True
            logger.info(f"Security verified: {self.customer_name}")
            return "Security answer verified"
        else:
            self.verification_passed = False
            logger.warning(f"Security failed: {self.customer_name} | Expected: {correct_answer} | Got: {user_answer}")
            
            db = get_fraud_db()
            db.update_case_status(
                self.customer_name,
                "verification_failed",
                "Security question failed"
            )
            return "Verification failed. Cannot proceed."
    
    @function_tool
    async def verify_card_digits(self, context: RunContext, digits: str):
        """Verify last 4 digits of customer's card.
        
        Args:
            digits: Last 4 digits of card
        """
        if not self.fraud_case:
            return "ERROR: No case loaded"
        
        if not self.verification_passed:
            return "ERROR: Complete security question first"
        
        if not digits or not digits.strip():
            return "I didn't catch the digits. Please repeat them."
        
        correct_digits = self.fraud_case["cardEnding"]
        user_digits = digits.strip()
        
        if user_digits == correct_digits:
            logger.info(f"Card verified: {self.customer_name} | Digits: {correct_digits}")
            return "Card verified"
        else:
            logger.warning(f"Card failed: {self.customer_name} | Expected: {correct_digits} | Got: {user_digits}")
            
            db = get_fraud_db()
            db.update_case_status(
                self.customer_name,
                "verification_failed",
                "Card digits failed"
            )
            return "Card verification failed. Cannot proceed."
    
    @function_tool
    async def mark_transaction_safe(self, context: RunContext):
        """Mark transaction as safe (customer confirmed)."""
        if not self.fraud_case or not self.verification_passed:
            return "ERROR: Verification incomplete"
        
        db = get_fraud_db()
        success = db.update_case_status(
            self.customer_name,
            "confirmed_safe",
            "Customer confirmed transaction"
        )
        
        if success:
            logger.info(f"Marked SAFE: {self.customer_name}")
            return "Transaction confirmed safe"
        return "ERROR: Database update failed"
    
    @function_tool
    async def mark_transaction_fraudulent(self, context: RunContext):
        """Mark transaction as fraudulent (customer denied)."""
        if not self.fraud_case or not self.verification_passed:
            return "ERROR: Verification incomplete"
        
        db = get_fraud_db()
        success = db.update_case_status(
            self.customer_name,
            "confirmed_fraud",
            "Customer denied transaction - card blocked"
        )
        
        if success:
            logger.info(f"Marked FRAUD: {self.customer_name}")
            return f"Transaction marked fraudulent. Card ending {self.fraud_case['cardEnding']} blocked."
        return "ERROR: Database update failed"


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    ctx.log_context_fields = {"room": ctx.room.name}
    
    session = AgentSession(
        stt=deepgram.STT(model="nova-3"),
        llm=google.LLM(model="gemini-2.5-flash"),
        tts=murf.TTS(
            voice="en-US-matthew",
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
    
    await session.start(
        agent=FraudAlertAssistant(),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )
    
    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
