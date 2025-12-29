import { Challenge, Subject } from '@/types';

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
  // Age 7-10: Number logic
  {
    id: createId(),
    type: 'odd-one-out',
    subject: 'logic',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: 'Which number does NOT belong?',
    voicePrompt: 'Which number does not belong with the others?',
    options: [
      { id: '1', value: 2, label: '2', isCorrect: false },
      { id: '2', value: 4, label: '4', isCorrect: false },
      { id: '3', value: 5, label: '5', isCorrect: true },
      { id: '4', value: 8, label: '8', isCorrect: false },
    ],
    correctAnswer: 5,
  },
  {
    id: createId(),
    type: 'odd-one-out',
    subject: 'logic',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: 'Which is the biggest?',
    voicePrompt: 'Which number is the biggest?',
    options: [
      { id: '1', value: 12, label: '12', isCorrect: false },
      { id: '2', value: 8, label: '8', isCorrect: false },
      { id: '3', value: 15, label: '15', isCorrect: true },
      { id: '4', value: 11, label: '11', isCorrect: false },
    ],
    correctAnswer: 15,
  },
  {
    id: createId(),
    type: 'odd-one-out',
    subject: 'logic',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: 'Which is the smallest?',
    voicePrompt: 'Which number is the smallest?',
    options: [
      { id: '1', value: 25, label: '25', isCorrect: false },
      { id: '2', value: 17, label: '17', isCorrect: true },
      { id: '3', value: 32, label: '32', isCorrect: false },
      { id: '4', value: 28, label: '28', isCorrect: false },
    ],
    correctAnswer: 17,
  },
  {
    id: createId(),
    type: 'odd-one-out',
    subject: 'logic',
    ageMin: 7,
    ageMax: 10,
    difficulty: 4,
    prompt: 'What comes between 7 and 9?',
    voicePrompt: 'What number comes between 7 and 9?',
    options: [
      { id: '1', value: 6, label: '6', isCorrect: false },
      { id: '2', value: 7, label: '7', isCorrect: false },
      { id: '3', value: 8, label: '8', isCorrect: true },
      { id: '4', value: 10, label: '10', isCorrect: false },
    ],
    correctAnswer: 8,
  },
];

// ============================================
// MEMORY CHALLENGES (NEW!)
// ============================================

