import { Badge, Unlockable } from '@/types';

// ============================================
// BADGE DEFINITIONS
// 25 badges across 5 categories
// ============================================

export const BADGES: Badge[] = [
  // ============================================
  // MILESTONE BADGES (5)
  // Level progression achievements
  // ============================================
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first level',
    icon: '🎯',
    category: 'milestone',
    rarity: 'common',
    condition: { type: 'level-reached', level: 1 },
  },
  {
    id: 'rising-star',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    category: 'milestone',
    rarity: 'common',
    condition: { type: 'level-reached', level: 5 },
  },
  {
    id: 'marble-expert',
    name: 'Marble Expert',
    description: 'Reach level 15',
    icon: '🏆',
    category: 'milestone',
    rarity: 'rare',
    condition: { type: 'level-reached', level: 15 },
    reward: { type: 'theme', value: 'ocean-depths' },
  },
  {
    id: 'marble-master',
    name: 'Marble Master',
    description: 'Reach level 30',
    icon: '👑',
    category: 'milestone',
    rarity: 'epic',
    condition: { type: 'level-reached', level: 30 },
    reward: { type: 'marble-skin', value: 'gold' },
  },
  {
    id: 'marble-legend',
    name: 'Marble Legend',
    description: 'Reach level 50',
    icon: '🌟',
    category: 'milestone',
    rarity: 'legendary',
    condition: { type: 'level-reached', level: 50 },
    reward: { type: 'marble-skin', value: 'galaxy' },
  },

  // ============================================
  // COLLECTION BADGES (5)
  // Marble collection achievements
  // ============================================
  {
    id: 'collector',
    name: 'Collector',
    description: 'Collect 50 marbles',
    icon: '🔵',
    category: 'collection',
    rarity: 'common',
    condition: { type: 'marbles-collected', count: 50 },
  },
  {
    id: 'marble-hoarder',
    name: 'Marble Hoarder',
    description: 'Collect 250 marbles',
    icon: '💎',
    category: 'collection',
    rarity: 'rare',
    condition: { type: 'marbles-collected', count: 250 },
  },
  {
    id: 'treasure-hunter',
    name: 'Treasure Hunter',
    description: 'Collect 500 marbles',
    icon: '🏅',
    category: 'collection',
    rarity: 'rare',
    condition: { type: 'marbles-collected', count: 500 },
    reward: { type: 'marble-skin', value: 'crystal' },
  },
  {
    id: 'marble-tycoon',
    name: 'Marble Tycoon',
    description: 'Collect 1,000 marbles',
    icon: '💰',
    category: 'collection',
    rarity: 'epic',
    condition: { type: 'marbles-collected', count: 1000 },
    reward: { type: 'theme', value: 'jungle-adventure' },
  },
  {
    id: 'marble-mogul',
    name: 'Marble Mogul',
    description: 'Collect 2,500 marbles',
    icon: '🎪',
    category: 'collection',
    rarity: 'legendary',
    condition: { type: 'marbles-collected', count: 2500 },
    reward: { type: 'marble-skin', value: 'rainbow' },
  },

  // ============================================
  // MASTERY BADGES (7)
  // Subject-specific achievements
  // ============================================
  {
    id: 'color-champion',
    name: 'Color Champion',
    description: 'Master colors with 80% accuracy',
    icon: '🎨',
    category: 'mastery',
    rarity: 'rare',
    condition: { type: 'subject-mastery', subject: 'colors', mastery: 80 },
  },
  {
    id: 'counting-whiz',
    name: 'Counting Whiz',
    description: 'Master counting with 80% accuracy',
    icon: '🔢',
    category: 'mastery',
    rarity: 'rare',
    condition: { type: 'subject-mastery', subject: 'counting', mastery: 80 },
  },
  {
    id: 'math-genius',
    name: 'Math Genius',
    description: 'Master math with 80% accuracy',
    icon: '➕',
    category: 'mastery',
    rarity: 'rare',
    condition: { type: 'subject-mastery', subject: 'math', mastery: 80 },
    reward: { type: 'points', value: 500 },
  },
  {
    id: 'pattern-pro',
    name: 'Pattern Pro',
    description: 'Master patterns with 80% accuracy',
    icon: '🔷',
    category: 'mastery',
    rarity: 'rare',
    condition: { type: 'subject-mastery', subject: 'patterns', mastery: 80 },
  },
  {
    id: 'letter-learner',
    name: 'Letter Learner',
    description: 'Master letters with 80% accuracy',
    icon: '📝',
    category: 'mastery',
    rarity: 'rare',
    condition: { type: 'subject-mastery', subject: 'letters', mastery: 80 },
  },
  {
    id: 'logic-lord',
    name: 'Logic Lord',
    description: 'Master logic with 80% accuracy',
    icon: '🧩',
    category: 'mastery',
    rarity: 'rare',
    condition: { type: 'subject-mastery', subject: 'logic', mastery: 80 },
  },
  {
    id: 'memory-master',
    name: 'Memory Master',
    description: 'Master memory with 80% accuracy',
    icon: '🧠',
    category: 'mastery',
    rarity: 'rare',
    condition: { type: 'subject-mastery', subject: 'memory', mastery: 80 },
    reward: { type: 'marble-skin', value: 'neon' },
  },

  // ============================================
  // STREAK BADGES (4)
  // Consistency achievements
  // ============================================
  {
    id: 'hot-streak',
    name: 'Hot Streak',
    description: 'Get 5 answers correct in a row',
    icon: '🔥',
    category: 'streak',
    rarity: 'common',
    condition: { type: 'streak-correct', count: 5 },
  },
  {
    id: 'on-fire',
    name: 'On Fire',
    description: 'Get 10 answers correct in a row',
    icon: '🌋',
    category: 'streak',
    rarity: 'rare',
    condition: { type: 'streak-correct', count: 10 },
    reward: { type: 'marble-skin', value: 'lava' },
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Get 20 answers correct in a row',
    icon: '💥',
    category: 'streak',
    rarity: 'epic',
    condition: { type: 'streak-correct', count: 20 },
    reward: { type: 'theme', value: 'arctic-frost' },
  },
  {
    id: 'weekly-warrior',
    name: 'Weekly Warrior',
    description: 'Play 7 days in a row',
    icon: '📆',
    category: 'streak',
    rarity: 'epic',
    condition: { type: 'streak-days', count: 7 },
    reward: { type: 'marble-skin', value: 'ice' },
  },

  // ============================================
  // SPECIAL BADGES (4)
  // Unique achievements
  // ============================================
  {
    id: 'perfect-run',
    name: 'Perfect Run',
    description: 'Complete a level with no wrong answers',
    icon: '✨',
    category: 'special',
    rarity: 'rare',
    condition: { type: 'perfect-level' },
  },
  {
    id: 'brainiac',
    name: 'Brainiac',
    description: 'Get 80%+ mastery in all subjects',
    icon: '🎓',
    category: 'special',
    rarity: 'legendary',
    condition: { type: 'all-subjects-mastery', mastery: 80 },
    reward: { type: 'theme', value: 'volcano-blast' },
  },
  {
    id: 'challenge-champion',
    name: 'Challenge Champion',
    description: 'Complete 50 challenges',
    icon: '🎖️',
    category: 'special',
    rarity: 'rare',
    condition: { type: 'challenges-completed', count: 50 },
  },
  {
    id: 'dedicated-player',
    name: 'Dedicated Player',
    description: 'Play for 60 minutes total',
    icon: '⏰',
    category: 'special',
    rarity: 'rare',
    condition: { type: 'play-time', minutes: 60 },
  },
];

