import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// TUTORIAL STORE
// Manages tutorial state with persistence
// ============================================

export type TutorialStep =
  | 'welcome'
  | 'tap-launcher'
  | 'watch-marble'
  | 'collect-first'
  | 'show-goal'
  | 'free-play'
  | 'complete';

export type AgeGroup = 'toddler' | 'early-reader' | 'reader';

export interface TutorialState {
  // Persistent state
  completedByAge: Record<number, boolean>;

  // Session state
  isActive: boolean;
  currentStep: TutorialStep;
  helpOverlayOpen: boolean;
}

export interface TutorialActions {
  // Actions
  startTutorial: () => void;
  advanceStep: () => void;
  skipTutorial: () => void;
  completeTutorial: (age: number) => void;
  openHelp: () => void;
  closeHelp: () => void;
  shouldShowTutorial: (age: number) => boolean;
  resetTutorialForAge: (age: number) => void;
  getAgeGroup: (age: number) => AgeGroup;
}

export type TutorialStore = TutorialState & TutorialActions;

const TUTORIAL_STEPS: TutorialStep[] = [
  'welcome',
  'tap-launcher',
  'watch-marble',
  'collect-first',
  'show-goal',
  'free-play',
  'complete',
];

export const useTutorialStore = create<TutorialStore>()(
  persist(
    (set, get) => ({
      // Initial state
      completedByAge: {},
      isActive: false,
      currentStep: 'welcome',
      helpOverlayOpen: false,

      // Start tutorial
      startTutorial: () =>
        set({
          isActive: true,
          currentStep: 'welcome',
        }),

      // Advance to next step
      advanceStep: () => {
        const currentIndex = TUTORIAL_STEPS.indexOf(get().currentStep);
        if (currentIndex < TUTORIAL_STEPS.length - 1) {
          set({ currentStep: TUTORIAL_STEPS[currentIndex + 1] });
        }
      },

      // Skip tutorial entirely
      skipTutorial: () =>
        set({
          isActive: false,
          currentStep: 'complete',
        }),

      // Complete tutorial and persist
      completeTutorial: (age: number) =>
        set((state) => ({
          isActive: false,
          currentStep: 'complete',
          completedByAge: {
            ...state.completedByAge,
            [age]: true,
          },
        })),

      // Open help overlay
      openHelp: () => set({ helpOverlayOpen: true }),

      // Close help overlay
      closeHelp: () => set({ helpOverlayOpen: false }),

      // Check if tutorial should show for age
      shouldShowTutorial: (age: number) => {
        const completed = get().completedByAge;

        // Check exact age
        if (completed[age]) return false;

        // Check nearby ages (within 1 year)
        for (const completedAge of Object.keys(completed)) {
          if (completed[parseInt(completedAge)] && Math.abs(parseInt(completedAge) - age) <= 1) {
            return false;
          }
        }

        return true;
      },

      // Reset tutorial for specific age
      resetTutorialForAge: (age: number) =>
        set((state) => ({
          completedByAge: {
            ...state.completedByAge,
            [age]: false,
          },
        })),

      // Get age group for content adaptation
      getAgeGroup: (age: number): AgeGroup => {
        if (age <= 4) return 'toddler';
        if (age <= 6) return 'early-reader';
        return 'reader';
      },
    }),
    {
      name: 'marble-masters-tutorial',
      partialize: (state) => ({
        completedByAge: state.completedByAge,
      }),
    }
  )
);

export default useTutorialStore;
