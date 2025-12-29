import { Challenge, MarbleColor, Subject } from '@/types';

// ============================================
// CHALLENGE DATA BY SUBJECT AND AGE
// Curriculum designed for ages 3-10
// ============================================

// Helper to create challenge IDs
let challengeCounter = 0;
const createId = () => `challenge-${++challengeCounter}`;

// ============================================
// COLOR CHALLENGES
// ============================================

export const colorChallenges: Challenge[] = [
  // Age 3-4: Basic color recognition
  {
    id: createId(),
    type: 'tap-color',
    subject: 'colors',
    ageMin: 3,
    ageMax: 4,
    difficulty: 1,
    prompt: 'Tap the RED marble!',
    voicePrompt: 'Tap the red marble!',
    options: [
      { id: '1', value: 'red', label: 'Red', color: 'red', isCorrect: true },
      { id: '2', value: 'blue', label: 'Blue', color: 'blue', isCorrect: false },
      { id: '3', value: 'green', label: 'Green', color: 'green', isCorrect: false },
      { id: '4', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: false },
    ],
    correctAnswer: 'red',
    showMarbles: true,
  },
  {
    id: createId(),
    type: 'tap-color',
    subject: 'colors',
    ageMin: 3,
    ageMax: 4,
    difficulty: 1,
    prompt: 'Tap the BLUE marble!',
    voicePrompt: 'Tap the blue marble!',
    options: [
      { id: '1', value: 'red', label: 'Red', color: 'red', isCorrect: false },
      { id: '2', value: 'blue', label: 'Blue', color: 'blue', isCorrect: true },
      { id: '3', value: 'green', label: 'Green', color: 'green', isCorrect: false },
      { id: '4', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: false },
    ],
    correctAnswer: 'blue',
    showMarbles: true,
  },
  {
    id: createId(),
    type: 'tap-color',
    subject: 'colors',
    ageMin: 3,
    ageMax: 4,
    difficulty: 1,
    prompt: 'Tap the GREEN marble!',
    voicePrompt: 'Tap the green marble!',
    options: [
      { id: '1', value: 'red', label: 'Red', color: 'red', isCorrect: false },
      { id: '2', value: 'blue', label: 'Blue', color: 'blue', isCorrect: false },
      { id: '3', value: 'green', label: 'Green', color: 'green', isCorrect: true },
      { id: '4', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: false },
    ],
    correctAnswer: 'green',
    showMarbles: true,
  },
  {
    id: createId(),
    type: 'tap-color',
    subject: 'colors',
    ageMin: 3,
    ageMax: 4,
    difficulty: 1,
    prompt: 'Tap the YELLOW marble!',
    voicePrompt: 'Tap the yellow marble!',
    options: [
      { id: '1', value: 'red', label: 'Red', color: 'red', isCorrect: false },
      { id: '2', value: 'blue', label: 'Blue', color: 'blue', isCorrect: false },
      { id: '3', value: 'green', label: 'Green', color: 'green', isCorrect: false },
      { id: '4', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: true },
    ],
    correctAnswer: 'yellow',
    showMarbles: true,
  },
  // Age 5-6: More colors
  {
    id: createId(),
    type: 'tap-color',
    subject: 'colors',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: 'Tap the PURPLE marble!',
    voicePrompt: 'Tap the purple marble!',
    options: [
      { id: '1', value: 'purple', label: 'Purple', color: 'purple', isCorrect: true },
      { id: '2', value: 'blue', label: 'Blue', color: 'blue', isCorrect: false },
      { id: '3', value: 'pink', label: 'Pink', color: 'pink', isCorrect: false },
      { id: '4', value: 'cyan', label: 'Cyan', color: 'cyan', isCorrect: false },
    ],
    correctAnswer: 'purple',
    showMarbles: true,
  },
  {
    id: createId(),
    type: 'tap-color',
    subject: 'colors',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: 'Tap the ORANGE marble!',
    voicePrompt: 'Tap the orange marble!',
    options: [
      { id: '1', value: 'orange', label: 'Orange', color: 'orange', isCorrect: true },
      { id: '2', value: 'red', label: 'Red', color: 'red', isCorrect: false },
      { id: '3', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: false },
      { id: '4', value: 'pink', label: 'Pink', color: 'pink', isCorrect: false },
    ],
    correctAnswer: 'orange',
    showMarbles: true,
  },
];

// ============================================
// COUNTING CHALLENGES
// ============================================

