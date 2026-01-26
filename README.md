# Bible Memory App

A modern, Progressive Web App for memorizing Bible verses with typing practice, quiz mode, and streak tracking.

## 🏗️ Architecture Overview

This application follows **industry-standard OOP patterns** with a modular ES6 architecture:

```
bible-memory/
├── index.html                 # Main HTML entry point
├── src/
│   ├── app.js                 # Application entry point & composition root
│   ├── data/
│   │   └── verses.js          # Verse data storage
│   ├── services/              # Business logic layer
│   │   ├── StorageService.js  # localStorage abstraction with user scoping
│   │   ├── VerseService.js    # Verse management & mastery tracking
│   │   ├── TimerService.js    # Practice timer functionality
│   │   ├── StreakService.js   # Daily streak calculations
│   │   ├── AudioService.js    # Sound feedback via Web Audio API
│   │   ├── QuizEngine.js      # Quiz question generation & validation
│   │   └── TypingChecker.js   # Typed verse validation with similarity matching
│   └── controllers/
│       └── UIController.js    # DOM manipulation & UI state management
├── index.backup-*.html        # Backup files for safety
├── README.md                  # This file
└── INSTRUCTIONS.md            # Running & deployment guide
```

## 🎯 Design Patterns Used

### 1. **Service Layer Pattern**
All business logic is encapsulated in dedicated service classes:
- `StorageService` - Centralized data persistence
- `VerseService` - Verse data and progression management
- `TimerService` - Timer abstraction
- `StreakService` - Streak calculations
- `AudioService` - Audio feedback (Singleton pattern)
- `QuizEngine` - Quiz logic
- `TypingChecker` - Text comparison algorithms

### 2. **Dependency Injection**
Services are instantiated in `app.js` (the composition root) and injected where needed:
```javascript
const storage = new StorageService();
const verseService = new VerseService(verses, storage);
const ui = new UIController(elements);
```

### 3. **Separation of Concerns**
- **Services**: Pure business logic, no DOM access
- **Controllers**: UI manipulation only
- **Data**: Static verse content
- **App**: Event binding and orchestration

### 4. **Module Pattern (ES6)**
Each file exports a single class or data structure:
```javascript
export class VerseService { ... }
export const verses = [ ... ];
```

## 📦 Core Services

### StorageService
User-scoped localStorage wrapper supporting multi-user functionality:
```javascript
storage.setUser('Tyrone');
storage.set('progress', { mastered: 5 });  // Stored as 'Tyrone_progress'
storage.getGlobal('theme');                 // Non-user-scoped data
```

### VerseService
Manages verse progression, random ordering, and mastery tracking:
```javascript
verseService.initialize();
const verse = verseService.getCurrentVerse();
verseService.markMastered(verse.reference);
verseService.setRandomMode(true);  // Uses Fisher-Yates shuffle
```

### QuizEngine
Generates multiple-choice questions with smart option creation:
```javascript
const question = QuizEngine.generateQuestion(verses, currentVerse);
const isCorrect = QuizEngine.validateAnswer(userAnswer, question.correct);
```

### TypingChecker
Word-based similarity matching for flexible verse validation:
```javascript
const result = TypingChecker.check(userInput, verse.text);
// result: { percentage: 92, status: 'excellent' | 'close' | 'incorrect' }
```

## 🎨 Features

- **Multi-User Support**: Switch between users (Tyrone/Kashieca) with separate progress
- **Typing Practice**: Type verses with real-time feedback
- **Quiz Mode**: Multiple-choice questions on verse content
- **Focus Mode**: Clean interface for distraction-free practice
- **Dark Mode**: Toggle via UI or keyboard shortcut
- **Streak Tracking**: Daily practice motivation
- **Random Mode**: Shuffled verse order for variety
- **Progressive Web App**: Install on mobile devices

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Submit typed verse / Next verse |
| `Escape` | Close modals / Exit focus mode |
| `Space` | Next verse (when not typing) |
| `D` | Toggle dark mode |
| `R` | Toggle random mode |
| `Q` | Start quiz |

## 🔧 Technical Details

- **No Build Step**: Pure ES6 modules, runs directly in modern browsers
- **No Dependencies**: Zero external libraries
- **Offline Capable**: All assets are local
- **Responsive Design**: Works on desktop and mobile
- **CSS Variables**: Easy theming customization

## 📊 Data Flow

```
User Action → app.js (Event Handler)
                ↓
         Service Layer (Business Logic)
                ↓
         StorageService (Persistence)
                ↓
         UIController (DOM Update)
```

## 🧪 Adding New Verses

Edit `src/data/verses.js`:
```javascript
export const verses = [
  {
    reference: "John 3:16",
    text: "For God so loved the world...",
    category: "love"  // Optional
  },
  // Add more verses here
];
```

## 👥 Multi-User System

The app supports multiple users with isolated data:
- Each user has separate mastery progress
- Streaks are tracked per user
- Visual theming per user (green for Tyrone, pink for Kashieca)

---

Built with ❤️ for Scripture memorization