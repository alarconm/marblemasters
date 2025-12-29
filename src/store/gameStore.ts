import { create } from 'zustand';
import {
  Marble,
  MarbleColor,
  TrackSegment,
  Bucket,
  TrackTheme,
  Challenge,
  ChallengeResult,
  Subject,
  MARBLE_COLORS,
} from '@/types';
import { createMarble, dropMarble } from '@/systems/physics';
import { randomChoice, shuffleArray } from '@/utils/mathHelpers';
import { selectChallenge, shuffleChallengeOptions } from '@/systems/educationEngine';

// Default enabled subjects
const defaultEnabledSubjects: Record<Subject, boolean> = {
  colors: true,
  counting: true,
  math: true,
  patterns: true,
  letters: true,
  logic: true,
  memory: true,
};

interface GameStore {
  // Game state
  currentLevel: number;
  score: number;
  marblesDropped: number;
  marblesCollected: number;
  marblesRequired: number;

  // Entities
  marbles: Marble[];
  track: TrackSegment[];
  buckets: Bucket[];

  // Visual
  theme: TrackTheme;
  launcherPosition: { x: number; y: number };

  // UI state
  isPlaying: boolean;
  isPaused: boolean;
  showCelebration: boolean;
  showChallenge: boolean;
  showAgeSelector: boolean;
  playerAge: number;

  // Challenge state
  currentChallenge: Challenge | null;
  recentChallenges: ChallengeResult[];
  enabledSubjects: Record<Subject, boolean>;

  // Marble queue
  nextMarbleColors: MarbleColor[];

  // Actions
  setTrack: (track: TrackSegment[], buckets: Bucket[]) => void;
  setTheme: (theme: TrackTheme) => void;
  startGame: (age: number) => void;
  dropNextMarble: () => void;
  updateMarbles: (marbles: Marble[]) => void;
  collectMarble: (marbleId: string) => void;
  completeLevel: () => void;
  showChallengeModal: () => void;
  answerChallenge: (correct: boolean, responseTime: number) => void;
  skipChallenge: () => void;
  nextLevel: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
}

const MARBLE_COLOR_LIST: MarbleColor[] = [
  'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'
];

