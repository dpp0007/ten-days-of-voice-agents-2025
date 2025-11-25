# Teach-the-Tutor Design System

## 🎨 Visual Design Philosophy

A premium, pixel-art inspired dark theme with glassmorphism elements, creating a futuristic yet approachable learning environment.

---

## 📐 Layout System

### Spacing Scale (8pt Grid)
- **4px** - Micro spacing (gaps between related elements)
- **8px** - Small spacing (component padding)
- **12px** - Medium spacing (section gaps)
- **16px** - Large spacing (component margins)
- **24px** - XL spacing (section margins)
- **32px** - 2XL spacing (page sections)
- **48px** - 3XL spacing (major sections)

### Responsive Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

---

## 🎨 Color Palette

### Mode-Based Colors
```css
/* Learn Mode */
--learn-primary: #3B82F6 (blue-500)
--learn-glow: rgba(59, 130, 246, 0.2)

/* Quiz Mode */
--quiz-primary: #10B981 (green-500)
--quiz-glow: rgba(16, 185, 129, 0.2)

/* Teach-Back Mode */
--teach-primary: #8B5CF6 (purple-500)
--teach-glow: rgba(139, 92, 246, 0.2)
```

### Accent Colors
```css
--cyan: #00FFFF
--purple: #8A2BE2
--cyan-glow: rgba(0, 255, 255, 0.3)
--purple-glow: rgba(138, 43, 226, 0.3)
```

### Neutral Colors
```css
--background: #0C0C0E
--surface: rgba(255, 255, 255, 0.03)
--border: rgba(255, 255, 255, 0.08)
--text-primary: #FFFFFF
--text-secondary: #9CA3AF (gray-400)
--text-muted: #6B7280 (gray-500)
```

---

## 🪟 Glassmorphism Styles

### Standard Glass
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
```

### Strong Glass (Cards)
```css
background: rgba(255, 255, 255, 0.08);
backdrop-filter: blur(30px);
border: 1.5px solid rgba(255, 255, 255, 0.15);
box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
```

### Pill Glass (Navigation)
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 9999px;
```

---

## 🎭 Typography

### Font Families
```css
--font-pixel: 'Courier New', monospace;
--font-ui: 'Public Sans', system-ui, sans-serif;
--font-mono: 'Commit Mono', monospace;
```

### Type Scale
```css
/* Headings */
h1: 48px / 56px (3xl / 4xl)
h2: 32px / 40px (2xl / 3xl)
h3: 24px / 28px (xl / 2xl)

/* Body */
body-lg: 18px / 28px
body: 16px / 24px
body-sm: 14px / 20px

/* UI */
caption: 12px / 16px
label: 14px / 20px
```

### Pixel Title Style
```css
.pixel-title {
  font-family: 'Courier New', monospace;
  letter-spacing: 0.1em;
  text-shadow: 
    2px 2px 0 rgba(0, 255, 255, 0.5),
    4px 4px 0 rgba(138, 43, 226, 0.3),
    0 0 20px rgba(0, 255, 255, 0.3);
}
```

---

## ✨ Animation Specifications

### Timing Functions
```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-in-out: cubic-bezier(0.4, 0, 0.6, 1);
```

### Duration Scale
```css
--duration-fast: 150ms
--duration-normal: 300ms
--duration-slow: 500ms
--duration-mode-switch: 400ms
```

### Key Animations

#### Float Up (Chat Bubbles)
```css
@keyframes float-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Duration: 400ms, Easing: ease-out */
```

#### Pulse Ring (Mic Active)
```css
@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
/* Duration: 1.5s, Easing: ease-out, Infinite */
```

#### Pulse Grow (Listening Dots)
```css
@keyframes pulse-grow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.4);
    opacity: 1;
    box-shadow: 0 0 12px currentColor;
  }
}
/* Duration: 1.2s, Easing: ease-in-out, Infinite */
/* Stagger delay: 150ms per dot */
```

#### Pixel Shift (Background)
```css
@keyframes pixelShift {
  0% { transform: translate(0, 0); }
  100% { transform: translate(20px, 20px); }
}
/* Duration: 20s, Easing: linear, Infinite */
```

#### Fade In Right (Progress Cards)
```css
@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
/* Duration: 500ms, Easing: ease-out */
/* Stagger delay: 100ms per card */
```

---

## 🎯 Component Specifications

### Chat Bubble
```
Padding: 12px 16px
Border Radius: 16px
Max Width: 85% (mobile), 70% (desktop)
Border: 1px solid (mode-colored, 15% opacity)
Shadow: 0 4px 16px (mode-colored, 10% opacity)
Hover: translateY(-2px) + enhanced shadow
```

### Bottom Navigation
```
Position: Fixed bottom
Padding: 16px (horizontal), 24px (vertical)
Border Radius: 9999px (full pill)
Icon Size: 24px
Icon Spacing: 24px
Active State: Cyan glow + pulse ring
```

