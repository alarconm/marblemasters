import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subject, ChallengeResult, EarnedBadge, LevelStars, MarbleSkin } from '@/types';

// ============================================
// PARENT STORE
// Persisted settings and progress data
// ============================================

interface SessionRecord {
  date: number;
  duration: number; // minutes
  challengesCompleted: number;
  correctAnswers: number;
  levelsCompleted: number;
}

interface SubjectMastery {
  subject: Subject;
  mastery: number; // 0-100
  totalAttempts: number;
  correctAttempts: number;
}

interface ParentStore {
  // PIN Protection
  pin: string;
  isPinSet: boolean;

  // Child Settings
  childName: string;
  childAge: number;
  difficultyBias: 'easier' | 'normal' | 'harder';

  // Challenge Settings
  challengeFrequency: 1 | 2 | 3; // Every N levels
  enabledSubjects: Record<Subject, boolean>;
  voicePromptsEnabled: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;

  // Session Limits
  sessionTimeLimit: number; // minutes, 0 = unlimited
  breakReminderInterval: number; // minutes, 0 = disabled

  // Progress Data
  subjectMastery: SubjectMastery[];
  recentChallenges: ChallengeResult[];
  sessionHistory: SessionRecord[];
  totalPlayTime: number; // minutes
  currentSessionStart: number | null;

  // Achievement Data
  earnedBadges: EarnedBadge[];
  levelStars: LevelStars[];
  totalMarblesCollected: number;
  currentCorrectStreak: number;
  maxCorrectStreak: number;
  currentDayStreak: number;
  lastPlayedDate: string | null; // YYYY-MM-DD
  hadPerfectLevel: boolean;
  unlockedThemes: string[];
  unlockedSkins: MarbleSkin[];
  selectedSkin: MarbleSkin;

  // Actions
  setPin: (pin: string) => void;
  verifyPin: (pin: string) => boolean;
  updateChildSettings: (name: string, age: number) => void;
  setDifficultyBias: (bias: 'easier' | 'normal' | 'harder') => void;
  setChallengeFrequency: (freq: 1 | 2 | 3) => void;
  toggleSubject: (subject: Subject) => void;
  setVoicePrompts: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setSessionTimeLimit: (minutes: number) => void;
  setBreakReminder: (minutes: number) => void;
  recordChallengeResult: (result: ChallengeResult) => void;
  updateMastery: (subject: Subject, correct: boolean) => void;
  startSession: () => void;
  endSession: (challengesCompleted: number, correctAnswers: number, levelsCompleted: number) => void;
  resetProgress: () => void;

  // Achievement Actions
  earnBadge: (badgeId: string) => void;
  setLevelStars: (level: number, stars: 1 | 2 | 3, perfectRun: boolean, challengeCorrect: boolean) => void;
  addMarblesCollected: (count: number) => void;
  updateStreak: (correct: boolean) => void;
  updateDayStreak: () => void;
  setPerfectLevel: () => void;
  unlockTheme: (themeId: string) => void;
  unlockSkin: (skin: MarbleSkin) => void;
  setSelectedSkin: (skin: MarbleSkin) => void;
}

const defaultSubjects: Record<Subject, boolean> = {
  colors: true,
  counting: true,
  math: true,
  patterns: true,
  letters: true,
  logic: true,
  memory: true,
};

const initialMastery: SubjectMastery[] = [
  { subject: 'colors', mastery: 50, totalAttempts: 0, correctAttempts: 0 },
  { subject: 'counting', mastery: 50, totalAttempts: 0, correctAttempts: 0 },
  { subject: 'math', mastery: 50, totalAttempts: 0, correctAttempts: 0 },
  { subject: 'patterns', mastery: 50, totalAttempts: 0, correctAttempts: 0 },
  { subject: 'letters', mastery: 50, totalAttempts: 0, correctAttempts: 0 },
  { subject: 'logic', mastery: 50, totalAttempts: 0, correctAttempts: 0 },
  { subject: 'memory', mastery: 50, totalAttempts: 0, correctAttempts: 0 },
];

