# Blue Tokai Coffee Voice Assistant 🎙️☕

A multilingual voice-powered coffee ordering system built with LiveKit Agents, featuring real-time voice interaction, animated coffee visualizations, and order management.

![Blue Tokai Coffee Bot](https://img.shields.io/badge/Voice-Assistant-12B1C5?style=for-the-badge)
![LiveKit](https://img.shields.io/badge/LiveKit-Agents-8FE4F9?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge)

## ✨ Features

### 🎤 Voice Interaction
- **Natural Conversation**: Speak naturally in English to place orders
- **Real-time STT**: Powered by Deepgram Nova-3
- **Natural TTS**: High-quality voice synthesis with Murf Falcon
- **Smart Turn Detection**: Multilingual turn detection for smooth conversations

### ☕ Coffee Ordering
- **Complete Menu**: Espresso, Americano, Cappuccino, Latte, Flat White, Mocha, Cold Brew, and more
- **Customization**: Size (small/medium/large), milk type (regular/oat/almond/soy), extras
- **Order Confirmation**: Clear recap before finalizing
- **Unique Tokens**: Each order gets a unique BT-YYYYMMDD-XXXX token

### 🎨 Visual Experience
- **Animated Coffee Cup**: Real-time pouring animation when orders are placed
- **Professional Design**: Clean, minimal UI with Blue Tokai brand colors
- **Responsive Layout**: Works on desktop and mobile
- **Order History**: View all orders from the current session

### 📊 Order Management
- **JSON Storage**: Orders saved as structured JSON files
- **HTML Receipts**: Beautiful HTML receipts generated for each order
- **Session History**: Track multiple orders in a single session
- **Real-time Updates**: Instant order confirmation and visualization

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Voice UI    │  │  Animation   │  │  Order       │      │
│  │  Component   │  │  System      │  │  History     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ LiveKit WebRTC
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Python Agent)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  LLM         │  │  STT         │  │  TTS         │      │
│  │  (Gemini)    │  │  (Deepgram)  │  │  (Murf)      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────────────────────────────────────────┐      │
│  │         Order Management & Storage                │      │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.11+** with `uv` package manager
- **Node.js 18+** with `npm` or `pnpm`
- **LiveKit Account** (free tier available)
- **API Keys**: Deepgram, Murf, Google Gemini

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Add your API keys to `.env.local`:**
   ```env
   LIVEKIT_URL=wss://your-livekit-url.livekit.cloud
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   GOOGLE_API_KEY=your_gemini_api_key
   MURF_API_KEY=your_murf_api_key
   DEEPGRAM_API_KEY=your_deepgram_api_key
   ```

4. **Install dependencies and run:**
   ```bash
   uv run src/agent.py dev
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Add LiveKit credentials to `.env.local`:**
   ```env
   LIVEKIT_URL=wss://your-livekit-url.livekit.cloud
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   ```

4. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

5. **Run development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open browser:**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
ten-days-of-voice-agents-2025/
├── backend/
│   ├── src/
│   │   └── agent.py              # Main agent logic
│   ├── orders/                   # Order storage (JSON + HTML)
│   ├── .env.local               # Environment variables (not in git)
│   ├── .env.example             # Example environment file
│   └── pyproject.toml           # Python dependencies
│
├── frontend/
│   ├── app/                     # Next.js app directory
│   ├── components/
│   │   └── app/
│   │       ├── blue-tokai-session.tsx      # Main session component
│   │       ├── blue-tokai-session.module.css # Styles & animations
│   │       └── animated-grid.tsx           # Background animation
│   ├── hooks/
│   │   └── useRoom.ts           # LiveKit room management
│   ├── .env.local              # Environment variables (not in git)
│   └── package.json            # Node dependencies
│
└── README_BLUE_TOKAI.md        # This file
```

## 🎯 How It Works

### 1. User Flow
```
User starts session
    ↓
Agent greets and asks for name
    ↓
User provides order details (drink, size, milk, extras)
    ↓
Agent confirms order
    ↓
User confirms
    ↓
Order saved & HTML receipt generated
    ↓
Animation plays & order added to history
```

### 2. Technical Flow
```
Frontend connects to LiveKit room
    ↓
Backend agent joins room
    ↓
User speaks → Deepgram STT → Text
    ↓
Text → Gemini LLM → Response
    ↓
Response → Murf TTS → Audio
    ↓
Audio played to user
    ↓
On order confirmation:
  - Save JSON file
  - Generate HTML receipt
  - Send HTML via data message
  - Frontend receives & displays
  - Animation triggers
```

## 🎨 Design System

### Colors
- **Primary**: `#12B1C5` (Teal)
- **Accent**: `#8FE4F9` (Light Blue)
- **Surface**: `#FFF9EF` (Cream)

### Typography
- **Font**: Segoe UI, system fonts
- **Headings**: 700 weight
- **Body**: 500 weight

### Animations
- **Cup Pouring**: 2.5s duration
- **Idle Hover**: 4s loop
- **Steam Rise**: 3.5s loop
- **Card Slide**: 400ms ease-out

## 🔧 Configuration

### Agent Behavior
Edit `backend/src/agent.py` to customize:
- Conversation flow
- Menu items
- Confirmation logic
- Order validation

### UI Customization
Edit `frontend/components/app/blue-tokai-session.module.css` to customize:
- Colors and branding
- Animation timings
- Layout proportions
- Component styles

## 📊 Order Data Structure

### JSON Format
```json
{
  "drinkType": "Latte",
  "size": "medium",
  "milk": "oat",
  "extras": ["vanilla syrup"],
  "name": "John",
  "token_number": "BT-20251123-A1B2",
  "timestamp": "2025-11-23T19:30:00.000000",
  "status": "confirmed"
}
```

### HTML Receipt
Each order generates a styled HTML receipt with:
- Customer name
- Order details
- Unique token
- Timestamp
- Visual coffee cup illustration

## 🐛 Troubleshooting

### Backend Issues

**Agent not responding:**
- Check API keys in `.env.local`
- Verify LiveKit connection
- Check backend logs for errors

**Orders not saving:**
- Ensure `orders/` directory exists
- Check file permissions
- Verify agent is calling `save_order()` function

### Frontend Issues

**No audio:**
- Grant microphone permissions
- Check browser compatibility (Chrome/Edge recommended)
- Verify LiveKit credentials

**Animation not playing:**
- Check browser console for errors
- Verify data message is received
- Check HTML parsing in console logs

**Order history empty:**
- Open browser console (F12)
- Look for "📝 Added to order history" logs
- Verify data message contains HTML

## 🔐 Security Notes

- **Never commit `.env.local` files** - they contain sensitive API keys
- **Use `.env.example`** as a template for required variables
- **Rotate API keys** if accidentally exposed
- **Use environment variables** for all sensitive data

## 📝 API Keys Required

1. **LiveKit** - [Get free account](https://livekit.io/)
2. **Deepgram** - [Get API key](https://deepgram.com/)
3. **Murf** - [Get API key](https://murf.ai/)
4. **Google Gemini** - [Get API key](https://ai.google.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the LiveKit Agents challenge. See individual LICENSE files in backend and frontend directories.

## 🙏 Acknowledgments

- **LiveKit** - Real-time communication platform
- **Deepgram** - Speech-to-text API
- **Murf** - Text-to-speech API
- **Google Gemini** - LLM for conversation
- **Blue Tokai Coffee Roasters** - Brand inspiration

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review console logs
3. Check API key validity
4. Verify network connectivity

---

**Built with ❤️ for the LiveKit Agents Challenge**

*Enjoy your virtual coffee experience!* ☕✨