export const memoryChallenges: Challenge[] = [
  // Age 3-4: Simple 2-color sequences
  {
    id: createId(),
    type: 'memory-sequence',
    subject: 'memory',
    ageMin: 3,
    ageMax: 4,
    difficulty: 1,
    prompt: 'What color was FIRST?',
    voicePrompt: 'What color marble did you see first?',
    options: [
      { id: '1', value: 'red', label: 'Red', color: 'red', isCorrect: true },
      { id: '2', value: 'blue', label: 'Blue', color: 'blue', isCorrect: false },
      { id: '3', value: 'green', label: 'Green', color: 'green', isCorrect: false },
      { id: '4', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: false },
    ],
    correctAnswer: 'red',
    showMarbles: true,
    memorySequence: ['red', 'blue'],
  },
  {
    id: createId(),
    type: 'memory-sequence',
    subject: 'memory',
    ageMin: 3,
    ageMax: 4,
    difficulty: 1,
    prompt: 'What color was LAST?',
    voicePrompt: 'What color marble did you see last?',
    options: [
      { id: '1', value: 'green', label: 'Green', color: 'green', isCorrect: false },
      { id: '2', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: true },
      { id: '3', value: 'red', label: 'Red', color: 'red', isCorrect: false },
      { id: '4', value: 'blue', label: 'Blue', color: 'blue', isCorrect: false },
    ],
    correctAnswer: 'yellow',
    showMarbles: true,
    memorySequence: ['green', 'yellow'],
  },
  {
    id: createId(),
    type: 'memory-sequence',
    subject: 'memory',
    ageMin: 3,
    ageMax: 4,
    difficulty: 1,
    prompt: 'What color was FIRST?',
    voicePrompt: 'What color marble did you see first?',
    options: [
      { id: '1', value: 'blue', label: 'Blue', color: 'blue', isCorrect: true },
      { id: '2', value: 'red', label: 'Red', color: 'red', isCorrect: false },
      { id: '3', value: 'green', label: 'Green', color: 'green', isCorrect: false },
      { id: '4', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: false },
    ],
    correctAnswer: 'blue',
    showMarbles: true,
    memorySequence: ['blue', 'green'],
  },
  // Age 5-6: 3-color sequences
  {
    id: createId(),
    type: 'memory-sequence',
    subject: 'memory',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: 'What color was in the MIDDLE?',
    voicePrompt: 'What color marble was in the middle?',
    options: [
      { id: '1', value: 'red', label: 'Red', color: 'red', isCorrect: false },
      { id: '2', value: 'green', label: 'Green', color: 'green', isCorrect: true },
      { id: '3', value: 'blue', label: 'Blue', color: 'blue', isCorrect: false },
      { id: '4', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: false },
    ],
    correctAnswer: 'green',
    showMarbles: true,
    memorySequence: ['red', 'green', 'blue'],
  },
  {
    id: createId(),
    type: 'memory-sequence',
    subject: 'memory',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: 'What color was FIRST?',
    voicePrompt: 'What color marble did you see first?',
    options: [
      { id: '1', value: 'purple', label: 'Purple', color: 'purple', isCorrect: true },
      { id: '2', value: 'orange', label: 'Orange', color: 'orange', isCorrect: false },
      { id: '3', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: false },
      { id: '4', value: 'pink', label: 'Pink', color: 'pink', isCorrect: false },
    ],
    correctAnswer: 'purple',
    showMarbles: true,
    memorySequence: ['purple', 'yellow', 'orange'],
  },
  {
    id: createId(),
    type: 'memory-sequence',
    subject: 'memory',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: 'What color was LAST?',
    voicePrompt: 'What color marble did you see last?',
    options: [
      { id: '1', value: 'cyan', label: 'Cyan', color: 'cyan', isCorrect: true },
      { id: '2', value: 'pink', label: 'Pink', color: 'pink', isCorrect: false },
      { id: '3', value: 'green', label: 'Green', color: 'green', isCorrect: false },
      { id: '4', value: 'red', label: 'Red', color: 'red', isCorrect: false },
    ],
    correctAnswer: 'cyan',
    showMarbles: true,
    memorySequence: ['pink', 'green', 'cyan'],
  },
  // Age 7-10: 4-5 color sequences
  {
    id: createId(),
    type: 'memory-sequence',
    subject: 'memory',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: 'What color was SECOND?',
    voicePrompt: 'What color marble was second in the sequence?',
    options: [
      { id: '1', value: 'blue', label: 'Blue', color: 'blue', isCorrect: true },
      { id: '2', value: 'red', label: 'Red', color: 'red', isCorrect: false },
      { id: '3', value: 'green', label: 'Green', color: 'green', isCorrect: false },
      { id: '4', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: false },
    ],
    correctAnswer: 'blue',
    showMarbles: true,
    memorySequence: ['red', 'blue', 'green', 'yellow'],
  },
  {
    id: createId(),
    type: 'memory-sequence',
    subject: 'memory',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: 'What color was THIRD?',
    voicePrompt: 'What color marble was third in the sequence?',
    options: [
      { id: '1', value: 'orange', label: 'Orange', color: 'orange', isCorrect: true },
      { id: '2', value: 'purple', label: 'Purple', color: 'purple', isCorrect: false },
      { id: '3', value: 'cyan', label: 'Cyan', color: 'cyan', isCorrect: false },
      { id: '4', value: 'pink', label: 'Pink', color: 'pink', isCorrect: false },
    ],
    correctAnswer: 'orange',
    showMarbles: true,
    memorySequence: ['purple', 'cyan', 'orange', 'pink'],
  },
  {
    id: createId(),
    type: 'memory-sequence',
    subject: 'memory',
    ageMin: 7,
    ageMax: 10,
    difficulty: 4,
    prompt: 'What color was FOURTH?',
    voicePrompt: 'What color marble was fourth in the sequence?',
    options: [
      { id: '1', value: 'green', label: 'Green', color: 'green', isCorrect: true },
      { id: '2', value: 'red', label: 'Red', color: 'red', isCorrect: false },
      { id: '3', value: 'blue', label: 'Blue', color: 'blue', isCorrect: false },
      { id: '4', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: false },
    ],
    correctAnswer: 'green',
    showMarbles: true,
    memorySequence: ['red', 'blue', 'yellow', 'green', 'purple'],
  },
  {
    id: createId(),
    type: 'memory-sequence',
    subject: 'memory',
    ageMin: 7,
    ageMax: 10,
    difficulty: 4,
    prompt: 'How many marbles did you see?',
    voicePrompt: 'How many marbles did you see in the sequence?',
    options: [
      { id: '1', value: 3, label: '3', isCorrect: false },
      { id: '2', value: 4, label: '4', isCorrect: false },
      { id: '3', value: 5, label: '5', isCorrect: true },
      { id: '4', value: 6, label: '6', isCorrect: false },
    ],
    correctAnswer: 5,
    showMarbles: true,
    memorySequence: ['red', 'blue', 'green', 'yellow', 'purple'],
  },
];

