import { Badge, BadgeCondition, EarnedBadge, Subject } from '@/types';
import { BADGES, getUnlockedByBadge } from '@/data/badges';

// ============================================
// ACHIEVEMENT CHECKER SYSTEM
// Evaluates badge conditions and tracks progress
// ============================================

export interface AchievementState {
  // Current game stats
  currentLevel: number;
  totalMarblesCollected: number;
  challengesCompleted: number;
  totalPlayTimeMinutes: number;

  // Subject mastery (0-100)
  subjectMastery: Record<Subject, number>;

  // Streaks
  currentCorrectStreak: number;
  maxCorrectStreak: number;
  currentDayStreak: number;

  // Level performance
  hadPerfectLevel: boolean;
  firstChallengeCorrect: boolean;

  // Already earned
  earnedBadges: EarnedBadge[];
}

export interface BadgeProgress {
  badge: Badge;
  isEarned: boolean;
  earnedAt?: number;
  progress: number; // 0-100
  progressText: string;
}

/**
 * Check if a badge condition is met
 */
function checkCondition(condition: BadgeCondition, state: AchievementState): boolean {
  switch (condition.type) {
    case 'level-reached':
      return state.currentLevel >= condition.level;

    case 'marbles-collected':
      return state.totalMarblesCollected >= condition.count;

    case 'subject-mastery':
      return state.subjectMastery[condition.subject] >= condition.mastery;

    case 'all-subjects-mastery':
      return Object.values(state.subjectMastery).every(
        (mastery) => mastery >= condition.mastery
      );

    case 'streak-correct':
      return state.maxCorrectStreak >= condition.count;

    case 'streak-days':
      return state.currentDayStreak >= condition.count;

    case 'perfect-level':
      return state.hadPerfectLevel;

    case 'challenges-completed':
      return state.challengesCompleted >= condition.count;

    case 'play-time':
      return state.totalPlayTimeMinutes >= condition.minutes;

    case 'first-challenge-correct':
      return state.firstChallengeCorrect;

    case 'badge-count':
      return state.earnedBadges.length >= condition.count;

    default:
      return false;
  }
}

/**
 * Calculate progress toward a badge (0-100)
 */
function calculateProgress(
  condition: BadgeCondition,
  state: AchievementState
): { progress: number; progressText: string } {
  switch (condition.type) {
    case 'level-reached': {
      const progress = Math.min((state.currentLevel / condition.level) * 100, 100);
      return {
        progress,
        progressText: `Level ${state.currentLevel}/${condition.level}`,
      };
    }

    case 'marbles-collected': {
      const progress = Math.min(
        (state.totalMarblesCollected / condition.count) * 100,
        100
      );
      return {
        progress,
        progressText: `${state.totalMarblesCollected}/${condition.count} marbles`,
      };
    }

    case 'subject-mastery': {
      const current = state.subjectMastery[condition.subject];
      const progress = Math.min((current / condition.mastery) * 100, 100);
      return {
        progress,
        progressText: `${Math.round(current)}%/${condition.mastery}% mastery`,
      };
    }

    case 'all-subjects-mastery': {
      const masteries = Object.values(state.subjectMastery);
      const avgMastery =
        masteries.reduce((sum, m) => sum + m, 0) / masteries.length;
      const progress = Math.min((avgMastery / condition.mastery) * 100, 100);
      const completed = masteries.filter((m) => m >= condition.mastery).length;
      return {
        progress,
        progressText: `${completed}/7 subjects at ${condition.mastery}%`,
      };
    }

    case 'streak-correct': {
      const progress = Math.min(
        (state.maxCorrectStreak / condition.count) * 100,
        100
      );
      return {
        progress,
        progressText: `Best: ${state.maxCorrectStreak}/${condition.count} in a row`,
      };
    }

    case 'streak-days': {
      const progress = Math.min(
        (state.currentDayStreak / condition.count) * 100,
        100
      );
      return {
        progress,
        progressText: `${state.currentDayStreak}/${condition.count} days`,
      };
    }

    case 'perfect-level':
      return {
        progress: state.hadPerfectLevel ? 100 : 0,
        progressText: state.hadPerfectLevel ? 'Achieved!' : 'Not yet',
      };

    case 'challenges-completed': {
      const progress = Math.min(
        (state.challengesCompleted / condition.count) * 100,
        100
      );
      return {
        progress,
        progressText: `${state.challengesCompleted}/${condition.count} challenges`,
      };
    }

    case 'play-time': {
      const progress = Math.min(
        (state.totalPlayTimeMinutes / condition.minutes) * 100,
        100
      );
      return {
        progress,
        progressText: `${state.totalPlayTimeMinutes}/${condition.minutes} minutes`,
      };
    }

    case 'first-challenge-correct':
      return {
        progress: state.firstChallengeCorrect ? 100 : 0,
        progressText: state.firstChallengeCorrect ? 'Achieved!' : 'Not yet',
      };

    case 'badge-count': {
      const progress = Math.min(
        (state.earnedBadges.length / condition.count) * 100,
        100
      );
      return {
        progress,
        progressText: `${state.earnedBadges.length}/${condition.count} badges`,
      };
    }

    default:
      return { progress: 0, progressText: 'Unknown' };
  }
}

