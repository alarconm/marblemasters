# Marble Masters: Educational Marble Track Game

## Project Brief for Claude Code

Build a production-quality iPad-optimized web application (React + TypeScript) that transforms passive marble video watching into active, educational gameplay. Target audience: children ages 3-10 with age-adaptive difficulty scaling.

**Core Philosophy:** The education IS the fun. Never interrupt play for learning—weave learning INTO the marble mechanics themselves.

---

## Part 1: Technical Architecture

### Deployment Strategy
**Primary:** Progressive Web App (PWA) hosted on Vercel (free)
- Works on iPad via Safari → "Add to Home Screen"
- No App Store needed for testing with real kids
- Full screen, offline capable, feels like native app

**Future Optional:** App Store via Capacitor wrapper (requires Mac or cloud Mac rental)

### Development Environment
- Windows compatible (no Mac required)
- Test in Chrome DevTools with iPad emulation
- Final testing on actual iPad via hosted URL

### Stack
```
- React 18+ with TypeScript (strict mode)
- Vite for build tooling (with PWA plugin)
- Tailwind CSS for styling
- Framer Motion for animations
- Howler.js for audio (or Web Audio API)
- Zustand for state management
- React Spring for physics-based animations (or custom physics engine)
- vite-plugin-pwa for PWA functionality
```

### File Structure
```
/src
  /components
    /game
      MarbleCanvas.tsx        # Main game rendering area
      Marble.tsx              # Individual marble with physics
      Track.tsx               # Track segment component
      TrackSystem.tsx         # Full track assembly
      Bucket.tsx              # Collection points
      Launcher.tsx            # Marble drop zone
    /ui
      ProgressBar.tsx
      ScoreDisplay.tsx
      LevelIndicator.tsx
      CelebrationOverlay.tsx
      AgeSelector.tsx
    /education
      ChallengeModal.tsx
      ColorChallenge.tsx
      CountingChallenge.tsx
      MathChallenge.tsx
      PatternChallenge.tsx
      PhonicsChallenge.tsx
      ShapeChallenge.tsx
      LogicChallenge.tsx
      MemoryChallenge.tsx
    /parent
      ParentDashboard.tsx
      ProgressReport.tsx
      DifficultySlider.tsx
      ContentToggle.tsx
      SessionHistory.tsx
  /systems
    physics.ts                # Core physics engine
    trackGenerator.ts         # Procedural track generation
    difficultyEngine.ts       # Adaptive difficulty system
    educationEngine.ts        # Challenge selection logic
    audioManager.ts           # Sound effect system
    progressTracker.ts        # Learning progress tracking
  /data
    challenges.ts             # All challenge content by age/subject
    trackPieces.ts            # Track segment definitions
    achievements.ts           # Unlockables and rewards
  /hooks
    usePhysics.ts
    useAudio.ts
    useProgress.ts
    useParentMode.ts
  /types
    index.ts                  # All TypeScript interfaces
  /utils
    mathHelpers.ts
    colorUtils.ts
  App.tsx
  main.tsx
```

---

## Part 2: Physics System (CRITICAL)

### Marble Physics Requirements

The marbles must FOLLOW tracks realistically—not bounce randomly like Plinko. This is the most important technical challenge.

#### Track-Following Physics Model

```typescript
interface TrackSegment {
  id: string;
  type: 'straight' | 'curve' | 'spiral' | 'loop' | 'funnel' | 'split' | 'jump';
  path: BezierPath;           // Cubic bezier curves defining the track centerline
  width: number;              // Track width (affects marble tolerance)
  friction: number;           // 0-1, affects speed loss
  bounciness: number;         // For walls/edges
  entryPoint: Vector2;
  exitPoint: Vector2;
  nextSegments: string[];     // For splits/choices
}

interface Marble {
  id: string;
  position: Vector2;
  velocity: Vector2;
  angularVelocity: number;
  radius: number;             // Affects physics
  mass: number;
  color: MarbleColor;
  currentTrackSegment: string | null;
  trackProgress: number;      // 0-1 along current segment
  state: 'falling' | 'on-track' | 'airborne' | 'collected';
}
```

#### Physics Update Loop (60fps target)

```typescript
function updateMarble(marble: Marble, track: TrackSystem, deltaTime: number) {
  if (marble.state === 'on-track') {
    // 1. Calculate position along bezier path
    const segment = track.getSegment(marble.currentTrackSegment);
    const pathPoint = segment.path.getPointAt(marble.trackProgress);
    const pathTangent = segment.path.getTangentAt(marble.trackProgress);
    
    // 2. Apply gravity component along track direction
    const gravityForce = GRAVITY * Math.sin(pathTangent.angle);
    
    // 3. Apply friction
    const frictionForce = segment.friction * marble.velocity.magnitude * -Math.sign(marble.velocity.magnitude);
    
    // 4. Calculate acceleration and update velocity
    const acceleration = (gravityForce + frictionForce) / marble.mass;
    marble.velocity.magnitude += acceleration * deltaTime;
    
    // 5. Clamp velocity (min/max speeds for fun factor)
    marble.velocity.magnitude = clamp(marble.velocity.magnitude, MIN_SPEED, MAX_SPEED);
    
    // 6. Update track progress
    marble.trackProgress += (marble.velocity.magnitude * deltaTime) / segment.path.length;
    
    // 7. Update visual position (with slight wobble for realism)
    marble.position = pathPoint.add(calculateWobble(marble, segment));
    
    // 8. Update rotation for visual roll
    marble.angularVelocity = marble.velocity.magnitude / marble.radius;
    
    // 9. Check for segment transition
    if (marble.trackProgress >= 1) {
      transitionToNextSegment(marble, segment);
    }
  }
  
  if (marble.state === 'falling' || marble.state === 'airborne') {
    // Standard projectile physics
    marble.velocity.y += GRAVITY * deltaTime;
    marble.position.add(marble.velocity.scale(deltaTime));
    
    // Check for track collision/capture
    checkTrackCollision(marble, track);
  }
}
```

