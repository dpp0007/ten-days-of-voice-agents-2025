# 🛒 QuickMart Voice Shopping Assistant - Day 7

A complete voice-controlled grocery ordering system built with LiveKit Agents and Murf Falcon TTS. Shop by voice or text with an intelligent assistant that understands recipes, manages your cart, and places orders.

![Day 7 - Food & Grocery Ordering Voice Agent](https://img.shields.io/badge/Day-7-green) ![Status](https://img.shields.io/badge/Status-Complete-success) ![LiveKit](https://img.shields.io/badge/LiveKit-Agents-blue) ![Murf](https://img.shields.io/badge/Murf-Falcon%20TTS-orange)

## ✨ Features

### 🎤 Voice & Chat Interface
- **Dual Input**: Speak OR type your orders
- **Auto-greeting**: Agent welcomes you when you connect
- **Real-time feedback**: Visual indicators for listening/speaking states
- **Conversation history**: See all your interactions

### 🛍️ Smart Shopping
- **18 Products** across 7 categories (Dairy, Bakery, Vegetables, Staples, Eggs, Snacks, Beverages)
- **Recipe Intelligence**: Say "ingredients for pasta" and get all items automatically
- **6 Pre-configured Recipes**: Pasta, Sandwich, Omelette, Fried Rice, Breakfast, and more
- **Cart Management**: Add, remove, update quantities with voice or UI

### 🎨 Blinkit-Style UI
- Modern, responsive product grid
- Real-time cart updates
- Quantity controls (+/-)
- Order confirmation screen
- Floating voice button

### 🔧 Technical Features
- **Murf Falcon TTS**: Fastest text-to-speech for instant responses
- **Deepgram STT**: Accurate speech recognition
- **Google Gemini LLM**: Intelligent conversation handling
- **7 Function Tools**: Complete cart operations
- **JSON Order Storage**: Persistent order history

## 🚀 Quick Start

### Prerequisites
- Python 3.9+ with [uv](https://docs.astral.sh/uv/)
- Node.js 18+ with pnpm
- LiveKit Cloud account (or local server)

### 1. Clone & Install

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
```

Edit `backend/.env.local`:
```env
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
GOOGLE_API_KEY=your_google_api_key
MURF_API_KEY=your_murf_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
```

```bash
# Download models (first time only)
uv run python src/agent.py download-files

# Start backend
uv run python src/agent.py dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
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
# Start frontend
pnpm dev
```

### 4. Open & Shop!

Open http://localhost:3000 in your browser and start shopping!

## 🎤 Voice Commands

### Basic Shopping
```
"Add milk"
"Add 2 bread"
"Remove eggs"
"Update milk quantity to 3"
```

### Recipe-Based
```
"I need ingredients for pasta"
"Get me what I need for a sandwich"
"Ingredients for omelette"
```

### Cart & Checkout
```
"What's in my cart?"
"Show my cart"
"Place my order"
"Clear my cart"
```

## 📦 Product Catalog

| Category | Items | Price Range |
|----------|-------|-------------|
| **Dairy & Milk** | Milk, Butter, Cheese | ₹30-120 |
| **Bakery** | Bread (2 types) | ₹35-40 |
| **Vegetables** | Tomato, Onion, Potato | ₹20-30 |
| **Staples** | Rice, Pasta, Oil | ₹80-180 |
| **Eggs** | Farm Fresh Eggs | ₹45 |
| **Snacks** | Chips, Biscuits | ₹20-25 |
| **Beverages** | Mango Juice | ₹120 |

**Total**: 18 products

## 🍳 Available Recipes

| Recipe | Ingredients Added |
|--------|-------------------|
| **Pasta** | Pasta, Tomato, Cheese, Oil |
| **Sandwich** | Bread, Butter, Cheese |
| **Peanut Butter Sandwich** | Bread, Butter |
| **Omelette** | Eggs, Butter, Onion, Tomato |
| **Fried Rice** | Rice, Oil, Onion, Eggs |
| **Breakfast** | Bread, Butter, Eggs, Milk |

## 📁 Project Structure

```
ten-days-of-voice-agents-2025/
├── backend/
│   └── src/
│       ├── agent.py              # Voice agent with 7 tools
│       ├── cart_manager.py       # Cart & order logic
│       ├── catalog.json          # Product catalog
│       ├── recipes.json          # Recipe mappings
│       └── orders/               # Saved orders
│
├── frontend/
│   ├── components/
│   │   ├── grocery-store.tsx     # Main shopping UI
│   │   └── grocery-voice-app.tsx # Voice integration
│   └── app/
│       ├── api/catalog/          # Catalog API
│       └── (app)/page.tsx        # Main page
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
