import { Challenge, Subject, ChallengeResult } from '@/types';
import { getChallengesForAge } from '@/data/challenges';
import { randomChoice, shuffleArray } from '@/utils/mathHelpers';

// ============================================
// EDUCATION ENGINE
// Selects appropriate challenges based on
// age, mastery, and recent performance
// ============================================

const SUBJECTS: Subject[] = [
  'colors',
  'counting',
  'math',
  'patterns',
  'letters',
  'logic',
  'memory',
];

// Get subject weights based on age (some subjects not appropriate for young kids)
function getSubjectWeights(age: number): Record<Subject, number> {
  if (age <= 4) {
    return {
      colors: 3,
      counting: 3,
      math: 0, // Too young
      patterns: 2,
      letters: 1,
      logic: 1,
      memory: 1,
    };
  } else if (age <= 6) {
    return {
      colors: 2,
      counting: 2,
      math: 2,
      patterns: 2,
      letters: 2,
      logic: 1,
      memory: 1,
    };
  } else {
    return {
      colors: 1,
      counting: 1,
      math: 3,
      patterns: 2,
      letters: 2,
      logic: 2,
      memory: 2,
    };
  }
}

// Calculate recent accuracy for a subject
function getRecentAccuracy(
  recentChallenges: ChallengeResult[],
  subject: Subject
): number {
  const subjectResults = recentChallenges.filter(
    (r) => r.subject === subject
  );
  if (subjectResults.length === 0) return 0.7; // Default if no data

  const correct = subjectResults.filter((r) => r.correct).length;
  return correct / subjectResults.length;
}

// Select a subject with variety (don't repeat same subject too often)
function selectSubject(
  age: number,
  recentChallenges: ChallengeResult[],
  enabledSubjects: Record<Subject, boolean>
): Subject {
  const weights = getSubjectWeights(age);

  // Get recently used subjects (last 3)
  const recentSubjects = recentChallenges.slice(-3).map((r) => r.subject);

  // Build weighted list, reducing weight for recently used
  const weightedSubjects: Subject[] = [];
  for (const subject of SUBJECTS) {
    if (!enabledSubjects[subject]) continue;

    let weight = weights[subject];

    // Reduce weight for recently used subjects
    const timesUsed = recentSubjects.filter((s) => s === subject).length;
    weight = Math.max(0, weight - timesUsed);

    // Add subject to list weight times
    for (let i = 0; i < weight; i++) {
      weightedSubjects.push(subject);
    }
  }

  if (weightedSubjects.length === 0) {
    // Fallback: return any enabled subject
    const enabled = SUBJECTS.filter((s) => enabledSubjects[s]);
    return randomChoice(enabled) || 'colors';
  }

  return randomChoice(weightedSubjects);
}

// Determine difficulty adjustment based on performance
function getDifficultyAdjustment(
  recentChallenges: ChallengeResult[],
  subject: Subject
): 'easier' | 'maintain' | 'harder' {
  const accuracy = getRecentAccuracy(recentChallenges, subject);

  // Check for frustration (3+ wrong in a row)
  const last3 = recentChallenges.slice(-3);
  const wrongStreak = last3.filter((r) => !r.correct).length === 3;
  if (wrongStreak) return 'easier';

  // Check for flow (5+ correct in a row)
  const last5 = recentChallenges.slice(-5);
  const correctStreak = last5.every((r) => r.correct) && last5.length >= 5;
  if (correctStreak) return 'harder';

  // Based on accuracy
  if (accuracy > 0.85) return 'harder';
  if (accuracy < 0.6) return 'easier';
  return 'maintain';
}

// Select a challenge for the player
export function selectChallenge(
  age: number,
  recentChallenges: ChallengeResult[],
  enabledSubjects: Record<Subject, boolean>
): Challenge | null {
  // 1. Select subject
  const subject = selectSubject(age, recentChallenges, enabledSubjects);

  // 2. Get available challenges for age and subject
  const available = getChallengesForAge(age).filter(
    (c) => c.subject === subject
  );

  if (available.length === 0) {
    // Try any subject
    const anyAvailable = getChallengesForAge(age);
    if (anyAvailable.length === 0) return null;
    return randomChoice(anyAvailable);
  }

  // 3. Determine difficulty adjustment
  const adjustment = getDifficultyAdjustment(recentChallenges, subject);

  // 4. Filter by difficulty
  let filtered = available;
  if (adjustment === 'easier') {
    filtered = available.filter((c) => c.difficulty <= 1) || available;
  } else if (adjustment === 'harder') {
    const harder = available.filter((c) => c.difficulty >= 2);
    filtered = harder.length > 0 ? harder : available;
  }

  // 5. Avoid recently used challenges
  const recentIds = recentChallenges.slice(-10).map((r) => r.challengeId);
  const fresh = filtered.filter((c) => !recentIds.includes(c.id));

  const pool = fresh.length > 0 ? fresh : filtered;

  // 6. Select random challenge from pool
  return randomChoice(pool) || available[0];
}

// Shuffle challenge options (so correct answer isn't always in same position)
export function shuffleChallengeOptions(challenge: Challenge): Challenge {
  return {
    ...challenge,
    options: shuffleArray(challenge.options),
  };
}

// Check if an answer is correct
export function checkAnswer(
  challenge: Challenge,
  answer: string | number
): boolean {
  return String(challenge.correctAnswer) === String(answer);
}

// Calculate mastery update based on result
export function calculateMasteryChange(
  currentMastery: number,
  correct: boolean,
  difficulty: number
): number {
  if (correct) {
    // Increase mastery (more for harder challenges)
    const gain = difficulty * 2 + 1;
    return Math.min(100, currentMastery + gain);
  } else {
    // Slight decrease (not punishing)
    return Math.max(0, currentMastery - 1);
  }
}

export default {
  selectChallenge,
  shuffleChallengeOptions,
  checkAnswer,
  calculateMasteryChange,
};
