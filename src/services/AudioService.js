/**
 * AudioService - Handles sound feedback using Web Audio API
 * 
 * Provides audio feedback for correct answers and other events.
 */
export class AudioService {
  constructor() {
    this.audioContext = null;
  }

  /**
   * Initialize audio context (must be called after user interaction)
   */
  init() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    }
  }

  /**
   * Play a success/correct answer sound
   */
  playSuccess() {
    this.playTone(800, 0.2, 0.3);
  }

  /**
   * Play an error/incorrect sound
   */
  playError() {
    this.playTone(300, 0.2, 0.2);
  }

  /**
   * Play a tone with specified parameters
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in seconds
   * @param {number} volume - Volume (0-1)
   */
  playTone(frequency, duration, volume = 0.3) {
    this.init();
    
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      // Silently fail if audio playback fails
    }
  }
}

export default AudioService;
