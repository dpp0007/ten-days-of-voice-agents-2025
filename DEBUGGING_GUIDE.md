# Debugging Guide - Product List Issue

## Issues Fixed ✅

### 1. Header Text Not Visible
**Problem:** Header title "AI Shopping Assistant" was white text on white background
**Solution:** Changed color from `white` to `#0c4a6e` (dark blue) with dark mode support
**File:** `frontend/components/app/commerce-session.module.css`

## Issue to Debug 🔍

### 2. Agent Can't Retrieve Product List

The code is correctly set up, but we need to verify the agent is calling the function.

## How to Debug

### Step 1: Check Backend Logs
When you ask the agent to show products, look for these log messages:

```
🎯 list_products() CALLED with category=..., search_query=...
🔍 list_products() completed! Found X products
📦 Products to send: [...]
📡 Sending data payload: ...
✅ Successfully sent X products to frontend via data channel
```

**If you DON'T see these logs:**
- The agent isn't calling the function
- Try being more explicit: "Please call the list_products function"
- Try: "Show me all products" or "List all products"

**If you see "❌ Room reference not available":**
- The room isn't being passed correctly to the agent
- Restart the backend

### Step 2: Check Frontend Console
Open browser DevTools (F12) and look for:

```
📥 Received data message: ...
📦 Parsed data: ...
📦 Data type: product_list
✅ Product list received: [...]
📊 Stored products with timestamp: ...
```

**If you DON'T see these logs:**
- The backend isn't sending data
- Check backend logs first

**If you see parsing errors:**
- The data format is incorrect
- Check the backend payload structure

### Step 3: Test Commands

Try these exact phrases:

**Voice:**
1. "Show me all products"
2. "List products"
3. "What products do you have?"
4. "Show me electronics"
5. "I want to see headphones"

**Text:**
1. Type: "list products"
2. Type: "show me all products"
3. Type: "what do you have?"

### Step 4: Check Agent Instructions

The agent has these instructions for product listing:

```
- ALWAYS use the list_products() function when customer asks to see products
- NEVER list products in your response text - always call the function
- When customer asks for a SPECIFIC product: Use list_products(search_query="...")
- When customer asks to browse a CATEGORY: Use list_products(category="...")
- When customer asks to see ALL products: Use list_products() with no parameters
```

## Common Issues & Solutions

### Issue: Agent responds with text instead of calling function
**Cause:** LLM isn't recognizing the need to call the function
**Solution:** 
- Be more explicit: "Please use the list_products function"
- Try: "Call list_products"
- Restart the backend to reload the agent

### Issue: Function is called but no products appear
**Cause:** Data channel not working
**Solution:**
- Check browser console for data reception logs
- Verify room connection is established
- Check backend logs for "Room reference not available"

### Issue: Products appear but not in UI
**Cause:** Frontend state not updating
**Solution:**
- Check if `latestProducts` state is being set
- Verify the message is the last agent message
- Check the product card rendering logic

## Quick Restart

If nothing works, restart everything:

```bash
# Stop all processes (Ctrl+C in each terminal)

# Terminal 1 - Backend
cd backend
uv run python src/commerce_agent.py dev

# Terminal 2 - Frontend  
cd frontend
pnpm dev

# Browser
# Go to http://localhost:3000
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

## Verification Checklist

- [ ] Backend is running without errors
- [ ] Frontend is running on http://localhost:3000
- [ ] Browser console is open (F12)
- [ ] Backend terminal is visible for logs
- [ ] Microphone permissions granted
- [ ] Connected to agent (status shows "Ready")
- [ ] Tried multiple phrasings
- [ ] Checked both backend and frontend logs

## Expected Behavior

When working correctly:

1. User says/types: "Show me products"
2. Backend logs: `🎯 list_products() CALLED`
3. Backend logs: `✅ Successfully sent 5 products`
4. Frontend logs: `📥 Received data message`
5. Frontend logs: `✅ Product list received: [5 products]`
6. UI shows: 5 product cards with images, prices, and Buy buttons

## Need More Help?

If you've tried all the above and it still doesn't work:

1. Copy the backend logs when you ask for products
2. Copy the frontend console logs
3. Share what command you used
4. Share any error messages

This will help identify the exact issue!