function generateMarbleQueue(count: number): MarbleColor[] {
  const colors: MarbleColor[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(randomChoice(MARBLE_COLOR_LIST));
  }
  return colors;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentLevel: 1,
  score: 0,
  marblesDropped: 0,
  marblesCollected: 0,
  marblesRequired: 5,
  marbles: [],
  track: [],
  buckets: [],
  theme: 'wooden-classic',
  launcherPosition: { x: 200, y: 80 },
  isPlaying: false,
  isPaused: false,
  showCelebration: false,
  showChallenge: false,
  showAgeSelector: true,
  playerAge: 5,
  currentChallenge: null,
  recentChallenges: [],
  enabledSubjects: { ...defaultEnabledSubjects },
  nextMarbleColors: generateMarbleQueue(10),

  // Actions
  setTrack: (track, buckets) => set({ track, buckets }),

  setTheme: (theme) => set({ theme }),

  startGame: (age) =>
    set({
      isPlaying: true,
      showAgeSelector: false,
      playerAge: age,
      currentLevel: 1,
      score: 0,
      marblesDropped: 0,
      marblesCollected: 0,
      marbles: [],
      nextMarbleColors: generateMarbleQueue(10),
    }),

  dropNextMarble: () => {
    const state = get();
    if (state.isPaused || state.marblesDropped >= state.marblesRequired) return;

    const [nextColor, ...remainingColors] = state.nextMarbleColors;
    const newMarble = createMarble(
      `marble-${Date.now()}`,
      nextColor,
      state.launcherPosition
    );

    // Drop the marble immediately
    const droppedMarble = dropMarble(newMarble);

    set({
      marbles: [...state.marbles, droppedMarble],
      marblesDropped: state.marblesDropped + 1,
      nextMarbleColors: [
        ...remainingColors,
        randomChoice(MARBLE_COLOR_LIST),
      ],
    });
  },

  updateMarbles: (marbles) => {
    const state = get();

    // Check for newly collected marbles
    const newlyCollected = marbles.filter(
      (m) =>
        m.state === 'collected' &&
        !state.marbles.find((om) => om.id === m.id && om.state === 'collected')
    );

    const newCollectedCount = state.marblesCollected + newlyCollected.length;
    const newScore = state.score + newlyCollected.length * 100;

    // Remove collected marbles from the active list
    const activeMarbles = marbles.filter((m) => m.state !== 'collected');

    set({
      marbles: activeMarbles,
      marblesCollected: newCollectedCount,
      score: newScore,
    });

    // Check for level completion
    if (
      newCollectedCount >= state.marblesRequired &&
      activeMarbles.length === 0
    ) {
      get().completeLevel();
    }
  },

  collectMarble: (marbleId) => {
    const state = get();
    const updatedMarbles = state.marbles.map((m) =>
      m.id === marbleId ? { ...m, state: 'collected' as const } : m
    );
    set({
      marbles: updatedMarbles,
      marblesCollected: state.marblesCollected + 1,
      score: state.score + 100,
    });
  },

  completeLevel: () => {
    set({ showCelebration: true, isPaused: true });

    // After celebration, show challenge
    setTimeout(() => {
      get().showChallengeModal();
    }, 2000);
  },

  showChallengeModal: () => {
    const state = get();
    const challenge = selectChallenge(
      state.playerAge,
      state.recentChallenges,
      state.enabledSubjects
    );

    if (challenge) {
      const shuffled = shuffleChallengeOptions(challenge);
      set({
        currentChallenge: shuffled,
        showCelebration: false,
        showChallenge: true,
      });
    } else {
      // No challenge available, go directly to next level
      get().nextLevel();
    }
  },

  answerChallenge: (correct, responseTime) => {
    const state = get();
    if (!state.currentChallenge) return;

    // Record result
    const result: ChallengeResult = {
      challengeId: state.currentChallenge.id,
      subject: state.currentChallenge.subject,
      correct,
      responseTime,
      timestamp: Date.now(),
    };

    // Add bonus points for correct answer
    const bonusPoints = correct ? 50 * state.currentChallenge.difficulty : 0;

    set({
      recentChallenges: [...state.recentChallenges.slice(-19), result],
      score: state.score + bonusPoints,
    });

    // If correct, proceed to next level after a delay
    if (correct) {
      setTimeout(() => {
        get().nextLevel();
      }, 500);
    }
    // If incorrect, the modal handles retry
  },

  skipChallenge: () => {
    get().nextLevel();
  },

  nextLevel: () => {
    const state = get();
    const nextThemes: TrackTheme[] = ['wooden-classic', 'rainbow-candy', 'space-station'];
    const nextTheme = nextThemes[(state.currentLevel) % nextThemes.length];

    set({
      currentLevel: state.currentLevel + 1,
      marblesDropped: 0,
      marblesCollected: 0,
      marblesRequired: Math.min(5 + Math.floor(state.currentLevel / 3), 10),
      marbles: [],
      showCelebration: false,
      showChallenge: false,
      currentChallenge: null,
      isPaused: false,
      theme: nextTheme,
      nextMarbleColors: generateMarbleQueue(10),
    });
  },

  pauseGame: () => set({ isPaused: true }),

  resumeGame: () => set({ isPaused: false }),

  resetGame: () =>
    set({
      currentLevel: 1,
      score: 0,
      marblesDropped: 0,
      marblesCollected: 0,
      marblesRequired: 5,
      marbles: [],
      isPlaying: false,
      isPaused: false,
      showCelebration: false,
      showAgeSelector: true,
      nextMarbleColors: generateMarbleQueue(10),
    }),
}));
