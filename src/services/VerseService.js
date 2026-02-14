/**
 * VerseService - Manages verse data, ordering, and mastery tracking
 * 
 * Handles daily rotation, random mode, and persistence of mastered verses.
 */
export class VerseService {
  /**
   * @param {Array} verses - Array of verse objects
   * @param {StorageService} storage - Storage service instance
   */
  constructor(verses, storage) {
    this.verses = verses;
    this.storage = storage;
    this.currentIndex = 0;
    this.order = [];
    this.randomMode = false;
  }

  /**
   * Initialize verses from storage
   */
  initialize() {
    // Load mastered status
    const masteredIndices = this.storage.getJSON('masteredVerses', []);
    masteredIndices.forEach(idx => {
      if (this.verses[idx]) {
        this.verses[idx].mastered = true;
      }
    });

    // Load random mode preference
    this.randomMode = this.storage.get('randomMode') === 'true';

    // Set up order
    if (this.randomMode) {
      this.createRandomOrder();
    } else {
      this.createSequentialOrder();
    }

    // Check daily reset
    const todayKey = this.getTodayKey();
    const lastKey = this.storage.get('lastVerseDateKey');
    
    if (lastKey !== todayKey) {
      this.storage.set('lastVerseDateKey', todayKey);
      this.currentIndex = 0;
    } else {
      this.currentIndex = parseInt(this.storage.get('currentVerseIndex')) || 0;
    }
  }

  /**
   * Get today's date as a storage key
   * @returns {string} - Date key (e.g., "2026-0-26")
   */
  getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  }

  /**
   * Create sequential order
   */
  createSequentialOrder() {
    this.order = this.verses.map((_, i) => i);
  }

  /**
   * Create randomized order using Fisher-Yates shuffle
   */
  createRandomOrder() {
    this.order = this.verses.map((_, i) => i);
    for (let i = this.order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.order[i], this.order[j]] = [this.order[j], this.order[i]];
    }
  }

  /**
   * Toggle random mode
   * @returns {boolean} - New random mode state
   */
  toggleRandomMode() {
    this.randomMode = !this.randomMode;
    this.storage.set('randomMode', this.randomMode);
    
    if (this.randomMode) {
      this.createRandomOrder();
    } else {
      this.createSequentialOrder();
    }
    
    this.currentIndex = 0;
    return this.randomMode;
  }

  /**
   * Get current verse
   * @returns {Object} - Current verse object
   */
  getCurrentVerse() {
    const actualIndex = this.order[this.currentIndex];
    return this.verses[actualIndex];
  }

  /**
   * Get current verse's actual index in the verses array
   * @returns {number} - Actual index
   */
  getCurrentActualIndex() {
    return this.order[this.currentIndex];
  }

  /**
   * Get current position (1-based) in the order
   * @returns {number}
   */
  getCurrentPosition() {
    return this.currentIndex + 1;
  }

  /**
   * Advance to next verse
   * @returns {Object} - New current verse
   */
  nextVerse() {
    this.currentIndex = (this.currentIndex + 1) % this.verses.length;
    this.storage.set('currentVerseIndex', this.currentIndex);
    return this.getCurrentVerse();
  }

  /**
   * Get next verse without advancing
   * @returns {Object} - Next verse object
   */
  peekNextVerse() {
    const nextIndex = (this.currentIndex + 1) % this.verses.length;
    const actualIndex = this.order[nextIndex];
    return this.verses[actualIndex];
  }

  /**
   * Mark current verse as mastered
   */
  markCurrentAsMastered() {
    const actualIndex = this.getCurrentActualIndex();
    this.verses[actualIndex].mastered = true;
    this.saveMasteredVerses();
  }

  /**
   * Save mastered verses to storage
   */
  saveMasteredVerses() {
    const masteredIndices = this.verses
      .map((v, i) => v.mastered ? i : -1)
      .filter(i => i !== -1);
    this.storage.setJSON('masteredVerses', masteredIndices);
  }

  /**
   * Reset all mastery progress
   */
  resetMastery() {
    this.verses.forEach(v => v.mastered = false);
    this.storage.remove('masteredVerses');
  }

  /**
   * Get mastery statistics
   * @returns {Object} - { mastered, total, toPractice }
   */
  getStats() {
    const mastered = this.verses.filter(v => v.mastered).length;
    return {
      mastered,
      total: this.verses.length,
      toPractice: this.verses.length - mastered
    };
  }

  /**
   * Check if random mode is active
   * @returns {boolean}
   */
  isRandomMode() {
    return this.randomMode;
  }
}

export default VerseService;
