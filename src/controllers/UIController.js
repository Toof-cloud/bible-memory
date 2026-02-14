/**
 * UIController - Manages DOM updates and UI state
 * 
 * Provides a clean interface for updating the user interface without
 * direct DOM manipulation in business logic.
 */
export class UIController {
  /**
   * @param {Document} doc - Document object (for testing/DI)
   */
  constructor(doc = document) {
    this.doc = doc;
    this.elements = {};
    this.cacheElements();
  }

  /**
   * Cache frequently accessed DOM elements
   */
  cacheElements() {
    const ids = [
      'reference', 'verse', 'hintText', 'progress', 'timer',
      'verseInput', 'result', 'quizResult', 'quizQuestionText',
      'quizOptions', 'submitQuizBtn', 'typingSection', 'quizSection',
      'streakBox', 'masteredBox', 'practiceBox', 'currentUser',
      'loginScreen', 'randomBtn', 'nextVerseModal', 'nextVerseRef', 'nextVerseText'
    ];
    
    ids.forEach(id => {
      this.elements[id] = this.doc.getElementById(id);
    });
  }

  /**
   * Get an element by ID (cached)
   * @param {string} id - Element ID
   * @returns {HTMLElement|null}
   */
  getElement(id) {
    return this.elements[id] || this.doc.getElementById(id);
  }

  // --- Verse Display ---

  /**
   * Set verse reference text
   * @param {string} ref - Reference (e.g., "John 3:16")
   */
  setReference(ref) {
    const el = this.getElement('reference');
    if (el) el.innerText = ref;
  }

  /**
   * Set verse text
   * @param {string} text - Verse text
   */
  setVerseText(text) {
    const el = this.getElement('verse');
    if (el) el.innerText = text;
  }

  /**
   * Set hint text
   * @param {string} hint - Hint text
   */
  setHint(hint) {
    const el = this.getElement('hintText');
    if (el) el.innerText = hint;
  }

  /**
   * Set progress text
   * @param {number} total - Total verse count
   */
  setProgress(current, total) {
    const el = this.getElement('progress');
    if (el) el.innerText = `Verse ${current} of ${total}`;
  }

  /**
   * Show or hide the verse
   * @param {boolean} show - Whether to show
   */
  showVerse(show) {
    const el = this.getElement('verse');
    if (el) el.classList.toggle('show', !!show);
  }

  /**
   * Set timer display
   * @param {string} text - Timer text
   */
  setTimer(text) {
    const el = this.getElement('timer');
    if (el) el.innerHTML = text;
  }

  /**
   * Clear timer display
   */
  clearTimer() {
    this.setTimer('');
  }

  // --- Buttons ---

  /**
   * Set reveal button label
   * @param {string} labelHtml - HTML content for button
   */
  setRevealLabel(labelHtml) {
    const btn = this.doc.querySelector('[data-action="reveal"]') || 
                this.doc.querySelector('[onclick="revealVerse()"]');
    if (btn) btn.innerHTML = labelHtml;
  }

  /**
   * Set dark mode button label
   * @param {string} labelHtml - HTML content for button
   */
  setDarkModeLabel(labelHtml) {
    const btn = this.doc.querySelector('[data-action="darkMode"]') ||
                this.doc.querySelector('[onclick="toggleDarkMode()"]');
    if (btn) btn.innerHTML = labelHtml;
  }

  /**
   * Set random mode button active state
   * @param {boolean} active - Whether random mode is active
   */
  setRandomModeActive(active) {
    const btn = this.getElement('randomBtn');
    if (btn) btn.classList.toggle('active', active);
  }

  // --- Typing Section ---

  /**
   * Show or hide typing section
   * @param {boolean} show - Whether to show
   */
  showTypingSection(show) {
    const el = this.getElement('typingSection');
    if (el) el.classList.toggle('show', show);
  }

  /**
   * Check if typing section is visible
   * @returns {boolean}
   */
  isTypingSectionVisible() {
    const el = this.getElement('typingSection');
    return el ? el.classList.contains('show') : false;
  }

  /**
   * Get typed input value
   * @returns {string}
   */
  getTypedInput() {
    const el = this.getElement('verseInput');
    return el ? el.value.trim() : '';
  }

  /**
   * Clear typed input
   */
  clearTypedInput() {
    const el = this.getElement('verseInput');
    if (el) el.value = '';
  }

  /**
   * Show typing result
   * @param {string} message - Result message
   * @param {boolean} correct - Whether answer was correct
   */
  showTypingResult(message, correct) {
    const el = this.getElement('result');
    if (el) {
      el.innerText = message;
      el.classList.add('show');
      el.classList.toggle('correct', correct);
      el.classList.toggle('incorrect', !correct);
    }
  }

  /**
   * Reset typing UI
   */
  resetTypingUI() {
    this.clearTypedInput();
    const el = this.getElement('result');
    if (el) {
      el.classList.remove('show', 'correct', 'incorrect');
      el.innerText = '';
    }
  }

  // --- Quiz Section ---

  /**
   * Show or hide quiz section
   * @param {boolean} show - Whether to show
   */
  showQuizSection(show) {
    const el = this.getElement('quizSection');
    if (el) el.classList.toggle('show', show);
  }

  /**
   * Check if quiz section is visible
   * @returns {boolean}
   */
  isQuizSectionVisible() {
    const el = this.getElement('quizSection');
    return el ? el.classList.contains('show') : false;
  }

  /**
   * Set quiz question text
   * @param {string} text - Question text
   */
  setQuizQuestion(text) {
    const el = this.getElement('quizQuestionText');
    if (el) el.innerText = text;
  }

