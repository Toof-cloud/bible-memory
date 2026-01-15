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

### Option 3: Direct File Open
```bash
open /Users/tyronegabrielr.pascual/Documents/bible-memory-app/bible-memory/index.html
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
git add index.html
# Or add all changes:
git add .
```

### Step 3: Commit
```bash
git commit -m "Update: added new features or fixes"
```
*Replace the message with what you actually changed*

### Step 4: Push to GitHub
```bash
git push origin main
```

---

## 🔄 Update Your App Online After Committing

### On Your Browser (Desktop or Mobile):
1. **Hard Refresh** to clear cache:
   - **Mac**: `Cmd + Shift + R`
   - **iPhone**: Safari Settings → Clear History and Website Data, then refresh
   - **Opera Browser**: `Cmd + Shift + R` or Settings → Clear browsing data

2. **GitHub Pages** (if you set it up):
   - Go to: `https://toof-cloud.github.io/bible-memory/`
   - Wait ~1-2 minutes for deployment
   - Hard refresh your browser

3. **Direct File Link** (if hosting locally):
   - Just hard refresh the tab with `Cmd + Shift + R`

---

## 📱 Add as iPhone Shortcut

1. Open Safari
2. Go to your app link
3. Tap **Share** button
4. Select **"Add to Home Screen"**
5. Name it "Bible Memory"
6. Tap **"Add"**

Now it's a home screen app! When you update the code and push to GitHub, just restart the app on your iPhone.

---

## 🔑 Quick Keyboard Shortcuts

- **R** – Reveal Verse
- **N** – Next Verse
- **T** – Type & Check

---

## 📊 Features

✅ Streak counter (localStorage)
✅ Progress stats (Mastered vs To Practice)
✅ Dark mode toggle
✅ Random verse order
✅ Typing checker (case-insensitive)
✅ Sound feedback
✅ Share verse to clipboard
✅ Timer for verse recall
✅ Daily verse rotation
✅ Keyboard shortcuts

---

## 🐛 Troubleshooting

**Changes not showing?**
- Hard refresh: `Cmd + Shift + R`
- Clear browser cache
- Check git push was successful: `git log`

**Streak not saving?**
- Make sure browser allows localStorage (not in Private mode)
- Check browser console for errors

**Sound not working?**
- Check browser volume
- Some browsers require user interaction first

---

## 📝 Example Workflow

```bash
# 1. Make changes to index.html in VS Code
# 2. Test locally with python server
# 3. When ready to save:

git add index.html
git commit -m "Add dark mode support"
git push origin main

# 4. Wait 1-2 min for GitHub Pages deployment
# 5. Hard refresh browser: Cmd + Shift + R
```

---

Happy memorizing! 🙏
