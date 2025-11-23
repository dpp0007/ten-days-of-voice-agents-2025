# Day 2: Blue Tokai Coffee Voice Assistant ☕🎙️

## 📋 Project Overview

**Blue Tokai Coffee Voice Assistant** is a fully functional, production-ready voice-powered coffee ordering system that allows customers to place orders through natural conversation. Built using LiveKit Agents, it features real-time voice interaction, animated visualizations, and complete order management.

### 🎯 Project Goal

Create an intelligent voice assistant that can:
- Take coffee orders through natural conversation
- Understand customer preferences (drink type, size, milk, extras)
- Confirm orders before processing
- Generate unique order tokens
- Display beautiful animated visualizations
- Maintain order history within a session

---

## ✨ Key Features Implemented

### 1. 🎤 Voice Interaction System

**Natural Conversation Flow:**
- Greets customers warmly
- Asks for name first
- Collects drink preferences naturally
- Handles clarifications and changes
- Confirms order before finalizing

**Technology Stack:**
- **STT (Speech-to-Text)**: Deepgram Nova-3 for accurate transcription
- **LLM (Language Model)**: Google Gemini 2.5 Flash for intelligent responses
- **TTS (Text-to-Speech)**: Murf Falcon with "Anisha" voice for natural speech
- **Turn Detection**: Multilingual model for smooth conversation flow

**Conversation Example:**
```
Agent: "Hello! Welcome to Blue Tokai Coffee Roasters. What's your name?"
User: "I'm Sarah"
Agent: "Nice to meet you, Sarah! What are you in the mood for?"
User: "I'd like a latte"
Agent: "Great choice! What size - small, medium, or large?"
User: "Medium please"
Agent: "Perfect! What kind of milk - regular, oat, almond, or soy?"
User: "Oat milk"
Agent: "Would you like any extras?"
User: "No thanks"
Agent: "Alright, here's your order: A medium latte with oat milk for Sarah. Should I confirm this?"
User: "Yes"
Agent: "Perfect! Your order is confirmed. Token: BT-20251123-A1B2"
```

### 2. ☕ Coffee Ordering System

**Complete Menu:**
- Espresso
- Americano
- Cappuccino
- Latte
- Flat White
- Mocha
- Cold Brew
- Iced Latte
- Frappé
- Hot Chocolate

**Customization Options:**
- **Sizes**: Small, Medium, Large
- **Milk Types**: Regular, Skim, Oat, Almond, Soy
- **Extras**: Extra shot, Vanilla syrup, Caramel drizzle, Whipped cream

**Order State Management:**
```json
{
  "drinkType": "Latte",
  "size": "medium",
  "milk": "oat",
  "extras": ["vanilla syrup"],
  "name": "Sarah",
  "token_number": "BT-20251123-A1B2",
  "timestamp": "2025-11-23T19:30:00.000000",
  "status": "confirmed"
}
```

### 3. 🎨 Visual Experience