#### Track Piece Physics Behaviors

| Track Type | Physics Behavior |
|------------|------------------|
| **Straight Ramp** | Constant acceleration based on angle, slight speed wobble |
| **Curve** | Centripetal force, marble hugs outer edge at high speed |
| **Spiral** | Continuous rotation, gradual descent, mesmerizing visual |
| **Loop-de-loop** | Requires minimum entry velocity, dramatic slowdown at top |
| **Funnel** | Orbital motion, gradually spiraling to center exit |
| **Split** | Random or triggered path selection |
| **Jump** | Projectile arc, must land on next track piece |
| **Bumper** | Velocity reflection with energy loss |
| **Spinner** | Affects marble rotation, visual flair |
| **Tube** | Hidden section, marble emerges at exit |

---

## Part 3: Track Generation System

### Procedural Track Algorithm

```typescript
interface TrackGenerationParams {
  difficulty: number;           // 1-10
  length: 'short' | 'medium' | 'long';
  theme: TrackTheme;
  requiredFeatures?: TrackFeature[];  // e.g., must include a loop
  educationalFocus?: Subject;   // Affects bucket labels, etc.
}

function generateTrack(params: TrackGenerationParams): TrackSystem {
  const segments: TrackSegment[] = [];
  
  // 1. Create entry zone (launcher area at top)
  segments.push(createLauncher(params.theme));
  
  // 2. Build main track using grammar-based generation
  //    Rules ensure physical plausibility (e.g., loops need run-up)
  const trackGrammar = getGrammarForDifficulty(params.difficulty);
  let currentY = LAUNCHER_Y;
  let currentX = SCREEN_CENTER_X;
  
  while (currentY < BUCKET_Y - 100) {
    const validNextPieces = trackGrammar.getValidNext(segments.at(-1));
    const nextPiece = weightedRandomSelect(validNextPieces, params);
    
    // Position and connect to previous segment
    const positioned = positionSegment(nextPiece, segments.at(-1), currentX, currentY);
    segments.push(positioned);
    
    currentY = positioned.exitPoint.y;
    currentX = positioned.exitPoint.x;
  }
  
  // 3. Create collection zone (buckets)
  segments.push(...createBuckets(params.educationalFocus, params.difficulty));
  
  // 4. Validate entire track (test marble can complete it)
  const validation = simulateMarbleRun(segments);
  if (!validation.success) {
    // Adjust problematic segments or regenerate
    return generateTrack(params);
  }
  
  return new TrackSystem(segments, params.theme);
}
```

### Track Themes (Visual Variety)

```typescript
type TrackTheme = 
  | 'wooden-classic'      // Brown wood grain, cozy
  | 'rainbow-candy'       // Bright colors, sparkles
  | 'space-station'       // Metallic, stars background
  | 'underwater'          // Blue/green, bubbles
  | 'jungle'              // Vines, leaves, natural
  | 'ice-palace'          // Crystalline, frosty
  | 'volcano'             // Red/orange, dramatic
  | 'cloud-kingdom'       // Fluffy, pastel
  | 'dinosaur-land'       // Prehistoric theme
  | 'robot-factory'       // Industrial, gears
```

Each theme includes: color palette, background, track textures, particle effects, ambient sounds, bucket designs.

---

## Part 4: Educational Content System

### Age-Based Curriculum Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ AGE │ COLORS │ COUNTING │ MATH │ PATTERNS │ LETTERS │ LOGIC │ MEMORY │
├─────┼────────┼──────────┼──────┼──────────┼─────────┼───────┼────────┤
│  3  │ Basic 4│   1-5    │  -   │  AB AB   │    -    │   -   │ 2 item │
│  4  │ Basic 6│   1-10   │  -   │  ABC ABC │  A-F    │Simple │ 3 item │
│  5  │ All 8  │   1-15   │ +1-3 │  ABBA    │  A-M    │ Easy  │ 4 item │
│  6  │ Shades │   1-20   │ +/-5 │  Complex │  A-Z    │Medium │ 5 item │
│  7  │ Mixing │  1-100   │ ×2,5 │  Number  │ Phonics │Medium │ 6 item │
│  8  │ Comple-│ Hundreds │ ×,÷  │  Shape   │ Spelling│ Hard  │ 7 item │
│  9  │ mentary│ Thousands│Frac. │  Algebra │ Vocab   │Complex│ 8 item │
│ 10  │ Theory │ Decimals │Order │  Coding  │ Grammar │Expert │ 9 item │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Challenge Types by Category

#### Colors (Ages 3-6, then advanced)
```typescript
const colorChallenges = {
  age3: [
    { type: 'tap-color', prompt: 'Tap the RED marble!', options: 4 },
    { type: 'match-bucket', prompt: 'Which bucket is BLUE?', options: 3 },
  ],
  age4: [
    { type: 'color-count', prompt: 'How many GREEN marbles?', showMarbles: true },
    { type: 'odd-one-out', prompt: 'Which color is different?', options: 4 },
  ],
  age5: [
    { type: 'color-sequence', prompt: 'Put these in rainbow order', draggable: true },
  ],
  age7plus: [
    { type: 'color-mixing', prompt: 'Red + Yellow = ?', options: ['Orange', 'Purple', 'Green'] },
    { type: 'complementary', prompt: 'What color completes the pair?', showColorWheel: true },
  ],
};
```

