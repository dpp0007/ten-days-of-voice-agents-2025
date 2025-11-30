# 🎙️ Ten Days of Voice Agents 2025 - E-Commerce Assistant

**Day 9 Project**: A fully functional voice-powered e-commerce agent built with LiveKit Agents framework as part of the **#MurfAIVoiceAgentsChallenge**.

This project demonstrates real-world voice commerce capabilities with actual order processing, customer management, and product catalog integration - going beyond simple demos to create a production-ready voice shopping experience.

![LiveKit Agents](https://img.shields.io/badge/LiveKit-Agents-00ADD8?style=for-the-badge)
![Murf AI](https://img.shields.io/badge/Murf-Falcon_TTS-6366F1?style=for-the-badge)
![Deepgram](https://img.shields.io/badge/Deepgram-Nova--2-FF6B35?style=for-the-badge)
![Google Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?style=for-the-badge)

## 🎯 Project Scope

This is **Day 9** of my **10 Days of Voice Agents Challenge** - building increasingly sophisticated voice AI applications. This particular agent focuses on:

- **Real E-commerce Functionality**: Not a demo - actual product catalog, shopping cart, and order processing
- **Production Order Management**: Successfully processing orders for real customers (Utkarsh, Abhay, Yash, and more)
- **Advanced Voice AI**: Using Murf Falcon (fastest TTS), Deepgram Nova-2 (STT), and Google Gemini (LLM)
- **Function Tools**: Pydantic-validated commerce functions with proper error handling

## ✨ What Makes This Special

### 🚀 Real Implementation
- **Actual Orders**: Processing real customer orders with names, timestamps, and product details
- **Live Order History**: 40+ completed orders visible in `/backend/orders/` 
- **Production Ready**: Proper error handling, validation, and order confirmation workflows
- **Customer Names**: Real interactions with customers like Utkarsh, Abhay, Yash, Deepankar, and others

### 🎤 Advanced Voice AI Stack
- **Murf Falcon TTS**: Fastest text-to-speech API for instant voice responses
- **Deepgram Nova-2**: High-accuracy speech-to-text for natural conversations  
- **Google Gemini**: Advanced LLM for intelligent product recommendations and conversation flow
- **LiveKit Agents**: Real-time voice communication with WebRTC technology

### 🛍️ E-Commerce Features
- **Product Catalog Management**: Dynamic product browsing with detailed specifications
- **Smart Shopping Cart**: Add, remove, and modify items with real-time price calculation
- **Order Processing**: Complete checkout flow with order confirmation and receipt generation
- **Customer Management**: Personalized experience with name recognition and order history
- **Inventory Integration**: Real product data with images, prices, and variants

### 🎨 Professional UI/UX
- **Next.js 15.5 Frontend**: Modern React application with Turbo Pack
- **Real-time Animations**: Visual feedback during order processing
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Order Visualization**: Beautiful HTML receipts generated for each purchase

## 📈 Live Project Results

### 🎯 Customer Success Metrics
- **40+ Successfully Processed Orders** (as of Dec 1, 2025)
- **Real Customer Names**: Utkarsh, Abhay, Yash, Deepankar, Shivansh, John, Sarah, Jenna, Ram, Sam, and more
- **Product Variety**: Electronics, accessories, and consumer goods
- **Order Values**: Range from $29.99 to $299.99 per transaction

### 📦 Recent Orders Sample
```
order_20251130_211508_Utkarsh.json → Premium Wireless Headphones ($299.99)
order_20251130_194117_Yash.json → Product purchase with confirmation
order_20251130_193510_Abhay.json → Successful order completion
order_20251130_180703_Deepankar.json → E-commerce transaction
```

### 🛠️ Technical Implementation Highlights
- **Commerce Agent**: `backend/src/commerce_agent.py` (979 lines of production code)
- **Function Tools**: Pydantic-validated commerce operations
- **Order Persistence**: JSON + HTML receipt generation
- **Error Recovery**: Robust validation with proper user feedback

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15.5)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  LiveKit     │  │  React UI    │  │  Order       │      │
│  │  Components  │  │  with Motion │  │  Management  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                         ↕ LiveKit WebRTC
┌─────────────────────────────────────────────────────────────┐
│                Backend (Python + LiveKit Agents)             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Commerce     │  │  Deepgram    │  │   Murf       │      │
│  │ Agent (979   │  │  Nova-2 STT  │  │  Falcon TTS  │      │
│  │ lines)       │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Google     │  │ Function     │  │   Order      │      │
│  │   Gemini     │  │ Tools with   │  │  Storage     │      │
│  │   LLM        │  │ Pydantic     │  │ (JSON+HTML)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Real Order Data Structure

### Actual Customer Order Example
```json
{
  "order_id": "ORD-20251130_211508",
  "customer_name": "Utkarsh",
  "items": [
    {
      "product_id": "prod_001",
      "name": "Premium Wireless Headphones",
      "unit_price": 299.99,
      "quantity": 1,
      "color": "Black",
      "image": "https://images.unsplash.com/photo-1505740420928..."
    }
  ],
  "total": 299.99,
  "timestamp": "2025-11-30T21:15:08.017560",
  "status": "confirmed"
}
```

## 🚀 Getting Started

### Prerequisites
- **Python 3.11+** with `uv` package manager  
- **Node.js 18+** with `npm` or `pnpm`
- **API Keys Required**:
  - LiveKit Account (free tier available)
  - Murf AI Falcon API key
  - Deepgram Nova-2 API key  
  - Google Gemini API key

### Quick Setup

**Clone and Setup Backend:**
```bash
cd backend
cp .env.example .env.local
# Add your API keys to .env.local
uv run src/agent.py dev
```

**Setup Frontend:**
```bash
cd frontend  
cp .env.example .env.local
# Add LiveKit credentials to .env.local
npm install && npm run dev
```

**Start Voice Session:**
```bash
# Open browser to http://localhost:3000
# Click "Connect" and start talking!
```

## 🎯 Challenge Progress

This project is part of the **#MurfAIVoiceAgentsChallenge** - **10 Days of Voice Agents 2025**

### Challenge Objectives ✅
- **Day 1**: ✅ Get starter voice agent running end-to-end
- **Day 9**: ✅ **THIS PROJECT** - Advanced e-commerce voice agent with real order processing
- **Next**: Continue building increasingly sophisticated voice AI applications

### Key Achievements
- 🎤 **Natural Voice Conversations** - Seamless STT/TTS with Murf Falcon + Deepgram
- 🛍️ **Real E-commerce Functionality** - Not just a demo, actual working commerce
- 👥 **Customer Success** - 40+ real orders from actual users 
- 🏗️ **Production Architecture** - LiveKit Agents + Next.js 15.5 + proper error handling
- 📦 **Order Management** - Complete workflow from browse to checkout with receipts

## 📁 Project Structure

```
ten-days-of-voice-agents-2025/
├── backend/                    
│   ├── src/
│   │   ├── agent.py           # Entry point and agent setup
│   │   ├── commerce_agent.py  # Main commerce logic (979 lines)
│   │   └── catalog.json       # Product database
│   ├── orders/                # Real customer orders (40+ files)
│   │   ├── order_20251130_211508_Utkarsh.json
│   │   ├── order_20251130_194117_Yash.json
│   │   └── ...               # More real orders
│   └── .env.local            # API keys (Murf, Deepgram, Gemini, LiveKit)
├── frontend/                  
│   ├── app/                  # Next.js 15.5 application
│   ├── components/           # LiveKit React components
│   └── package.json          # Dependencies (React 19, LiveKit, etc.)
└── challenges/
    └── Day 1 Task.md        # Challenge instructions
```

## 🎤 How Voice Commerce Works

### Customer Experience
```
1. User visits → http://localhost:3000
2. Clicks "Connect" → LiveKit room established  
3. Starts talking → "I need wireless headphones"
4. Agent responds → Natural conversation about preferences
5. Product suggestions → AI recommends based on requirements
6. Add to cart → Voice confirmation with price
7. Checkout → Order confirmation with total
8. Order complete → JSON + HTML receipt generated
9. Success! → Real order stored in /orders/ directory
```

### Technical Flow
```
Voice Input → Deepgram Nova-2 STT → Google Gemini LLM
     ↓                                       ↓
Gemini calls commerce functions → Pydantic validation
     ↓                                       ↓  
Function results → Natural response → Murf Falcon TTS
     ↓                                       ↓
Audio output → Order storage → HTML receipt
```

## 🛠️ Technical Implementation

### Commerce Agent Core Functions
```python
@function_tool
async def list_products(category: Optional[str] = None) -> Dict:
    """Browse available products with filtering"""
    
@function_tool  
async def add_to_cart(product_id: str, quantity: int = 1) -> Dict:
    """Add products to shopping cart"""
    
@function_tool
async def checkout_cart(customer_name: str) -> Dict:
    """Process order and generate receipt"""
```

### Key Features
- **979 lines** of production Python code in `commerce_agent.py`
- **Pydantic validation** for all function parameters
- **Real-time error handling** with user-friendly responses
- **Order persistence** with both JSON and HTML formats
- **Customer management** with name recognition and history

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
  "productType": "Widget",
  "variant": "Premium",
  "color": "Blue",
  "extras": ["Extended Warranty"],
  "name": "John",
  "token_number": "ORDER-20251123-A1B2",
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
- Visual order illustration

## 🐛 Troubleshooting

### Backend Issues

**Agent not responding:**
- Check API keys in `.env.local`
- Verify LiveKit connection
- Check backend logs for errors
- Ensure `commerce_agent.py` is properly loaded

**Function tools not working:**
- Check Pydantic validation errors in logs
- Verify `catalog.json` exists and is valid
- Ensure function parameters are properly typed
- Review function tool decorators

**Product search failing:**
- Verify `catalog.json` file path and format
- Check product data structure
- Review search function parameters
- Ensure JSON is valid and accessible

**Orders not saving:**
- Ensure `orders/` directory exists
- Check file permissions
- Verify agent is calling `save_order()` function
- Check cart state and order data

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
- **E-commerce Industry** - Inspiration for commerce use case

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review console logs
3. Check API key validity
4. Verify network connectivity

---

**Built with ❤️ for the LiveKit Agents Challenge**

*Enjoy your voice commerce experience!* 🛍️✨
