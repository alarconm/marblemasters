// ============================================
// AUDIO MANAGER
// Handles all game sounds using Web Audio API
// Falls back gracefully if audio not supported
// ============================================

class AudioManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private musicEnabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  // Resume audio context (required after user interaction on mobile)
  async resume() {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Generate a simple beep sound
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Play a sequence of notes
  private playMelody(notes: { freq: number; dur: number }[], startTime: number = 0) {
    if (!this.audioContext || !this.enabled) return;

    let time = this.audioContext.currentTime + startTime;
    notes.forEach(({ freq, dur }) => {
      this.playToneAt(freq, dur, time);
      time += dur;
    });
  }

  private playToneAt(frequency: number, duration: number, startTime: number) {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.9);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  // GAME SOUNDS

  // Marble drop - soft pop sound
  playDrop() {
    this.playTone(600, 0.1, 'sine');
    setTimeout(() => this.playTone(400, 0.08, 'sine'), 30);
  }

  // Marble rolling - subtle tick
  playRoll() {
    this.playTone(300, 0.03, 'triangle');
  }

  // Marble collected - happy chime
  playCollect() {
    this.playMelody([
      { freq: 523, dur: 0.1 }, // C5
      { freq: 659, dur: 0.1 }, // E5
      { freq: 784, dur: 0.15 }, // G5
    ]);
  }

  // Correct answer - celebration sound
  playCorrect() {
    this.playMelody([
      { freq: 523, dur: 0.08 }, // C5
      { freq: 659, dur: 0.08 }, // E5
      { freq: 784, dur: 0.08 }, // G5
      { freq: 1047, dur: 0.2 }, // C6
    ]);
  }

  // Wrong answer - gentle bonk (not harsh!)
  playIncorrect() {
    this.playTone(200, 0.15, 'triangle');
    setTimeout(() => this.playTone(180, 0.1, 'triangle'), 100);
  }

  // Level complete - fanfare
  playLevelComplete() {
    this.playMelody([
      { freq: 392, dur: 0.12 }, // G4
      { freq: 523, dur: 0.12 }, // C5
      { freq: 659, dur: 0.12 }, // E5
      { freq: 784, dur: 0.15 }, // G5
      { freq: 659, dur: 0.08 }, // E5
      { freq: 784, dur: 0.25 }, // G5
    ]);
  }

  // UI tap - soft click
  playTap() {
    this.playTone(800, 0.05, 'sine');
  }

  // Button press
  playButton() {
    this.playTone(500, 0.08, 'triangle');
  }

  // SETTINGS

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
  }

  isMusicEnabled(): boolean {
    return this.musicEnabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  getVolume(): number {
    return this.volume;
  }
}

// Singleton instance
export const audioManager = new AudioManager();

export default audioManager;