// ============================================
// UNLOCKABLE THEMES & SKINS
// ============================================

export const UNLOCKABLES: Unlockable[] = [
  // Themes
  {
    id: 'ocean-depths',
    type: 'theme',
    name: 'Ocean Depths',
    description: 'Dive into an underwater marble adventure',
    preview: 'linear-gradient(180deg, #006994 0%, #0077B6 50%, #00B4D8 100%)',
    unlockCondition: { type: 'badge', badgeId: 'marble-expert' },
  },
  {
    id: 'jungle-adventure',
    type: 'theme',
    name: 'Jungle Adventure',
    description: 'Explore the wild jungle tracks',
    preview: 'linear-gradient(180deg, #2D5A27 0%, #4A7C59 50%, #8FBC8F 100%)',
    unlockCondition: { type: 'badge', badgeId: 'marble-tycoon' },
  },
  {
    id: 'arctic-frost',
    type: 'theme',
    name: 'Arctic Frost',
    description: 'Slide through icy wonderlands',
    preview: 'linear-gradient(180deg, #B8D4E3 0%, #E8F4F8 50%, #F0F8FF 100%)',
    unlockCondition: { type: 'badge', badgeId: 'unstoppable' },
  },
  {
    id: 'volcano-blast',
    type: 'theme',
    name: 'Volcano Blast',
    description: 'Navigate through fiery volcanic tracks',
    preview: 'linear-gradient(180deg, #8B0000 0%, #FF4500 50%, #FFD700 100%)',
    unlockCondition: { type: 'badge', badgeId: 'brainiac' },
  },

  // Marble Skins
  {
    id: 'skin-galaxy',
    type: 'marble-skin',
    name: 'Galaxy Marble',
    description: 'A marble filled with stars',
    preview: 'radial-gradient(circle, #1a1a2e 0%, #4a148c 50%, #311b92 100%)',
    unlockCondition: { type: 'badge', badgeId: 'marble-legend' },
  },
  {
    id: 'skin-rainbow',
    type: 'marble-skin',
    name: 'Rainbow Marble',
    description: 'All the colors of the rainbow',
    preview: 'linear-gradient(90deg, red, orange, yellow, green, blue, purple)',
    unlockCondition: { type: 'badge', badgeId: 'marble-mogul' },
  },
  {
    id: 'skin-gold',
    type: 'marble-skin',
    name: 'Golden Marble',
    description: 'A shiny golden marble',
    preview: 'radial-gradient(circle, #FFD700 0%, #DAA520 50%, #B8860B 100%)',
    unlockCondition: { type: 'badge', badgeId: 'marble-master' },
  },
  {
    id: 'skin-crystal',
    type: 'marble-skin',
    name: 'Crystal Marble',
    description: 'A sparkling crystal marble',
    preview: 'radial-gradient(circle, #E0FFFF 0%, #87CEEB 50%, #4169E1 100%)',
    unlockCondition: { type: 'badge', badgeId: 'treasure-hunter' },
  },
  {
    id: 'skin-lava',
    type: 'marble-skin',
    name: 'Lava Marble',
    description: 'A hot molten marble',
    preview: 'radial-gradient(circle, #FF4500 0%, #FF0000 50%, #8B0000 100%)',
    unlockCondition: { type: 'badge', badgeId: 'on-fire' },
  },
  {
    id: 'skin-ice',
    type: 'marble-skin',
    name: 'Ice Marble',
    description: 'A frozen icy marble',
    preview: 'radial-gradient(circle, #FFFFFF 0%, #ADD8E6 50%, #87CEEB 100%)',
    unlockCondition: { type: 'badge', badgeId: 'weekly-warrior' },
  },
  {
    id: 'skin-neon',
    type: 'marble-skin',
    name: 'Neon Marble',
    description: 'A glowing neon marble',
    preview: 'radial-gradient(circle, #00FF00 0%, #00FFFF 50%, #FF00FF 100%)',
    unlockCondition: { type: 'badge', badgeId: 'memory-master' },
  },
];

// Helper functions
export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find((badge) => badge.id === id);
}

export function getBadgesByCategory(category: Badge['category']): Badge[] {
  return BADGES.filter((badge) => badge.category === category);
}

export function getUnlockableById(id: string): Unlockable | undefined {
  return UNLOCKABLES.find((item) => item.id === id);
}

export function getUnlockedByBadge(badgeId: string): Unlockable | undefined {
  return UNLOCKABLES.find(
    (item) => item.unlockCondition.type === 'badge' && item.unlockCondition.badgeId === badgeId
  );
}

// Category display names
export const BADGE_CATEGORY_NAMES: Record<Badge['category'], string> = {
  milestone: 'Milestones',
  collection: 'Collection',
  mastery: 'Subject Mastery',
  streak: 'Streaks',
  special: 'Special',
};

// Rarity colors for UI
export const RARITY_COLORS: Record<Badge['rarity'], { bg: string; text: string; border: string }> = {
  common: { bg: '#E5E7EB', text: '#374151', border: '#9CA3AF' },
  rare: { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' },
  epic: { bg: '#F3E8FF', text: '#7C3AED', border: '#8B5CF6' },
  legendary: { bg: '#FEF3C7', text: '#D97706', border: '#F59E0B' },
};
