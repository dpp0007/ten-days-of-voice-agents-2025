# Wellness Voice Companion 🌟

A calm, supportive wellness check-in voice assistant built with LiveKit Agents. Features daily mood tracking, goal setting, Todoist integration, and Notion sync with a beautiful mobile-optimized UI.

![Wellness Companion](https://img.shields.io/badge/Wellness-Companion-FF6B6B?style=for-the-badge)
![LiveKit](https://img.shields.io/badge/LiveKit-Agents-8FE4F9?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11+-blue?style=for-the-badge)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Design System](#design-system)
- [API Keys](#api-keys)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Wellness Voice Companion is a voice-first application designed to help users maintain their mental wellness through daily check-ins. It guides users through a structured conversation about their mood, energy levels, and daily goals, then optionally creates actionable tasks in Todoist and saves entries to Notion.

### Why This Project?

- **Voice-First**: Natural conversation, no typing required
- **Mobile-Optimized**: Beautiful UI designed for phones
- **Actionable**: Converts wellness goals into Todoist tasks
- **Integrated**: Syncs with Notion for long-term tracking
- **Private**: All data stored locally or in your own services

## ✨ Features

### 🎤 Voice Interaction

- **Natural Conversation**: Speak naturally about your feelings and goals
- **Real-time STT**: Powered by Deepgram Nova-3 for accurate transcription
- **Natural TTS**: High-quality voice synthesis with Murf (Anisha voice)
- **Smart Turn Detection**: Multilingual turn detection for smooth conversations
- **Mic Mute Indicator**: Visual feedback when microphone is muted

### 💚 Wellness Tracking

- **Daily Check-ins**: 
  - Record your mood (happy, stressed, tired, etc.)
  - Track energy levels (high, low, medium, etc.)
  - Set 1-3 daily goals
- **Goal Guidance**: AI helps convert emotional goals into actionable steps
  - "I want to feel better" → "Take a 10-minute walk"
  - "I want to be productive" → "Finish one small task"
- **Weekly Summaries**: Ask "How was my week?" for insights
  - Most common moods
  - Energy patterns
  - Goal tracking
  - Check-in streaks
- **JSON Storage**: All entries saved to `wellness_data/wellness_log.json`

### 🔗 Integrations

#### Todoist
- **Trigger**: "Turn these into tasks" or "Add to Todoist"
- **Action**: Creates tasks from your daily goals
- **Confirmation**: "Great! All 3 tasks have been saved to your Todoist. You're all set!"

#### Notion
- **Trigger**: "Save to Notion" or "Add to Notion"
- **Action**: Saves complete check-in to your Notion database
- **Confirmation**: "Perfect! Your wellness check-in has been saved to Notion. Everything is backed up!"

### 🎨 Mobile-First UI

#### Design Features
- **Coral Theme**: Beautiful gradient orb (#FF6B6B → #FFB4B4)
- **Floating Chat**: Messages scroll bottom-to-top (like WhatsApp/iMessage)
- **Glassmorphism**: Frosted glass control bar with backdrop blur
- **Responsive Orb**: 128px on mobile, 160px on desktop
- **Touch Optimized**: All buttons ≥ 44px (WCAG compliant)

#### Layout
- **Orb at Top**: Compact design, doesn't block view
- **Status Text**: Clear visibility with background pill
- **Scrollable Chat**: Full screen, natural upward scroll
- **Control Bar**: Glassmorphism pills at bottom

#### Animations
- **Breathing Orb**: Gentle pulsing when idle
- **Morphing Shape**: Dynamic distortion when AI speaks
- **Smooth Transitions**: 300ms ease for all interactions
- **Loading State**: Coral breathing circle

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Session     │  │  Chat        │  │  Control     │      │
│  │  Screen      │  │  Messages    │  │  Bar         │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────────────────────────────────────────┐      │
│  │         LiveKit Components React                  │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ LiveKit WebRTC
┌─────────────────────────────────────────────────────────────┐
│                Backend (Python LiveKit Agent)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  LLM         │  │  STT         │  │  TTS         │      │
│  │  (Gemini     │  │  (Deepgram   │  │  (Murf       │      │
│  │  2.5 Flash)  │  │  Nova-3)     │  │  Anisha)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────────────────────────────────────────┐      │
│  │         Wellness Agent (Function Tools)           │      │
│  │  • record_mood()  • record_energy()               │      │
│  │  • record_objectives()  • save_wellness_entry()   │      │
│  │  • create_tasks_from_goals()  • save_to_notion()  │      │
│  │  • get_weekly_summary()                           │      │
│  └──────────────────────────────────────────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  Todoist     │  │  Notion      │                        │
│  │  Handler     │  │  Handler     │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+** with `uv` package manager
- **Node.js 18+** with `pnpm` (or npm)
- **LiveKit Account** ([free tier available](https://livekit.io/))
- **API Keys**: Deepgram, Murf, Google Gemini
- **Optional**: Todoist API token, Notion API key

### Backend Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Add your API keys to `.env.local`:**
   ```env
   # LiveKit (Required)
   LIVEKIT_URL=wss://your-project.livekit.cloud
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret

   # AI Services (Required)
   GOOGLE_API_KEY=your_gemini_api_key
   MURF_API_KEY=your_murf_api_key
   DEEPGRAM_API_KEY=your_deepgram_api_key

   # Integrations (Optional)
   TODOIST_API_TOKEN=your_todoist_token
   TODOIST_PROJECT_ID=your_project_id
   NOTION_API_KEY=your_notion_key
   NOTION_DATABASE_ID=your_database_id
   ```

4. **Install dependencies and run:**
   ```bash
   uv run src/agent.py dev
   ```

   You should see:
   ```
   INFO livekit.agents starting worker
   INFO livekit.agents registered worker
   ```

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Add LiveKit credentials to `.env.local`:**
   ```env
   LIVEKIT_URL=wss://your-project.livekit.cloud
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   ```

4. **Install dependencies:**
   ```bash
   pnpm install
   ```

5. **Run development server:**
   ```bash
   pnpm dev
   ```

6. **Open browser:**
   ```
   http://localhost:3000
   ```

### Mobile Testing

To test on your phone:

1. **Start ngrok tunnel:**
   ```bash
   ngrok http 3000
   ```

2. **Open the ngrok URL on your phone**
3. **Grant microphone permissions**
4. **Start your wellness check-in!**

## 📁 Project Structure

```
ten-days-of-voice-agents-2025/
├── backend/
│   ├── src/
│   │   ├── agent.py              # Main wellness agent
│   │   ├── todoist_handler.py    # Todoist integration
│   │   └── notion_handler.py     # Notion integration
│   ├── wellness_data/
│   │   └── wellness_log.json     # Check-in storage
│   ├── .env.local               # API keys (not in git)
│   ├── .env.example             # Template
│   └── pyproject.toml           # Dependencies
│
├── frontend/
│   ├── app/
│   │   ├── (app)/
│   │   │   └── page.tsx         # Main session page
│   │   ├── welcome/
│   │   │   └── page.tsx         # Welcome screen
│   │   └── history/
│   │       └── page.tsx         # Session history
│   ├── components/
│   │   ├── app/
│   │   │   ├── session-screen.tsx      # Orb & layout
│   │   │   ├── default-session.tsx     # Chat & controls
│   │   │   ├── wellness-welcome.tsx    # Welcome screen
│   │   │   └── wellness-loader.tsx     # Loading state
│   │   └── livekit/
│   │       ├── chat-entry.tsx          # Message component
│   │       ├── agent-control-bar/      # Control bar
│   │       ├── button.tsx              # Button styles
│   │       └── toggle.tsx              # Toggle styles
│   ├── hooks/
│   │   └── useChatMessages.ts   # Chat message hook
│   ├── .env.local              # LiveKit credentials
│   └── package.json            # Dependencies
│
├── DESIGN_GUIDE.md             # Complete design system
├── CODEBASE_SUMMARY.md         # Quick reference
└── README.md                   # This file
```

## 🎯 How It Works

### User Flow

```
1. User opens app → Welcome screen with breathing animation
   ↓
2. Click "Begin Session" → Connects to LiveKit room
   ↓
3. Agent greets: "Hi! Let's do a quick check-in. How are you feeling today?"
   ↓
4. User speaks → Deepgram transcribes → Gemini processes
   ↓
5. Agent asks about mood → User responds → record_mood() called
   ↓
6. Agent asks about energy → User responds → record_energy() called
   ↓
7. Agent asks about goals → User responds → record_objectives() called
   ↓
8. Agent provides recap → User confirms → save_wellness_entry() called
   ↓
9. Agent asks: "Create tasks in Todoist? Save to Notion?"
   ↓
10. User says "yes" → create_tasks_from_goals() and/or save_to_notion()
    ↓
11. Confirmation: "Great! All 3 tasks saved to Todoist. You're all set!"
```

### Technical Flow

```
Frontend (React)
    ↓ User speaks
Microphone → LiveKit WebRTC
    ↓ Audio stream
Backend Agent receives audio
    ↓
Deepgram STT → Text
    ↓
Gemini LLM → Response + Function calls
    ↓
Function tools execute (record_mood, save_entry, etc.)
    ↓
Murf TTS → Audio response
    ↓ Audio stream
LiveKit WebRTC → Frontend
    ↓
User hears response + sees chat message
```

### Function Tools

The agent uses these function tools:

1. **record_mood(mood: str)** - Saves user's mood
2. **record_energy(energy: str)** - Saves energy level
3. **record_objectives(objectives: str)** - Saves daily goals
4. **save_wellness_entry()** - Saves complete check-in to JSON
5. **create_tasks_from_goals()** - Creates Todoist tasks
6. **save_to_notion()** - Syncs to Notion database
7. **get_weekly_summary()** - Analyzes past 7 days
8. **emit_intent(intent: str)** - Emits tracking events

## 🎨 Design System

### Color Palette

```css
/* Coral Theme */
--coral-primary: #FF6B6B;
--coral-mid: #FF8E8E;
--coral-light: #FFB4B4;

/* Neutrals */
--gray-50: #FAFAFA;
--white: #FFFFFF;
--gray-100: #F8F8F8;
--gray-600: #6B7280;
--gray-900: #111827;

/* Glassmorphism */
--glass-bg: rgba(255, 255, 255, 0.2);
--glass-border: rgba(255, 255, 255, 0.3);
```

### Components

#### Orb
- **Size**: 128px mobile, 160px desktop
- **Position**: Top with 36px margin
- **Gradient**: Coral (#FF6B6B → #FFB4B4)
- **Animation**: Morphs when speaking, breathes when idle

#### Status Text
- **Size**: 12px mobile, 14px desktop
- **Color**: gray-600
- **Background**: white/60 pill with backdrop-blur
- **Position**: Below orb

#### Chat Messages
- **User**: Coral background, white text, right-aligned
- **Companion**: Gray background, dark text, left-aligned
- **Direction**: Bottom to top (reversed)
- **Scroll**: Natural upward scroll

#### Control Bar
- **Style**: Glassmorphism (white/20 + backdrop-blur)
- **Layout**: Separate pills for mic and controls
- **Position**: Bottom with 16px margin
- **Touch**: 44px minimum height

### Responsive Design

```css
/* Mobile (< 640px) */
- Orb: 128px
- Text: 10-12px
- Padding: 16px
- Full-width controls

/* Desktop (≥ 640px) */
- Orb: 160px
- Text: 12-16px
- Padding: 24px
- Centered controls
```

## 🔑 API Keys

### Required

1. **LiveKit** - [Get free account](https://livekit.io/)
   - Create a project
   - Copy URL, API Key, and API Secret

2. **Deepgram** - [Get API key](https://deepgram.com/)
   - Sign up for free tier
   - Create API key
   - Model: Nova-3

3. **Murf** - [Get API key](https://murf.ai/)
   - Sign up for account
   - Generate API key
   - Voice: Anisha, Style: Conversation

4. **Google Gemini** - [Get API key](https://ai.google.dev/)
   - Create project in Google AI Studio
   - Generate API key
   - Model: gemini-2.5-flash

### Optional

5. **Todoist** - [Get API token](https://todoist.com/app/settings/integrations)
   - Settings → Integrations → API token
   - Optional: Create a specific project and get its ID

6. **Notion** - [Get API key](https://www.notion.so/my-integrations)
   - Create integration
   - Copy API key
   - Share database with integration
   - Copy database ID from URL

## 🚀 Deployment

### Backend (LiveKit Agent)

**Option 1: LiveKit Cloud**
```bash
# Build and deploy
livekit-cli deploy create
```

**Option 2: Self-hosted**
```bash
# Run with Docker
docker build -t wellness-agent .
docker run -e LIVEKIT_URL=... wellness-agent
```

### Frontend (Next.js)

**Option 1: Vercel** (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Option 2: Netlify**
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Environment Variables:**
- Set `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
- Configure build command: `pnpm build`
- Configure output directory: `.next`

## 🐛 Troubleshooting

### Backend Issues

**Agent not starting:**
```bash
# Check Python version
python --version  # Should be 3.11+

# Check uv installation
uv --version

# Reinstall dependencies
uv sync
```

**Agent not responding:**
- Verify all API keys in `.env.local`
- Check LiveKit connection in logs
- Ensure `wellness_data/` directory exists

**Tasks not creating:**
- Verify `TODOIST_API_TOKEN` is set
- Check Todoist API status
- Look for errors in agent logs

**Notion not saving:**
- Verify `NOTION_API_KEY` and `NOTION_DATABASE_ID`
- Ensure database is shared with integration
- Check database schema matches expected fields

### Frontend Issues

**No audio:**
- Grant microphone permissions in browser
- Use Chrome/Edge (best compatibility)
- Check LiveKit credentials in `.env.local`

**Chat not showing:**
- Open browser console (F12)
- Look for errors
- Verify WebSocket connection

**Orb not animating:**
- Check `isAgentSpeaking` state
- Verify motion/react is installed
- Look for animation errors in console

**Control bar not working:**
- Check touch target sizes (should be 44px)
- Verify glassmorphism styles are applied
- Test on different browsers

### Mobile Issues

**App not loading on phone:**
- Use ngrok for HTTPS tunnel
- Grant microphone permissions
- Check network connectivity

**Touch targets too small:**
- All buttons should be ≥ 44px
- Check responsive classes (sm:, md:)
- Test with Chrome DevTools mobile view

**Chat scrolling issues:**
- Verify `flex-col-reverse` is applied
- Check overflow-y-auto on container
- Test scroll behavior

## 📊 Data Structure

### Wellness Entry (JSON)

```json
{
  "datetime": "2025-11-24T10:30:00.000000",
  "mood": "calm",
  "energy": "medium",
  "objectives": [
    "Finish project documentation",
    "Take a 20-minute walk",
    "Call mom"
  ],
  "summary": "Feeling calm with medium energy. Goals: Finish project documentation, Take a 20-minute walk, Call mom"
}
```

### Todoist Task

```json
{
  "content": "Finish project documentation",
  "project_id": "2331234567",
  "priority": 1,
  "due_string": "today"
}
```

### Notion Page

```json
{
  "Date": "2025-11-24",
  "Mood": "calm",
  "Energy": "medium",
  "Goals": "Finish project documentation, Take a 20-minute walk, Call mom",
  "Summary": "Feeling calm with medium energy..."
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly (mobile + desktop)
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is part of the LiveKit Agents challenge. See individual LICENSE files in backend and frontend directories.

## 🙏 Acknowledgments

- **LiveKit** - Real-time communication platform
- **Deepgram** - Speech-to-text API
- **Murf** - Text-to-speech API
- **Google Gemini** - LLM for conversation
- **Todoist** - Task management integration
- **Notion** - Note-taking integration

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review console logs (browser + backend)
3. Verify API keys are valid
4. Check network connectivity
5. Open an issue on GitHub

## 🎉 Features Roadmap

- [ ] Dark mode support
- [ ] Multiple language support
- [ ] Voice customization
- [ ] Mood visualization charts
- [ ] Goal completion tracking
- [ ] Reminder notifications
- [ ] Export data to CSV
- [ ] Custom goal templates

---

**Built with ❤️ for mental wellness**

*Take a moment for yourself today.* 🌟