#### Counting & Numbers
```typescript
const countingChallenges = {
  age3: [
    { type: 'count-marbles', range: [1, 5], visual: true },
    { type: 'more-or-less', prompt: 'Which has MORE?', compareGroups: true },
  ],
  age5: [
    { type: 'count-by-twos', prompt: '2, 4, 6, ?', options: [7, 8, 9] },
    { type: 'missing-number', prompt: '1, 2, ?, 4', options: [3, 5, 0] },
  ],
  age7: [
    { type: 'place-value', prompt: 'What digit is in the tens place? 347' },
    { type: 'skip-counting', prompt: 'Count by 5s: 15, 20, ?' },
  ],
  age9: [
    { type: 'decimals', prompt: 'Which is greater: 0.5 or 0.25?' },
    { type: 'estimation', prompt: 'About how many marbles? (show ~47)' },
  ],
};
```

#### Math Operations
```typescript
const mathChallenges = {
  age5: [
    { type: 'visual-addition', num1: 2, num2: 3, showMarbles: true },
    { type: 'one-more', prompt: '4 + 1 = ?', options: [4, 5, 6] },
  ],
  age6: [
    { type: 'addition', range: [1, 10], showMarbles: false },
    { type: 'subtraction-visual', prompt: '5 marbles, 2 roll away. How many left?' },
  ],
  age7: [
    { type: 'multiplication', tables: [2, 5, 10] },
    { type: 'word-problem', prompt: '3 buckets, 4 marbles each. Total?' },
  ],
  age8: [
    { type: 'division', prompt: '12 ÷ 3 = ?' },
    { type: 'order-operations', prompt: '2 + 3 × 4 = ?' },
  ],
  age9: [
    { type: 'fractions', prompt: 'What is 1/2 of 8?' },
    { type: 'percentages', prompt: '50% of 20 = ?' },
  ],
  age10: [
    { type: 'negative-numbers', prompt: '5 - 8 = ?' },
    { type: 'algebra-intro', prompt: 'x + 3 = 7. What is x?' },
  ],
};
```

#### Pattern Recognition
```typescript
const patternChallenges = {
  age3: [
    { type: 'continue-pattern', pattern: ['red', 'blue', 'red', 'blue', '?'] },
    { type: 'copy-pattern', showPattern: true, buildYourOwn: true },
  ],
  age5: [
    { type: 'complex-pattern', pattern: ['red', 'red', 'blue', 'red', 'red', '?'] },
    { type: 'find-the-error', pattern: ['A', 'B', 'A', 'C', 'A', 'B'], hasError: true },
  ],
  age7: [
    { type: 'number-pattern', sequence: [2, 4, 6, 8, '?'] },
    { type: 'growing-pattern', shapes: true },
  ],
  age9: [
    { type: 'function-pattern', input: [1, 2, 3], output: [3, 5, 7], findRule: true },
  ],
};
```

#### Letters & Phonics (Ages 4-10)
```typescript
const letterChallenges = {
  age4: [
    { type: 'letter-recognition', prompt: 'Find the letter B', options: ['B', 'D', 'P', 'R'] },
    { type: 'letter-sound', prompt: 'Which letter makes the "sss" sound?' },
  ],
  age5: [
    { type: 'beginning-sound', prompt: 'CAT starts with...', options: ['C', 'K', 'S'] },
    { type: 'uppercase-lowercase', prompt: 'Match A to...', options: ['a', 'b', 'c'] },
  ],
  age6: [
    { type: 'rhyming', prompt: 'Which rhymes with CAT?', options: ['Hat', 'Dog', 'Cup'] },
    { type: 'sight-word', prompt: 'Spell THE', scrambled: ['T', 'E', 'H'] },
  ],
  age7: [
    { type: 'spelling', prompt: 'Spell MARBLE', audio: true },
    { type: 'vowel-consonant', prompt: 'Which is a vowel?', options: ['A', 'B', 'C', 'D'] },
  ],
  age8: [
    { type: 'syllables', prompt: 'How many syllables in BUTTERFLY?' },
    { type: 'compound-words', prompt: 'Sun + Flower = ?' },
  ],
  age9: [
    { type: 'vocabulary', prompt: 'What does VELOCITY mean?', context: 'marble speed' },
    { type: 'prefixes-suffixes', prompt: 'UN + happy = ?' },
  ],
};
```

#### Logic & Problem Solving (Ages 4-10)
```typescript
const logicChallenges = {
  age4: [
    { type: 'odd-one-out', items: ['apple', 'banana', 'car', 'orange'] },
    { type: 'what-comes-next', sequence: ['morning', 'afternoon', '?'] },
  ],
  age5: [
    { type: 'simple-maze', prompt: 'Which path leads to the bucket?' },
    { type: 'sorting', prompt: 'Put smallest to biggest' },
  ],
  age6: [
    { type: 'if-then', prompt: 'If red=1 point, blue=2 points. Red+Blue=?' },
    { type: 'categorization', prompt: 'Which group does MARBLE belong to?' },
  ],
  age7: [
    { type: 'simple-sudoku', grid: '4x4', partial: true },
    { type: 'deduction', prompt: 'Sam is taller than Max. Max is taller than Lee. Who is tallest?' },
  ],
  age8: [
    { type: 'logic-grid', clues: 3, variables: 3 },
    { type: 'probability', prompt: '3 red, 2 blue marbles. More likely to pick?' },
  ],
  age9: [
    { type: 'coding-basics', prompt: 'If marble=red, go left. Else go right.' },
    { type: 'sequencing', prompt: 'Put these steps in order to make a sandwich' },
  ],
  age10: [
    { type: 'algorithm', prompt: 'Write steps to sort marbles by size' },
    { type: 'venn-diagram', prompt: 'Where does BLUE LARGE marble go?' },
  ],
};
```

