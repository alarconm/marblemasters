// ============================================
// AUDIO MANAGER
// Handles all game sounds using Web Audio API
// Falls back gracefully if audio not supported
// ============================================

// Musical notes for background music (pentatonic scale - always sounds pleasant)
const PENTATONIC_NOTES = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.0, // G4
  440.0, // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
];

class AudioManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private musicEnabled: boolean = true;
  private volume: number = 0.5;
  private musicVolume: number = 0.15;

  // Background music state
  private musicPlaying: boolean = false;
  private musicGainNode: GainNode | null = null;
  private musicInterval: NodeJS.Timeout | null = null;
  private currentNoteIndex: number = 0;

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

  // ============================================
  // BACKGROUND MUSIC
  // Procedurally generated ambient music
  // ============================================

  startMusic() {
    if (!this.audioContext || !this.musicEnabled || this.musicPlaying) return;

    this.musicPlaying = true;

    // Create master gain for music
    this.musicGainNode = this.audioContext.createGain();
    this.musicGainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    this.musicGainNode.gain.linearRampToValueAtTime(
      this.musicVolume,
      this.audioContext.currentTime + 2
    );
    this.musicGainNode.connect(this.audioContext.destination);

    // Start playing notes at intervals
    this.playMusicNote();
    this.musicInterval = setInterval(() => {
      if (this.musicPlaying) {
        this.playMusicNote();
      }
    }, 2000); // Play a note every 2 seconds
  }

  private playMusicNote() {
    if (!this.audioContext || !this.musicGainNode || !this.musicEnabled) return;

    // Pick notes in a melodic pattern
    const patterns = [
      [0, 2, 4], // C, E, G
      [1, 3, 5], // D, G, C5
      [2, 4, 6], // E, A, D5
      [0, 3, 5], // C, G, C5
    ];

    const patternIndex = Math.floor(this.currentNoteIndex / 3) % patterns.length;
    const noteInPattern = this.currentNoteIndex % 3;
    const noteIndex = patterns[patternIndex][noteInPattern];
    const frequency = PENTATONIC_NOTES[noteIndex];

    // Create oscillator with smooth envelope
    const osc = this.audioContext.createOscillator();
    const noteGain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    // Add slight vibrato for warmth
    const vibrato = this.audioContext.createOscillator();
    const vibratoGain = this.audioContext.createGain();
    vibrato.frequency.setValueAtTime(4, this.audioContext.currentTime);
    vibratoGain.gain.setValueAtTime(2, this.audioContext.currentTime);
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);

    osc.connect(noteGain);
    noteGain.connect(this.musicGainNode);

    // Soft envelope
    const now = this.audioContext.currentTime;
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.3, now + 0.1);
    noteGain.gain.exponentialRampToValueAtTime(0.01, now + 1.8);

    osc.start(now);
    vibrato.start(now);
    osc.stop(now + 2);
    vibrato.stop(now + 2);

    this.currentNoteIndex++;
  }

  stopMusic() {
    if (!this.musicPlaying) return;

    this.musicPlaying = false;

    // Fade out
    if (this.musicGainNode && this.audioContext) {
      this.musicGainNode.gain.linearRampToValueAtTime(
        0,
        this.audioContext.currentTime + 1
      );
    }

    // Clear interval
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  isMusicPlaying(): boolean {
    return this.musicPlaying;
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(0.3, volume)); // Cap at 0.3 for background
    if (this.musicGainNode && this.audioContext) {
      this.musicGainNode.gain.linearRampToValueAtTime(
        this.musicVolume,
        this.audioContext.currentTime + 0.1
      );
    }
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
    if (enabled && !this.musicPlaying) {
      this.startMusic();
    } else if (!enabled && this.musicPlaying) {
      this.stopMusic();
    }
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
