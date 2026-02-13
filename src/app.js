/**
 * Bible Memory App - Main Application Entry Point
 * 
 * This module orchestrates all services and controllers, sets up event bindings,
 * and manages the application lifecycle.
 * 
 * Architecture:
 * - Services: Handle business logic and data persistence
 * - Controllers: Manage UI updates and user interactions
 * - App: Composition root that wires everything together
 */

import verses from './data/verses.js';
import { StorageService } from './services/StorageService.js';
import { VerseService } from './services/VerseService.js';
import { StreakService } from './services/StreakService.js';
import { TimerService } from './services/TimerService.js';
import { AudioService } from './services/AudioService.js';
import { QuizEngine } from './services/QuizEngine.js';
import { TypingChecker } from './services/TypingChecker.js';
import { UIController } from './controllers/UIController.js';

/**
 * BibleMemoryApp - Main application class
 * 
 * Coordinates all services and handles user interactions.
 */
class BibleMemoryApp {
  constructor() {
    // Current user state
    this.currentUsername = null;
    
    // Initialize services
    this.storage = new StorageService(() => this.currentUsername);
    this.verseService = new VerseService(verses, this.storage);
    this.streakService = new StreakService(this.storage);
    this.timerService = new TimerService();
    this.audioService = new AudioService();
    this.quizEngine = new QuizEngine(verses);
    this.typingChecker = new TypingChecker(85);
    
    // Initialize UI controller
    this.ui = new UIController();
    
    // State
    this.verseRevealed = false;
  }

