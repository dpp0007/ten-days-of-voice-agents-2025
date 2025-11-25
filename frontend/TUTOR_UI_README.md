# 🎓 Teach-the-Tutor Frontend

A premium pixel-art themed voice tutor interface with glassmorphism design, built with Next.js 15 and Tailwind CSS.

---

## 📱 Screens Overview

### 1. Welcome Screen (`/welcome`)
**Purpose**: Entry point with animated introduction

**Features**:
- Animated 3D rotating cube
- Rotating interesting facts (6s interval)
- Pixel-art styled title
- Glassmorphism CTA button
- Ambient pixel grid background

**Route**: `/welcome`

---

### 2. Session Screen (`/session`)
**Purpose**: Main learning interface with voice interaction

**Features**:
- Mode-based background tinting (Learn/Quiz/Teach-back)
- Animated listening indicator with colored dots
- Floating chat bubbles (AI left, User right)
- Bottom pill navigation (Mic, Chat, Progress)
- Expandable chat input
- Auto-scrolling message history

**Route**: `/session`

**Mode Colors**:
- 🔵 Learn: Blue tint
- 🟢 Quiz: Green tint
- 🟣 Teach-back: Purple tint

---

### 3. Progress Page (`/progress`)
**Purpose**: Learning analytics dashboard

**Features**:
- Summary card with highest/lowest/average scores
- Individual concept progress cards
- Pixel-art decorative corners
- Responsive grid layout
- Smooth fade-in animations

**Route**: `/progress`

---

## 🎨 Design System

### Color Palette
```
Background: #0C0C0E (near black)
Cyan Accent: #00FFFF
Purple Accent: #8A2BE2
Glass: rgba(255, 255, 255, 0.05)
Border: rgba(255, 255, 255, 0.08)
```

### Spacing System
Based on 8pt grid: 4px, 8px, 12px, 16px, 24px, 32px, 48px

### Typography
- **Headings**: Courier New (pixel-style)
- **Body**: Public Sans (clean UI font)
- **Code**: Commit Mono

---

## 🧩 Component Library

### Core Components

#### `<AnimatedCube />`
3D rotating cube with depth-based opacity
- Canvas-based rendering
- Smooth rotation animation
- Cyan/purple gradient edges

#### `<InterestingFact fact={string} />`
Glassmorphism card with pixel corners
- Fade-in animation
- Hover scale effect
- Rotating content support

#### `<ListeningIndicator mode={Mode} isListening={boolean} isAISpeaking={boolean} />`
Mode-aware status indicator
- Three animated dots
- Color changes per mode
- Pulse animation when active

#### `<ChatBubble role={Role} content={string} timestamp={Date} />`
Message bubble with glassmorphism
- Left-aligned for AI
- Right-aligned for user
- Pixel corner accents
- Hover timestamp reveal

#### `<ChatInput onSend={Function} onClose={Function} />`
Expandable input bar
- Slide-up animation
- Glassmorphism styling
- Gradient send button
- Auto-focus on mount

#### `<BottomNav isListening={boolean} onMicToggle={Function} onChatToggle={Function} />`
Pill-shaped navigation bar
- Three icon buttons
- Pulse ring on mic active
- Smooth hover states
- Fixed bottom positioning

#### `<ProgressCard concept={ConceptProgress} index={number} />`
Individual concept stats card
- Score display with color coding
- Attempt type indicator
- Progress bar
- Staggered fade-in

#### `<SummaryCard summary={Summary} />`
Overall stats dashboard
- Three-column grid
- Icon-based stats
- Pixel corner decorations
- Strong glow border

---

## 🎭 Animations

### Timing
- **Fast**: 150ms (micro-interactions)
- **Normal**: 300ms (hover states)
- **Slow**: 500ms (page transitions)
- **Mode Switch**: 400ms (background tint)

### Key Animations

**Float Up** (Chat bubbles)
```css
from: opacity 0, translateY(20px)
to: opacity 1, translateY(0)
duration: 400ms
```

**Pulse Ring** (Mic active)
```css
from: scale(1), opacity 1
to: scale(1.5), opacity 0
duration: 1.5s, infinite
```

