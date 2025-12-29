// ============================================
// CORE GEOMETRY TYPES
// ============================================

export interface Vector2 {
  x: number;
  y: number;
}

export interface BezierPoint {
  x: number;
  y: number;
  controlIn?: Vector2;
  controlOut?: Vector2;
}

export interface BezierPath {
  points: BezierPoint[];
  length: number;
}

// ============================================
// TRACK TYPES
// ============================================

export type TrackSegmentType =
  | 'straight'
  | 'curve-left'
  | 'curve-right'
  | 'spiral'
  | 'loop'
  | 'funnel'
  | 'split'
  | 'jump'
  | 'tube';

export interface TrackSegment {
  id: string;
  type: TrackSegmentType;
  path: BezierPath;
  width: number;
  friction: number;
  bounciness: number;
  entryPoint: Vector2;
  exitPoint: Vector2;
  nextSegments: string[];
  theme: TrackTheme;
}

export type TrackTheme =
  | 'wooden-classic'
  | 'rainbow-candy'
  | 'space-station';

export interface ThemeColors {
  trackFill: string;
  trackStroke: string;
  background: string;
  bucketFill: string;
  bucketStroke: string;
  accent: string;
}

// ============================================
// MARBLE TYPES
// ============================================

export type MarbleState = 'waiting' | 'falling' | 'on-track' | 'airborne' | 'collected';

export type MarbleColor =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'cyan';

export interface Marble {
  id: string;
  position: Vector2;
  velocity: Vector2;
  speed: number;
  angularVelocity: number;
  radius: number;
  mass: number;
  color: MarbleColor;
  currentTrackSegment: string | null;
  trackProgress: number;
  state: MarbleState;
  rotation: number;
}

// ============================================
// BUCKET TYPES
// ============================================

export interface Bucket {
  id: string;
  position: Vector2;
  width: number;
  height: number;
  label?: string | number;
  isCorrect?: boolean;
  theme: TrackTheme;
}

// ============================================
// GAME STATE TYPES
// ============================================

export interface GameLevel {
  level: number;
  track: TrackSegment[];
  buckets: Bucket[];
  marblesRequired: number;
  theme: TrackTheme;
  challenge?: Challenge;
}

export interface GameState {
  currentLevel: number;
  score: number;
  marblesDropped: number;
  marblesCollected: number;
  marblesRequired: number;
  marbles: Marble[];
  track: TrackSegment[];
  buckets: Bucket[];
  theme: TrackTheme;
  isPlaying: boolean;
  isPaused: boolean;
  showCelebration: boolean;
  showChallenge: boolean;
  currentChallenge: Challenge | null;
  nextMarbleColors: MarbleColor[];
}

// ============================================
// EDUCATION TYPES
// ============================================

export type Subject =
  | 'colors'
  | 'counting'
  | 'math'
  | 'patterns'
  | 'letters'
  | 'logic'
  | 'memory';

export type ChallengeType =
  | 'tap-color'
  | 'count-marbles'
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'pattern-complete'
  | 'letter-match'
  | 'odd-one-out'
  | 'memory-sequence';

export interface ChallengeOption {
  id: string;
  value: string | number;
  label: string;
  color?: MarbleColor;
  isCorrect: boolean;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  subject: Subject;
  ageMin: number;
  ageMax: number;
  difficulty: number;
  prompt: string;
  voicePrompt?: string;
  options: ChallengeOption[];
  correctAnswer: string | number;
  showMarbles?: boolean;
  marbleCount?: number;
  memorySequence?: MarbleColor[];
}

export interface ChallengeResult {
  challengeId: string;
  subject: Subject;
  correct: boolean;
  responseTime: number;
  timestamp: number;
}

// ============================================
// PLAYER PROFILE TYPES
// ============================================

export interface SubjectMastery {
  colors: number;
  counting: number;
  math: number;
  patterns: number;
  letters: number;
  logic: number;
  memory: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  age: number;
  currentLevel: number;
  totalScore: number;
  subjectMastery: SubjectMastery;
  recentChallenges: ChallengeResult[];
  totalPlayTime: number;
  streakDays: number;
  lastPlayed: number;
}

// ============================================
// PARENT SETTINGS TYPES
// ============================================