// ============================================
// ADDITIONAL CHALLENGES FOR AGES 7-10
// ============================================

export const advancedMathChallenges: Challenge[] = [
  // Multiplication
  {
    id: createId(),
    type: 'multiplication',
    subject: 'math',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: '2 x 3 = ?',
    voicePrompt: 'Two times three equals what?',
    options: [
      { id: '1', value: 5, label: '5', isCorrect: false },
      { id: '2', value: 6, label: '6', isCorrect: true },
      { id: '3', value: 7, label: '7', isCorrect: false },
      { id: '4', value: 8, label: '8', isCorrect: false },
    ],
    correctAnswer: 6,
  },
  {
    id: createId(),
    type: 'multiplication',
    subject: 'math',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: '4 x 2 = ?',
    voicePrompt: 'Four times two equals what?',
    options: [
      { id: '1', value: 6, label: '6', isCorrect: false },
      { id: '2', value: 7, label: '7', isCorrect: false },
      { id: '3', value: 8, label: '8', isCorrect: true },
      { id: '4', value: 9, label: '9', isCorrect: false },
    ],
    correctAnswer: 8,
  },
  {
    id: createId(),
    type: 'multiplication',
    subject: 'math',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: '5 x 2 = ?',
    voicePrompt: 'Five times two equals what?',
    options: [
      { id: '1', value: 8, label: '8', isCorrect: false },
      { id: '2', value: 9, label: '9', isCorrect: false },
      { id: '3', value: 10, label: '10', isCorrect: true },
      { id: '4', value: 11, label: '11', isCorrect: false },
    ],
    correctAnswer: 10,
  },
  {
    id: createId(),
    type: 'multiplication',
    subject: 'math',
    ageMin: 7,
    ageMax: 10,
    difficulty: 4,
    prompt: '3 x 4 = ?',
    voicePrompt: 'Three times four equals what?',
    options: [
      { id: '1', value: 10, label: '10', isCorrect: false },
      { id: '2', value: 11, label: '11', isCorrect: false },
      { id: '3', value: 12, label: '12', isCorrect: true },
      { id: '4', value: 14, label: '14', isCorrect: false },
    ],
    correctAnswer: 12,
  },
  {
    id: createId(),
    type: 'multiplication',
    subject: 'math',
    ageMin: 7,
    ageMax: 10,
    difficulty: 4,
    prompt: '5 x 3 = ?',
    voicePrompt: 'Five times three equals what?',
    options: [
      { id: '1', value: 12, label: '12', isCorrect: false },
      { id: '2', value: 13, label: '13', isCorrect: false },
      { id: '3', value: 15, label: '15', isCorrect: true },
      { id: '4', value: 16, label: '16', isCorrect: false },
    ],
    correctAnswer: 15,
  },
  {
    id: createId(),
    type: 'multiplication',
    subject: 'math',
    ageMin: 7,
    ageMax: 10,
    difficulty: 4,
    prompt: '4 x 4 = ?',
    voicePrompt: 'Four times four equals what?',
    options: [
      { id: '1', value: 14, label: '14', isCorrect: false },
      { id: '2', value: 16, label: '16', isCorrect: true },
      { id: '3', value: 18, label: '18', isCorrect: false },
      { id: '4', value: 20, label: '20', isCorrect: false },
    ],
    correctAnswer: 16,
  },
  // Larger subtraction
  {
    id: createId(),
    type: 'subtraction',
    subject: 'math',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: '15 - 7 = ?',
    voicePrompt: 'Fifteen minus seven equals what?',
    options: [
      { id: '1', value: 6, label: '6', isCorrect: false },
      { id: '2', value: 7, label: '7', isCorrect: false },
      { id: '3', value: 8, label: '8', isCorrect: true },
      { id: '4', value: 9, label: '9', isCorrect: false },
    ],
    correctAnswer: 8,
  },
  {
    id: createId(),
    type: 'subtraction',
    subject: 'math',
    ageMin: 7,
    ageMax: 10,
    difficulty: 4,
    prompt: '20 - 8 = ?',
    voicePrompt: 'Twenty minus eight equals what?',
    options: [
      { id: '1', value: 10, label: '10', isCorrect: false },
      { id: '2', value: 11, label: '11', isCorrect: false },
      { id: '3', value: 12, label: '12', isCorrect: true },
      { id: '4', value: 13, label: '13', isCorrect: false },
    ],
    correctAnswer: 12,
  },
  // Two-digit addition
  {
    id: createId(),
    type: 'addition',
    subject: 'math',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: '12 + 5 = ?',
    voicePrompt: 'Twelve plus five equals what?',
    options: [
      { id: '1', value: 15, label: '15', isCorrect: false },
      { id: '2', value: 16, label: '16', isCorrect: false },
      { id: '3', value: 17, label: '17', isCorrect: true },
      { id: '4', value: 18, label: '18', isCorrect: false },
    ],
    correctAnswer: 17,
  },
  {
    id: createId(),
    type: 'addition',
    subject: 'math',
    ageMin: 7,
    ageMax: 10,
    difficulty: 4,
    prompt: '15 + 15 = ?',
    voicePrompt: 'Fifteen plus fifteen equals what?',
    options: [
      { id: '1', value: 25, label: '25', isCorrect: false },
      { id: '2', value: 28, label: '28', isCorrect: false },
      { id: '3', value: 30, label: '30', isCorrect: true },
      { id: '4', value: 35, label: '35', isCorrect: false },
    ],
    correctAnswer: 30,
  },
];

