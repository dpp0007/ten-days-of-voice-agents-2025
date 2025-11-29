# ⚡ Aetherfall - Voice-Powered D&D Adventure

An immersive voice-controlled D&D-style adventure game built with LiveKit Agents and Murf Falcon TTS. Explore a floating sky city, make choices that matter, and experience an epic story guided by an AI Game Master.

![Day 8 - Voice Game Master](https://img.shields.io/badge/Day-8-purple) ![Status](https://img.shields.io/badge/Status-Complete-success) ![LiveKit](https://img.shields.io/badge/LiveKit-Agents-blue) ![Murf](https://img.shields.io/badge/Murf-Falcon%20TTS-orange)

## ✨ Features

### 🎭 Voice-Powered Gameplay
- **Speak Your Actions**: Control your character entirely by voice
- **AI Game Master**: Intelligent narrator that responds to your choices
- **Cinematic Narration**: Immersive storytelling with dramatic pauses
- **Real-time Feedback**: Visual indicators for GM speaking/listening states

### 🎲 D&D-Style Mechanics
- **Character System**: HP, Strength, Intelligence, Luck attributes
- **Dice Rolling**: d20 rolls for skill checks and risky actions
- **Inventory Management**: Collect and use items throughout your journey
- **Quest Tracking**: Active and completed quests
- **NPC Interactions**: Meet characters with persistent relationships
- **Location Tracking**: Explore different areas of Aetherfall

### 🌌 Epic Story World
- **Aetherfall**: A floating city above an endless storm
- **The Abyss**: Violent world of lightning and ancient machines below
- **Broken Sky-Temple**: Your mysterious starting location
- **Glowing Mark**: A mystical symbol on your arm that reacts to the world
- **Story Progression**: Awakening → Discovery → Threat → Choice → Outcome

### 🎨 Modern Game UI
- **Dark Fantasy Theme**: Immersive amber/purple gradient design
- **Animated Temple**: Floating temple with lightning effects on welcome screen
- **Story Panel**: Large, readable GM narration
- **Chat Transcript**: Full conversation history
- **Character Sheet**: Real-time stats, HP, inventory, and quests
- **Mobile Responsive**: Optimized for desktop and mobile devices

### 🔧 Technical Features
- **Murf Falcon TTS**: Natural voice for the Game Master
- **Deepgram STT**: Accurate speech recognition
- **Google Gemini 2.5 Flash**: Intelligent story generation
- **14 Function Tools**: Complete game mechanics
- **Auto-Save System**: Progress saved every 5 minutes + on disconnect
- **JSON Save Files**: Persistent game state

## 🚀 Quick Start

### Prerequisites
- Python 3.9+ with [uv](https://docs.astral.sh/uv/)
- Node.js 18+ with npm/pnpm
- LiveKit Cloud account ([Get free account](https://cloud.livekit.io/))
- API Keys: [Google AI](https://aistudio.google.com/), [Murf](https://murf.ai/), [Deepgram](https://deepgram.com/)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/aetherfall-voice-game.git
cd ten-days-of-voice-agents-2025
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
uv sync

# Configure environment
cp .env.example .env.local
```

Edit `backend/.env.local` with your API keys:
```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
GOOGLE_API_KEY=your_google_api_key
MURF_API_KEY=your_murf_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
```

```bash
# Start the Game Master agent
python -m livekit.agents.cli dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Configure environment
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
```

```bash
# Start the web app
npm run dev
# or
pnpm dev
```

### 4. Begin Your Adventure!

Open http://localhost:3000 in your browser and click "Begin Adventure" ⚡

## 🎤 How to Play

### Speaking to the Game Master

Simply speak your actions naturally:

**Exploration:**
```
"I look around"
"I examine the glowing mark on my arm"
"I walk towards the broken pillar"
"I search for a way down"
```

**Interaction:**
```
"I talk to the stranger"
"I ask about the storm"
"I try to open the door"
"I pick up the ancient key"
```

**Combat & Actions:**
```
"I attack the creature"
"I try to dodge"
"I cast a spell"
"I run away"
```

### Game Commands

**Character Info:**
```
"Show my character sheet"
"What's in my inventory?"
"Check my HP"
"What are my stats?"
```

**Game Management:**
```
"Save my game"
"Load my game"
"Start over"
```

## 🎲 Game Mechanics

### Character Attributes
- **Strength (STR)**: Physical power and combat ability
- **Intelligence (INT)**: Problem-solving and magic
- **Luck (LCK)**: Fortune and chance outcomes

### Dice System
- **d20 Rolls**: Standard skill checks
- **Modifiers**: Based on your attributes
- **Difficulty Classes**: 10 (normal), 15 (hard), 20 (very hard)
- **Critical Success**: Natural 20
- **Critical Failure**: Natural 1

### Health System
- **Starting HP**: 20/20
- **Status Effects**: Healthy, Injured, Critical, Dead
- **Healing**: Find potions or rest
- **Damage**: Combat, traps, environmental hazards

### Progression
Your choices shape the story through 5 stages:
1. **Awakening** - Discover who you are
2. **Discovery** - Learn about the world
3. **Threat** - Face danger
4. **Choice** - Make critical decisions
5. **Outcome** - Experience consequences

## 📁 Project Structure

```
ten-days-of-voice-agents-2025/
├── backend/
│   └── src/
│       ├── agent.py              # Game Master AI with 14 tools
│       ├── game_master.py        # Game state & mechanics
│       └── saves/                # Auto-saved game progress
│           ├── autosave.json     # Auto-save (every 5 min)
│           └── manual_save.json  # Manual saves
│
├── frontend/
│   ├── components/app/
│   │   ├── session-view.tsx      # Main game UI
│   │   ├── welcome-view.tsx      # Landing page
│   │   ├── character-sheet.tsx   # Character stats
│   │   ├── chat-transcript.tsx   # Conversation history
│   │   └── tile-layout.tsx       # Audio visualization
│   ├── hooks/
│   │   ├── useChatMessages.ts    # Message handling
│   │   └── useRoom.ts            # LiveKit connection
│   └── styles/
│       └── globals.css           # Dark fantasy theme
│
└── README.md                     # This file
```

## 🛠️ Voice Agent Tools

The agent has 7 function tools:

1. **add_item_to_cart** - Add items with quantity
2. **remove_item_from_cart** - Remove items
3. **update_item_quantity** - Change quantities
4. **add_recipe_ingredients** - Add recipe items
5. **show_cart** - Display cart contents
6. **place_order** - Save order to JSON
7. **clear_cart** - Empty the cart

## 💾 Order Format

Orders are saved to `backend/src/orders/order_<id>.json`:

```json
{
  "order_id": "abc123",
  "timestamp": "2025-11-28T10:30:00",
  "customer": "Guest",
  "items": [
    {
      "id": "milk-amul-500",
      "name": "Amul Cow Milk",
      "price": 30,
      "unit": "500 ml",
      "quantity": 1
    }
  ],
  "total": 30,
  "status": "placed"
}
```

## 🎨 Customization

### Add Products

Edit `backend/src/catalog.json` and `frontend/app/api/catalog/catalog.json`:

```json
{
  "id": "product-id",
  "name": "Product Name",
  "price": 100,
  "unit": "1 kg",
  "brand": "Brand",
  "tags": ["category"]
}
```

### Add Recipes

Edit `backend/src/recipes.json`:

```json
{
  "recipe-name": {
    "name": "Display Name",
    "items": ["item-id-1", "item-id-2"]
  }
}
```

## 🐛 Troubleshooting

### Backend won't start
```bash
cd backend
uv run python src/agent.py download-files
uv sync --reinstall
```

### Frontend won't start
```bash
cd frontend
rm -rf .next node_modules
pnpm install
```

### Voice not working
- Check microphone permissions in browser
- Click "Allow" when prompted
- Verify LiveKit credentials in `.env.local`
- Check browser console for errors

### Chat not working
- Ensure backend is running
- Check LiveKit connection status
- Verify API keys are correct

## 📊 Stats

- **Code Files**: 13
- **Total Lines**: ~1,650
- **Products**: 18
- **Categories**: 7
- **Recipes**: 6
- **Voice Tools**: 7
- **Documentation**: 8 files

## 🎯 Day 7 Challenge Complete

This project fulfills all Day 7 Primary Goal requirements:

✅ Catalog JSON with products  
✅ Cart management (add/remove/update)  
✅ Voice-controlled ordering  
✅ Recipe-based ordering  
✅ Order placement with JSON storage  
✅ Blinkit-style UI  
✅ Voice + Chat integration  

## 📚 Documentation

- [Quick Reference](./START_HERE.md) - Quick start guide
- [Setup Guide](./DAY7_SETUP.md) - Detailed setup
- [Architecture](./DAY7_ARCHITECTURE.md) - System design
- [Examples](./DAY7_EXAMPLE_CONVERSATIONS.md) - Voice examples

## 🔗 Resources

- [LiveKit Agents](https://docs.livekit.io/agents/)
- [Murf Falcon TTS](https://murf.ai/)
- [Challenge Details](https://github.com/murf-ai/ten-days-of-voice-agents-2025)

## 📝 License

MIT License - See [LICENSE](./LICENSE) file

## 🙏 Acknowledgments

Built for the **Murf AI Voice Agents Challenge**

- **Murf Falcon TTS** - Fastest text-to-speech API
- **LiveKit** - Real-time voice infrastructure
- **Deepgram** - Speech recognition
- **Google Gemini** - Language model

---

**#MurfAIVoiceAgentsChallenge #10DaysofAIVoiceAgents**

Made with ❤️ for Day 7 Challenge
