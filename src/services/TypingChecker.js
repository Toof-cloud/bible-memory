/**
 * TypingChecker - Validates typed verse answers
 * 
 * Uses word-based matching with configurable threshold for flexible validation.
 */
export class TypingChecker {
  /**
   * @param {number} threshold - Minimum match percentage for success (0-100)
   */
  constructor(threshold = 85) {
    this.threshold = threshold;
  }

  /**
   * Normalize text for comparison
   * @param {string} text - Text to normalize
   * @returns {string[]} - Array of normalized words
   */
  static normalize(text) {
    return text
      .toLowerCase()
      .replace(/[.,;:!?'"—-]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  /**
   * Check typed input against actual verse
   * @param {string} userInput - User's typed text
   * @param {string} actualVerse - Correct verse text
   * @returns {Object} - { correct, percentage, feedback }
   */
  check(userInput, actualVerse) {
    const userWords = TypingChecker.normalize(userInput);
    const actualWords = TypingChecker.normalize(actualVerse);

    if (userWords.length === 0) {
      return {
        correct: false,
        percentage: 0,
        feedback: 'Please type something first!'
      };
    }

    // Count matching words
    let matchCount = 0;
    userWords.forEach(word => {
      if (actualWords.includes(word)) {
        matchCount++;
      }
    });

    const percentage = Math.round((matchCount / actualWords.length) * 100);
    const correct = percentage >= this.threshold;

    let feedback;
    if (correct) {
      feedback = '✓ Excellent! You got it right!';
    } else if (percentage >= 60) {
      feedback = `Close! ${percentage}% match. Try again!`;
    } else {
      feedback = `Keep practicing! ${percentage}% match.`;
    }

    return {
      correct,
      percentage,
      feedback
    };
  }

  /**
   * Get the threshold percentage
   * @returns {number}
   */
  getThreshold() {
    return this.threshold;
  }

  /**
   * Set a new threshold percentage
   * @param {number} threshold - New threshold (0-100)
   */
  setThreshold(threshold) {
    this.threshold = Math.max(0, Math.min(100, threshold));
  }
}

export default TypingChecker;