// ============================================
// ADDITIONAL PATTERN CHALLENGES
// ============================================

export const advancedPatternChallenges: Challenge[] = [
  // ABC patterns for ages 5-6
  {
    id: createId(),
    type: 'pattern-complete',
    subject: 'patterns',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: 'What comes next? Red, Green, Blue, Red, Green, Blue, ?',
    voicePrompt: 'What comes next? Red, green, blue, red, green, blue, and then what?',
    options: [
      { id: '1', value: 'red', label: 'Red', color: 'red', isCorrect: true },
      { id: '2', value: 'green', label: 'Green', color: 'green', isCorrect: false },
      { id: '3', value: 'blue', label: 'Blue', color: 'blue', isCorrect: false },
      { id: '4', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: false },
    ],
    correctAnswer: 'red',
    showMarbles: true,
  },
  {
    id: createId(),
    type: 'pattern-complete',
    subject: 'patterns',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: 'What comes next? Yellow, Yellow, Red, Yellow, Yellow, Red, ?',
    voicePrompt: 'What comes next? Yellow, yellow, red, yellow, yellow, red, and then what?',
    options: [
      { id: '1', value: 'yellow', label: 'Yellow', color: 'yellow', isCorrect: true },
      { id: '2', value: 'red', label: 'Red', color: 'red', isCorrect: false },
      { id: '3', value: 'green', label: 'Green', color: 'green', isCorrect: false },
      { id: '4', value: 'blue', label: 'Blue', color: 'blue', isCorrect: false },
    ],
    correctAnswer: 'yellow',
    showMarbles: true,
  },
  // Number patterns for ages 7-10
  {
    id: createId(),
    type: 'pattern-complete',
    subject: 'patterns',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: 'What comes next? 2, 4, 6, 8, ?',
    voicePrompt: 'What comes next? 2, 4, 6, 8, and then what?',
    options: [
      { id: '1', value: 9, label: '9', isCorrect: false },
      { id: '2', value: 10, label: '10', isCorrect: true },
      { id: '3', value: 11, label: '11', isCorrect: false },
      { id: '4', value: 12, label: '12', isCorrect: false },
    ],
    correctAnswer: 10,
  },
  {
    id: createId(),
    type: 'pattern-complete',
    subject: 'patterns',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: 'What comes next? 1, 3, 5, 7, ?',
    voicePrompt: 'What comes next? 1, 3, 5, 7, and then what?',
    options: [
      { id: '1', value: 8, label: '8', isCorrect: false },
      { id: '2', value: 9, label: '9', isCorrect: true },
      { id: '3', value: 10, label: '10', isCorrect: false },
      { id: '4', value: 11, label: '11', isCorrect: false },
    ],
    correctAnswer: 9,
  },
  {
    id: createId(),
    type: 'pattern-complete',
    subject: 'patterns',
    ageMin: 7,
    ageMax: 10,
    difficulty: 4,
    prompt: 'What comes next? 5, 10, 15, 20, ?',
    voicePrompt: 'What comes next? 5, 10, 15, 20, and then what?',
    options: [
      { id: '1', value: 22, label: '22', isCorrect: false },
      { id: '2', value: 24, label: '24', isCorrect: false },
      { id: '3', value: 25, label: '25', isCorrect: true },
      { id: '4', value: 30, label: '30', isCorrect: false },
    ],
    correctAnswer: 25,
  },
  {
    id: createId(),
    type: 'pattern-complete',
    subject: 'patterns',
    ageMin: 7,
    ageMax: 10,
    difficulty: 4,
    prompt: 'What comes next? 1, 2, 4, 8, ?',
    voicePrompt: 'What comes next? 1, 2, 4, 8, and then what?',
    options: [
      { id: '1', value: 10, label: '10', isCorrect: false },
      { id: '2', value: 12, label: '12', isCorrect: false },
      { id: '3', value: 14, label: '14', isCorrect: false },
      { id: '4', value: 16, label: '16', isCorrect: true },
    ],
    correctAnswer: 16,
  },
];