#### Memory Challenges (All Ages)
```typescript
const memoryChallenges = {
  // Universal but scaled by item count and display time
  all: [
    { 
      type: 'sequence-memory', 
      prompt: 'Remember the order!',
      itemCount: (age) => age - 1,  // 2 items at age 3, up to 9 at age 10
      displayTime: (age) => 3000 - (age * 100),  // Less time as they get older
    },
    {
      type: 'matching-pairs',
      gridSize: (age) => Math.min(age, 6),  // 3x3 at age 3, up to 6x6
    },
    {
      type: 'what-changed',
      items: (age) => age + 2,
      changes: (age) => Math.ceil(age / 3),
    },
  ],
};
```

### In-Game Educational Integration

Education shouldn't just be between levels—it should be IN the gameplay:

```typescript
// Educational buckets - marbles must go to correct answer
interface EducationalBucket {
  id: string;
  label: string | number;      // "3" or "RED" or "A"
  isCorrect: boolean;
  position: Vector2;
  theme: BucketTheme;
}

// Example: Math during play
// Prompt appears: "5 + 3 = ?"
// Three buckets labeled "7", "8", "9"
// Child must aim marbles at "8" bucket
// Correct bucket glows/celebrates
// Wrong bucket gently bounces marble back

// Example: Color sorting during play
// Marbles are random colors
// Buckets are labeled by color
// Match marble to bucket = points
// Creates natural categorization learning

// Example: Counting during play
// "Drop exactly 4 marbles into the star bucket"
// Progress shows: "2 of 4"
// Teaches counting with immediate feedback
```

---

## Part 5: Difficulty & Progression Engine

### Adaptive Difficulty System

```typescript
interface PlayerProfile {
  age: number;
  currentLevel: number;
  subjectMastery: {
    colors: number;       // 0-100
    counting: number;
    math: number;
    patterns: number;
    letters: number;
    logic: number;
    memory: number;
  };
  recentPerformance: ChallengeResult[];  // Last 20 challenges
  sessionDuration: number;
  frustrationIndicators: number;         // Rapid wrong answers, quitting
  flowIndicators: number;                // Streaks, fast correct answers
}

function selectNextChallenge(player: PlayerProfile): Challenge {
  // 1. Pick subject (weighted by weakest areas, but not exclusively)
  const subject = weightedSubjectSelection(player.subjectMastery);
  
  // 2. Determine difficulty within subject
  const recentAccuracy = calculateRecentAccuracy(player.recentPerformance, subject);
  
  let difficulty: 'easier' | 'maintain' | 'harder';
  if (recentAccuracy > 0.85) difficulty = 'harder';
  else if (recentAccuracy < 0.60) difficulty = 'easier';
  else difficulty = 'maintain';
  
  // 3. Check frustration/flow state
  if (player.frustrationIndicators > 3) {
    difficulty = 'easier';  // Give them a win
  }
  if (player.flowIndicators > 5) {
    difficulty = 'harder';  // They're in the zone, challenge them
  }
  
  // 4. Select specific challenge
  return getChallengeForLevel(subject, player.age, difficulty);
}

function adjustTrackDifficulty(player: PlayerProfile): TrackParams {
  return {
    // Longer/more complex tracks as mastery increases
    trackComplexity: Math.floor(player.currentLevel / 5) + 1,
    
    // More precision required at higher levels
    bucketSize: lerp(BUCKET_SIZE_LARGE, BUCKET_SIZE_SMALL, player.currentLevel / 50),
    
    // Faster marble speeds
    baseSpeed: lerp(SPEED_SLOW, SPEED_FAST, player.currentLevel / 50),
    
    // More track features
    features: getUnlockedFeatures(player.currentLevel),
    
    // Time pressure (optional, older kids only)
    timeLimit: player.age >= 7 ? calculateTimeLimit(player) : null,
  };
}
```

### Mastery Tracking

```typescript
// Each challenge updates mastery
function updateMastery(player: PlayerProfile, result: ChallengeResult) {
  const subject = result.challenge.subject;
  const currentMastery = player.subjectMastery[subject];
  
  if (result.correct) {
    // Increase mastery (more for harder challenges)
    const gain = result.challenge.difficulty * 2;
    player.subjectMastery[subject] = Math.min(100, currentMastery + gain);
  } else {
    // Slight decrease (not punishing)
    player.subjectMastery[subject] = Math.max(0, currentMastery - 1);
  }
}
```

---

## Part 6: Parent Dashboard

### Dashboard Features