export const countingChallenges: Challenge[] = [
  // Age 3-4: Count 1-5
  {
    id: createId(),
    type: 'count-marbles',
    subject: 'counting',
    ageMin: 3,
    ageMax: 4,
    difficulty: 1,
    prompt: 'How many marbles?',
    voicePrompt: 'How many marbles do you see?',
    options: [
      { id: '1', value: 1, label: '1', isCorrect: false },
      { id: '2', value: 2, label: '2', isCorrect: true },
      { id: '3', value: 3, label: '3', isCorrect: false },
      { id: '4', value: 4, label: '4', isCorrect: false },
    ],
    correctAnswer: 2,
    showMarbles: true,
    marbleCount: 2,
  },
  {
    id: createId(),
    type: 'count-marbles',
    subject: 'counting',
    ageMin: 3,
    ageMax: 4,
    difficulty: 1,
    prompt: 'How many marbles?',
    voicePrompt: 'How many marbles do you see?',
    options: [
      { id: '1', value: 2, label: '2', isCorrect: false },
      { id: '2', value: 3, label: '3', isCorrect: true },
      { id: '3', value: 4, label: '4', isCorrect: false },
      { id: '4', value: 5, label: '5', isCorrect: false },
    ],
    correctAnswer: 3,
    showMarbles: true,
    marbleCount: 3,
  },
  {
    id: createId(),
    type: 'count-marbles',
    subject: 'counting',
    ageMin: 3,
    ageMax: 4,
    difficulty: 1,
    prompt: 'How many marbles?',
    voicePrompt: 'How many marbles do you see?',
    options: [
      { id: '1', value: 3, label: '3', isCorrect: false },
      { id: '2', value: 4, label: '4', isCorrect: true },
      { id: '3', value: 5, label: '5', isCorrect: false },
      { id: '4', value: 6, label: '6', isCorrect: false },
    ],
    correctAnswer: 4,
    showMarbles: true,
    marbleCount: 4,
  },
  {
    id: createId(),
    type: 'count-marbles',
    subject: 'counting',
    ageMin: 3,
    ageMax: 4,
    difficulty: 1,
    prompt: 'How many marbles?',
    voicePrompt: 'How many marbles do you see?',
    options: [
      { id: '1', value: 4, label: '4', isCorrect: false },
      { id: '2', value: 5, label: '5', isCorrect: true },
      { id: '3', value: 6, label: '6', isCorrect: false },
      { id: '4', value: 7, label: '7', isCorrect: false },
    ],
    correctAnswer: 5,
    showMarbles: true,
    marbleCount: 5,
  },
  // Age 5-6: Count 1-10
  {
    id: createId(),
    type: 'count-marbles',
    subject: 'counting',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: 'How many marbles?',
    voicePrompt: 'How many marbles do you see?',
    options: [
      { id: '1', value: 6, label: '6', isCorrect: false },
      { id: '2', value: 7, label: '7', isCorrect: true },
      { id: '3', value: 8, label: '8', isCorrect: false },
      { id: '4', value: 9, label: '9', isCorrect: false },
    ],
    correctAnswer: 7,
    showMarbles: true,
    marbleCount: 7,
  },
  {
    id: createId(),
    type: 'count-marbles',
    subject: 'counting',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: 'How many marbles?',
    voicePrompt: 'How many marbles do you see?',
    options: [
      { id: '1', value: 8, label: '8', isCorrect: false },
      { id: '2', value: 9, label: '9', isCorrect: false },
      { id: '3', value: 10, label: '10', isCorrect: true },
      { id: '4', value: 11, label: '11', isCorrect: false },
    ],
    correctAnswer: 10,
    showMarbles: true,
    marbleCount: 10,
  },
];

// ============================================
// MATH CHALLENGES
// ============================================