**Animated Coffee Cup:**
- Professional 3D design with realistic handle
- Clean white/cream gradient
- Smooth rounded edges
- Elegant tan border (#D4A574)

**Animation States:**
1. **Idle**: Gentle hover animation with steam
2. **Pouring**: Coffee fills the cup (0% → 70%)
3. **Ready**: Celebration bounce with glow effect

**Animation Features:**
- Pouring stream from above
- Coffee liquid filling animation
- Milk swirl for lattes/cappuccinos
- Foam appearance
- Whipped cream topping (if ordered)
- Rising steam particles
- Surface shine effects

**Design System:**
- **Primary Color**: #12B1C5 (Teal)
- **Accent Color**: #8FE4F9 (Light Blue)
- **Surface Color**: #FFF9EF (Cream)
- **Style**: Minimal, soft, flat-design

### 4. 📊 Order Management

**Order Storage:**
- JSON files for structured data
- HTML receipts for visual display
- Unique token generation (BT-YYYYMMDD-XXXX format)
- Timestamp tracking

**Order History:**
- View all orders from current session
- Beautiful card-based display
- Shows: customer name, drink details, token, timestamp
- Animated slide-in effects
- Hover interactions

**File Structure:**
```
backend/orders/
├── order_20251123_193405_Sarah.json
├── order_20251123_193405_Sarah.html
├── order_20251123_194944_John.json
└── order_20251123_194944_John.html
```

### 5. 🎯 User Interface

**Layout (Desktop):**
- **Left Panel (420px)**: Animated coffee cup + welcome message
- **Right Panel (Flexible)**: Chat conversation
- **Bottom Bar**: Control buttons (Back, Mic, Show Bill, Reorder)

**Layout (Mobile):**
- **Coffee Section (35%)**: Compact cup animation
- **Chat Section (55%)**: Expanded conversation area
- **Navigation (10%)**: Floating pill bar

**Interactive Elements:**
- Microphone toggle with visual feedback
- Show Bill button (always enabled)
- Reorder button (restarts session)
- Back button (ends session)
- Animated message bubbles

---

## 🏗️ Technical Architecture

### System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface (Next.js)                  │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Voice UI    │  │  Animation   │  │  Order       │      │
│  │  Component   │  │  Engine      │  │  History     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          └──────────────────┴──────────────────┘
                            │
                    LiveKit WebRTC
                            │
┌───────────────────────────┴──────────────────────────────────┐
│                  Backend Agent (Python)                       │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Speech      │  │  Language    │  │  Speech      │      │
│  │  Recognition │  │  Model       │  │  Synthesis   │      │
│  │  (Deepgram)  │  │  (Gemini)    │  │  (Murf)      │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│  ┌─────────────────────────┴──────────────────────────┐    │
│  │         Order Processing & Storage                  │    │
│  │  • Function Tools (set_name, set_drink, etc.)      │    │
│  │  • Order State Management                          │    │
│  │  • JSON/HTML Generation                            │    │
│  │  • Data Message Transmission                       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. User speaks → Microphone captures audio
                    ↓
2. Audio → LiveKit → Backend Agent
                    ↓
3. Deepgram STT → Text transcription
                    ↓
4. Gemini LLM → Processes text → Generates response
                    ↓
5. Murf TTS → Converts response to speech
                    ↓
6. Audio → LiveKit → Frontend → User hears response
                    ↓
7. On order confirmation:
   - save_order() function called
   - JSON file created
   - HTML receipt generated
   - Data message sent to frontend
   - Frontend receives HTML
   - Order details extracted
   - Animation triggered
   - Order added to history
```

### Component Structure

**Frontend:**
```
frontend/
├── app/
│   └── (app)/
│       └── page.tsx                    # Main entry point
├── components/
│   └── app/
│       ├── app.tsx                     # App wrapper
│       ├── session-provider.tsx        # LiveKit session management
│       ├── view-controller.tsx         # View routing
│       ├── blue-tokai-session.tsx      # Main session component
│       ├── blue-tokai-session.module.css # Styles & animations
│       ├── animated-grid.tsx           # Background animation
│       └── coffee-loader.tsx           # Loading screen
├── hooks/
│   ├── useRoom.ts                      # Room connection logic
│   ├── useChatMessages.ts              # Message handling
│   └── useConnectionTimeout.ts         # Connection monitoring
└── lib/
    └── utils.ts                        # Utility functions
```

**Backend:**
```
backend/
├── src/
│   ├── agent.py                        # Main agent logic
│   └── __init__.py
├── orders/                             # Order storage
│   ├── *.json                          # Order data
│   └── *.html                          # Receipts
├── .env.local                          # Environment variables
└── pyproject.toml                      # Dependencies
```

---

## 🔧 Implementation Details

### 1. Agent Function Tools

The agent uses function tools to manage order state:

```python
@function_tool()
async def set_name(self, context: RunContext, name: str) -> str:
    """Set customer's name"""
    self.order_state["name"] = name
    return f"Nice to meet you, {name}!"

@function_tool()
async def set_drink_type(self, context: RunContext, drink_type: str) -> str:
    """Set drink type"""
    self.order_state["drinkType"] = drink_type
    return f"Great choice! What size would you like?"

@function_tool()
async def set_size(self, context: RunContext, size: str) -> str:
    """Set drink size"""
    self.order_state["size"] = size
    return f"Perfect, a {size} {self.order_state['drinkType']}."

@function_tool()
async def set_milk(self, context: RunContext, milk: str) -> str:
    """Set milk preference"""
    self.order_state["milk"] = milk
    return f"Great! {milk} milk it is."

@function_tool()
async def save_order(self, context: RunContext) -> str:
    """Save order and send to frontend"""
    # Generate token
    token = self._generate_token_number()
    
    # Save JSON
    order_data = {**self.order_state, "token_number": token, ...}
    with open(filename, 'w') as f:
        json.dump(order_data, f)
    
    # Generate HTML
    html = self._generate_html_receipt(order_data, token)
    
    # Send to frontend via data message
    await self.session.room.local_participant.publish_data(
        f"HTML_SNIPPET:{html}END_HTML_SNIPPET".encode('utf-8')
    )
    
    return "Order confirmed!"
```

### 2. Frontend Animation System

```typescript
// Animation states
type AnimationState = 'idle' | 'pouring' | 'ready';

// Trigger animation when HTML received
const triggerAnimationFromHTML = (html: string) => {
  // Extract order details from HTML
  const values = extractValues(html);
  
  // Reset animation
  setAnimationState('idle');
  setDrinkOrder(null);
  
  // Trigger new animation
  setTimeout(() => {
    setDrinkOrder({
      size: values.size,
      type: values.drinkType,
      hasFoam: true,
      temperature: 'hot',
      ...
    });
    
    setAnimationState('pouring');
    
    // Transition to ready after 2.5s
    setTimeout(() => {
      setAnimationState('ready');
    }, 2500);
  }, 50);
};
```

### 3. CSS Animation System

```css
/* Pouring animation */
.cup.pouring .coffeeLiquid {
  animation: liquidPour 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes liquidPour {
  0% { height: 0%; }
  100% { height: 70%; }
}

/* Ready state celebration */
.cup.ready {
  animation: cupReady 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes cupReady {
  0% { transform: translateY(0) scale(1); }
  30% { transform: translateY(-16px) scale(1.08); }
  100% { transform: translateY(0) scale(1); }
}

/* Steam animation */
.steam {
  animation: steamRise 3.5s ease-in-out infinite;
}

@keyframes steamRise {
  0% { transform: translateY(0); opacity: 0; }
  20% { opacity: 0.4; }
  100% { transform: translateY(-40px); opacity: 0; }
}
```

---

## 📦 Dependencies

### Backend (Python)
```toml
[project]
dependencies = [
    "livekit-agents>=0.8.0",
    "livekit-plugins-deepgram>=0.6.0",
    "livekit-plugins-google>=0.6.0",
    "livekit-plugins-murf>=0.1.0",
    "livekit-plugins-silero>=0.6.0",
    "python-dotenv>=1.0.0",
]
```

### Frontend (Node.js)
```json
{
  "dependencies": {
    "@livekit/components-react": "^2.6.3",
    "livekit-client": "^2.6.1",
    "next": "15.5.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

---

## 🎯 Key Achievements

### ✅ Completed Features

1. **Voice Interaction**
   - ✅ Natural conversation flow
   - ✅ Multi-turn dialogue
   - ✅ Context awareness
   - ✅ Error handling

2. **Order Management**
   - ✅ Complete order state tracking
   - ✅ Validation before saving
   - ✅ Unique token generation
   - ✅ JSON + HTML storage

3. **Visual Experience**
   - ✅ Professional cup design
   - ✅ Smooth animations
   - ✅ Responsive layout
   - ✅ Brand consistency

4. **User Experience**
   - ✅ Intuitive controls
   - ✅ Clear feedback
   - ✅ Order history
   - ✅ Session management

### 📊 Performance Metrics

- **STT Latency**: ~500ms (Deepgram Nova-3)
- **LLM Response**: ~1-2s (Gemini 2.5 Flash)
- **TTS Generation**: ~600ms (Murf Falcon)
- **Animation Duration**: 2.5s (pouring)
- **Total Order Time**: ~30-60s (conversation)

---

## 🚀 Future Enhancements

### Potential Improvements

1. **Payment Integration**
   - Add payment processing
   - Calculate prices
   - Generate invoices

2. **Multi-language Support**
   - Hindi language support
   - Language detection
   - Bilingual responses

3. **Advanced Features**
   - Order scheduling
   - Delivery tracking
   - Loyalty program
   - Favorites/Quick reorder

4. **Analytics**
   - Popular drinks tracking
   - Peak hours analysis
   - Customer preferences
   - Revenue reporting

5. **Enhanced UI**
   - More drink animations
   - Customization preview
   - 3D cup models
   - AR visualization

---

## 🎓 Learning Outcomes

### Technical Skills Gained

1. **LiveKit Agents Framework**
   - Agent lifecycle management
   - Function tools implementation
   - Real-time communication
   - Data message handling

2. **Voice AI Pipeline**
   - STT integration (Deepgram)
   - LLM orchestration (Gemini)
   - TTS synthesis (Murf)
   - Turn detection

3. **Frontend Development**
   - Next.js 15 with Turbopack
   - React hooks patterns
   - CSS animations
   - WebRTC integration

4. **State Management**
   - Order state tracking
   - Session persistence
   - Real-time updates
   - History management

5. **UI/UX Design**
   - Animation principles
   - Responsive design
   - Brand consistency
   - User feedback

---

## 📝 Challenges Overcome

### 1. LiveKit Connection Issues
**Problem**: Room connection timeouts
**Solution**: Enhanced room configuration, retry logic, better error handling

### 2. Order Not Saving
**Problem**: Agent saying "confirmed" without calling save_order()
**Solution**: Explicit instructions in agent prompt, clearer function descriptions

### 3. Animation Not Replaying
**Problem**: Animation only played once
**Solution**: Reset animation state before triggering new animation

### 4. Order History Not Showing
**Problem**: Data messages not reaching frontend
**Solution**: Fixed data message sending using `self.session.room`

### 5. Cup Design Issues
**Problem**: Ugly brown markings and asymmetric handle
**Solution**: Redesigned with clean gradients and centered handle

---

## 🎉 Project Success

This project successfully demonstrates:

✅ **Real-time voice interaction** with natural conversation
✅ **Complete order management** with validation and storage
✅ **Beautiful visual experience** with smooth animations
✅ **Production-ready code** with proper error handling
✅ **Scalable architecture** for future enhancements
✅ **Professional UI/UX** matching brand guidelines

**Total Development Time**: Day 2 of 10 Days Challenge
**Lines of Code**: ~2,500+ (Frontend + Backend)
**Files Created**: 15+ components and modules
**Features Implemented**: 20+ major features

---

## 📚 Resources & References

- **LiveKit Agents**: https://docs.livekit.io/agents/
- **Deepgram API**: https://developers.deepgram.com/
- **Murf API**: https://murf.ai/api/docs
- **Google Gemini**: https://ai.google.dev/
- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev/

---

**Built with ❤️ for the LiveKit 10 Days of Voice Agents Challenge**

*Day 2: Blue Tokai Coffee Voice Assistant - A complete voice-powered ordering system* ☕🎙️✨