```typescript
interface ParentDashboard {
  // Access via PIN or hidden gesture (prevents kids from accessing)
  accessMethod: 'pin' | 'long-press-settings' | 'shake-device';
  
  sections: {
    overview: {
      totalPlayTime: Duration;
      levelsCompleted: number;
      overallProgress: Percentage;
      streakDays: number;
    };
    
    learningProgress: {
      // Visual chart showing mastery by subject
      subjectMastery: Record<Subject, Percentage>;
      recentChallenges: ChallengeResult[];
      strengthAreas: Subject[];
      growthAreas: Subject[];
    };
    
    controls: {
      ageOverride: number | 'auto';
      difficultyBias: 'easier' | 'normal' | 'challenging';
      subjectFocus: Subject[] | 'all';
      sessionTimeLimit: Duration | 'unlimited';
      breakReminders: boolean;
      challengeFrequency: 'every-level' | 'every-2-levels' | 'every-3-levels';
    };
    
    contentToggles: {
      enableMath: boolean;
      enablePhonics: boolean;
      enablePatterns: boolean;
      enableLogic: boolean;
      enableMemory: boolean;
      enableColors: boolean;
      // Parents can disable subjects if child is getting them elsewhere
    };
    
    reports: {
      weeklyEmailSummary: boolean;
      exportProgressPDF: () => void;
      viewSessionHistory: () => SessionLog[];
    };
  };
}
```

### Parent Dashboard UI Requirements

```
┌─────────────────────────────────────────────────────────────────┐
│  👨‍👩‍👧 PARENT DASHBOARD                              [X Close]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PLAYER: Tommy (Age 5)          This Week: 2h 34m played       │
│  ═══════════════════════════════════════════════════════════   │
│                                                                 │
│  📊 LEARNING PROGRESS                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Colors      ████████████████████░░░░░░░░  78% ⭐         │   │
│  │ Counting    ██████████████████████░░░░░░  85% ⭐⭐       │   │
│  │ Patterns    ████████████░░░░░░░░░░░░░░░░  52%           │   │
│  │ Letters     ██████████████░░░░░░░░░░░░░░  61%           │   │
│  │ Math        ███████░░░░░░░░░░░░░░░░░░░░░  34% 💡        │   │
│  │ Logic       ██████████████████░░░░░░░░░░  71%           │   │
│  └─────────────────────────────────────────────────────────┘   │
│  💡 = Growth opportunity    ⭐ = Strength                      │
│                                                                 │
│  ⚙️ SETTINGS                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Age Setting:        [3] [4] [●5] [6] [7] [8] [9] [10]   │   │
│  │ Difficulty:         [Easier] [●Normal] [Challenging]     │   │
│  │ Challenge After:    [●1 level] [2 levels] [3 levels]    │   │
│  │ Session Limit:      [15min] [30min] [●60min] [None]     │   │
│  │ Break Reminders:    [●On] [Off]                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  📚 SUBJECT FOCUS (tap to toggle)                              │
│  [✓Colors] [✓Counting] [✓Patterns] [✓Letters] [○Math] [✓Logic] │
│                                                                 │
│  📈 RECENT ACTIVITY                                            │
│  • Yesterday: 45 min, 12 challenges (10 correct)               │
│  • Monday: 30 min, 8 challenges (7 correct)                    │
│  • Sunday: 1 hour, 15 challenges (12 correct)                  │
│                                                                 │
│  [📧 Email Weekly Reports]  [📄 Export Progress PDF]           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 7: UI/UX Specifications

### Core Interaction Design

```typescript
interface InteractionDesign {
  // Touch targets must be large (minimum 60px for ages 3-5, 44px for 6+)
  touchTargetSize: (age: number) => number;
  
  // Gestures
  primaryAction: 'tap';           // Drop marbles
  secondaryAction: 'drag';        // Aim launcher (older kids)
  menuAccess: 'corner-button';    // Pause/settings
  parentAccess: 'long-press-corner' | 'settings-pin';
  
  // Feedback (every action needs immediate feedback)
  haptics: {
    marbleDrop: 'light';
    marbleCollect: 'medium';
    correctAnswer: 'success';
    wrongAnswer: 'soft-warning';  // Never harsh
    levelComplete: 'celebration';
  };
  
  // Visual feedback
  touchFeedback: 'ripple' | 'glow';
  correctFeedback: 'confetti' | 'stars' | 'fireworks';
  wrongFeedback: 'gentle-shake';  // No red X, no harsh sounds
}
```

### Screen Layout

```
┌────────────────────────────────────────────────────────────────┐
│ [☰]  Level 12      🎯 2/5 marbles      ⭐ 1,247 pts      [⏸️] │
│      ═══════════════════════════════════════════════════════  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│                    ┌─────────────────┐                         │
│                    │   LAUNCHER      │  ← Tap zone            │
│                    │   🔵 🔴 🟢 🟡    │    (shows next marble) │
│                    └────────┬────────┘                         │
│                             │                                  │
│                    ╔════════╧════════╗                         │
│                    ║    RAMP         ║                         │
│                    ╚════════╤════════╝                         │
│                             │                                  │
│              ╔══════════════╧═══╗                              │
│              ║    SPIRAL         ║                             │
│              ╚════════╤══════════╝                             │
│                       │                                        │
│         ┌─────────────┴─────────────┐                          │
│         │         FUNNEL            │                          │
│         └───────────┬───────────────┘                          │
│                     │                                          │
│        ╔════════════╧════════════╗                             │
│        ║    LOOP-DE-LOOP         ║                             │
│        ╚════════════╤════════════╝                             │
│                     │                                          │
│    ┌────────┐  ┌────────┐  ┌────────┐                          │
│    │   7    │  │   8    │  │   9    │  ← Answer buckets       │
│    │  ⬜⬜⬜  │  │  ⬜⬜⬜  │  │  ⬜⬜⬜  │    (for 5+3=?)          │
│    └────────┘  └────────┘  └────────┘                          │
│                                                                │
│    [ 5 + 3 = ? ]  ← Current challenge prompt                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Animation Specifications