**Pulse Grow** (Listening dots)
```css
0%: scale(1), opacity 0.6
50%: scale(1.4), opacity 1, glow
100%: scale(1), opacity 0.6
duration: 1.2s, infinite
stagger: 150ms
```

**Pixel Shift** (Background grid)
```css
from: translate(0, 0)
to: translate(20px, 20px)
duration: 20s, infinite
```

---

## 📐 Responsive Breakpoints

```
Mobile:  < 640px  (1 column, full width)
Tablet:  640px+   (2 columns, centered)
Desktop: 1024px+  (3 columns, max-width 800px)
```

### Mobile Optimizations
- Touch targets: 48px minimum
- Bottom nav: Full width, fixed
- Chat bubbles: 85% max-width
- Larger font sizes
- Simplified animations

### Desktop Enhancements
- Hover effects enabled
- Wider chat bubbles (70% max-width)
- Multi-column grids
- Enhanced shadows
- Cursor interactions

---

## 🔌 API Integration

### Progress Data
**Endpoint**: `/api/progress`
**Method**: GET
**Response**:
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

**Source**: `backend/shared-data/learner_history.json`

---

## 🎯 State Management

### Session State
```typescript
{
  mode: 'learn' | 'quiz' | 'teach_back' | null,
  messages: Message[],
  isListening: boolean,
  isAISpeaking: boolean,
  showChatInput: boolean
}
```

### Message Structure
```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+
pnpm (recommended)
```

### Installation
```bash
cd frontend
pnpm install
```

### Development
```bash
pnpm dev
# Opens on http://localhost:3000
```

### Build
```bash
pnpm build
pnpm start
```

---

## 📁 File Structure

```
app/
├── (tutor)/
│   ├── welcome/page.tsx       # Entry screen
│   ├── session/page.tsx       # Main learning UI
│   └── progress/page.tsx      # Analytics dashboard
├── api/
│   └── progress/route.ts      # Progress data API
└── layout.tsx                 # Root layout

components/tutor/
├── animated-cube.tsx          # 3D cube animation
├── interesting-fact.tsx       # Fact card
├── listening-indicator.tsx    # Status dots
├── chat-bubble.tsx           # Message bubble
├── chat-input.tsx            # Input bar
├── bottom-nav.tsx            # Navigation
├── progress-card.tsx         # Concept card
└── summary-card.tsx          # Stats summary

styles/
└── globals.css               # Global styles + utilities
```

---

## 🎨 Customization

### Changing Mode Colors
Edit `getModeColor()` in components:
```typescript
const getModeColor = () => {
  switch (mode) {
    case 'learn': return 'from-blue-500/20 to-blue-600/10';
    case 'quiz': return 'from-green-500/20 to-green-600/10';
    case 'teach_back': return 'from-purple-500/20 to-purple-600/10';
  }
};
```

### Adjusting Glassmorphism
Modify blur and opacity in component styles:
```css
background: rgba(255, 255, 255, 0.05);  /* Opacity */
backdrop-filter: blur(20px);             /* Blur amount */
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Changing Animation Speed
Update duration in keyframes:
```css
animation: float-up 0.4s ease-out;  /* Adjust 0.4s */
```

---

## 🐛 Troubleshooting

### Chat not scrolling
Check `chatContainerRef` is properly attached and `useEffect` dependency array includes `messages`.

### Animations not working
Ensure `@keyframes` are defined in `<style jsx>` blocks or global CSS.

### Glassmorphism not visible
Verify `backdrop-filter` support in browser. Add `-webkit-backdrop-filter` for Safari.

### Progress data not loading
Check backend is running and `learner_history.json` exists at correct path.

---

## 🔮 Future Enhancements

- [ ] Voice waveform visualization
- [ ] Concept mastery progress bars
- [ ] Achievement badges
- [ ] Dark/light theme toggle
- [ ] Accessibility improvements (ARIA labels)
- [ ] Keyboard shortcuts
- [ ] Export progress as PDF
- [ ] Social sharing of achievements

---

## 📚 Resources

- [Design System](./DESIGN_SYSTEM.md) - Complete design specifications
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

---

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for active learning**
