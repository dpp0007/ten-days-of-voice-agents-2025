# 🎮 IMPROV BATTLE
## Voice-First AI Game Show

```
┌─────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ▓▓                                     ▓▓  │
│  ▓▓    📺  IMPROV BATTLE  📺           ▓▓  │
│  ▓▓                                     ▓▓  │
│  ▓▓    [●] ON AIR                       ▓▓  │
│  ▓▓                                     ▓▓  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
└─────────────────────────────────────────────┘
```

---

## What This Is

**IMPROV BATTLE** is a live, voice-powered improv game show where you perform scenes for an AI host who reacts in real-time.

No typing. No clicking. Just you, your voice, and a pixel TV broadcast universe.

The AI host gives you absurd scenarios. You act them out. The host reacts—sometimes impressed, sometimes not. It's a show, and you're the star.

---

## Features

✅ **Live Voice Host** — AI-powered personality that runs the show  
✅ **Pixel Broadcast UI** — Retro TV aesthetic with animated stars and floating blocks  
✅ **Real-Time Reactions** — The host listens, judges, and responds to your performance  
✅ **Round System** — 3-5 rounds of escalating improv chaos  
✅ **Gemini Intelligence** — Google's Gemini 2.5 Flash powers the host's brain  
✅ **Murf Voice Personality** — Natural, expressive TTS for the host  
✅ **LiveKit Audio Streaming** — Low-latency voice communication  
✅ **Mobile-Ready** — Optimized for phones with touch controls and safe areas

---

## Tech Stack

📡 **LiveKit** = Broadcast System  
🧠 **Gemini 2.5 Flash** = Host's Brain  
🎙 **Murf TTS** = Voice Personality  
🎮 **Next.js Frontend** = Pixel Screen  
🛠 **Python Backend** = Show Engine  
🔊 **Deepgram STT** = Speech Recognition  
🎯 **Silero VAD** = Turn Detection

---

## Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- pnpm (or npm)
- LiveKit Cloud account (free tier works)
- Google AI API key (Gemini)
- Murf API key
- Deepgram API key

### Install

**Backend:**
```bash
cd backend
pip install uv
uv sync
```

**Frontend:**
```bash
cd frontend
pnpm install
```

### Configure Environment

**Backend** (`backend/.env.local`):
```bash
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
GOOGLE_API_KEY=your_gemini_key
MURF_API_KEY=your_murf_key
DEEPGRAM_API_KEY=your_deepgram_key
```

**Frontend** (`frontend/.env.local`):
```bash
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
```

### Run

**Start Backend:**
```bash
cd backend
python -m src.agent dev
```

**Start Frontend:**
```bash
cd frontend
pnpm dev
```

Open `http://localhost:3000`

---

## How to Play

1. **Enter Your Name** — The host will use it throughout the show
2. **Start Call** — Click "Start" and allow microphone access
3. **Listen to Scenario** — The host gives you a character and situation
4. **Perform the Scene** — Act it out with your voice
5. **Say "End Scene"** — When you're done, say this to move on
6. **Get Feedback** — The host reacts to your performance
7. **Repeat** — Continue through 3-5 rounds
8. **Finish Show** — Get a final summary and wrap-up

---

## Architecture Overview

```
┌─────────────┐
│   Browser   │ ← User speaks into microphone
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   LiveKit   │ ← Real-time audio streaming
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Voice Agent │ ← Python backend processes audio
└──────┬──────┘
       │
       ├──→ Deepgram STT (speech → text)
       ├──→ Gemini LLM (text → response)
       └──→ Murf TTS (response → speech)
```

**Frontend Flow:**
```
Next.js App → LiveKit React SDK → WebRTC → LiveKit Cloud
```

**Backend Flow:**
```
LiveKit Agent → STT → LLM → TTS → Audio Stream
```

---

## Project Structure

```
improv-battle/
├── backend/
│   ├── src/
│   │   ├── agent.py          # Main voice agent logic
│   │   └── __init__.py
│   ├── .env.local            # Backend environment config
│   ├── pyproject.toml        # Python dependencies
│   └── uv.lock
│
├── frontend/
│   ├── app/
│   │   ├── session-view.tsx  # Main game UI
│   │   ├── welcome-view.tsx  # Name entry screen
│   │   └── app.tsx           # Root component
│   ├── styles/
│   │   └── globals.css       # Pixel theme styles
│   ├── .env.local            # Frontend environment config
│   └── package.json
│
├── challenges/               # Original challenge tasks
├── LICENSE
└── README.md                 # You are here
```

---

## Environment Variables

### Backend Required

| Variable | Description |
|----------|-------------|
| `LIVEKIT_URL` | Your LiveKit server URL |
| `LIVEKIT_API_KEY` | LiveKit API key |
| `LIVEKIT_API_SECRET` | LiveKit API secret |
| `GOOGLE_API_KEY` | Google AI (Gemini) API key |
| `MURF_API_KEY` | Murf TTS API key |
| `DEEPGRAM_API_KEY` | Deepgram STT API key |

### Frontend Required

| Variable | Description |
|----------|-------------|
| `LIVEKIT_URL` | Your LiveKit server URL (server-side) |
| `LIVEKIT_API_KEY` | LiveKit API key (server-side) |
| `LIVEKIT_API_SECRET` | LiveKit API secret (server-side) |
| `NEXT_PUBLIC_LIVEKIT_URL` | Your LiveKit server URL (client-side) |

---

## Customization

### Change Host Personality

Edit `backend/src/agent.py` → `Assistant.__init__()` → `instructions` parameter

### Adjust Round Count

The host randomly picks 3-5 rounds. To force a specific count, modify the instructions in `agent.py`.

### Modify UI Theme

Edit `frontend/styles/globals.css` → Look for `.pixel-sky-bg`, `.pixel-star`, `.pixel-block`

### Change Voice

Edit `backend/src/agent.py` → `tts=murf.TTS(voice="...")` → See [Murf voice options](https://docs.livekit.io/agents/models/tts/plugins/murf)

---

## Troubleshooting

**Agent won't start:**
- Check all API keys are set in `backend/.env.local`
- Verify LiveKit URL format: `wss://your-project.livekit.cloud`

**No audio in browser:**
- Allow microphone permissions
- Check browser console for WebRTC errors
- Verify `NEXT_PUBLIC_LIVEKIT_URL` matches backend `LIVEKIT_URL`

**Host doesn't respond:**
- Check backend logs for errors
- Verify Gemini API key has quota
- Ensure Deepgram API key is active

**Rounds not updating:**
- The UI detects "Round X" in agent messages
- Check browser console for parsing errors

---

## License

MIT License - See LICENSE file for details

---

## Credits

Built with:
- [LiveKit](https://livekit.io) - Real-time communication
- [Google Gemini](https://ai.google.dev) - Language model
- [Murf AI](https://murf.ai) - Text-to-speech
- [Deepgram](https://deepgram.com) - Speech-to-text
- [Next.js](https://nextjs.org) - Frontend framework

---

**You're not just running a server.**  
**You're launching a show.**

🎬 Break a leg.