```typescript
const animations = {
  marblePhysics: {
    type: 'spring',
    damping: 10,
    stiffness: 100,
    mass: 1,
  },
  
  celebration: {
    confetti: { count: 50, duration: 2000, spread: 180 },
    stars: { count: 20, duration: 1500 },
    screenFlash: { color: 'gold', opacity: 0.3, duration: 200 },
  },
  
  levelTransition: {
    type: 'crossfade',
    duration: 500,
    trackBuildAnimation: 'piece-by-piece',  // Pieces slide in sequentially
  },
  
  challengeAppear: {
    type: 'spring-pop',
    scale: { from: 0.8, to: 1 },
    opacity: { from: 0, to: 1 },
    duration: 300,
  },
  
  wrongAnswerFeedback: {
    type: 'shake',
    intensity: 5,
    duration: 300,
    // NO harsh sounds, no red colors
  },
};
```

---

## Part 8: Audio Design

### Sound Categories

```typescript
const soundDesign = {
  marbles: {
    drop: 'soft-pop.mp3',           // When spawned
    roll: 'marble-roll-loop.mp3',   // While on track (pitch varies with speed)
    click: 'marble-click.mp3',       // Track transitions
    collect: 'chime-collect.mp3',   // Into bucket
    bounce: 'soft-bounce.mp3',      // Off walls
  },
  
  ui: {
    tap: 'soft-tap.mp3',
    correct: 'sparkle-success.mp3',  // Warm, not jarring
    incorrect: 'soft-bonk.mp3',      // Gentle, not punishing
    levelUp: 'fanfare-short.mp3',
    celebration: 'celebration-full.mp3',
  },
  
  ambient: {
    // Soft background music, toggleable
    themes: {
      default: 'playful-loop.mp3',
      space: 'cosmic-ambient.mp3',
      underwater: 'ocean-calm.mp3',
      jungle: 'nature-sounds.mp3',
    },
  },
  
  voice: {
    // Optional voice prompts for younger children
    enabled: (age) => age <= 5,
    prompts: {
      welcome: 'welcome-to-marble-masters.mp3',
      dropMarble: 'tap-to-drop-a-marble.mp3',
      levelComplete: 'great-job.mp3',
      // Challenge prompts read aloud
    },
  },
};
```

---

## Part 9: Performance Requirements

### Target Metrics

```typescript
const performanceTargets = {
  // Must hit 60fps on iPad Air (2020) and newer
  targetFPS: 60,
  maxMarbleCount: 20,           // On screen simultaneously
  physicsTick: 16.67,           // ms (60Hz)
  renderBudget: 10,             // ms per frame
  
  // Loading
  initialLoad: 2000,            // ms max
  levelTransition: 500,         // ms max
  assetPreload: true,           // Load next level assets during play
  
  // Memory
  maxHeapSize: 150,             // MB
  textureAtlasing: true,        // Combine sprites
  objectPooling: true,          // Reuse marble instances
};
```

### Optimization Strategies

```typescript
const optimizations = {
  physics: {
    useSpatialPartitioning: true,
    simplifyOffScreenMarbles: true,
    batchCollisionDetection: true,
  },
  
  rendering: {
    useCanvasOrWebGL: 'webgl-with-canvas-fallback',
    batchDrawCalls: true,
    cullOffScreen: true,
    reduceOverdraw: true,
  },
  
  assets: {
    compressTextures: true,
    lazyLoadThemes: true,
    cacheGeneratedTracks: true,
  },
};
```

---

## Part 10: Implementation Plan (Claude Code Sessions)

### Timeline Overview
**Total active time: 3-5 days of sessions** (not calendar days)
**Target: Nephews playing v1 within 1-2 weeks**

---

### SESSION 1: Core Physics Engine (2-3 hours)

**Prompt for Claude Code:**
```
Build a React + TypeScript marble game with Vite where marbles follow 
curved track paths using bezier curves. 

Requirements:
- Launcher zone at top (tap anywhere to drop marble)
- Marbles must FOLLOW the track centerline smoothly, not bounce randomly
- Start with 3 track pieces: straight ramp, curve, funnel
- Collection bucket at bottom with satisfying "collected" feedback
- Basic scoring display
- Progress bar showing "3/5 marbles dropped" toward level completion

Technical:
- Use Framer Motion for animations
- Touch-optimized (60px minimum tap targets)
- Target 60fps on iPad

The marble physics are CRITICAL. Marbles should:
- Roll along bezier curve paths
- Accelerate on downward slopes (gravity)
- Slow slightly on curves (friction)
- Have visible rotation matching their speed
- Feel satisfying and weighty, not floaty

Make it feel like a real marble on a real track.
```

**Your job during this session:**
- Test the physics feel constantly
- Give feedback: "too floaty," "too fast," "doesn't follow the curve"
- Iterate until dropping a marble feels satisfying

**Done when:** Dropping marbles and watching them roll is genuinely fun

---

### SESSION 2: Track System & Levels (2-3 hours)

**Prompt for Claude Code:**
```
Expand the track system:

New track pieces:
- Loop-de-loop (requires minimum entry velocity to complete)
- Spiral (continuous rotation, gradual descent)
- Split path (random or alternating which way marble goes)
- Jump gap (marble goes airborne, must land on next piece)
- Tube (marble hidden briefly, emerges at exit)

Track generation:
- Procedural generation that chains pieces together logically
- Validation: simulate that a marble can complete the track
- Each level = new randomly generated track
- Tracks get longer/more complex as levels increase

Visual themes (implement 3):
- "wooden-classic" - brown wood grain, cozy
- "rainbow-candy" - bright colors, sparkles
- "space-station" - metallic, stars background

Each theme has: color palette, track textures, background, bucket designs

Level flow:
- Complete track (drop X marbles into bucket) → celebration → generate new track
- Show level number and running score
```