export const useParentStore = create<ParentStore>()(
  persist(
    (set, get) => ({
      // Initial state
      pin: '0000',
      isPinSet: false,
      childName: '',
      childAge: 5,
      difficultyBias: 'normal',
      challengeFrequency: 1,
      enabledSubjects: { ...defaultSubjects },
      voicePromptsEnabled: true,
      soundEnabled: true,
      musicEnabled: false,
      sessionTimeLimit: 30,
      breakReminderInterval: 15,
      subjectMastery: [...initialMastery],
      recentChallenges: [],
      sessionHistory: [],
      totalPlayTime: 0,
      currentSessionStart: null,

      // Achievement initial state
      earnedBadges: [],
      levelStars: [],
      totalMarblesCollected: 0,
      currentCorrectStreak: 0,
      maxCorrectStreak: 0,
      currentDayStreak: 0,
      lastPlayedDate: null,
      hadPerfectLevel: false,
      unlockedThemes: [],
      unlockedSkins: ['classic'],
      selectedSkin: 'classic',

      // Actions
      setPin: (pin) => set({ pin, isPinSet: true }),

      verifyPin: (pin) => get().pin === pin,

      updateChildSettings: (name, age) => set({ childName: name, childAge: age }),

      setDifficultyBias: (bias) => set({ difficultyBias: bias }),

      setChallengeFrequency: (freq) => set({ challengeFrequency: freq }),

      toggleSubject: (subject) => {
        const current = get().enabledSubjects;
        // Ensure at least one subject stays enabled
        const enabledCount = Object.values(current).filter(Boolean).length;
        if (enabledCount <= 1 && current[subject]) return;

        set({
          enabledSubjects: {
            ...current,
            [subject]: !current[subject],
          },
        });
      },

      setVoicePrompts: (enabled) => set({ voicePromptsEnabled: enabled }),

      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      setMusicEnabled: (enabled) => set({ musicEnabled: enabled }),

      setSessionTimeLimit: (minutes) => set({ sessionTimeLimit: minutes }),

      setBreakReminder: (minutes) => set({ breakReminderInterval: minutes }),

      recordChallengeResult: (result) => {
        const current = get().recentChallenges;
        set({
          recentChallenges: [...current.slice(-49), result],
        });
      },

      updateMastery: (subject, correct) => {
        const current = get().subjectMastery;
        const updated = current.map((m) => {
          if (m.subject !== subject) return m;

          const newTotal = m.totalAttempts + 1;
          const newCorrect = m.correctAttempts + (correct ? 1 : 0);
          const accuracy = newCorrect / newTotal;

          // Mastery moves toward accuracy, weighted by attempts
          const weight = Math.min(newTotal / 20, 1); // Full weight after 20 attempts
          const newMastery = Math.round(
            m.mastery * (1 - weight * 0.1) + accuracy * 100 * weight * 0.1
          );

          return {
            ...m,
            mastery: Math.max(0, Math.min(100, newMastery)),
            totalAttempts: newTotal,
            correctAttempts: newCorrect,
          };
        });

        set({ subjectMastery: updated });
      },

      startSession: () => set({ currentSessionStart: Date.now() }),

      endSession: (challengesCompleted, correctAnswers, levelsCompleted) => {
        const state = get();
        if (!state.currentSessionStart) return;

        const duration = Math.round(
          (Date.now() - state.currentSessionStart) / 60000
        );

        const record: SessionRecord = {
          date: Date.now(),
          duration,
          challengesCompleted,
          correctAnswers,
          levelsCompleted,
        };

        set({
          sessionHistory: [...state.sessionHistory.slice(-29), record],
          totalPlayTime: state.totalPlayTime + duration,
          currentSessionStart: null,
        });
      },

      resetProgress: () =>
        set({
          subjectMastery: [...initialMastery],
          recentChallenges: [],
          sessionHistory: [],
          totalPlayTime: 0,
          earnedBadges: [],
          levelStars: [],
          totalMarblesCollected: 0,
          currentCorrectStreak: 0,
          maxCorrectStreak: 0,
          currentDayStreak: 0,
          hadPerfectLevel: false,
        }),

      // Achievement Actions
      earnBadge: (badgeId) => {
        const state = get();
        // Don't earn same badge twice
        if (state.earnedBadges.some((eb) => eb.badgeId === badgeId)) return;

        set({
          earnedBadges: [
            ...state.earnedBadges,
            { badgeId, earnedAt: Date.now() },
          ],
        });
      },

      setLevelStars: (level, stars, perfectRun, challengeCorrect) => {
        const state = get();
        const existing = state.levelStars.find((ls) => ls.level === level);

        if (existing) {
          // Only update if new stars are higher
          if (stars > existing.stars) {
            set({
              levelStars: state.levelStars.map((ls) =>
                ls.level === level
                  ? { level, stars, perfectRun, challengeCorrect }
                  : ls
              ),
            });
          }
        } else {
          set({
            levelStars: [
              ...state.levelStars,
              { level, stars, perfectRun, challengeCorrect },
            ],
          });
        }
      },

      addMarblesCollected: (count) => {
        set((state) => ({
          totalMarblesCollected: state.totalMarblesCollected + count,
        }));
      },

      updateStreak: (correct) => {
        const state = get();
        if (correct) {
          const newStreak = state.currentCorrectStreak + 1;
          set({
            currentCorrectStreak: newStreak,
            maxCorrectStreak: Math.max(newStreak, state.maxCorrectStreak),
          });
        } else {
          set({ currentCorrectStreak: 0 });
        }
      },

      updateDayStreak: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        if (!state.lastPlayedDate) {
          // First time playing
          set({ currentDayStreak: 1, lastPlayedDate: today });
          return;
        }

        const lastDate = new Date(state.lastPlayedDate);
        const todayDate = new Date(today);
        const diffDays = Math.floor(
          (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) {
          // Same day, no change
          return;
        } else if (diffDays === 1) {
          // Consecutive day
          set({
            currentDayStreak: state.currentDayStreak + 1,
            lastPlayedDate: today,
          });
        } else {
          // Streak broken
          set({ currentDayStreak: 1, lastPlayedDate: today });
        }
      },

      setPerfectLevel: () => {
        set({ hadPerfectLevel: true });
      },

      unlockTheme: (themeId) => {
        const state = get();
        if (state.unlockedThemes.includes(themeId)) return;
        set({ unlockedThemes: [...state.unlockedThemes, themeId] });
      },

      unlockSkin: (skin) => {
        const state = get();
        if (state.unlockedSkins.includes(skin)) return;
        set({ unlockedSkins: [...state.unlockedSkins, skin] });
      },

      setSelectedSkin: (skin) => {
        set({ selectedSkin: skin });
      },
    }),
    {
      name: 'marble-masters-parent',
    }
  )
);

export default useParentStore;
