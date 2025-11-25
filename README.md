# 🎓 Teach-the-Tutor: Active Recall Voice Coach

> An AI-powered voice tutor that helps you master programming concepts through active recall, built with LiveKit Agents and Murf Falcon TTS.

[![LiveKit](https://img.shields.io/badge/LiveKit-Agents-00E5FF?style=flat-square)](https://livekit.io/)
[![Murf AI](https://img.shields.io/badge/Murf-Falcon%20TTS-A855F7?style=flat-square)](https://murf.ai/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.13-blue?style=flat-square)](https://python.org/)

---

## 📖 Overview

**Teach-the-Tutor** is an interactive voice-based learning platform that uses active recall methodology to help users master programming concepts. The system features three distinct learning modes, each powered by a different AI voice personality, creating an engaging and effective learning experience.

### Why Active Recall?

Active recall is proven to be 50% more effective than passive reading. By forcing your brain to retrieve information, you strengthen neural pathways and improve long-term retention.

---

## ✨ Key Features

- 🎤 **Voice-First Interaction** - Natural conversation with AI tutor using LiveKit real-time communication
- 🎭 **Three Learning Modes** - Learn, Quiz, and Teach-Back with dedicated AI voices
- 🧠 **Active Recall Methodology** - Science-backed learning technique for better retention
- 📊 **Progress Tracking** - Persistent learning history with performance analytics
- 🎨 **Pixel-Art Theme** - Modern dark UI with glassmorphism and neon accents
- 📱 **Mobile-First Design** - Responsive interface optimized for all devices
- 🔄 **Real-Time Scoring** - Instant feedback with motivational progress updates
- 💾 **Session Persistence** - Resume learning from where you left off

---

## 🏗️ Tech Stack

### Backend
- **Python 3.13** - Core language
- **LiveKit Agents** - Real-time voice agent framework
- **Murf Falcon TTS** - Ultra-fast text-to-speech (Matthew, Alicia, Ken voices)
- **Deepgram STT** - Speech-to-text recognition
- **Google Gemini 2.5 Flash** - LLM for conversation intelligence
- **UV** - Fast Python package manager

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **LiveKit Components React** - Real-time communication UI
- **Lucide React** - Icon library
- **PNPM** - Fast package manager

---

## 🎯 Learning Modes

### 1. Learn Mode (Voice: Matthew)
The AI explains programming concepts using clear, structured summaries. Perfect for initial understanding.

### 2. Quiz Mode (Voice: Alicia)
The AI asks questions to test your knowledge. Receive scores (0-100) and track your progress.

### 3. Teach-Back Mode (Voice: Ken)
Explain concepts back to the AI in your own words. The ultimate test of understanding.

---

## 📁 Project Architecture

```
teach-the-tutor/
├── backend/                    # Python voice agent
│   ├── src/
│   │   ├── agent.py           # Main tutor agent
│   │   └── __init__.py
│   ├── shared-data/
│   │   ├── day4_tutor_content.json      # Learning concepts
│   │   └── learner_history.json         # Progress tracking
│   ├── .env.local             # Environment variables
│   ├── pyproject.toml         # Python dependencies
│   └── Dockerfile             # Container config
│
├── frontend/                   # Next.js web app
│   ├── app/
│   │   ├── (tutor)/
│   │   │   ├── welcome/       # Entry screen
│   │   │   ├── session/       # Main learning UI
│   │   │   └── progress/      # Analytics dashboard
│   │   ├── api/
│   │   │   └── progress/      # Progress data API
│   │   ├── layout.tsx
│   │   └── loading.tsx
│   ├── components/
│   │   └── tutor/             # Custom UI components
│   │       ├── animated-cube.tsx
│   │       ├── chat-bubble.tsx
│   │       ├── listening-indicator.tsx
│   │       ├── tutor-bottom-nav.tsx
│   │       ├── neon-loader.tsx
│   │       └── ...
│   ├── styles/
│   │   └── globals.css        # Global styles
│   └── package.json
│
└── README.md                   # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.13+** with UV package manager
- **Node.js 18+** with PNPM
- **LiveKit Cloud Account** (free tier available)
- **API Keys** for:
  - LiveKit (URL, API Key, Secret)
  - Murf AI (API Key)
  - Deepgram (API Key)
  - Google Gemini (API Key)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/teach-the-tutor.git
cd teach-the-tutor
```

#### 2. Backend Setup

```bash
cd backend

# Install UV (if not installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install dependencies
uv sync

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your API keys
# LIVEKIT_URL=wss://your-project.livekit.cloud
# LIVEKIT_API_KEY=your_api_key
# LIVEKIT_API_SECRET=your_api_secret
# MURF_API_KEY=your_murf_key
# DEEPGRAM_API_KEY=your_deepgram_key
# GOOGLE_API_KEY=your_google_key
```

#### 3. Frontend Setup

```bash
cd ../frontend

# Install PNPM (if not installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with LiveKit credentials
```

#### 4. Download Required Models

```bash
cd backend
uv run python src/agent.py download-files
```

---

## 🎮 Running the Application

### Development Mode

#### Option 1: Run All Services Together

```bash
# From project root
./start_app.sh
```

#### Option 2: Run Services Separately

**Terminal 1 - Backend Agent:**
```bash
cd backend
uv run python src/agent.py dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm dev
```

**Access the app:**
- Local: http://localhost:3000
- Welcome: http://localhost:3000/welcome
- Session: http://localhost:3000/session
- Progress: http://localhost:3000/progress

### Production Mode

**Backend:**
```bash
cd backend
uv run python src/agent.py start
```

**Frontend:**
```bash
cd frontend
pnpm build
pnpm start
```

---

## 🎨 User Interface

### Welcome Screen
- Animated 3D rotating cube
- Rotating interesting facts about learning
- Pixel-art styled title with neon glow
- Glassmorphism "Begin Learning" button

### Session Screen
- Mode-based background tinting (Blue/Green/Purple)
- Real-time voice/text communication
- Floating chat bubbles with pixel accents
- Compact pill-shaped navigation bar
- Mic toggle with visual feedback

### Progress Dashboard
- Summary card with highest/lowest/average scores
- Individual concept progress cards
- Responsive grid layout
- Pixel-art decorative elements

---

## 🧠 Learning Concepts

The tutor currently teaches 5 core programming concepts:

1. **Variables** - Data containers and assignment
2. **Loops** - Iteration and repetition
3. **Functions** - Reusable code blocks
4. **Conditionals** - Decision-making logic
5. **Lists** - Ordered collections

Each concept includes:
- Structured summary for learning
- Sample question for assessment
- Scoring and progress tracking

---

## 📊 Progress Tracking

### Data Storage

Progress is stored in `backend/shared-data/learner_history.json`:

```json
{
  "last_concept": "variables",
  "last_mode": "quiz",
  "concepts": {
    "variables": {
      "attempts": [
        {
          "mode": "quiz",
          "current_score": 85,
          "previous_score": null,
          "timestamp": "2025-11-25T18:40:00"
        }
      ],
      "average_score": 85
    }
  }
}
```

### Scoring System

- **Range**: 0-100 points
- **Feedback**: Motivational messages based on improvement
- **Tracking**: Current score vs. previous score
- **Analytics**: Average score calculated for frontend visualization

---

## 🔧 Configuration

### Environment Variables

#### Backend (`.env.local`)
```bash
# LiveKit Configuration
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# AI Services
MURF_API_KEY=your_murf_api_key
DEEPGRAM_API_KEY=your_deepgram_key
GOOGLE_API_KEY=your_google_gemini_key
```

#### Frontend (`.env.local`)
```bash
# LiveKit Configuration (same as backend)
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
```

---

## 🎭 Voice Personalities

### Matthew (Learn Mode)
- Warm, explanatory tone
- Clear and structured delivery
- Patient and encouraging

### Alicia (Quiz Mode)
- Engaging, quiz-show energy
- Supportive and motivating
- Celebrates correct answers

### Ken (Teach-Back Mode)
- Attentive listener
- Constructive feedback
- Guides without judgment

---

## 🛠️ Development

### Project Structure

```
Backend Agent (Python):
- agent.py              # Main agent with 3 modes
- day4_tutor_content.json    # Concept definitions
- learner_history.json       # Progress persistence

Frontend (Next.js):
- app/(tutor)/          # Main app routes
- components/tutor/     # Custom UI components
- styles/globals.css    # Theme and animations
```

### Adding New Concepts

Edit `backend/shared-data/day4_tutor_content.json`:

```json
{
  "concepts": [
    {
      "id": "new_concept",
      "title": "New Concept",
      "summary": "Explanation of the concept...",
      "sample_question": "Question to test understanding?"
    }
  ]
}
```

### Customizing Voices

Edit voice assignments in `backend/src/agent.py`:

```python
voice_map = {
    "learn": "matthew",      # Change to any Murf Falcon voice
    "quiz": "alicia",
    "teach_back": "ken"
}
```

---

## 📱 Mobile Support

The app is fully responsive and optimized for:
- iPhone SE (375px)
- iPhone 12/13/14 (390px)
- iPad (768px)
- Desktop (1024px+)

Features:
- Touch-friendly buttons (48px minimum)
- Safe area insets for notched devices
- No horizontal scrolling
- Optimized font sizes
- Compact navigation

---

## 🎨 Design System

### Theme
- **Background**: #0C0C0E (near black)
- **Accent Colors**: Cyan (#00FFFF), Purple (#8A2BE2)
- **Glassmorphism**: 8-16px blur, low opacity whites
- **Spacing**: 8pt grid system (4/8/12/16/24/32/48px)

### Animations
- Float up (chat bubbles): 400ms
- Pulse ring (mic active): 1.5s infinite
- Mode transition: 500ms ease-in-out
- Pixel grid shift: 30s infinite

See `frontend/DESIGN_SYSTEM.md` for complete specifications.

---

## 🧪 Testing

### Manual Testing

1. **Welcome Screen**
   - Verify cube animation
   - Check fact rotation (6s interval)
   - Test "Begin Learning" button

2. **Session Screen**
   - Test voice input (mic button)
   - Test text input (chat button)
   - Verify chat bubbles appear
   - Check mode switching
   - Test back button navigation

3. **Progress Page**
   - Verify stats display
   - Check responsive grid
   - Test back button

### Browser Testing

Tested on:
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

---

## 📚 API Reference

### Progress API

**Endpoint**: `GET /api/progress`

**Response**:
```json
{
  "last_concept": "variables",
  "last_mode": "quiz",
  "concepts": {
    "variables": {
      "attempts": [...],
      "average_score": 85
    }
  }
}
```

### Connection Details API

**Endpoint**: `POST /api/connection-details`

**Response**:
```json
{
  "serverUrl": "wss://...",
  "participantToken": "..."
}
```

---

## 🗺️ Roadmap

### Current Features
- ✅ Three learning modes with voice switching
- ✅ Five programming concepts
- ✅ Progress tracking and persistence
- ✅ Mobile-responsive UI
- ✅ Real-time voice/text communication

### Planned Enhancements
- [ ] Voice waveform visualization
- [ ] Achievement badges and milestones
- [ ] Spaced repetition algorithm
- [ ] More programming concepts (OOP, async, etc.)
- [ ] Multi-language support
- [ ] Export progress as PDF
- [ ] Social sharing features
- [ ] Leaderboard (optional)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Issues
1. Check existing issues first
2. Use the issue template
3. Provide detailed reproduction steps
4. Include screenshots if UI-related

### Submitting Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test on mobile and desktop
- Update documentation if needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

### Technologies
- [LiveKit](https://livekit.io/) - Real-time communication platform
- [Murf AI](https://murf.ai/) - Premium text-to-speech API
- [Deepgram](https://deepgram.com/) - Speech recognition
- [Google Gemini](https://ai.google.dev/) - Large language model
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

### Inspiration
- Active Recall methodology by cognitive science research
- Feynman Technique for learning through teaching
- Spaced repetition systems (SRS)

---

## 📞 Support

- **Documentation**: See `/frontend/DESIGN_SYSTEM.md` and `/frontend/TUTOR_UI_README.md`
- **Issues**: [GitHub Issues](https://github.com/yourusername/teach-the-tutor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/teach-the-tutor/discussions)

---

## 🌟 Star History

If you find this project helpful, please consider giving it a star ⭐

---

**Built with ❤️ for effective learning**

*Part of the AI Voice Agents Challenge by Murf.ai*
