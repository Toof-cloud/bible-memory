/**
 * StorageService - Centralized localStorage management with user scoping
 * 
 * Provides a clean API for persisting data, automatically scoping keys
 * per user when a user is logged in.
 */
export class StorageService {
  /**
   * @param {Function} getUserFn - Function that returns current username or null
   */
  constructor(getUserFn = () => null) {
    this.getUser = getUserFn;
  }

  /**
   * Generate a user-scoped key
   * @param {string} key - Base key name
   * @returns {string} - Scoped key (e.g., "Tyrone_streak")
   */
  key(key) {
    const user = this.getUser();
    return user ? `${user}_${key}` : key;
  }

  /**
   * Set a user-scoped value
   * @param {string} key - Key name
   * @param {*} value - Value to store (will be converted to string)
   */
  set(key, value) {
    localStorage.setItem(this.key(key), value);
  }

  /**
   * Get a user-scoped value
   * @param {string} key - Key name
   * @returns {string|null} - Stored value or null
   */
  get(key) {
    return localStorage.getItem(this.key(key));
  }

  /**
   * Remove a user-scoped value
   * @param {string} key - Key name
   */
  remove(key) {
    localStorage.removeItem(this.key(key));
  }

  /**
   * Set a global (non-user-scoped) value
   * @param {string} key - Key name
   * @param {*} value - Value to store
   */
  setGlobal(key, value) {
    localStorage.setItem(key, value);
  }

  /**
   * Get a global (non-user-scoped) value
   * @param {string} key - Key name
   * @returns {string|null} - Stored value or null
   */
  getGlobal(key) {
    return localStorage.getItem(key);
  }

  /**
   * Remove a global (non-user-scoped) value
   * @param {string} key - Key name
   */
  removeGlobal(key) {
    localStorage.removeItem(key);
  }

  /**
   * Get a user-scoped JSON value
   * @param {string} key - Key name
   * @param {*} defaultValue - Default if not found or invalid JSON
   * @returns {*} - Parsed value or default
   */
  getJSON(key, defaultValue = null) {
    try {
      const value = this.get(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  /**
   * Set a user-scoped JSON value
   * @param {string} key - Key name
   * @param {*} value - Value to stringify and store
   */
  setJSON(key, value) {
    this.set(key, JSON.stringify(value));
  }
}

export default StorageService;