  /**
   * Initialize the application
   */
  init() {
    this.bindEvents();
    this.checkLogin();
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Login buttons
    document.querySelectorAll('[data-action="login"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const username = e.target.dataset.username;
        if (username) this.selectUser(username);
      });
    });

    // Fallback for onclick handlers (backward compatibility)
    window.selectUser = (username) => this.selectUser(username);
    window.logout = () => this.logout();
    window.revealVerse = () => this.revealVerse();
    window.nextVerse = () => this.nextVerse();
    window.toggleTypingMode = () => this.toggleTypingMode();
    window.toggleQuizMode = () => this.toggleQuizMode();
    window.checkTyping = () => this.checkTyping();
    window.submitQuizAnswer = () => this.submitQuizAnswer();
    window.toggleDarkMode = () => this.toggleDarkMode();
    window.toggleRandomMode = () => this.toggleRandomMode();
    window.resetStats = () => this.resetStats();
    window.resetTimer = () => this.resetTimer();
    window.closeNextVerseModal = () => this.closeNextVerseModal();
    window.shareVerse = () => this.shareVerse();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  /**
   * Handle keyboard shortcuts
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeydown(e) {
    // Only on home page (not in typing or quiz mode)
    if (this.ui.isTypingSectionVisible() || this.ui.isQuizSectionVisible()) {
      return;
    }

    const key = e.key.toUpperCase();
    switch (key) {
      case 'R':
        this.revealVerse();
        break;
      case 'N':
        this.nextVerse();
        break;
      case 'T':
        this.toggleTypingMode();
        break;
      case 'Q':
        this.toggleQuizMode();
        break;
    }
  }

  // --- User Management ---

  /**
   * Check if user is logged in
   */
  checkLogin() {
    const lastUser = this.storage.getGlobal('lastUsername');
    if (lastUser) {
      this.currentUsername = lastUser;
      this.ui.showLoginScreen(false);
      this.ui.setCurrentUser(lastUser);
      this.initializeVerse();
      return true;
    }
    return false;
  }

  /**
   * Select/login a user
   * @param {string} username - Username to select
   */
  selectUser(username) {
    this.currentUsername = username;
    this.storage.setGlobal('lastUsername', username);
    this.ui.showLoginScreen(false);
    this.ui.setCurrentUser(username);
    this.initializeVerse();
    this.updateStats();
  }

  /**
   * Logout current user
   */
  logout() {
    if (confirm('Switch user? Your progress is saved.')) {
      this.currentUsername = null;
      this.storage.removeGlobal('lastUsername');
      this.ui.showLoginScreen(true);
    }
  }

  // --- Verse Display ---

  /**
   * Initialize verse display
   */
  initializeVerse() {
    this.streakService.recordPractice();
    this.verseService.initialize();
    this.ui.setRandomModeActive(this.verseService.isRandomMode());
    this.displayVerse();
    this.updateStats();
    this.loadDarkMode();
  }

  /**
   * Display current verse
   */
  displayVerse() {
    const verse = this.verseService.getCurrentVerse();
    
    this.ui.setReference(verse.ref);
    this.ui.setVerseText(verse.text);
    this.ui.setHint(verse.hint);
    this.ui.showVerse(false);
    this.ui.setRevealLabel('Reveal Verse <span class="kbd">(R)</span>');
    this.ui.clearTimer();
    this.ui.resetTypingUI();
    this.ui.setProgress(this.verseService.getCurrentPosition(), this.verseService.verses.length);
    
    this.verseRevealed = false;
    this.timerService.reset();
  }

  /**
   * Reveal or hide the verse
   */
  revealVerse() {
    if (!this.verseRevealed) {
      // Start timer if not already running
      if (!this.timerService.isRunning()) {
        this.timerService.start((elapsed) => {
          this.ui.setTimer(TimerService.format(elapsed));
        });
      }
      this.ui.showVerse(true);
      this.ui.setRevealLabel('Hide Verse <span class="kbd">(R)</span>');
      this.verseRevealed = true;
    } else {
      this.ui.showVerse(false);
      this.timerService.stop();
      this.ui.setRevealLabel('Reveal Verse <span class="kbd">(R)</span>');
      this.verseRevealed = false;
    }
  }

  /**
   * Advance to next verse
   */
  nextVerse() {
    this.verseService.nextVerse();
    this.displayVerse();
    
    // Start timer automatically
    this.timerService.start((elapsed) => {
      this.ui.setTimer(TimerService.format(elapsed));
    });

    // Close quiz if open
    if (this.ui.isQuizSectionVisible()) {
      this.ui.showQuizSection(false);
      this.ui.resetQuizUI();
      this.quizEngine.reset();
    }

    // Restore main buttons if not in typing mode
    if (!this.ui.isTypingSectionVisible()) {
      this.ui.showMainButtons();
    }
  }

  // --- Typing Mode ---

  /**
   * Toggle typing mode
   */
  toggleTypingMode() {
    const willShow = !this.ui.isTypingSectionVisible();
    this.ui.showTypingSection(willShow);

    if (willShow) {
      this.ui.hideMainButtons();
    } else if (!this.ui.isQuizSectionVisible()) {
      this.ui.showMainButtons();
    }
  }

  /**
   * Check typed answer
   */
  checkTyping() {
    const userInput = this.ui.getTypedInput();
    const verse = this.verseService.getCurrentVerse();
    const result = this.typingChecker.check(userInput, verse.text);

    this.ui.showTypingResult(result.feedback, result.correct);

    if (result.correct) {
      this.audioService.playSuccess();
      this.verseService.markCurrentAsMastered();
      this.updateStats();
      
      // Show next verse modal after delay
      setTimeout(() => this.showNextVerseModal(), 800);
    }
  }

  // --- Quiz Mode ---

  /**
   * Toggle quiz mode
   */
  toggleQuizMode() {
    const willShow = !this.ui.isQuizSectionVisible();

    if (willShow) {
      this.generateQuizQuestion();
      this.ui.hideMainButtons();
    } else if (!this.ui.isTypingSectionVisible()) {
      this.ui.showMainButtons();
    }

    this.ui.showQuizSection(willShow);
  }

  /**
   * Generate quiz question
   */
  generateQuizQuestion() {
    const verse = this.verseService.getCurrentVerse();
    const question = this.quizEngine.generateQuestion(verse);

    this.ui.setQuizQuestion(question.question);
    this.ui.renderQuizOptions(question.options, (index, element) => {
      this.quizEngine.selectOption(index);
      this.ui.selectQuizOption(index);
    });
    this.ui.resetQuizUI();
  }

  /**
   * Submit quiz answer
   */
  submitQuizAnswer() {
    if (this.quizEngine.getSelectedIndex() === null) {
      alert('Please select an answer!');
      return;
    }

    const result = this.quizEngine.submitAnswer();
    this.ui.showQuizResult(result);

    if (result.correct) {
      this.audioService.playSuccess();
      this.verseService.markCurrentAsMastered();
      this.updateStats();
      
      // Show next verse modal after delay
      setTimeout(() => this.showNextVerseModal(), 800);
    }
  }

  // --- Modal ---

  /**
   * Show next verse modal
   */
  showNextVerseModal() {
    const nextVerse = this.verseService.peekNextVerse();
    this.ui.showNextVerseModal(nextVerse);
  }

  /**
   * Close next verse modal and advance
   */
  closeNextVerseModal() {
    this.ui.hideNextVerseModal();
    this.verseService.nextVerse();
    this.displayVerse();
    
    // Close typing/quiz sections
    this.ui.showTypingSection(false);
    this.ui.showQuizSection(false);
    this.ui.resetQuizUI();
    this.quizEngine.reset();
    
    // Show main buttons
    this.ui.showMainButtons();
    
    // Start timer
    this.timerService.start((elapsed) => {
      this.ui.setTimer(TimerService.format(elapsed));
    });
  }

  // --- Settings ---

  /**
   * Toggle dark mode
   */
  toggleDarkMode() {
    const enabled = !this.ui.isDarkMode();
    this.ui.setDarkMode(enabled);
    this.storage.setGlobal('darkMode', enabled ? 'true' : 'false');
  }

  /**
   * Load dark mode preference
   */
  loadDarkMode() {
    const enabled = this.storage.getGlobal('darkMode') === 'true';
    this.ui.setDarkMode(enabled);
  }

  /**
   * Toggle random mode
   */
  toggleRandomMode() {
    const enabled = this.verseService.toggleRandomMode();
    this.ui.setRandomModeActive(enabled);
    this.displayVerse();
  }

  /**
   * Reset all stats
   */
  resetStats() {
    if (confirm('Are you sure you want to reset all progress?')) {
      this.streakService.reset();
      this.verseService.resetMastery();
      this.updateStats();
      alert('Progress reset!');
    }
  }

  /**
   * Reset the recall timer
   */
  resetTimer() {
    this.timerService.reset();
    this.ui.clearTimer();
  }


  /**
   * Update stats display
   */
  updateStats() {
    const verseStats = this.verseService.getStats();
    const streak = this.streakService.getStreak();

    this.ui.updateStats({
      streak,
      mastered: verseStats.mastered,
      total: verseStats.total,
      toPractice: verseStats.toPractice
    });
  }

  // --- Sharing ---

  /**
   * Share current verse
   */
  shareVerse() {
    const verse = this.verseService.getCurrentVerse();
    const text = `${verse.ref}\n${verse.text}`;

    if (navigator.share) {
      navigator.share({ title: 'Bible Verse', text });
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert('Verse copied to clipboard!');
      });
    }
  }
}

// Initialize app when DOM is ready
const app = new BibleMemoryApp();

// Export for module usage and expose globally for backward compatibility
export default app;
window.app = app;

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}