export const mathChallenges: Challenge[] = [
  // Age 5-6: Simple addition
  {
    id: createId(),
    type: 'addition',
    subject: 'math',
    ageMin: 5,
    ageMax: 6,
    difficulty: 1,
    prompt: '1 + 1 = ?',
    voicePrompt: 'One plus one equals what?',
    options: [
      { id: '1', value: 1, label: '1', isCorrect: false },
      { id: '2', value: 2, label: '2', isCorrect: true },
      { id: '3', value: 3, label: '3', isCorrect: false },
      { id: '4', value: 4, label: '4', isCorrect: false },
    ],
    correctAnswer: 2,
  },
  {
    id: createId(),
    type: 'addition',
    subject: 'math',
    ageMin: 5,
    ageMax: 6,
    difficulty: 1,
    prompt: '2 + 1 = ?',
    voicePrompt: 'Two plus one equals what?',
    options: [
      { id: '1', value: 2, label: '2', isCorrect: false },
      { id: '2', value: 3, label: '3', isCorrect: true },
      { id: '3', value: 4, label: '4', isCorrect: false },
      { id: '4', value: 5, label: '5', isCorrect: false },
    ],
    correctAnswer: 3,
  },
  {
    id: createId(),
    type: 'addition',
    subject: 'math',
    ageMin: 5,
    ageMax: 6,
    difficulty: 1,
    prompt: '2 + 2 = ?',
    voicePrompt: 'Two plus two equals what?',
    options: [
      { id: '1', value: 3, label: '3', isCorrect: false },
      { id: '2', value: 4, label: '4', isCorrect: true },
      { id: '3', value: 5, label: '5', isCorrect: false },
      { id: '4', value: 6, label: '6', isCorrect: false },
    ],
    correctAnswer: 4,
  },
  {
    id: createId(),
    type: 'addition',
    subject: 'math',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: '3 + 2 = ?',
    voicePrompt: 'Three plus two equals what?',
    options: [
      { id: '1', value: 4, label: '4', isCorrect: false },
      { id: '2', value: 5, label: '5', isCorrect: true },
      { id: '3', value: 6, label: '6', isCorrect: false },
      { id: '4', value: 7, label: '7', isCorrect: false },
    ],
    correctAnswer: 5,
  },
  // Age 7+: Subtraction
  {
    id: createId(),
    type: 'subtraction',
    subject: 'math',
    ageMin: 7,
    ageMax: 10,
    difficulty: 2,
    prompt: '5 - 2 = ?',
    voicePrompt: 'Five minus two equals what?',
    options: [
      { id: '1', value: 2, label: '2', isCorrect: false },
      { id: '2', value: 3, label: '3', isCorrect: true },
      { id: '3', value: 4, label: '4', isCorrect: false },
      { id: '4', value: 5, label: '5', isCorrect: false },
    ],
    correctAnswer: 3,
  },
  {
    id: createId(),
    type: 'subtraction',
    subject: 'math',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: '10 - 4 = ?',
    voicePrompt: 'Ten minus four equals what?',
    options: [
      { id: '1', value: 5, label: '5', isCorrect: false },
      { id: '2', value: 6, label: '6', isCorrect: true },
      { id: '3', value: 7, label: '7', isCorrect: false },
      { id: '4', value: 8, label: '8', isCorrect: false },
    ],
    correctAnswer: 6,
  },
];

// ============================================
// PATTERN CHALLENGES
// ============================================

export const patternChallenges: Challenge[] = [
  // Age 3-4: Simple AB patterns
  {
    id: createId(),
    type: 'pattern-complete',
    subject: 'patterns',
    ageMin: 3,
    ageMax: 4,
    difficulty: 1,
    prompt: 'What comes next? Red, Blue, Red, Blue, ?',
    voicePrompt: 'What comes next? Red, blue, red, blue, and then what?',
    options: [
      { id: '1', value: 'red', label: 'Red', color: 'red', isCorrect: true },
      { id: '2', value: 'blue', label: 'Blue', color: 'blue', isCorrect: false },
      { id: '3', value: 'green', label: 'Green', color: 'green', isCorrect: false },
      { id: '4', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: false },
    ],
    correctAnswer: 'red',
    showMarbles: true,
  },
  {
    id: createId(),
    type: 'pattern-complete',
    subject: 'patterns',
    ageMin: 3,
    ageMax: 4,
    difficulty: 1,
    prompt: 'What comes next? Green, Yellow, Green, Yellow, ?',
    voicePrompt: 'What comes next? Green, yellow, green, yellow, and then what?',
    options: [
      { id: '1', value: 'red', label: 'Red', color: 'red', isCorrect: false },
      { id: '2', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: false },
      { id: '3', value: 'green', label: 'Green', color: 'green', isCorrect: true },
      { id: '4', value: 'blue', label: 'Blue', color: 'blue', isCorrect: false },
    ],
    correctAnswer: 'green',
    showMarbles: true,
  },
  // Age 5-6: ABB patterns
  {
    id: createId(),
    type: 'pattern-complete',
    subject: 'patterns',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: 'What comes next? Red, Blue, Blue, Red, Blue, Blue, ?',
    voicePrompt: 'What comes next? Red, blue, blue, red, blue, blue, and then what?',
    options: [
      { id: '1', value: 'red', label: 'Red', color: 'red', isCorrect: true },
      { id: '2', value: 'blue', label: 'Blue', color: 'blue', isCorrect: false },
      { id: '3', value: 'green', label: 'Green', color: 'green', isCorrect: false },
      { id: '4', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: false },
    ],
    correctAnswer: 'red',
    showMarbles: true,
  },
];