/**
 * Check all badges and return newly earned ones
 */
export function checkForNewBadges(state: AchievementState): Badge[] {
  const earnedIds = new Set(state.earnedBadges.map((eb) => eb.badgeId));
  const newlyEarned: Badge[] = [];

  for (const badge of BADGES) {
    // Skip already earned
    if (earnedIds.has(badge.id)) continue;

    // Check condition
    if (checkCondition(badge.condition, state)) {
      newlyEarned.push(badge);
    }
  }

  return newlyEarned;
}

/**
 * Get progress for all badges
 */
export function getAllBadgeProgress(state: AchievementState): BadgeProgress[] {
  const earnedMap = new Map(
    state.earnedBadges.map((eb) => [eb.badgeId, eb.earnedAt])
  );

  return BADGES.map((badge) => {
    const isEarned = earnedMap.has(badge.id);
    const earnedAt = earnedMap.get(badge.id);
    const { progress, progressText } = isEarned
      ? { progress: 100, progressText: 'Completed!' }
      : calculateProgress(badge.condition, state);

    return {
      badge,
      isEarned,
      earnedAt,
      progress,
      progressText,
    };
  });
}

/**
 * Get recently earned badges (within last session)
 */
export function getRecentBadges(
  earnedBadges: EarnedBadge[],
  sinceTimestamp: number
): Badge[] {
  return earnedBadges
    .filter((eb) => eb.earnedAt >= sinceTimestamp)
    .map((eb) => BADGES.find((b) => b.id === eb.badgeId))
    .filter((b): b is Badge => b !== undefined);
}

/**
 * Get unlockable rewards from a list of badges
 */
export function getUnlockedRewards(badges: Badge[]): Array<{
  badge: Badge;
  reward: NonNullable<Badge['reward']>;
  unlockable?: ReturnType<typeof getUnlockedByBadge>;
}> {
  return badges
    .filter((badge) => badge.reward)
    .map((badge) => ({
      badge,
      reward: badge.reward!,
      unlockable: getUnlockedByBadge(badge.id),
    }));
}

/**
 * Count badges by category
 */
export function countBadgesByCategory(earnedBadges: EarnedBadge[]): Record<string, { earned: number; total: number }> {
  const earnedIds = new Set(earnedBadges.map((eb) => eb.badgeId));
  const counts: Record<string, { earned: number; total: number }> = {};

  for (const badge of BADGES) {
    if (!counts[badge.category]) {
      counts[badge.category] = { earned: 0, total: 0 };
    }
    counts[badge.category].total++;
    if (earnedIds.has(badge.id)) {
      counts[badge.category].earned++;
    }
  }

  return counts;
}

/**
 * Create achievement state from store data
 */
export function createAchievementState(
  gameStore: {
    currentLevel: number;
    totalMarblesCollected: number;
  },
  parentStore: {
    subjectMastery: Array<{ subject: Subject; mastery: number }>;
    recentChallenges: Array<{ correct: boolean }>;
    totalPlayTime: number;
    earnedBadges: EarnedBadge[];
  },
  streakData: {
    currentCorrectStreak: number;
    maxCorrectStreak: number;
    currentDayStreak: number;
  }
): AchievementState {
  // Convert subject mastery array to record
  const subjectMasteryRecord: Record<Subject, number> = {
    colors: 50,
    counting: 50,
    math: 50,
    patterns: 50,
    letters: 50,
    logic: 50,
    memory: 50,
  };
  for (const { subject, mastery } of parentStore.subjectMastery) {
    subjectMasteryRecord[subject] = mastery;
  }

  // Check for perfect level (no wrong answers in current streak)
  const hadPerfectLevel = streakData.maxCorrectStreak >= 3; // Simplified check

  // First challenge correct
  const firstChallengeCorrect =
    parentStore.recentChallenges.length > 0 &&
    parentStore.recentChallenges[0].correct;

  return {
    currentLevel: gameStore.currentLevel,
    totalMarblesCollected: gameStore.totalMarblesCollected,
    challengesCompleted: parentStore.recentChallenges.length,
    totalPlayTimeMinutes: parentStore.totalPlayTime,
    subjectMastery: subjectMasteryRecord,
    currentCorrectStreak: streakData.currentCorrectStreak,
    maxCorrectStreak: streakData.maxCorrectStreak,
    currentDayStreak: streakData.currentDayStreak,
    hadPerfectLevel,
    firstChallengeCorrect,
    earnedBadges: parentStore.earnedBadges,
  };
}

export default {
  checkForNewBadges,
  getAllBadgeProgress,
  getRecentBadges,
  getUnlockedRewards,
  countBadgesByCategory,
  createAchievementState,
};