export interface ParentSettings {
  pin: string;
  ageOverride: number | null;
  difficultyBias: 'easier' | 'normal' | 'challenging';
  challengeFrequency: 1 | 2 | 3;
  sessionTimeLimit: number | null;
  breakReminders: boolean;
  voicePromptsEnabled: boolean;
  enabledSubjects: Record<Subject, boolean>;
  soundEnabled: boolean;
  musicEnabled: boolean;
}

// ============================================
// PHYSICS CONSTANTS
// ============================================

export const PHYSICS = {
  GRAVITY: 400,          // Gentler gravity for kids
  MIN_SPEED: 80,         // Slow, watchable marble movement
  MAX_SPEED: 250,        // Still leisurely at max
  DEFAULT_FRICTION: 0.02,
  MARBLE_RADIUS: 16,     // Slightly smaller marbles
  MARBLE_MASS: 1,
  TRACK_WIDTH: 44,       // Track width for visual appeal
} as const;

// ============================================
// COLOR DEFINITIONS
// ============================================

export const MARBLE_COLORS: Record<MarbleColor, string> = {
  red: '#E53935',
  blue: '#1E88E5',
  green: '#43A047',
  yellow: '#FDD835',
  purple: '#8E24AA',
  orange: '#FB8C00',
  pink: '#EC407A',
  cyan: '#00ACC1',
};

export const THEME_COLORS: Record<TrackTheme, ThemeColors> = {
  'wooden-classic': {
    trackFill: '#A0522D',
    trackStroke: '#5D3A1A',
    background: 'linear-gradient(180deg, #87CEEB 0%, #E0F7FA 50%, #8BC34A 100%)',
    bucketFill: '#DAA520',
    bucketStroke: '#8B6914',
    accent: '#FFD700',
  },
  'rainbow-candy': {
    trackFill: '#FF69B4',
    trackStroke: '#FF1493',
    background: 'linear-gradient(180deg, #FFE5EC 0%, #FFECD2 50%, #FCB69F 100%)',
    bucketFill: '#FF6B6B',
    bucketStroke: '#EE5A5A',
    accent: '#FFE66D',
  },
  'space-station': {
    trackFill: '#4A5568',
    trackStroke: '#2D3748',
    background: 'linear-gradient(180deg, #0F0C29 0%, #302B63 50%, #24243E 100%)',
    bucketFill: '#38B2AC',
    bucketStroke: '#2C7A7B',
    accent: '#F6E05E',
  },
};

// ============================================
// ACHIEVEMENT & BADGE TYPES
// ============================================

export type BadgeCategory =
  | 'milestone'
  | 'collection'
  | 'mastery'
  | 'streak'
  | 'special';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  // Condition to unlock (evaluated by achievement checker)
  condition: BadgeCondition;
  // Optional reward for unlocking
  reward?: {
    type: 'theme' | 'marble-skin' | 'points';
    value: string | number;
  };
}

export type BadgeCondition =
  | { type: 'level-reached'; level: number }
  | { type: 'marbles-collected'; count: number }
  | { type: 'subject-mastery'; subject: Subject; mastery: number }
  | { type: 'all-subjects-mastery'; mastery: number }
  | { type: 'streak-correct'; count: number }
  | { type: 'streak-days'; count: number }
  | { type: 'perfect-level' }
  | { type: 'challenges-completed'; count: number }
  | { type: 'play-time'; minutes: number }
  | { type: 'first-challenge-correct' }
  | { type: 'badge-count'; count: number };

export interface EarnedBadge {
  badgeId: string;
  earnedAt: number;
}

export type StarRating = 0 | 1 | 2 | 3;

export interface LevelStars {
  level: number;
  stars: StarRating;
  perfectRun: boolean;
  challengeCorrect: boolean;
}

// ============================================
// UNLOCKABLE CONTENT TYPES
// ============================================

export type UnlockableType = 'theme' | 'marble-skin';

export interface Unlockable {
  id: string;
  type: UnlockableType;
  name: string;
  description: string;
  preview: string; // Color or image preview
  // How to unlock
  unlockCondition:
    | { type: 'badge'; badgeId: string }
    | { type: 'badge-count'; count: number }
    | { type: 'level'; level: number };
}

export type MarbleSkin =
  | 'classic'
  | 'galaxy'
  | 'rainbow'
  | 'gold'
  | 'crystal'
  | 'lava'
  | 'ice'
  | 'neon';
