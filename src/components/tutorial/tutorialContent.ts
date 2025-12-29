import { TutorialStep, AgeGroup } from '@/store/tutorialStore';

// ============================================
// TUTORIAL CONTENT
// Age-adaptive content for each tutorial step
// ============================================

export interface StepContent {
  text?: string;
  voice?: string;
  showHand: boolean;
  handSize: 'small' | 'medium' | 'large';
  highlightTarget: 'launcher' | 'track' | 'bucket' | 'progress' | 'none';
  duration: number; // Auto-advance after this many ms (0 = wait for action)
  waitForAction?: 'marble-dropped' | 'marble-collected';
}

export const TUTORIAL_CONTENT: Record<TutorialStep, Record<AgeGroup, StepContent>> = {
  welcome: {
    toddler: {
      voice: "Let's play with marbles!",
      showHand: false,
      handSize: 'large',
      highlightTarget: 'none',
      duration: 2500,
    },
    'early-reader': {
      text: 'Welcome!',
      voice: "Welcome! Let's play!",
      showHand: false,
      handSize: 'medium',
      highlightTarget: 'none',
      duration: 2000,
    },
    reader: {
      text: 'Welcome to Marble Masters!',
      showHand: false,
      handSize: 'small',
      highlightTarget: 'none',
      duration: 1500,
    },
  },

  'tap-launcher': {
    toddler: {
      voice: 'Tap here! Tap tap tap!',
      showHand: true,
      handSize: 'large',
      highlightTarget: 'launcher',
      duration: 0,
      waitForAction: 'marble-dropped',
    },
    'early-reader': {
      text: 'Tap here!',
      voice: 'Tap to drop a marble!',
      showHand: true,
      handSize: 'medium',
      highlightTarget: 'launcher',
      duration: 0,
      waitForAction: 'marble-dropped',
    },
    reader: {
      text: 'Tap the launcher to drop a marble',
      showHand: true,
      handSize: 'small',
      highlightTarget: 'launcher',
      duration: 0,
      waitForAction: 'marble-dropped',
    },
  },

  'watch-marble': {
    toddler: {
      voice: 'Watch it roll!',
      showHand: false,
      handSize: 'large',
      highlightTarget: 'track',
      duration: 3000,
    },
    'early-reader': {
      text: 'Watch it go!',
      showHand: false,
      handSize: 'medium',
      highlightTarget: 'track',
      duration: 2500,
    },
    reader: {
      showHand: false,
      handSize: 'small',
      highlightTarget: 'none',
      duration: 2000,
    },
  },

  'collect-first': {
    toddler: {
      voice: 'Yay! You got one!',
      showHand: false,
      handSize: 'large',
      highlightTarget: 'bucket',
      duration: 2500,
    },
    'early-reader': {
      text: 'Great job!',
      voice: 'Great job!',
      showHand: false,
      handSize: 'medium',
      highlightTarget: 'bucket',
      duration: 2000,
    },
    reader: {
      text: 'Nice!',
      showHand: false,
      handSize: 'small',
      highlightTarget: 'none',
      duration: 1500,
    },
  },

  'show-goal': {
    toddler: {
      voice: 'Get all the marbles in the bucket!',
      showHand: false,
      handSize: 'large',
      highlightTarget: 'progress',
      duration: 3000,
    },
    'early-reader': {
      text: 'Collect 5 marbles!',
      voice: 'Collect all the marbles!',
      showHand: false,
      handSize: 'medium',
      highlightTarget: 'progress',
      duration: 2500,
    },
    reader: {
      text: 'Collect 5 marbles to complete the level',
      showHand: false,
      handSize: 'small',
      highlightTarget: 'progress',
      duration: 2000,
    },
  },

  'free-play': {
    toddler: {
      voice: 'Keep going!',
      showHand: false,
      handSize: 'large',
      highlightTarget: 'none',
      duration: 1500,
    },
    'early-reader': {
      text: 'You got it!',
      showHand: false,
      handSize: 'medium',
      highlightTarget: 'none',
      duration: 1500,
    },
    reader: {
      showHand: false,
      handSize: 'small',
      highlightTarget: 'none',
      duration: 1000,
    },
  },

  complete: {
    toddler: {
      showHand: false,
      handSize: 'large',
      highlightTarget: 'none',
      duration: 0,
    },
    'early-reader': {
      showHand: false,
      handSize: 'medium',
      highlightTarget: 'none',
      duration: 0,
    },
    reader: {
      showHand: false,
      handSize: 'small',
      highlightTarget: 'none',
      duration: 0,
    },
  },
};

// Get content for current step and age
export function getStepContent(step: TutorialStep, ageGroup: AgeGroup): StepContent {
  return TUTORIAL_CONTENT[step][ageGroup];
}

// Check if skip button should be shown
export function shouldShowSkip(age: number, step: TutorialStep): boolean {
  const stepIndex = [
    'welcome',
    'tap-launcher',
    'watch-marble',
    'collect-first',
    'show-goal',
    'free-play',
    'complete',
  ].indexOf(step);

  // Ages 7+: Show skip after first step
  if (age >= 7) return stepIndex >= 1;

  // Ages 5-6: Show skip after second step
  if (age >= 5) return stepIndex >= 2;

  // Ages 3-4: No skip (they need guidance)
  return false;
}

// Help content for help overlay
export const HELP_CONTENT = {
  toddler: [
    { icon: '👆', text: 'Tap here!' },
    { icon: '🔵', text: 'Watch it roll!' },
    { icon: '🪣', text: 'Get in bucket!' },
  ],
  'early-reader': [
    { icon: '👆', text: 'TAP to drop marbles' },
    { icon: '⬇️', text: 'Marbles roll down' },
    { icon: '🪣', text: 'Collect in buckets' },
  ],
  reader: [
    { icon: '👆', text: 'Tap the launcher to drop marbles' },
    { icon: '🎯', text: 'Marbles follow the track' },
    { icon: '🏆', text: 'Collect all marbles to win' },
  ],
};