**Your job:** Test that generated tracks are completable and visually interesting

**Done when:** You can play through 10+ levels and each feels different

---

### SESSION 3: Education Engine (3-4 hours)

**Prompt for Claude Code:**
```
Add the educational layer:

Age selection at game start:
- Fun selector: "I'm 3!" "I'm 4!" ... "I'm 10!" (big colorful buttons)
- Stores age, affects all challenge content

Challenge system (appears after completing each track):
- Modal slides up with a challenge
- Correct answer = confetti celebration + bonus points + next level
- Wrong answer = gentle shake animation, try again (NEVER punishing, no harsh sounds)
- Challenge difficulty scales with age

Implement these challenge types:

AGES 3-5:
- Color matching: "Tap the RED marble!" (show 4 colored marble options)
- Counting: "How many marbles?" (show 2-5 marbles, pick number)
- Simple patterns: "What comes next? Red, Blue, Red, ?" (show options)

AGES 6-8:
- Addition: "3 + 4 = ?" (show visual marbles + number options)
- Subtraction: "7 - 2 = ?" (show marbles rolling away)
- Letter recognition: "Find the letter B" (show B, D, P, R)
- Harder patterns: "Red, Red, Blue, Red, Red, ?" 

AGES 9-10:
- Multiplication: "4 × 3 = ?"
- Division: "12 ÷ 4 = ?"
- Word problems: "3 buckets, 4 marbles each. Total?"
- Pattern logic: "2, 4, 6, 8, ?" 
- Spelling: "Spell MARBLE" (scrambled letters to arrange)

Also add "educational buckets" during gameplay:
- Sometimes buckets are labeled with answers (e.g., "7", "8", "9")
- Prompt shows: "5 + 3 = ?"
- Player must aim marbles at correct bucket (8)
- This makes education PART of the game, not an interruption

Challenge selection should:
- Rotate through subjects (don't do 5 math problems in a row)
- Track what they've seen recently
- Slight bias toward their weaker areas (track accuracy by subject)
```

**Your job:** Verify challenges feel appropriate for each age

**Done when:** A 5-year-old's game feels different from a 9-year-old's game

---

### SESSION 4: Adaptive Difficulty & Progress (2-3 hours)

**Prompt for Claude Code:**
```
Add adaptive difficulty and progress tracking:

Player profile (stored in localStorage):
- Selected age
- Mastery by subject (colors, counting, math, patterns, letters, logic)
- Recent challenge results (last 20)
- Total levels completed, total score

Adaptive difficulty:
- Track accuracy per subject
- If accuracy > 85% in a subject → give harder challenges
- If accuracy < 60% → give easier challenges
- If 3 wrong answers in a row → next challenge is easy (give them a win)
- If 5 correct in a row → increase difficulty (they're in flow)

Track difficulty also scales:
- More track pieces as levels increase
- Smaller bucket targets at higher levels
- Optional: time bonus for older kids (8+)

Mastery visualization:
- Simple progress bars somewhere accessible
- "You're getting great at counting! ⭐"
- Unlock celebration when mastery hits milestones (50%, 75%, 100%)

Keep it encouraging - never show failure states, only progress
```

---

### SESSION 5: Parent Dashboard (2-3 hours)

**Prompt for Claude Code:**
```
Add parent dashboard behind a PIN:

Access method:
- Small gear icon in corner
- Long press (2 seconds) to open
- 4-digit PIN entry (default: 0000, changeable)
- Kids can't accidentally access

Dashboard sections:

OVERVIEW:
- Player name/age
- Total play time
- Levels completed
- Current streak (days played)

PROGRESS BY SUBJECT (visual bar charts):
- Colors: ████████░░ 80%
- Counting: ██████░░░░ 60%
- Math: ████░░░░░░ 40%
- Patterns: ███████░░░ 70%
- Letters: █████░░░░░ 50%
- Logic: ██████░░░░ 60%
Mark strongest and "growth opportunity" areas

SETTINGS:
- Age override (dropdown 3-10 or "auto")
- Difficulty bias: Easier / Normal / Challenging
- Challenge frequency: Every level / Every 2 / Every 3 levels
- Session time limit: 15/30/60 min / Unlimited
- Break reminders: On/Off

SUBJECT TOGGLES:
- Enable/disable each subject (checkboxes)
- Use case: "He's doing phonics at school, focus on math here"

RECENT ACTIVITY:
- Last 7 days summary
- "Monday: 25 min, 8 challenges, 7 correct"

Keep the UI clean and parent-friendly, not overwhelming
```

---

### SESSION 6: Audio & Polish (2-3 hours)

**Prompt for Claude Code:**
```
Add audio and final polish:

Sound effects (use Howler.js):
- Marble drop: soft pop
- Marble rolling: gentle rolling sound (loop, pitch varies with speed)
- Marble collected: satisfying chime
- Correct answer: sparkle/success sound
- Wrong answer: soft bonk (gentle, not harsh)
- Level complete: short fanfare
- Button taps: soft click

Background music:
- Gentle, looping, not annoying
- Toggle on/off in settings
- Lower volume during challenges

Visual polish:
- Marble reflections/shadows
- Particle effects on collection (sparkles)
- Screen-wide confetti on level complete
- Smooth transitions between screens
- Loading states that don't feel broken

Haptic-style feedback:
- Visual "pulse" on every tap
- Screen shake on celebrations
- Subtle bounce on buttons

Performance check:
- Verify 60fps with 10+ marbles
- Lazy load audio files
- Optimize for iPad Safari specifically

PWA requirements:
- Add manifest.json with app icon
- Service worker for offline play
- Splash screen
- "Add to Home Screen" prompt/instructions
```

