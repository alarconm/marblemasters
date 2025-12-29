import { Subject, ChallengeResult } from '@/types';
import { useParentStore } from '@/store/parentStore';

// ============================================
// PROGRESS TRACKER
// Tracks and persists player progress
// ============================================

export interface ProgressSnapshot {
  subjectMastery: Record<Subject, number>;
  recentAccuracy: number;
  totalChallenges: number;
  streak: number;
  lastPlayedAt: number;
}

// Calculate streak (consecutive correct answers)
export function calculateStreak(results: ChallengeResult[]): number {
  let streak = 0;
  for (let i = results.length - 1; i >= 0; i--) {
    if (results[i].correct) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// Calculate recent accuracy (last 10 challenges)
export function calculateRecentAccuracy(results: ChallengeResult[]): number {
  const recent = results.slice(-10);
  if (recent.length === 0) return 0.7; // Default accuracy

  const correct = recent.filter((r) => r.correct).length;
  return correct / recent.length;
}

// Calculate accuracy for a specific subject
export function calculateSubjectAccuracy(
  results: ChallengeResult[],
  subject: Subject
): number {
  const subjectResults = results.filter((r) => r.subject === subject);
  if (subjectResults.length === 0) return 0.5; // Default

  const correct = subjectResults.filter((r) => r.correct).length;
  return correct / subjectResults.length;
}

// Get progress snapshot from parent store
export function getProgressSnapshot(): ProgressSnapshot {
  const state = useParentStore.getState();

  const subjectMastery: Record<Subject, number> = {
    colors: 50,
    counting: 50,
    math: 50,
    patterns: 50,
    letters: 50,
    logic: 50,
    memory: 50,
  };

  state.subjectMastery.forEach((m) => {
    subjectMastery[m.subject] = m.mastery;
  });

  return {
    subjectMastery,
    recentAccuracy: calculateRecentAccuracy(state.recentChallenges),
    totalChallenges: state.recentChallenges.length,
    streak: calculateStreak(state.recentChallenges),
    lastPlayedAt: state.sessionHistory.length > 0
      ? state.sessionHistory[state.sessionHistory.length - 1].date
      : 0,
  };
}

// Record a challenge result to parent store
export function recordProgress(result: ChallengeResult): void {
  const store = useParentStore.getState();
  store.recordChallengeResult(result);
  store.updateMastery(result.subject, result.correct);
}

// Get weakest subjects that need practice
export function getWeakSubjects(limit: number = 2): Subject[] {
  const state = useParentStore.getState();
  const enabledSubjects = Object.entries(state.enabledSubjects)
    .filter(([_, enabled]) => enabled)
    .map(([subject]) => subject as Subject);

  const sorted = [...state.subjectMastery]
    .filter((m) => enabledSubjects.includes(m.subject))
    .sort((a, b) => a.mastery - b.mastery);

  return sorted.slice(0, limit).map((m) => m.subject);
}

// Get strongest subjects
export function getStrongSubjects(limit: number = 2): Subject[] {
  const state = useParentStore.getState();
  const enabledSubjects = Object.entries(state.enabledSubjects)
    .filter(([_, enabled]) => enabled)
    .map(([subject]) => subject as Subject);

  const sorted = [...state.subjectMastery]
    .filter((m) => enabledSubjects.includes(m.subject))
    .sort((a, b) => b.mastery - a.mastery);

  return sorted.slice(0, limit).map((m) => m.subject);
}

// Check if player is frustrated (3+ wrong in a row)
export function isFrustrated(): boolean {
  const state = useParentStore.getState();
  const last3 = state.recentChallenges.slice(-3);
  return last3.length >= 3 && last3.every((r) => !r.correct);
}

// Check if player is in flow state (5+ correct in a row)
export function isInFlow(): boolean {
  const state = useParentStore.getState();
  const last5 = state.recentChallenges.slice(-5);
  return last5.length >= 5 && last5.every((r) => r.correct);
}

export default {
  calculateStreak,
  calculateRecentAccuracy,
  calculateSubjectAccuracy,
  getProgressSnapshot,
  recordProgress,
  getWeakSubjects,
  getStrongSubjects,
  isFrustrated,
  isInFlow,
};
