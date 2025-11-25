# 🧭 Navigation Guide

## Access the Tutor UI

### Local Development
- **Root**: http://localhost:3000 (redirects to Welcome)
- **Welcome Screen**: http://localhost:3000/welcome
- **Session Screen**: http://localhost:3000/session
- **Progress Page**: http://localhost:3000/progress

### Via Ngrok (Public Access)
- **Root**: https://trisyllabical-camellia-nocturnally.ngrok-free.dev
- **Welcome**: https://trisyllabical-camellia-nocturnally.ngrok-free.dev/welcome
- **Session**: https://trisyllabical-camellia-nocturnally.ngrok-free.dev/session
- **Progress**: https://trisyllabical-camellia-nocturnally.ngrok-free.dev/progress

## Screen Flow

```
┌─────────────┐
│   Welcome   │  Entry point with animated cube
│   /welcome  │  Click "Begin Learning" →
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Session   │  Main learning interface
│   /session  │  Click Progress icon →
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Progress   │  Analytics dashboard
│  /progress  │  Click "Back" →
└─────────────┘
```

## Quick Test Checklist

### Welcome Screen
- [ ] Animated cube is rotating
- [ ] Facts rotate every 6 seconds
- [ ] "Begin Learning" button glows on hover
- [ ] Pixel grid animates in background
- [ ] Title has cyan/purple shadow

### Session Screen
- [ ] Listening indicator shows 3 dots
- [ ] Chat bubbles appear on left (AI) and right (User)
- [ ] Bottom nav has 3 icons (Mic, Chat, Progress)
- [ ] Clicking Chat opens input bar
- [ ] Background tint changes with mode
- [ ] Messages auto-scroll to bottom

### Progress Page
- [ ] Summary card shows stats
- [ ] Concept cards display in grid
- [ ] Cards fade in from right
- [ ] Hover effects work on desktop
- [ ] Back button returns to session
- [ ] Pixel corners visible on cards

## Keyboard Shortcuts (Future)

- `Ctrl/Cmd + M` - Toggle microphone
- `Ctrl/Cmd + K` - Open chat input
- `Ctrl/Cmd + P` - View progress
- `Esc` - Close chat input

## Mobile Testing

Test on these viewports:
- **iPhone SE**: 375x667
- **iPhone 12**: 390x844
- **iPad**: 768x1024
- **Desktop**: 1920x1080

### Mobile-Specific Checks
- [ ] Touch targets are 48px minimum
- [ ] Bottom nav doesn't overlap content
- [ ] Chat input slides up smoothly
- [ ] No horizontal scroll
- [ ] Text is readable (14px minimum)

## Browser Compatibility

Tested on:
- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Safari 17+
- ✅ Edge 120+

### Known Issues
- Safari < 16: Backdrop-filter may not work (fallback to solid background)
- Firefox: Some blur effects may be less smooth

## Performance Metrics

Target metrics:
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## Troubleshooting

### "Page not found"
- Ensure frontend is running: `pnpm dev`
- Check you're on correct port: 3000
- Clear browser cache and hard refresh

### "Styles not loading"
- Check Tailwind is compiling
- Verify `globals.css` is imported
- Restart dev server

### "Components not rendering"
- Check browser console for errors
- Verify all imports are correct
- Check TypeScript errors: `pnpm type-check`

### "Animations not smooth"
- Check GPU acceleration is enabled
- Reduce backdrop-filter blur if needed
- Test on different browser

## Development Tips

### Hot Reload
Changes to these files trigger instant reload:
- `*.tsx` components
- `globals.css` styles
- `page.tsx` routes

### Testing Modes
To test different modes in Session screen:
1. Open browser DevTools
2. Set `mode` state manually
3. Or integrate with LiveKit agent

### Mock Data
Progress page uses mock data if API fails.
To test with real data:
1. Run backend agent
2. Complete some quizzes
3. Check `backend/shared-data/learner_history.json`

---

**Happy Testing! 🚀**
