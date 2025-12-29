import { useParentStore } from '@/store/parentStore';
import {
  isFrustrated,
  isInFlow,
  calculateRecentAccuracy,
  getWeakSubjects,
} from './progressTracker';

// ============================================
// DIFFICULTY ENGINE
// Adapts game and challenge difficulty based
// on player performance
// ============================================

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface DifficultySettings {
  challengeDifficulty: DifficultyLevel; // 1-5
  trackComplexity: number; // 0.5-2.0 multiplier
  bucketSizeMultiplier: number; // 0.8-1.2
  marbleSpeedMultiplier: number; // 0.8-1.2
  segmentCount: number; // 3-8
}

// Get overall recommended difficulty based on performance
export function getRecommendedDifficulty(): DifficultySettings {
  const state = useParentStore.getState();
  const accuracy = calculateRecentAccuracy(state.recentChallenges);
  const frustrated = isFrustrated();
  const inFlow = isInFlow();

  // Apply parent-configured bias
  let biasOffset = 0;
  if (state.difficultyBias === 'easier') biasOffset = -1;
  if (state.difficultyBias === 'harder') biasOffset = 1;

  // Base difficulty calculation
  let baseDifficulty: DifficultyLevel = 3;

  if (frustrated) {
    // Player is struggling - make it easier
    baseDifficulty = 1;
  } else if (inFlow) {
    // Player is doing great - challenge them
    baseDifficulty = 4;
  } else if (accuracy >= 0.9) {
    baseDifficulty = 4;
  } else if (accuracy >= 0.75) {
    baseDifficulty = 3;
  } else if (accuracy >= 0.6) {
    baseDifficulty = 2;
  } else {
    baseDifficulty = 1;
  }

  // Apply bias
  const adjustedDifficulty = Math.max(
    1,
    Math.min(5, baseDifficulty + biasOffset)
  ) as DifficultyLevel;

  return difficultyToSettings(adjustedDifficulty);
}

// Convert difficulty level to game settings
function difficultyToSettings(level: DifficultyLevel): DifficultySettings {
  switch (level) {
    case 1:
      return {
        challengeDifficulty: 1,
        trackComplexity: 0.6,
        bucketSizeMultiplier: 1.2,
        marbleSpeedMultiplier: 0.8,
        segmentCount: 3,
      };
    case 2:
      return {
        challengeDifficulty: 2,
        trackComplexity: 0.8,
        bucketSizeMultiplier: 1.1,
        marbleSpeedMultiplier: 0.9,
        segmentCount: 4,
      };
    case 3:
      return {
        challengeDifficulty: 3,
        trackComplexity: 1.0,
        bucketSizeMultiplier: 1.0,
        marbleSpeedMultiplier: 1.0,
        segmentCount: 5,
      };
    case 4:
      return {
        challengeDifficulty: 4,
        trackComplexity: 1.3,
        bucketSizeMultiplier: 0.9,
        marbleSpeedMultiplier: 1.1,
        segmentCount: 6,
      };
    case 5:
      return {
        challengeDifficulty: 5,
        trackComplexity: 1.6,
        bucketSizeMultiplier: 0.8,
        marbleSpeedMultiplier: 1.2,
        segmentCount: 7,
      };
  }
}

// Get challenge difficulty adjustment
export function getChallengeDifficultyAdjustment(): 'easier' | 'maintain' | 'harder' {
  const frustrated = isFrustrated();
  const inFlow = isInFlow();
  const state = useParentStore.getState();
  const accuracy = calculateRecentAccuracy(state.recentChallenges);

  // Apply bias
  if (state.difficultyBias === 'easier') {
    if (accuracy > 0.9) return 'maintain';
    return 'easier';
  }

  if (state.difficultyBias === 'harder') {
    if (accuracy < 0.5) return 'maintain';
    return 'harder';
  }

  // Normal adaptive behavior
  if (frustrated) return 'easier';
  if (inFlow) return 'harder';
  if (accuracy > 0.85) return 'harder';
  if (accuracy < 0.6) return 'easier';
  return 'maintain';
}

// Get subject bias for challenge selection
// Returns subjects to prioritize (weak areas) or avoid (for encouragement)
export function getSubjectBias(): {
  prioritize: string[];
  avoid: string[];
} {
  const frustrated = isFrustrated();
  const weakSubjects = getWeakSubjects(2);

  if (frustrated) {
    // When frustrated, avoid weak areas temporarily
    return {
      prioritize: [],
      avoid: weakSubjects,
    };
  }

  // Normally, slightly prioritize weak areas for practice
  return {
    prioritize: weakSubjects,
    avoid: [],
  };
}

// Get encouragement message based on performance
export function getEncouragementMessage(): string | null {
  const state = useParentStore.getState();
  const accuracy = calculateRecentAccuracy(state.recentChallenges);
  const inFlow = isInFlow();
  const frustrated = isFrustrated();

  if (frustrated) {
    const messages = [
      "Keep trying! You're doing great!",
      "Practice makes perfect!",
      "You've got this!",
      "Every mistake helps you learn!",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  if (inFlow) {
    const messages = [
      "Amazing streak! You're on fire! 🔥",
      "Incredible! Keep it up! ⭐",
      "You're a superstar! 🌟",
      "Unstoppable! 🚀",
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  if (accuracy >= 0.9) {
    return "Fantastic work! 🎉";
  }

  return null;
}

// Calculate score multiplier based on streak
export function getStreakMultiplier(): number {
  const state = useParentStore.getState();
  const last5 = state.recentChallenges.slice(-5);
  const streak = last5.filter((r) => r.correct).length;

  if (streak >= 5) return 2.0;
  if (streak >= 4) return 1.5;
  if (streak >= 3) return 1.25;
  return 1.0;
}

export default {
  getRecommendedDifficulty,
  getChallengeDifficultyAdjustment,
  getSubjectBias,
  getEncouragementMessage,
  getStreakMultiplier,
};