// ============================================
// LETTER CHALLENGES
// ============================================

export const letterChallenges: Challenge[] = [
  // Age 4-5: Letter recognition
  {
    id: createId(),
    type: 'letter-match',
    subject: 'letters',
    ageMin: 4,
    ageMax: 5,
    difficulty: 1,
    prompt: 'Find the letter A',
    voicePrompt: 'Can you find the letter A?',
    options: [
      { id: '1', value: 'A', label: 'A', isCorrect: true },
      { id: '2', value: 'B', label: 'B', isCorrect: false },
      { id: '3', value: 'C', label: 'C', isCorrect: false },
      { id: '4', value: 'D', label: 'D', isCorrect: false },
    ],
    correctAnswer: 'A',
  },
  {
    id: createId(),
    type: 'letter-match',
    subject: 'letters',
    ageMin: 4,
    ageMax: 5,
    difficulty: 1,
    prompt: 'Find the letter B',
    voicePrompt: 'Can you find the letter B?',
    options: [
      { id: '1', value: 'B', label: 'B', isCorrect: true },
      { id: '2', value: 'D', label: 'D', isCorrect: false },
      { id: '3', value: 'P', label: 'P', isCorrect: false },
      { id: '4', value: 'R', label: 'R', isCorrect: false },
    ],
    correctAnswer: 'B',
  },
  {
    id: createId(),
    type: 'letter-match',
    subject: 'letters',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: 'Find the letter M',
    voicePrompt: 'Can you find the letter M?',
    options: [
      { id: '1', value: 'M', label: 'M', isCorrect: true },
      { id: '2', value: 'N', label: 'N', isCorrect: false },
      { id: '3', value: 'W', label: 'W', isCorrect: false },
      { id: '4', value: 'V', label: 'V', isCorrect: false },
    ],
    correctAnswer: 'M',
  },
];

// ============================================
// LOGIC CHALLENGES
// ============================================

export const logicChallenges: Challenge[] = [
  // Age 4-5: Odd one out
  {
    id: createId(),
    type: 'odd-one-out',
    subject: 'logic',
    ageMin: 4,
    ageMax: 5,
    difficulty: 1,
    prompt: 'Which one is different?',
    voicePrompt: 'Which one is different from the others?',
    options: [
      { id: '1', value: 'red', label: '', color: 'red', isCorrect: false },
      { id: '2', value: 'red', label: '', color: 'red', isCorrect: false },
      { id: '3', value: 'blue', label: '', color: 'blue', isCorrect: true },
      { id: '4', value: 'red', label: '', color: 'red', isCorrect: false },
    ],
    correctAnswer: 'blue',
    showMarbles: true,
  },
  {
    id: createId(),
    type: 'odd-one-out',
    subject: 'logic',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: 'Which one is different?',
    voicePrompt: 'Which one is different from the others?',
    options: [
      { id: '1', value: 'green', label: '', color: 'green', isCorrect: false },
      { id: '2', value: 'green', label: '', color: 'green', isCorrect: false },
      { id: '3', value: 'green', label: '', color: 'green', isCorrect: false },
      { id: '4', value: 'yellow', label: '', color: 'yellow', isCorrect: true },
    ],
    correctAnswer: 'yellow',
    showMarbles: true,
  },
];

// ============================================
// GET ALL CHALLENGES
// ============================================

export const allChallenges: Challenge[] = [
  ...colorChallenges,
  ...countingChallenges,
  ...mathChallenges,
  ...patternChallenges,
  ...letterChallenges,
  ...logicChallenges,
];

// Get challenges appropriate for a given age
export function getChallengesForAge(age: number): Challenge[] {
  return allChallenges.filter(
    (c) => age >= c.ageMin && age <= c.ageMax
  );
}

// Get challenges by subject for a given age
export function getChallengesBySubject(
  age: number,
  subject: Subject
): Challenge[] {
  return allChallenges.filter(
    (c) => c.subject === subject && age >= c.ageMin && age <= c.ageMax
  );
}
