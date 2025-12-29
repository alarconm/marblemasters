// ============================================
// VOICE PROMPTS SYSTEM
// Uses Web Speech API for text-to-speech
// Priority feature for Peyton (age 3)
// ============================================

class VoicePromptsManager {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private enabled: boolean = true;
  private rate: number = 0.9; // Slightly slower for kids
  private pitch: number = 1.1; // Slightly higher, friendlier

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoice();
    }
  }

  private loadVoice() {
    if (!this.synth) return;

    // Wait for voices to load
    const setVoice = () => {
      const voices = this.synth!.getVoices();
      // Prefer a friendly English voice
      this.voice =
        voices.find((v) => v.name.includes('Google') && v.lang.startsWith('en')) ||
        voices.find((v) => v.lang.startsWith('en-US')) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0];
    };

    if (this.synth.getVoices().length > 0) {
      setVoice();
    } else {
      this.synth.addEventListener('voiceschanged', setVoice);
    }
  }

  // Speak a prompt
  speak(text: string, onEnd?: () => void): void {
    if (!this.synth || !this.enabled) {
      onEnd?.();
      return;
    }

    // Cancel any current speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = 1;

    if (this.voice) {
      utterance.voice = this.voice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    this.synth.speak(utterance);
  }

  // Speak with a friendly tone for correct answers
  speakCorrect(): void {
    const phrases = [
      'Great job!',
      'You got it!',
      'Awesome!',
      'That\'s right!',
      'Well done!',
      'Perfect!',
      'Super!',
      'Yay!',
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    this.speak(phrase);
  }

  // Speak with an encouraging tone for incorrect answers
  speakTryAgain(): void {
    const phrases = [
      'Try again!',
      'Almost! Try once more.',
      'Not quite, give it another try!',
      'Let\'s try that again!',
      'Oops! Try again!',
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    this.speak(phrase);
  }

  // Speak welcome message
  speakWelcome(age: number): void {
    if (age <= 4) {
      this.speak('Welcome to Marble Masters! Tap to drop marbles!');
    } else {
      this.speak('Welcome to Marble Masters! Let\'s play!');
    }
  }

  // Speak level complete
  speakLevelComplete(): void {
    const phrases = [
      'Level complete! Amazing!',
      'You did it! Great job!',
      'Fantastic! Level complete!',
      'Wonderful! On to the next level!',
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    this.speak(phrase);
  }

  // Enable/disable voice
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled && this.synth) {
      this.synth.cancel();
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  // Check if speech synthesis is supported
  isSupported(): boolean {
    return this.synth !== null;
  }

  // Stop current speech
  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

// Singleton instance
export const voicePrompts = new VoicePromptsManager();

export default voicePrompts;