### Progress Card
```
Padding: 20px
Border Radius: 12px
Border: 1px solid rgba(255, 255, 255, 0.08)
Hover: translateY(-4px) + cyan border glow
Grid: 1 col (mobile), 2 cols (tablet), 3 cols (desktop)
Gap: 16px
```

### Summary Card
```
Padding: 32px
Border Radius: 16px
Border: 2px solid rgba(0, 255, 255, 0.2)
Shadow: 0 12px 48px rgba(0, 255, 255, 0.2)
Grid: 1 col (mobile), 3 cols (desktop)
```

---

## 📱 Mobile-First Responsive Rules

### Navigation
- **Mobile**: Full width, fixed bottom, large touch targets (48px min)
- **Desktop**: Centered, max-width constrained

### Chat Container
- **Mobile**: Full width, padding 16px
- **Desktop**: Max-width 800px, centered, padding 24px

### Progress Grid
- **Mobile**: 1 column
- **Tablet (640px+)**: 2 columns
- **Desktop (1024px+)**: 3 columns

### Typography
- **Mobile**: Base 14px, headings scale down 20%
- **Desktop**: Base 16px, full heading scale

---

## 🎨 Pixel Art Styling Approach

### Pixel Corners
```html
<!-- Top-left corner -->
<div class="absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-cyan-500" />
```

### Pixel Grid Background
```css
background-image: 
  linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
background-size: 20px 20px;
```

### Pixel Glow
```css
box-shadow: 
  0 0 10px rgba(0, 255, 255, 0.3),
  0 0 20px rgba(0, 255, 255, 0.2),
  0 0 30px rgba(0, 255, 255, 0.1);
```

---

## 🔄 Mode Transition Specifications

### Background Tint Transition
```css
transition: background 400ms ease-in-out;
```

### Dot Color Transition
```css
transition: all 400ms ease-in-out;
```

### Smooth Scene Change
- Background gradient fades over 400ms
- Dots change color simultaneously
- Chat bubbles remain static (no re-animation)
- Listening indicator updates instantly

---

## 🎮 Interaction States

### Button States
```css
/* Default */
opacity: 0.6;
transform: scale(1);

/* Hover */
opacity: 1;
transform: scale(1.05);
background: rgba(255, 255, 255, 0.08);

/* Active/Pressed */
transform: scale(0.98);

/* Disabled */
opacity: 0.3;
cursor: not-allowed;
```

### Card States
```css
/* Default */
transform: translateY(0);
border-color: rgba(255, 255, 255, 0.08);

/* Hover (Desktop) */
transform: translateY(-4px);
border-color: rgba(0, 255, 255, 0.2);
box-shadow: enhanced;

/* Active (Mobile) */
transform: scale(0.98);
background: rgba(255, 255, 255, 0.06);
```

---

## 🏗️ Component Architecture

```
app/
├── (tutor)/
│   ├── welcome/
│   │   └── page.tsx          # Welcome screen
│   ├── session/
│   │   └── page.tsx          # Main session screen
│   └── progress/
│       └── page.tsx          # Progress dashboard
│
components/tutor/
├── animated-cube.tsx          # 3D rotating cube
├── interesting-fact.tsx       # Rotating fact cards
├── listening-indicator.tsx    # Mode-based dots
├── chat-bubble.tsx           # Message bubbles
├── chat-input.tsx            # Expandable input
├── bottom-nav.tsx            # Pill navigation
├── progress-card.tsx         # Individual concept card
└── summary-card.tsx          # Stats summary
```

---

## 🎯 Quality Checklist

- ✅ 8pt spacing system throughout
- ✅ Glassmorphism with 8-16px blur
- ✅ Pixel art accents (corners, grids)
- ✅ Smooth 400ms mode transitions
- ✅ Mobile-first responsive design
- ✅ Touch-friendly targets (48px min)
- ✅ Accessible contrast ratios
- ✅ Smooth animations (60fps)
- ✅ No layout shifts or overflow
- ✅ Cohesive visual language

---

## 🚀 Performance Optimizations

- Use `will-change` for animated elements
- Debounce scroll events
- Lazy load progress data
- Optimize backdrop-filter usage
- Use CSS transforms for animations
- Minimize re-renders with React.memo
- Virtual scrolling for long chat histories

---

## 📦 Dependencies

```json
{
  "lucide-react": "^0.x.x",     // Icons
  "next": "15.x.x",              // Framework
  "react": "19.x.x",             // UI library
  "tailwindcss": "^3.x.x",       // Styling
  "framer-motion": "^11.x.x"     // Advanced animations (optional)
}
```

---

This design system ensures a premium, cohesive, and performant user experience across all screens and devices.
