# 🎯 B2B Lead Generator - AI-Powered SDR Voice Agent

> **Day 5 - Murf AI Voice Agent Challenge**

An intelligent Sales Development Representative (SDR) voice agent that qualifies leads through natural conversation, answers FAQs, and schedules demo meetings - all powered by voice.

[![LiveKit](https://img.shields.io/badge/LiveKit-Agents-blue)](https://livekit.io)
[![Murf](https://img.shields.io/badge/Murf-Falcon%20TTS-orange)](https://murf.ai)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.11+-green)](https://python.org)

## ✨ Features

### 🎙️ Voice-First Experience
- **Natural Conversations**: Powered by Murf Falcon TTS (fastest TTS API)
- **Real-time Speech Recognition**: Deepgram Nova-3 for accurate transcription
- **Smart Turn Detection**: Multilingual VAD for natural conversation flow

### 🤖 Intelligent SDR Agent
- **Lead Qualification**: Captures 7 key data points naturally
  - Name, Company, Email
  - Role, Use Case
  - Team Size, Timeline
- **FAQ Answering**: Responds to product questions from knowledge base
- **Meeting Scheduling**: Books demos from available time slots
- **Exit Detection**: Knows when to summarize and save leads

### 💾 Data Persistence
- **Lead Storage**: All leads saved to JSON with timestamps
- **Meeting Bookings**: Scheduled meetings with confirmation
- **Individual Records**: Separate files for each lead/meeting

### 🎨 Modern UI
- **Clean Interface**: Full-screen chat with AI status indicator
- **Real-time Updates**: Live speaking/listening animations
- **Orange Theme**: Professional B2B design (#f58634)
- **Mobile Responsive**: Works on all devices

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** with pip or uv
- **Node.js 18+** with npm
- **API Keys**:
  - [LiveKit](https://livekit.io) account
  - [Murf API](https://murf.ai/api) key
  - [Google AI](https://ai.google.dev) API key
  - [Deepgram](https://deepgram.com) API key

### Installation

#### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ten-days-of-voice-agents-2025
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt
# OR using uv (faster)
uv sync

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys
```

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your LiveKit credentials
```

### Running the Application

#### Start Backend (Terminal 1)
```bash
cd backend
python src/agent.py dev
```

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

#### Open Browser
Navigate to: `http://localhost:3000`

## 📱 Access on Phone

Use ngrok to access on your phone:

```bash
# Install ngrok from https://ngrok.com/download
ngrok config add-authtoken YOUR_TOKEN
ngrok http 3000
```

Open the HTTPS URL on your phone's browser.

## 🎤 How to Use

### Sample Conversation Flow

1. **Start**: Click "Start Conversation"

2. **Agent Greets**: 
   > "Hi, this is Alex from B2B Lead Generator. How can I help you today?"

3. **Ask Questions**:
   - "What does your product do?"
   - "Do you have a free tier?"
   - "What's the pricing?"

4. **Schedule Demo**:
   - "I'd like to schedule a demo"
   - Agent shows available slots
   - Select a time

5. **Provide Information**:
   - "My name is John from TechCorp"
   - "I'm the VP of Sales"
   - "We need help with lead generation"
   - "We have a team of 20"
   - "We want to start soon"

6. **End Conversation**:
   - "That's all, thanks"
   - Agent summarizes and saves lead

## 🏗️ Architecture

### Tech Stack

**Backend:**
- LiveKit Agents (Python)
- Google Gemini 2.5 Flash (LLM)
- Murf Falcon (TTS)
- Deepgram Nova-3 (STT)
- Function calling for tools

**Frontend:**
- Next.js 15 with Turbopack
- React with LiveKit Components
- Tailwind CSS
- WebRTC via LiveKit

### Project Structure

```
├── backend/
│   ├── src/
│   │   └── agent.py          # Main agent logic
│   ├── faq.json              # Company knowledge base
│   ├── slots.json            # Available meeting times
│   ├── leads/                # Captured leads (gitignored)
│   ├── meetings/             # Booked meetings (gitignored)
│   └── .env.local            # API keys (gitignored)
│
├── frontend/
│   ├── app/                  # Next.js pages
│   ├── components/           # React components
│   ├── styles/               # CSS with orange theme
│   └── .env.local            # Config (gitignored)
│
└── README.md                 # This file
```

## 🎨 Customization

### Update Company Information

Edit `backend/faq.json`:
```json
{
  "company_name": "Your Company",
  "tagline": "Your tagline",
  "services": [...],
  "pricing": {...},
  "faqs": [...]
}
```

### Update Meeting Slots

Edit `backend/slots.json`:
```json
{
  "available_slots": [
    {
      "id": "slot_1",
      "datetime": "2025-11-27T10:00:00",
      "display": "Tomorrow at 10:00 AM",
      "available": true
    }
  ]
}
```

### Change Theme

Edit `frontend/styles/globals.css`:
```css
:root {
  --primary-orange: #f58634;  /* Your color */
}
```

## 📊 Features Implemented

### ✅ Primary Goal (Day 5)
- [x] SDR persona with company knowledge
- [x] FAQ answering from JSON
- [x] Lead capture (7 fields)
- [x] Natural conversation flow
- [x] End-of-call summary
- [x] Lead persistence to JSON

### ✅ Advanced Goal 1 (Bonus)
- [x] Mock meeting scheduler
- [x] Available time slots
- [x] Meeting booking
- [x] Confirmation with meeting ID

## 🔧 Configuration

### Environment Variables

**Backend (.env.local):**
```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
GOOGLE_API_KEY=your_google_api_key
MURF_API_KEY=your_murf_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
```

**Frontend (.env.local):**
```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
```

## 📝 Data Storage

### Leads
- **Location**: `backend/leads/`
- **Format**: JSON with timestamp
- **Files**: 
  - `leads.json` - All leads
  - `lead_YYYYMMDD_HHMMSS_Name.json` - Individual leads

### Meetings
- **Location**: `backend/meetings/`
- **Format**: JSON with timestamp
- **Files**:
  - `meetings.json` - All meetings
  - `meeting_YYYYMMDD_HHMMSS_Name.json` - Individual meetings

## 🚀 Deployment

### Backend
Deploy to:
- Railway
- Render
- Fly.io
- AWS Lambda

### Frontend
Deploy to:
- **Vercel** (recommended)
- Netlify
- Cloudflare Pages

```bash
cd frontend
vercel
```

## 🎯 Challenge Completion

This project completes **Day 5** of the **Murf AI Voice Agent Challenge**:

- ✅ Built an AI-powered SDR agent
- ✅ Implemented FAQ answering
- ✅ Lead qualification and capture
- ✅ Meeting scheduling (bonus)
- ✅ Real-time voice interaction
- ✅ Data persistence

**Built with Murf Falcon TTS** - The fastest text-to-speech API 🚀

## 📄 License

MIT License - See [LICENSE](LICENSE) file

## 🙏 Acknowledgments

- **Murf AI** for the Voice Agent Challenge
- **LiveKit** for the Agents framework
- **Google** for Gemini 2.5 Flash
- **Deepgram** for speech recognition

## 📞 Support

For issues or questions:
- Check [LiveKit Agents Docs](https://docs.livekit.io/agents)
- Review [Murf API Docs](https://murf.ai/api)

---

**#MurfAIVoiceAgentsChallenge** | **#10DaysofAIVoiceAgents**

Built with ❤️ by Deepankar