// ============================================
// ADDITIONAL LETTER CHALLENGES
// ============================================

export const advancedLetterChallenges: Challenge[] = [
  // More letters for ages 4-5
  {
    id: createId(),
    type: 'letter-match',
    subject: 'letters',
    ageMin: 4,
    ageMax: 5,
    difficulty: 1,
    prompt: 'Find the letter C',
    voicePrompt: 'Can you find the letter C?',
    options: [
      { id: '1', value: 'C', label: 'C', isCorrect: true },
      { id: '2', value: 'O', label: 'O', isCorrect: false },
      { id: '3', value: 'G', label: 'G', isCorrect: false },
      { id: '4', value: 'Q', label: 'Q', isCorrect: false },
    ],
    correctAnswer: 'C',
  },
  {
    id: createId(),
    type: 'letter-match',
    subject: 'letters',
    ageMin: 4,
    ageMax: 5,
    difficulty: 1,
    prompt: 'Find the letter D',
    voicePrompt: 'Can you find the letter D?',
    options: [
      { id: '1', value: 'D', label: 'D', isCorrect: true },
      { id: '2', value: 'B', label: 'B', isCorrect: false },
      { id: '3', value: 'P', label: 'P', isCorrect: false },
      { id: '4', value: 'O', label: 'O', isCorrect: false },
    ],
    correctAnswer: 'D',
  },
  {
    id: createId(),
    type: 'letter-match',
    subject: 'letters',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: 'Find the letter E',
    voicePrompt: 'Can you find the letter E?',
    options: [
      { id: '1', value: 'E', label: 'E', isCorrect: true },
      { id: '2', value: 'F', label: 'F', isCorrect: false },
      { id: '3', value: 'H', label: 'H', isCorrect: false },
      { id: '4', value: 'L', label: 'L', isCorrect: false },
    ],
    correctAnswer: 'E',
  },
  {
    id: createId(),
    type: 'letter-match',
    subject: 'letters',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: 'Find the letter S',
    voicePrompt: 'Can you find the letter S?',
    options: [
      { id: '1', value: 'S', label: 'S', isCorrect: true },
      { id: '2', value: '5', label: '5', isCorrect: false },
      { id: '3', value: 'Z', label: 'Z', isCorrect: false },
      { id: '4', value: '2', label: '2', isCorrect: false },
    ],
    correctAnswer: 'S',
  },
  // Vowel recognition for ages 7-10
  {
    id: createId(),
    type: 'letter-match',
    subject: 'letters',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: 'Which is a VOWEL?',
    voicePrompt: 'Which of these is a vowel?',
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
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: 'Which is a VOWEL?',
    voicePrompt: 'Which of these is a vowel?',
    options: [
      { id: '1', value: 'F', label: 'F', isCorrect: false },
      { id: '2', value: 'G', label: 'G', isCorrect: false },
      { id: '3', value: 'I', label: 'I', isCorrect: true },
      { id: '4', value: 'J', label: 'J', isCorrect: false },
    ],
    correctAnswer: 'I',
  },
  {
    id: createId(),
    type: 'letter-match',
    subject: 'letters',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: 'What letter comes AFTER M?',
    voicePrompt: 'What letter comes after M in the alphabet?',
    options: [
      { id: '1', value: 'L', label: 'L', isCorrect: false },
      { id: '2', value: 'N', label: 'N', isCorrect: true },
      { id: '3', value: 'O', label: 'O', isCorrect: false },
      { id: '4', value: 'P', label: 'P', isCorrect: false },
    ],
    correctAnswer: 'N',
  },
  {
    id: createId(),
    type: 'letter-match',
    subject: 'letters',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: 'What letter comes BEFORE P?',
    voicePrompt: 'What letter comes before P in the alphabet?',
    options: [
      { id: '1', value: 'N', label: 'N', isCorrect: false },
      { id: '2', value: 'O', label: 'O', isCorrect: true },
      { id: '3', value: 'Q', label: 'Q', isCorrect: false },
      { id: '4', value: 'R', label: 'R', isCorrect: false },
    ],
    correctAnswer: 'O',
  },
];

