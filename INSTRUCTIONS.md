# Bible Memory App - Setup & Usage Guide

## 🚀 How to Run Locally

### Option 1: Using Python (Recommended)
```bash
cd /Users/tyronegabrielr.pascual/Documents/bible-memory-app/bible-memory
python3 -m http.server 8000
```
Then open your browser and go to: `http://localhost:8000`

### Option 2: Using VS Code Live Server
1. Right-click `index.html` in VS Code
2. Select **"Open with Live Server"**
3. Browser will open automatically

### Option 3: Using Node.js
```bash
# Install serve globally (one time)
npm install -g serve

# Run the server
serve .

# Open the URL shown in terminal
```

### Option 4: Direct File Open
```bash
open /Users/tyronegabrielr.pascual/Documents/bible-memory-app/bible-memory/index.html
```
⚠️ **Note**: ES6 modules require a server. Direct file opening uses the fallback inline script.

---

## 📂 Project Structure (New Modular Architecture)

```
bible-memory/
├── index.html              # Main HTML + CSS + fallback script
├── src/
│   ├── app.js              # Entry point (composition root)
│   ├── data/
│   │   └── verses.js       # All verse data (19 verses)
│   ├── services/           # Business logic layer
│   │   ├── StorageService.js   # localStorage wrapper
│   │   ├── VerseService.js     # Verse management
│   │   ├── TimerService.js     # Timer functionality
│   │   ├── StreakService.js    # Daily streaks
│   │   ├── AudioService.js     # Sound feedback
│   │   ├── QuizEngine.js       # Quiz generation
│   │   └── TypingChecker.js    # Text matching
│   └── controllers/
│       └── UIController.js     # DOM manipulation
├── README.md               # Architecture documentation
├── INSTRUCTIONS.md         # This file
└── index.backup-*.html     # Backup files
```

---

## 💾 How to Commit Changes to GitHub

### Step 1: Check Status
```bash
cd /Users/tyronegabrielr.pascual/Documents/bible-memory-app/bible-memory
git status
```

### Step 2: Add Files
```bash
# Add specific files
git add index.html src/

# Or add all changes:
git add .
```

### Step 3: Commit
```bash
git commit -m "Update: description of your changes"
```

### Step 4: Push to GitHub
```bash
git push origin main
```

---

## 🔄 Update Your App Online After Committing

### On Your Browser (Desktop or Mobile):
1. **Hard Refresh** to clear cache:
   - **Mac**: `Cmd + Shift + R`
   - **iPhone**: Safari Settings → Clear History and Website Data
   - **Opera/Chrome**: `Cmd + Shift + R`

2. **GitHub Pages** (if set up):
   - URL: `https://toof-cloud.github.io/bible-memory/`
   - Wait ~1-2 minutes for deployment
   - Hard refresh your browser

---

## 📱 Add as iPhone Shortcut

1. Open Safari
2. Go to your app link
3. Tap **Share** button
4. Select **"Add to Home Screen"**
5. Name it "Bible Memory"
6. Tap **"Add"**

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Submit typed verse / Next verse |
| `Escape` | Close modals / Exit focus mode |
| `Space` | Next verse (when not typing) |
| `D` | Toggle dark mode |
| `R` | Toggle random mode |
| `Q` | Start quiz |

---

## 📊 Features

✅ Multi-user support (Tyrone/Kashieca)
✅ Streak counter (localStorage)
✅ Progress stats (Mastered vs To Practice)
✅ Dark mode toggle
✅ Random verse order (Fisher-Yates shuffle)
✅ Typing checker (85% threshold)
✅ Sound feedback (Web Audio API)
✅ Quiz mode (5 questions)
✅ Focus mode
✅ Timer for verse recall
✅ Keyboard shortcuts
✅ Modular ES6 architecture

---

## ✏️ Adding New Verses

Edit `src/data/verses.js`:

```javascript
export const verses = [
  {
    reference: "John 3:16",
    text: "For God so loved the world...",
    category: "love"  // Optional
  },
  // Add your new verse here
  {
    reference: "Philippians 4:13",
    text: "I can do all things through Christ who strengthens me.",
    category: "strength"
  }
];
```

Save and refresh the browser.

---

## 🐛 Troubleshooting

**Changes not showing?**
- Hard refresh: `Cmd + Shift + R`
- Clear browser cache
- Check git push was successful: `git log`

**Modules not loading?**
- Use a local server (Python/Node.js), not `file://` protocol
- Check browser console for errors (F12 → Console)

**Streak not saving?**
- Make sure browser allows localStorage (not in Private mode)
- Check browser console for errors

**Sound not working?**
- Click/tap the page first (browsers require user interaction)
- Check if your device is muted

---

## 📝 Example Workflow

```bash
# 1. Make changes to files in VS Code
# 2. Test locally with python server
python3 -m http.server 8000

# 3. When ready to save:
git add .
git commit -m "Add new verses for memorization"
git push origin main

# 4. Wait 1-2 min for GitHub Pages deployment
# 5. Hard refresh browser: Cmd + Shift + R
```

---

## 🌐 Deployment Options

### GitHub Pages (Free)
1. Push code to GitHub
2. Settings → Pages → Deploy from main branch
3. Live at: `https://username.github.io/repo-name`

### Netlify (Free)
1. Create account at netlify.com
2. Drag and drop folder
3. Instant deployment!

### Vercel (Free)
```bash
npm install -g vercel
vercel
```

---

Happy memorizing! 🙏📖
