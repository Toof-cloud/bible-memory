/**
 * TimerService - Manages practice timer functionality
 * 
 * Provides start, stop, and elapsed time tracking for practice sessions.
 */
export class TimerService {
  constructor() {
    this.startTime = 0;
    this.intervalId = null;
    this.onTick = null;
  }

  /**
   * Start the timer
   * @param {Function} onTick - Callback called every tick with elapsed seconds
   */
  start(onTick) {
    this.stop(); // Clear any existing timer
    this.startTime = Date.now();
    this.onTick = onTick;
    
    this.intervalId = setInterval(() => {
      if (this.onTick) {
        const elapsed = this.getElapsed();
        this.onTick(elapsed);
      }
    }, 100);
  }

  /**
   * Stop the timer
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Reset the timer
   */
  reset() {
    this.stop();
    this.startTime = 0;
  }

  /**
   * Get elapsed time in seconds
   * @returns {number} - Elapsed seconds
   */
  getElapsed() {
    if (!this.startTime) return 0;
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * Check if timer is running
   * @returns {boolean}
   */
  isRunning() {
    return this.intervalId !== null;
  }

  /**
   * Format elapsed time for display
   * @param {number} seconds - Seconds to format
   * @returns {string} - Formatted string (e.g., "⏱️ 45s")
   */
  static format(seconds) {
    return `⏱️ ${seconds}s`;
  }
}

export default TimerService;
