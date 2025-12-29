/**
 * Haptic feedback system for tactile responses
 * Uses the Vibration API for mobile devices
 */

class HapticsManager {
  private isSupported: boolean;

  constructor() {
    this.isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;
  }

  /**
   * Check if haptics are supported on this device
   */
  canVibrate(): boolean {
    return this.isSupported;
  }

  /**
   * Light tap - for marble drops and UI interactions
   */
  tap(): void {
    if (!this.isSupported) return;
    try {
      navigator.vibrate(10);
    } catch {
      // Silently fail if vibration is blocked
    }
  }

  /**
   * Medium tap - for collecting marbles
   */
  collect(): void {
    if (!this.isSupported) return;
    try {
      navigator.vibrate(20);
    } catch {
      // Silently fail
    }
  }

  /**
   * Success pattern - for correct answers
   */
  success(): void {
    if (!this.isSupported) return;
    try {
      // Two quick pulses
      navigator.vibrate([30, 50, 30]);
    } catch {
      // Silently fail
    }
  }

  /**
   * Error pattern - for incorrect answers
   */
  error(): void {
    if (!this.isSupported) return;
    try {
      // Three short buzzes
      navigator.vibrate([50, 30, 50, 30, 50]);
    } catch {
      // Silently fail
    }
  }

  /**
   * Celebration pattern - for level completion
   */
  celebrate(): void {
    if (!this.isSupported) return;
    try {
      // Ascending pattern
      navigator.vibrate([20, 40, 30, 40, 40, 40, 50]);
    } catch {
      // Silently fail
    }
  }

  /**
   * Button press feedback
   */
  buttonPress(): void {
    if (!this.isSupported) return;
    try {
      navigator.vibrate(5);
    } catch {
      // Silently fail
    }
  }

  /**
   * Long press feedback
   */
  longPress(): void {
    if (!this.isSupported) return;
    try {
      navigator.vibrate([10, 50, 20]);
    } catch {
      // Silently fail
    }
  }
}

// Singleton instance
export const haptics = new HapticsManager();

export default haptics;
