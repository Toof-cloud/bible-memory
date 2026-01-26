/**
 * StreakService - Manages daily practice streak tracking
 * 
 * Tracks consecutive days of practice and persists to storage.
 */
export class StreakService {
  /**
   * @param {StorageService} storage - Storage service instance
   */
  constructor(storage) {
    this.storage = storage;
  }

  /**
   * Get today's date as a storage key
   * @returns {string} - Date key
   */
  getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  }

  /**
   * Record today's practice and update streak
   */
  recordPractice() {
    const lastPracticeDate = this.storage.get('lastPracticeDate');
    const today = this.getTodayKey();

    if (lastPracticeDate !== today) {
      let streak = parseInt(this.storage.get('streak')) || 0;
      
      if (lastPracticeDate) {
        const dayDiff = this.calculateDayDifference(lastPracticeDate, today);
        
        if (dayDiff === 1) {
          // Consecutive day - increment streak
          streak++;
        } else if (dayDiff > 1) {
          // Missed days - reset streak
          streak = 1;
        }
      } else {
        // First practice ever
        streak = 1;
      }

      this.storage.set('streak', streak);
      this.storage.set('lastPracticeDate', today);
    }
  }

  /**
   * Calculate difference in days between two date keys
   * @param {string} dateKey1 - Earlier date key
   * @param {string} dateKey2 - Later date key
   * @returns {number} - Difference in days
   */
  calculateDayDifference(dateKey1, dateKey2) {
    try {
      const parts1 = dateKey1.split('-').map(Number);
      const parts2 = dateKey2.split('-').map(Number);
      const date1 = new Date(parts1[0], parts1[1], parts1[2]);
      const date2 = new Date(parts2[0], parts2[1], parts2[2]);
      return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
    } catch {
      return 2; // Assume gap if parsing fails
    }
  }

  /**
   * Get current streak count
   * @returns {number} - Current streak (0 if not practiced today)
   */
  getStreak() {
    const lastPracticeDate = this.storage.get('lastPracticeDate');
    const today = this.getTodayKey();
    
    if (lastPracticeDate === today) {
      return parseInt(this.storage.get('streak')) || 0;
    }
    return 0;
  }

  /**
   * Reset streak data
   */
  reset() {
    this.storage.remove('streak');
    this.storage.remove('lastPracticeDate');
  }
}

export default StreakService;
