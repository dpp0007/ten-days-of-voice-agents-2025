# 🎤 Bank Fraud Alert Voice Agent

A production-ready AI voice agent for bank fraud verification using LiveKit Agents, Murf Falcon TTS, and MongoDB Atlas.

## 🎯 Features

- **Real-time Voice Interaction** - Natural conversation flow with customers
- **Identity Verification** - Security questions + card digit verification
- **Transaction Confirmation** - Customer confirms or denies suspicious transactions
- **MongoDB Integration** - Cloud-ready database with 10 test cases
- **HTTPS Support** - Secure microphone access for web browsers
- **Production Ready** - Clean, tested, and documented code

## 🏗️ Architecture

```
Browser (HTTPS) → Next.js Frontend → LiveKit Server → Python Agent
                                                          ↓
                                                    MongoDB Atlas
```

**Tech Stack:**
- **Frontend:** Next.js 15, React 19, LiveKit Client SDK
- **Backend:** Python 3.9+, LiveKit Agents, Murf Falcon TTS
- **Database:** MongoDB Atlas (with SQLite fallback)
- **Voice Pipeline:** Deepgram STT → Gemini LLM → Murf TTS

## 📋 Prerequisites

- Python 3.9+ with [uv](https://docs.astral.sh/uv/)
- Node.js 18+ with pnpm
- [LiveKit Server](https://docs.livekit.io/home/self-hosting/local/)
- MongoDB Atlas account (or use SQLite)

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd ten-days-of-voice-agents-2025
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
uv sync

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys:
# - LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET
# - GOOGLE_API_KEY (Gemini)
# - MURF_API_KEY (Falcon TTS)
# - DEEPGRAM_API_KEY (STT)
# - MONGODB_URI (optional, uses SQLite if not set)

# Download AI models
uv run python src/agent.py download-files
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with LiveKit credentials

# Generate SSL certificates for HTTPS
pnpm run generate-certs
```

### 4. Run Application

**Terminal 1 - LiveKit Server:**
```bash
livekit-server --dev
```

**Terminal 2 - Backend Agent:**
```bash
cd backend
uv run python src/agent.py dev
```

**Terminal 3 - Frontend (HTTPS):**
```bash
cd frontend
pnpm run dev:https
```

**Open:** https://localhost:3000

## 🧪 Test Cases

The system includes 10 pre-configured fraud cases:

| Name | Security Answer | Card Digits | Amount | Merchant |
|------|----------------|-------------|--------|----------|
| John | blue | 4242 | $1,250.00 | ABC Industry |
| Sarah | chicago | 8888 | $5,499.99 | Luxury Watches Ltd |
| Michael | max | 1234 | $9,999.00 | Crypto Exchange Pro |
| Emily | smith | 5678 | $2,899.99 | Global Electronics |
| David | honda | 9012 | $799.00 | Premium Gaming |
| Jessica | pizza | 3456 | $1,599.50 | Fashion Boutique |
| Robert | inception | 7890 | $3,499.00 | Tech Gadgets Pro |
| Amanda | gatsby | 2468 | $4,250.00 | Travel Booking |
| James | basketball | 1357 | $899.99 | Sports Equipment |
| Lisa | summer | 9753 | $1,750.00 | Home Decor |

See [TEST_CASES.md](./TEST_CASES.md) for complete details.

## 🔄 Conversation Flow

1. **Introduction** - Agent identifies as bank fraud department
2. **Name Collection** - "May I have your name please?"
3. **Case Loading** - Retrieves fraud case from database
4. **Security Question** - Asks customer-specific security question
5. **Card Verification** - "What are the last 4 digits of your card?"
6. **Transaction Details** - Reads merchant, amount, card, time, location
7. **Confirmation** - "Did you make this transaction? Yes or no?"
8. **Database Update** - Updates status based on response
9. **Closing** - Explains outcome and ends call

### Verification Rules

- ✅ Security answer must match exactly (case-insensitive)
- ✅ Card digits must match exactly
- ❌ Verification failure → Call ends immediately
- ✅ YES → Status: `confirmed_safe`
- ❌ NO → Status: `confirmed_fraud` (card blocked)

## 🗄️ Database

### MongoDB Atlas (Recommended)

Set in `.env.local`:
```bash
USE_MONGODB=true
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

### SQLite (Local Fallback)

Set in `.env.local`:
```bash
USE_MONGODB=false
```

Database auto-creates with 10 test cases on first run.

### Reset Database

```bash
cd backend
uv run python reset_demo_data.py
```

## 🔒 HTTPS Setup

Microphone access requires HTTPS (except localhost). The app includes:

- Self-signed certificate generation
- Custom HTTPS server for Next.js
- Security context validation

**For production:** Use proper SSL certificates (Let's Encrypt, CloudFlare, etc.)

See [frontend/HTTPS_SETUP.md](./frontend/HTTPS_SETUP.md) for details.

## 📱 Phone Access

**Option 1: Same WiFi Network**
- Use your computer's local IP
- Update `.env.local` with your IP address
- Phone must be on same WiFi

**Option 2: ngrok (Requires Paid Plan)**
- Free tier only allows 1 tunnel
- Need 2 tunnels (frontend + LiveKit)
- Upgrade to paid plan for full phone support

**Recommended:** Test on computer at `https://localhost:3000`

## 🛠️ Development

### Project Structure

```
ten-days-of-voice-agents-2025/
├── backend/
│   ├── src/
│   │   ├── agent.py          # Main agent logic
│   │   └── fraud_db.py       # Database abstraction
│   ├── .env.local            # Backend config
│   └── pyproject.toml        # Python dependencies
├── frontend/
│   ├── app/                  # Next.js app
│   ├── components/           # React components
│   ├── lib/                  # Utilities
│   ├── .env.local            # Frontend config
│   └── package.json          # Node dependencies
├── challenges/               # Daily challenge tasks
└── README.md
```

### Key Files

- `backend/src/agent.py` - Voice agent implementation
- `backend/src/fraud_db.py` - MongoDB/SQLite database layer
- `frontend/components/security-guard.tsx` - HTTPS validation
- `frontend/lib/livekit-url.ts` - LiveKit connection logic

## 🧹 Code Quality

- ✅ Clean, focused code (150 lines agent)
- ✅ No unused imports or functions
- ✅ Comprehensive error handling
- ✅ Type hints and documentation
- ✅ Production-ready logging
- ✅ No test/demo code

## 📚 Documentation

- [TEST_CASES.md](./TEST_CASES.md) - All test cases with answers
- [QUICK_START_WINDOWS.md](./QUICK_START_WINDOWS.md) - Windows setup guide
- [frontend/HTTPS_SETUP.md](./frontend/HTTPS_SETUP.md) - HTTPS configuration
- [backend/README.md](./backend/README.md) - Backend documentation
- [frontend/README.md](./frontend/README.md) - Frontend documentation

## 🔑 Environment Variables

### Backend (.env.local)

```bash
# LiveKit
LIVEKIT_URL=http://localhost:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret

# AI Services
GOOGLE_API_KEY=your_gemini_key
MURF_API_KEY=your_murf_key
DEEPGRAM_API_KEY=your_deepgram_key

# Database
USE_MONGODB=true
MONGODB_URI=your_mongodb_uri
```

### Frontend (.env.local)

```bash
# LiveKit Server
LIVEKIT_URL=http://localhost:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret

# LiveKit Client
NEXT_PUBLIC_LIVEKIT_HOST=localhost
NEXT_PUBLIC_LIVEKIT_PORT=7880
```

## 🐛 Troubleshooting

### "Microphone access blocked"
- Use `https://localhost:3000` (not IP address)
- Accept self-signed certificate warning
- Check browser permissions

### "Connection failed"
- Ensure all 3 services are running
- Check LiveKit server is on port 7880
- Verify `.env.local` files are configured

### "Database error"
- Check MongoDB URI is correct
- Verify network connectivity
- Falls back to SQLite automatically

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

## 🙏 Credits

Built for the AI Voice Agents Challenge by [murf.ai](https://murf.ai)

- [LiveKit Agents](https://docs.livekit.io/agents)
- [Murf Falcon TTS](https://murf.ai/api/docs/text-to-speech/streaming)
- [MongoDB Atlas](https://www.mongodb.com/atlas)

## 🤝 Contributing

This is a challenge project, but contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Ready to test!** Open https://localhost:3000 and start talking to your AI fraud alert agent! 🎉