---

### SESSION 7: Testing & Deployment (1-2 hours)

**Prompt for Claude Code:**
```
Prepare for deployment:

PWA Setup:
- Configure vite-plugin-pwa
- Create app icons (192x192, 512x512)
- manifest.json with:
  - name: "Marble Masters"
  - short_name: "Marbles"
  - theme_color and background_color
  - display: "standalone"
  - orientation: "portrait"
- Service worker for offline caching

Build optimization:
- Production build with minification
- Code splitting for faster initial load
- Preload critical assets

Create simple landing page:
- Hero showing game screenshot
- "Play Now" button (launches game)
- Instructions for "Add to Home Screen" on iPad
- Age range note: "For ages 3-10"

Vercel deployment:
- Create vercel.json if needed
- Ensure all routes work
- Test the deployed URL on actual iPad
```

**Deployment steps (you do this):**
1. Create account at vercel.com
2. Connect your GitHub repo (Claude Code can help set this up)
3. Deploy with one click
4. Get your URL: `https://marble-masters.vercel.app`
5. Open on iPad → Add to Home Screen → Test with nephews

---

### Post-Launch: Iteration Based on Nephew Testing

After your nephews play it, come back with observations:
- "They kept tapping the wrong bucket, targets too small"
- "The 3-year-old couldn't read the prompts"
- "They got bored after 10 minutes"
- "They loved the loops but ignored the educational parts"

Claude Code can iterate based on real feedback.

---

## Part 11: Future App Store Path (Optional)

If the nephews love it and you want to publish:

### Requirements
- Mac (borrow, rent cloud Mac for ~$50, or hire Fiverr wrapper service)
- Apple Developer Account ($99/year)
- Privacy policy page (free GitHub Pages works)
- App Store assets (screenshots, description, preview video)

### COPPA Compliance for Kids Apps
- No behavioral advertising
- No personal data collection without parental consent
- No external links without parental gate
- Your PIN-protected parent dashboard helps here

### Monetization Options
| Model | Recommendation |
|-------|----------------|
| Paid upfront $4.99-6.99 | Best for quality perception |
| Free + IAP unlock | More downloads, lower conversion |
| Subscription | Parents hate this for kids apps |

### Timeline to App Store
- Capacitor wrapper setup: 2-3 hours (on Mac)
- App Store assets: 1-2 days
- TestFlight review: 1-3 days
- App Store review: 3-7 days (kids apps get extra scrutiny)

**Don't worry about this now.** Build something great first.

---

## Part 12: Success Metrics

### Real Success (What Actually Matters)
- Nephews ask to play it again
- They're learning without realizing it
- Parents (your siblings) notice educational value
- You had fun building it

### Engagement Metrics (If Tracking)
- Average session length: Target 15+ minutes
- Return rate: Target 60%+ next-day return
- Level completion rate: Target 85%+
- Rage quit rate: Target <5%

### Educational Metrics
- Challenge accuracy: Target 70-80% (not too easy, not too hard)
- Subject mastery growth: Measurable improvement over 2 weeks
- Retention: Skills tested again after 1 week show >60% retention

---

## Quick Start

### Initial Setup (Do Once)
```bash
# Create project folder
mkdir marble-masters
cd marble-masters

# Initialize with Claude Code
# Just start a Claude Code session and paste Session 1 prompt
```

### Development Workflow
1. Open Claude Code
2. Paste the session prompt
3. Let it build
4. Test in browser (Chrome DevTools → iPad emulation)
5. Give feedback ("too floaty", "buttons too small")
6. Iterate until it feels right
7. Move to next session

### Testing on Actual iPad
After each major session:
1. Push to GitHub
2. Vercel auto-deploys
3. Open URL on iPad Safari
4. Add to Home Screen
5. Play test

### Priority Order
1. **Physics feel** — Marbles must feel satisfying
2. **Core loop** — Drop → roll → collect → celebrate → next level
3. **Education** — Challenges that feel like gameplay
4. **Age scaling** — 3-year-old experience ≠ 10-year-old experience
5. **Parent dashboard** — Control and visibility
6. **Polish** — Audio, particles, celebrations

### Critical Success Factors
- Marbles MUST follow tracks smoothly (not random bouncing)
- Wrong answers MUST never feel punishing
- Every tap MUST have immediate feedback
- Education MUST feel like gameplay, not interruption
- The 3-year-old MUST be able to play without reading

### Files Claude Code Should Create
```
/marble-masters
  /src
    /components      # React components
    /systems         # Physics, education, difficulty engines
    /data           # Challenge content, track pieces
    /hooks          # Custom React hooks
    /types          # TypeScript interfaces
    App.tsx
    main.tsx
  /public
    /sounds         # Audio files
    /images         # Sprites, backgrounds
    manifest.json   # PWA manifest
  index.html
  vite.config.ts
  tailwind.config.js
  package.json
```

---

## Final Notes

**This spec is a reference, not a script.** Claude Code works best with focused prompts per session, not a giant document dump.

Use the session prompts in Part 10. They're designed for iterative development with your feedback in the loop.

The physics are the foundation. If dropping a marble doesn't feel magical, nothing else matters. Spend extra time on Session 1.

When in doubt, test with the nephews. They'll tell you what's broken faster than any spec.

Good luck—make something those kids will love! 🎯
