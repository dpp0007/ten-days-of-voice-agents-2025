# 📤 GitHub Push Guide - Including JSON Data

## ✅ What Will Be Uploaded

### Code Files
- ✅ All source code (backend & frontend)
- ✅ Configuration files (faq.json, slots.json)
- ✅ Package files (package.json, pyproject.toml)

### Data Files (Your Demo Data)
- ✅ `backend/leads/leads.json` - All captured leads
- ✅ `backend/leads/lead_*.json` - Individual lead files
- ✅ `backend/meetings/meetings.json` - All booked meetings
- ✅ `backend/meetings/meeting_*.json` - Individual meeting files

### What's Excluded
- ❌ `.env.local` files (API keys - IMPORTANT!)
- ❌ `node_modules/` (dependencies)
- ❌ `.venv/` (Python virtual environment)
- ❌ `.next/` (build files)
- ❌ HTML files (*.html)
- ❌ Extra documentation files

---

## 🚀 Push to GitHub - Step by Step

### Step 1: Check Current Status
```bash
cd ten-days-of-voice-agents-2025
git status
```

You should see:
- Modified files (your changes)
- Untracked files (new JSON data)

### Step 2: Add All Files
```bash
git add .
```

This will:
- Add all modified code
- Add your JSON data files
- Respect .gitignore (won't add .env.local)

### Step 3: Verify What Will Be Committed
```bash
git status
```

Check that:
- ✅ leads.json is included
- ✅ meetings.json is included
- ❌ .env.local is NOT included

### Step 4: Commit Your Changes
```bash
git commit -m "Day 5: B2B Lead Generator SDR Agent with Meeting Scheduler"
```

Or with more details:
```bash
git commit -m "Day 5: B2B Lead Generator SDR Agent

Features:
- AI-powered SDR agent (Alex)
- FAQ answering from knowledge base
- Lead qualification (7 fields)
- Meeting scheduler with time slots
- Real-time voice interaction
- Orange theme UI

Tech Stack:
- Murf Falcon TTS
- Google Gemini 2.5 Flash
- Deepgram STT
- LiveKit Agents
- Next.js 15"
```

### Step 5: Push to GitHub
```bash
git push origin Day-5
```

This pushes to the Day-5 branch.

---

## 🔒 Security Check

### CRITICAL: Verify .env.local is NOT Being Pushed

Before pushing, double-check:

```bash
git status | grep ".env.local"
```

**Should return nothing!** If you see .env.local, DO NOT PUSH!

### If .env.local Appears:
```bash
# Remove from staging
git reset HEAD backend/.env.local
git reset HEAD frontend/.env.local

# Verify it's in .gitignore
echo "backend/.env.local" >> .gitignore
echo "frontend/.env.local" >> .gitignore

# Try again
git add .
git status
```

---

## 📊 Your JSON Data Will Show

After pushing, your GitHub repo will show:

```
backend/
├── leads/
│   ├── .gitkeep
│   ├── leads.json              ← Your demo leads
│   └── lead_*.json             ← Individual leads
├── meetings/
│   ├── .gitkeep
│   ├── meetings.json           ← Your demo meetings
│   └── meeting_*.json          ← Individual meetings
└── faq.json                    ← Company data
```

This is **perfect for showcasing** your project! 🎉

---

## 🎯 Why Include JSON Data?

**Pros:**
- ✅ Shows working examples
- ✅ Demonstrates functionality
- ✅ Helps others understand data structure
- ✅ Makes project more impressive

**Cons:**
- ⚠️ Data is public (use fake/demo data only)
- ⚠️ Don't include real customer information

---

## 🧹 Clean Up Sensitive Data (Optional)

If your JSON files have real data, clean them first:

### Option 1: Use Sample Data
```bash
# Edit leads.json with sample data
code backend/leads/leads.json
```

Replace with:
```json
[
  {
    "name": "John Doe",
    "company": "TechCorp",
    "email": "john@example.com",
    "role": "VP of Sales",
    "use_case": "Scale outbound sales",
    "team_size": "20",
    "timeline": "soon",
    "lead_id": "LEAD-20251126-DEMO",
    "timestamp": "2025-11-26T10:00:00"
  }
]
```

### Option 2: Keep Real Data
If your data is already anonymized/demo data, just push as is!

---

## 📝 After Pushing

### View Your Data on GitHub
1. Go to your repo: `https://github.com/YOUR_USERNAME/YOUR_REPO`
2. Navigate to: `backend/leads/leads.json`
3. GitHub will render it nicely!

### Add to README
Update README.md to mention:
```markdown
## 📊 Demo Data Included

This repo includes sample leads and meetings to demonstrate functionality:
- `backend/leads/leads.json` - Sample captured leads
- `backend/meetings/meetings.json` - Sample booked meetings
```

---

## 🎥 For LinkedIn Post

Your JSON data makes your post more impressive:

**Screenshot Ideas:**
1. Show the agent conversation
2. Show `leads.json` with captured data
3. Show `meetings.json` with scheduled demos
4. Show the clean UI

**Post Template:**
```
🚀 Day 5 Complete - B2B Lead Generator SDR Agent!

Built an AI-powered SDR that:
✅ Qualifies leads through voice conversation
✅ Answers FAQs from knowledge base
✅ Schedules demo meetings
✅ Saves all data to JSON

Check out the code and demo data on GitHub: [your-repo-link]

Tech: Murf Falcon TTS, Google Gemini, LiveKit, Next.js

#MurfAIVoiceAgentsChallenge #10DaysofAIVoiceAgents
@Murf AI
```

---

## ✅ Final Checklist

Before pushing:
- [ ] .env.local files are NOT in git status
- [ ] JSON data files ARE in git status
- [ ] README.md is updated
- [ ] No sensitive/real customer data in JSON
- [ ] All code changes committed

After pushing:
- [ ] Verify JSON files visible on GitHub
- [ ] Check README renders correctly
- [ ] Test clone on another machine (optional)
- [ ] Share repo link on LinkedIn

---

## 🚀 Quick Commands

```bash
# Check what will be pushed
git status

# Add everything (respects .gitignore)
git add .

# Commit
git commit -m "Day 5: B2B Lead Generator with demo data"

# Push
git push origin Day-5

# Verify on GitHub
# Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/tree/Day-5
```

---

## 💡 Pro Tip

Create a `backend/leads/README.md` to explain the data:

```markdown
# Sample Leads

This directory contains demo leads captured by the SDR agent.

- `leads.json` - All leads in one file
- `lead_*.json` - Individual lead files

These are sample/demo leads for demonstration purposes.
```

This makes your repo even more professional! 🎯