  /**
   * Render quiz options
   * @param {string[]} options - Array of option texts
   * @param {Function} onSelect - Callback when option is selected
   */
  renderQuizOptions(options, onSelect) {
    const container = this.getElement('quizOptions');
    if (!container) return;

    container.innerHTML = '';
    options.forEach((option, index) => {
      const button = this.doc.createElement('button');
      button.className = 'quiz-option';
      button.innerText = option;
      button.onclick = () => onSelect(index, button);
      container.appendChild(button);
    });
  }

  /**
   * Mark a quiz option as selected
   * @param {number} index - Option index
   */
  selectQuizOption(index) {
    const options = this.doc.querySelectorAll('.quiz-option');
    options.forEach(opt => opt.classList.remove('selected'));
    if (options[index]) options[index].classList.add('selected');
  }

  /**
   * Show quiz result
   * @param {Object} result - { correct, correctIndex, selectedIndex }
   */
  showQuizResult(result) {
    const resultEl = this.getElement('quizResult');
    const options = this.doc.querySelectorAll('.quiz-option');
    const submitBtn = this.getElement('submitQuizBtn');

    if (submitBtn) submitBtn.disabled = true;
    options.forEach(opt => opt.classList.add('disabled'));

    if (resultEl) {
      if (result.correct) {
        resultEl.innerText = '✓ Correct! Well done!';
        resultEl.classList.add('show', 'correct');
        resultEl.classList.remove('incorrect');
        if (options[result.selectedIndex]) {
          options[result.selectedIndex].classList.add('correct');
        }
      } else {
        resultEl.innerText = '✗ Incorrect. Try again!';
        resultEl.classList.add('show', 'incorrect');
        resultEl.classList.remove('correct');
        if (options[result.selectedIndex]) {
          options[result.selectedIndex].classList.add('incorrect');
        }
        if (options[result.correctIndex]) {
          options[result.correctIndex].classList.add('correct');
        }
      }
    }
  }

  /**
   * Reset quiz UI
   */
  resetQuizUI() {
    const questionEl = this.getElement('quizQuestionText');
    const optionsEl = this.getElement('quizOptions');
    const resultEl = this.getElement('quizResult');
    const submitBtn = this.getElement('submitQuizBtn');

    if (questionEl) questionEl.innerText = '';
    if (optionsEl) optionsEl.innerHTML = '';
    if (resultEl) {
      resultEl.classList.remove('show', 'correct', 'incorrect');
      resultEl.innerText = '';
    }
    if (submitBtn) submitBtn.disabled = false;
  }

  // --- Stats ---

  /**
   * Update stats display
   * @param {Object} stats - { streak, mastered, total, toPractice }
   */
  updateStats(stats) {
    const streakEl = this.getElement('streakBox');
    const masteredEl = this.getElement('masteredBox');
    const practiceEl = this.getElement('practiceBox');

    if (streakEl) streakEl.innerHTML = `🔥 ${stats.streak} day streak`;
    if (masteredEl) masteredEl.innerHTML = `✓ Mastered: ${stats.mastered}/${stats.total}`;
    if (practiceEl) practiceEl.innerHTML = `📝 To Practice: ${stats.toPractice}/${stats.total}`;
  }

  // --- User/Login ---

  /**
   * Set current user display
   * @param {string} username - Username to display
   */
  setCurrentUser(username) {
    const el = this.getElement('currentUser');
    if (el) el.innerText = username;
  }

  /**
   * Show or hide login screen
   * @param {boolean} show - Whether to show
   */
  showLoginScreen(show) {
    const el = this.getElement('loginScreen');
    if (el) el.classList.toggle('hidden', !show);
  }

  // --- Focus Mode ---

  /**
   * Hide main buttons for focus mode
   */
  hideMainButtons() {
    const controls = this.doc.querySelector('.controls');
    const buttonGroup = this.doc.querySelector('.button-group');
    const switchBtn = this.doc.querySelector('button.close-btn[onclick="logout()"]') ||
                      this.doc.querySelector('[data-action="logout"]');

    if (controls) controls.style.display = 'none';
    if (buttonGroup) buttonGroup.style.display = 'none';
    if (switchBtn) switchBtn.style.display = 'none';
  }

  /**
   * Show main buttons after focus mode
   */
  showMainButtons() {
    const controls = this.doc.querySelector('.controls');
    const buttonGroup = this.doc.querySelector('.button-group');
    const switchBtn = this.doc.querySelector('button.close-btn[onclick="logout()"]') ||
                      this.doc.querySelector('[data-action="logout"]');

    if (controls) controls.style.display = '';
    if (buttonGroup) buttonGroup.style.display = '';
    if (switchBtn) switchBtn.style.display = '';
  }

  // --- Modal ---

  /**
   * Show next verse modal
   * @param {Object} verse - { ref, text }
   */
  showNextVerseModal(verse) {
    const modal = this.getElement('nextVerseModal');
    const refEl = this.getElement('nextVerseRef');
    const textEl = this.getElement('nextVerseText');

    if (refEl) refEl.innerText = verse.ref;
    if (textEl) textEl.innerText = verse.text;
    if (modal) modal.classList.add('show');
  }

  /**
   * Hide next verse modal
   */
  hideNextVerseModal() {
    const modal = this.getElement('nextVerseModal');
    if (modal) modal.classList.remove('show');
  }

  // --- Dark Mode ---

  /**
   * Set dark mode
   * @param {boolean} enabled - Whether dark mode is enabled
   */
  setDarkMode(enabled) {
    this.doc.body.classList.toggle('dark-mode', enabled);
    this.setDarkModeLabel(enabled ? '☀️ Light' : '🌙 Dark');
  }

  /**
   * Check if dark mode is enabled
   * @returns {boolean}
   */
  isDarkMode() {
    return this.doc.body.classList.contains('dark-mode');
  }
}

export default UIController;
