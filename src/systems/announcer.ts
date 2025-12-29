// ============================================
// SCREEN READER ANNOUNCER
// Live region manager for accessible game events
// ============================================

export type GameEventType =
  | 'marble-dropped'
  | 'marble-collected'
  | 'level-complete'
  | 'challenge-start'
  | 'answer-correct'
  | 'answer-incorrect'
  | 'game-paused'
  | 'game-resumed';

export interface GameEvent {
  type: GameEventType;
  color?: string;
  collected?: number;
  total?: number;
  level?: number;
  score?: number;
  prompt?: string;
}

class ScreenReaderAnnouncer {
  private liveRegion: HTMLDivElement | null = null;
  private assertiveRegion: HTMLDivElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.createLiveRegions();
    }
  }

  private createLiveRegions() {
    // Polite announcements (non-urgent)
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('role', 'status');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'sr-only';
    this.liveRegion.id = 'announcer-polite';
    document.body.appendChild(this.liveRegion);

    // Assertive announcements (urgent/important)
    this.assertiveRegion = document.createElement('div');
    this.assertiveRegion.setAttribute('role', 'alert');
    this.assertiveRegion.setAttribute('aria-live', 'assertive');
    this.assertiveRegion.setAttribute('aria-atomic', 'true');
    this.assertiveRegion.className = 'sr-only';
    this.assertiveRegion.id = 'announcer-assertive';
    document.body.appendChild(this.assertiveRegion);
  }

  /**
   * Announce a message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const region = priority === 'assertive' ? this.assertiveRegion : this.liveRegion;
    if (!region) return;

    // Clear and set to trigger announcement
    region.textContent = '';
    requestAnimationFrame(() => {
      region.textContent = message;
    });
  }

  /**
   * Announce a game event with appropriate message
   */
  announceGameEvent(event: GameEvent) {
    switch (event.type) {
      case 'marble-dropped':
        this.announce(`${event.color || 'A'} marble dropped`);
        break;

      case 'marble-collected':
        this.announce(
          `Marble collected! ${event.collected} of ${event.total}`,
          'assertive'
        );
        break;

      case 'level-complete':
        this.announce(
          `Level ${event.level} complete! Score: ${event.score}`,
          'assertive'
        );
        break;

      case 'challenge-start':
        this.announce(`Challenge: ${event.prompt}`, 'assertive');
        break;

      case 'answer-correct':
        this.announce('Correct! Great job!', 'assertive');
        break;

      case 'answer-incorrect':
        this.announce('Try again!', 'assertive');
        break;

      case 'game-paused':
        this.announce('Game paused');
        break;

      case 'game-resumed':
        this.announce('Game resumed');
        break;
    }
  }

  /**
   * Announce marble drop with color
   */
  announceMarbleDrop(color: string) {
    this.announceGameEvent({ type: 'marble-dropped', color });
  }

  /**
   * Announce marble collection progress
   */
  announceMarbleCollected(collected: number, total: number) {
    this.announceGameEvent({ type: 'marble-collected', collected, total });
  }

  /**
   * Announce level completion
   */
  announceLevelComplete(level: number, score: number) {
    this.announceGameEvent({ type: 'level-complete', level, score });
  }

  /**
   * Announce challenge prompt
   */
  announceChallengeStart(prompt: string) {
    this.announceGameEvent({ type: 'challenge-start', prompt });
  }

  /**
   * Announce correct answer
   */
  announceCorrect() {
    this.announceGameEvent({ type: 'answer-correct' });
  }

  /**
   * Announce incorrect answer
   */
  announceIncorrect() {
    this.announceGameEvent({ type: 'answer-incorrect' });
  }

  /**
   * Announce game paused
   */
  announcePaused() {
    this.announceGameEvent({ type: 'game-paused' });
  }

  /**
   * Announce game resumed
   */
  announceResumed() {
    this.announceGameEvent({ type: 'game-resumed' });
  }
}

// Singleton instance
export const announcer = new ScreenReaderAnnouncer();

export default announcer;
