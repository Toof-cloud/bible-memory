/**
 * QuizEngine - Generates and validates quiz questions
 * 
 * Creates fill-in-the-blank questions from verses with multiple choice options.
 */
export class QuizEngine {
  /**
   * @param {Array} verses - Array of verse objects
   */
  constructor(verses) {
    this.verses = verses;
    this.currentQuestion = null;
    this.correctAnswer = null;
    this.options = [];
    this.selectedOptionIndex = null;
  }

  /**
   * Normalize text for comparison (lowercase, remove punctuation)
   * @param {string} text - Text to normalize
   * @returns {string} - Normalized text
   */
  static normalize(text) {
    return text
      .trim()
      .toLowerCase()
      .replace(/[.,;:!?'"—-]/g, '')
      .replace(/\s+/g, ' ');
  }

  /**
   * Generate a quiz question for a verse
   * @param {Object} verse - Verse object to create question from
   * @returns {Object} - Question data { question, options, correctAnswer }
   */
  generateQuestion(verse) {
    const words = verse.text.split(' ');
    const splitPoint = Math.floor(words.length * 0.4);
    const missingLen = Math.max(4, Math.floor(words.length * 0.3));

    const firstPart = words.slice(0, splitPoint);
    const correctPart = words.slice(splitPoint, splitPoint + missingLen).join(' ');
    const lastPart = words.slice(splitPoint + missingLen);

    // Create question text with blank
    const questionText = `${firstPart.join(' ')} _____ ${lastPart.join(' ')}`;

    // Generate distractor options
    const options = [correctPart];
    const normalizedCorrect = QuizEngine.normalize(correctPart);

    while (options.length < 4) {
      const randomVerse = this.verses[Math.floor(Math.random() * this.verses.length)];
      const randomWords = randomVerse.text.split(' ');
      const distractorSplit = Math.floor(randomWords.length * 0.4);
      const distractorPart = randomWords
        .slice(distractorSplit, distractorSplit + missingLen)
        .join(' ');

      const normalizedDistractor = QuizEngine.normalize(distractorPart);
      const exists = options.some(o => QuizEngine.normalize(o) === normalizedDistractor);

      if (!exists && normalizedDistractor !== normalizedCorrect) {
        options.push(distractorPart);
      }
    }

    // Shuffle options using Fisher-Yates
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    // Store current question state
    this.currentQuestion = questionText;
    this.correctAnswer = correctPart;
    this.options = options;
    this.selectedOptionIndex = null;

    return {
      question: questionText,
      options: options,
      correctAnswer: correctPart
    };
  }

  /**
   * Select an option
   * @param {number} index - Option index
   */
  selectOption(index) {
    this.selectedOptionIndex = index;
  }

  /**
   * Get selected option index
   * @returns {number|null}
   */
  getSelectedIndex() {
    return this.selectedOptionIndex;
  }

  /**
   * Check if an answer is correct
   * @param {string} answer - Answer to check
   * @returns {boolean} - True if correct
   */
  checkAnswer(answer) {
    return QuizEngine.normalize(answer) === QuizEngine.normalize(this.correctAnswer);
  }

  /**
   * Submit and validate the selected answer
   * @returns {Object} - { correct, selectedAnswer, correctAnswer, correctIndex }
   */
  submitAnswer() {
    if (this.selectedOptionIndex === null) {
      return { error: 'No option selected' };
    }

    const selectedAnswer = this.options[this.selectedOptionIndex];
    const correct = this.checkAnswer(selectedAnswer);
    const correctIndex = this.options.findIndex(
      o => QuizEngine.normalize(o) === QuizEngine.normalize(this.correctAnswer)
    );

    return {
      correct,
      selectedAnswer,
      correctAnswer: this.correctAnswer,
      correctIndex,
      selectedIndex: this.selectedOptionIndex
    };
  }

  /**
   * Reset quiz state
   */
  reset() {
    this.currentQuestion = null;
    this.correctAnswer = null;
    this.options = [];
    this.selectedOptionIndex = null;
  }
}

export default QuizEngine;