// ============================================
// ADDITIONAL COLOR CHALLENGES
// ============================================

export const advancedColorChallenges: Challenge[] = [
  // Pink and Cyan for ages 5-6
  {
    id: createId(),
    type: 'tap-color',
    subject: 'colors',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: 'Tap the PINK marble!',
    voicePrompt: 'Tap the pink marble!',
    options: [
      { id: '1', value: 'pink', label: 'Pink', color: 'pink', isCorrect: true },
      { id: '2', value: 'red', label: 'Red', color: 'red', isCorrect: false },
      { id: '3', value: 'purple', label: 'Purple', color: 'purple', isCorrect: false },
      { id: '4', value: 'orange', label: 'Orange', color: 'orange', isCorrect: false },
    ],
    correctAnswer: 'pink',
    showMarbles: true,
  },
  {
    id: createId(),
    type: 'tap-color',
    subject: 'colors',
    ageMin: 5,
    ageMax: 6,
    difficulty: 2,
    prompt: 'Tap the CYAN marble!',
    voicePrompt: 'Tap the cyan marble!',
    options: [
      { id: '1', value: 'cyan', label: 'Cyan', color: 'cyan', isCorrect: true },
      { id: '2', value: 'blue', label: 'Blue', color: 'blue', isCorrect: false },
      { id: '3', value: 'green', label: 'Green', color: 'green', isCorrect: false },
      { id: '4', value: 'purple', label: 'Purple', color: 'purple', isCorrect: false },
    ],
    correctAnswer: 'cyan',
    showMarbles: true,
  },
];

// ============================================
// ADDITIONAL COUNTING CHALLENGES
// ============================================

export const advancedCountingChallenges: Challenge[] = [
  // Count 8-9 for ages 5-6
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
      { id: '1', value: 7, label: '7', isCorrect: false },
      { id: '2', value: 8, label: '8', isCorrect: true },
      { id: '3', value: 9, label: '9', isCorrect: false },
      { id: '4', value: 10, label: '10', isCorrect: false },
    ],
    correctAnswer: 8,
    showMarbles: true,
    marbleCount: 8,
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
      { id: '1', value: 7, label: '7', isCorrect: false },
      { id: '2', value: 8, label: '8', isCorrect: false },
      { id: '3', value: 9, label: '9', isCorrect: true },
      { id: '4', value: 10, label: '10', isCorrect: false },
    ],
    correctAnswer: 9,
    showMarbles: true,
    marbleCount: 9,
  },
  // Larger counts for ages 7-10
  {
    id: createId(),
    type: 'count-marbles',
    subject: 'counting',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: 'How many marbles?',
    voicePrompt: 'How many marbles do you see?',
    options: [
      { id: '1', value: 11, label: '11', isCorrect: false },
      { id: '2', value: 12, label: '12', isCorrect: true },
      { id: '3', value: 13, label: '13', isCorrect: false },
      { id: '4', value: 14, label: '14', isCorrect: false },
    ],
    correctAnswer: 12,
    showMarbles: true,
    marbleCount: 12,
  },
  {
    id: createId(),
    type: 'count-marbles',
    subject: 'counting',
    ageMin: 7,
    ageMax: 10,
    difficulty: 3,
    prompt: 'How many marbles?',
    voicePrompt: 'How many marbles do you see?',
    options: [
      { id: '1', value: 13, label: '13', isCorrect: false },
      { id: '2', value: 14, label: '14', isCorrect: false },
      { id: '3', value: 15, label: '15', isCorrect: true },
      { id: '4', value: 16, label: '16', isCorrect: false },
    ],
    correctAnswer: 15,
    showMarbles: true,
    marbleCount: 15,
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
  ...memoryChallenges,
  ...advancedMathChallenges,
  ...advancedPatternChallenges,
  ...advancedLetterChallenges,
  ...advancedColorChallenges,
  ...advancedCountingChallenges,
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
