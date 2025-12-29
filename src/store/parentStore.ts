import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subject, ChallengeResult } from '@/types';

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
        }),
    }),
    {
      name: 'marble-masters-parent',
    }
  )
);

export default useParentStore;
