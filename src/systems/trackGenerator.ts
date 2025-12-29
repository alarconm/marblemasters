import {
  TrackSegment,
  Bucket,
  TrackTheme,
  Vector2,
  BezierPath,
  BezierPoint,
  PHYSICS,
} from '@/types';
import {
  randomBetween,
  randomChoice,
  calculatePathLength,
} from '@/utils/mathHelpers';

// ============================================
// DELIGHTFUL TRACK GENERATOR
// Creates long, winding, colorful marble tracks
// that fill the screen and are fun to watch!
// ============================================

interface TrackGeneratorParams {
  theme: TrackTheme;
  screenWidth: number;
  screenHeight: number;
  difficulty: number;
}

// Track patterns for variety
type TrackPattern =
  | 'zigzag-wide'      // Big sweeping zigzags
  | 'snake'            // S-curves down the screen
  | 'spiral-descent'   // Spiraling down one side then the other
  | 'waterfall'        // Cascading curves like a waterfall
  | 'rollercoaster';   // Up and down with big loops

// Generate a complete track with buckets
export function generateTrack(params: TrackGeneratorParams): {
  track: TrackSegment[];
  buckets: Bucket[];
  launcherPosition: Vector2;
} {
  const { theme, screenWidth, screenHeight } = params;

  // Choose a random track pattern
  const patterns: TrackPattern[] = ['zigzag-wide', 'snake', 'spiral-descent', 'waterfall', 'rollercoaster'];
  const pattern = randomChoice(patterns);

  // Generate based on pattern
  const segments = generatePatternTrack(pattern, screenWidth, screenHeight, theme);

  // Create buckets at the bottom
  const buckets = createBuckets(screenWidth, screenHeight, theme);

  // Add funnel to guide marbles to buckets
  const lastSegment = segments[segments.length - 1];
  const funnelSegments = createFunnelToGoal(lastSegment.exitPoint, screenWidth, screenHeight, theme, segments.length);
  segments.push(...funnelSegments);

  // Link the last regular segment to funnel
  if (funnelSegments.length > 0) {
    lastSegment.nextSegments = [funnelSegments[0].id];
  }

  // Launcher position at top center
  const launcherPosition: Vector2 = { x: screenWidth / 2, y: 50 };

  return { track: segments, buckets, launcherPosition };
}

// Generate track based on pattern type
function generatePatternTrack(
  pattern: TrackPattern,
  screenWidth: number,
  screenHeight: number,
  theme: TrackTheme
): TrackSegment[] {
  const padding = 40; // Edge padding
  const leftEdge = padding;
  const rightEdge = screenWidth - padding;
  const usableWidth = rightEdge - leftEdge;

  const startY = 100; // Below launcher
  const endY = screenHeight - 180; // Above buckets
  const usableHeight = endY - startY;

  switch (pattern) {
    case 'zigzag-wide':
      return generateZigzagWide(leftEdge, rightEdge, startY, endY, usableWidth, usableHeight, theme);
    case 'snake':
      return generateSnake(leftEdge, rightEdge, startY, endY, usableWidth, usableHeight, theme);
    case 'spiral-descent':
      return generateSpiralDescent(leftEdge, rightEdge, startY, endY, usableWidth, usableHeight, theme);
    case 'waterfall':
      return generateWaterfall(leftEdge, rightEdge, startY, endY, usableWidth, usableHeight, theme);
    case 'rollercoaster':
      return generateRollercoaster(leftEdge, rightEdge, startY, endY, usableWidth, usableHeight, theme);
    default:
      return generateZigzagWide(leftEdge, rightEdge, startY, endY, usableWidth, usableHeight, theme);
  }
}

// ZIGZAG WIDE - Big sweeping curves from edge to edge
function generateZigzagWide(
  leftEdge: number, rightEdge: number,
  startY: number, _endY: number,
  _usableWidth: number, usableHeight: number,
  theme: TrackTheme
): TrackSegment[] {
  const segments: TrackSegment[] = [];
  const segmentCount = randomBetween(6, 8);
  const segmentHeight = usableHeight / segmentCount;

  let currentX = (leftEdge + rightEdge) / 2; // Start center
  let currentY = startY;
  let goingRight = Math.random() > 0.5;

  for (let i = 0; i < segmentCount; i++) {
    const nextY = currentY + segmentHeight;
    const nextX = goingRight
      ? randomBetween(rightEdge - 60, rightEdge)
      : randomBetween(leftEdge, leftEdge + 60);

    const entry: Vector2 = { x: currentX, y: currentY };
    const exit: Vector2 = { x: nextX, y: nextY };

    // Create a big sweeping curve
    const path = createSweepingCurve(entry, exit, goingRight ? 'right' : 'left');

    const segment: TrackSegment = {
      id: `segment-${i}`,
      type: goingRight ? 'curve-right' : 'curve-left',
      path,
      width: PHYSICS.TRACK_WIDTH,
      friction: PHYSICS.DEFAULT_FRICTION,
      bounciness: 0.3,
      entryPoint: entry,
      exitPoint: exit,
      nextSegments: i < segmentCount - 1 ? [`segment-${i + 1}`] : [],
      theme,
    };

    segments.push(segment);
    currentX = nextX;
    currentY = nextY;
    goingRight = !goingRight;
  }

  return segments;
}

// SNAKE - Smooth S-curves flowing down
function generateSnake(
  leftEdge: number, rightEdge: number,
  startY: number, _endY: number,
  usableWidth: number, usableHeight: number,
  theme: TrackTheme
): TrackSegment[] {
  const segments: TrackSegment[] = [];
  const segmentCount = randomBetween(8, 10);
  const segmentHeight = usableHeight / segmentCount;

  let currentX = (leftEdge + rightEdge) / 2;
  let currentY = startY;

  for (let i = 0; i < segmentCount; i++) {
    const progress = i / segmentCount;
    const nextY = currentY + segmentHeight;

    // Snake oscillates with varying amplitude
    const amplitude = usableWidth * 0.4 * Math.sin(progress * Math.PI);
    const offset = Math.sin((i + 0.5) * Math.PI) * (usableWidth * 0.35 + amplitude * 0.2);
    const nextX = (leftEdge + rightEdge) / 2 + offset;

    const entry: Vector2 = { x: currentX, y: currentY };
    const exit: Vector2 = { x: nextX, y: nextY };

    const path = createFlowingCurve(entry, exit);

    const segment: TrackSegment = {
      id: `segment-${i}`,
      type: offset > 0 ? 'curve-right' : 'curve-left',
      path,
      width: PHYSICS.TRACK_WIDTH,
      friction: PHYSICS.DEFAULT_FRICTION,
      bounciness: 0.3,
      entryPoint: entry,
      exitPoint: exit,
      nextSegments: i < segmentCount - 1 ? [`segment-${i + 1}`] : [],
      theme,
    };

    segments.push(segment);
    currentX = nextX;
    currentY = nextY;
  }

  return segments;
}

// SPIRAL DESCENT - Curves that spiral around
function generateSpiralDescent(
  leftEdge: number, rightEdge: number,
  startY: number, _endY: number,
  _usableWidth: number, usableHeight: number,
  theme: TrackTheme
): TrackSegment[] {
  const segments: TrackSegment[] = [];
  const segmentCount = randomBetween(7, 9);
  const segmentHeight = usableHeight / segmentCount;

  let currentX = (leftEdge + rightEdge) / 2;
  let currentY = startY;

  for (let i = 0; i < segmentCount; i++) {
    const nextY = currentY + segmentHeight;
    const angle = (i * Math.PI * 0.7); // Spiral angle
    const radius = (rightEdge - leftEdge) * 0.35;
    const centerX = (leftEdge + rightEdge) / 2;
    const nextX = centerX + Math.sin(angle) * radius;

    const entry: Vector2 = { x: currentX, y: currentY };
    const exit: Vector2 = { x: nextX, y: nextY };

    // Spiral curves have more pronounced curvature
    const path = createSpiralCurve(entry, exit, i % 2 === 0);

    const segment: TrackSegment = {
      id: `segment-${i}`,
      type: 'spiral',
      path,
      width: PHYSICS.TRACK_WIDTH,
      friction: PHYSICS.DEFAULT_FRICTION,
      bounciness: 0.3,
      entryPoint: entry,
      exitPoint: exit,
      nextSegments: i < segmentCount - 1 ? [`segment-${i + 1}`] : [],
      theme,
    };

    segments.push(segment);
    currentX = nextX;
    currentY = nextY;
  }

  return segments;
}

// WATERFALL - Cascading curves like water flowing down rocks
function generateWaterfall(
  leftEdge: number, rightEdge: number,
  startY: number, endY: number,
  usableWidth: number, usableHeight: number,
  theme: TrackTheme
): TrackSegment[] {
  const segments: TrackSegment[] = [];
  const segmentCount = randomBetween(9, 12);
  const avgHeight = usableHeight / segmentCount;

  let currentX = (leftEdge + rightEdge) / 2;
  let currentY = startY;

  for (let i = 0; i < segmentCount; i++) {
    // Varying drop heights for waterfall effect
    const heightVariation = randomBetween(0.7, 1.3);
    const nextY = Math.min(currentY + avgHeight * heightVariation, endY);

    // Cascading left and right
    const cascadeDirection = Math.sin(i * 1.2) > 0 ? 1 : -1;
    const cascadeAmount = randomBetween(0.2, 0.4) * usableWidth * cascadeDirection;
    const nextX = Math.max(leftEdge + 30, Math.min(rightEdge - 30, currentX + cascadeAmount));

    const entry: Vector2 = { x: currentX, y: currentY };
    const exit: Vector2 = { x: nextX, y: nextY };

    const path = createWaterfallCurve(entry, exit);

    const segment: TrackSegment = {
      id: `segment-${i}`,
      type: cascadeDirection > 0 ? 'curve-right' : 'curve-left',
      path,
      width: PHYSICS.TRACK_WIDTH,
      friction: PHYSICS.DEFAULT_FRICTION * 0.8, // Less friction for waterfall
      bounciness: 0.4,
      entryPoint: entry,
      exitPoint: exit,
      nextSegments: i < segmentCount - 1 ? [`segment-${i + 1}`] : [],
      theme,
    };

    segments.push(segment);
    currentX = nextX;
    currentY = nextY;

    if (currentY >= endY) break;
  }

  return segments;
}

// ROLLERCOASTER - Fun ups and downs
function generateRollercoaster(
  leftEdge: number, rightEdge: number,
  startY: number, endY: number,
  usableWidth: number, usableHeight: number,
  theme: TrackTheme
): TrackSegment[] {
  const segments: TrackSegment[] = [];
  const segmentCount = randomBetween(8, 11);

  let currentX = (leftEdge + rightEdge) / 2;
  let currentY = startY;
  let segmentId = 0;

  // Calculate base progression
  const yStep = usableHeight / segmentCount;

  for (let i = 0; i < segmentCount; i++) {
    // Base Y progression with some variation
    const baseNextY = startY + (i + 1) * yStep;
    const nextY = Math.min(baseNextY + randomBetween(-20, 20), endY);

    // Rollercoaster X movement
    const xPhase = i * Math.PI * 0.6;
    const xAmplitude = usableWidth * 0.38;
    const nextX = (leftEdge + rightEdge) / 2 + Math.sin(xPhase) * xAmplitude;

    const entry: Vector2 = { x: currentX, y: currentY };
    const exit: Vector2 = { x: nextX, y: nextY };

    // Rollercoaster curves with loops
    const path = createRollercoasterCurve(entry, exit, i);

    const segment: TrackSegment = {
      id: `segment-${segmentId++}`,
      type: i % 3 === 0 ? 'loop' : (nextX > currentX ? 'curve-right' : 'curve-left'),
      path,
      width: PHYSICS.TRACK_WIDTH,
      friction: PHYSICS.DEFAULT_FRICTION,
      bounciness: 0.35,
      entryPoint: entry,
      exitPoint: exit,
      nextSegments: i < segmentCount - 1 ? [`segment-${segmentId}`] : [],
      theme,
    };

    segments.push(segment);
    currentX = nextX;
    currentY = nextY;
  }

  return segments;
}

// ============================================
// PATH CREATION FUNCTIONS
// These create beautiful bezier curves
// ============================================

// Big sweeping curve from one side to the other
function createSweepingCurve(entry: Vector2, exit: Vector2, direction: 'left' | 'right'): BezierPath {
  const midY = (entry.y + exit.y) / 2;
  const curveDepth = Math.abs(exit.x - entry.x) * 0.6;
  const curveOffset = direction === 'right' ? curveDepth : -curveDepth;

  const points: BezierPoint[] = [
    { x: entry.x, y: entry.y },
    { x: entry.x + curveOffset * 0.3, y: entry.y + (midY - entry.y) * 0.3 },
    { x: entry.x + curveOffset * 0.7, y: midY },
    { x: (entry.x + exit.x) / 2 + curveOffset * 0.2, y: midY + (exit.y - midY) * 0.3 },
    { x: exit.x + curveOffset * 0.3, y: exit.y - (exit.y - midY) * 0.4 },
    { x: exit.x, y: exit.y - (exit.y - midY) * 0.15 },
    { x: exit.x, y: exit.y },
  ];

  const path: BezierPath = { points, length: 0 };
  path.length = calculatePathLength(path);
  return path;
}

// Smooth flowing S-curve
function createFlowingCurve(entry: Vector2, exit: Vector2): BezierPath {
  const dx = exit.x - entry.x;
  const dy = exit.y - entry.y;
  const curvature = Math.abs(dx) * 0.5;

  const points: BezierPoint[] = [
    { x: entry.x, y: entry.y },
    { x: entry.x + dx * 0.1, y: entry.y + dy * 0.25 },
    { x: entry.x + dx * 0.4 + (dx > 0 ? curvature : -curvature) * 0.3, y: entry.y + dy * 0.4 },
    { x: entry.x + dx * 0.5, y: entry.y + dy * 0.5 },
    { x: entry.x + dx * 0.6 + (dx > 0 ? -curvature : curvature) * 0.3, y: entry.y + dy * 0.6 },
    { x: exit.x - dx * 0.1, y: exit.y - dy * 0.25 },
    { x: exit.x, y: exit.y },
  ];

  const path: BezierPath = { points, length: 0 };
  path.length = calculatePathLength(path);
  return path;
}

// Spiral-like curve
function createSpiralCurve(entry: Vector2, exit: Vector2, clockwise: boolean): BezierPath {
  const dx = exit.x - entry.x;
  const dy = exit.y - entry.y;
  const spiralOffset = Math.abs(dx) * 0.8 * (clockwise ? 1 : -1);

  const points: BezierPoint[] = [
    { x: entry.x, y: entry.y },
    { x: entry.x + spiralOffset * 0.5, y: entry.y + dy * 0.15 },
    { x: entry.x + spiralOffset * 0.8, y: entry.y + dy * 0.35 },
    { x: entry.x + spiralOffset * 0.6, y: entry.y + dy * 0.5 },
    { x: entry.x + spiralOffset * 0.2, y: entry.y + dy * 0.65 },
    { x: exit.x - spiralOffset * 0.3, y: exit.y - dy * 0.2 },
    { x: exit.x, y: exit.y },
  ];

  const path: BezierPath = { points, length: 0 };
  path.length = calculatePathLength(path);
  return path;
}

// Waterfall cascade curve
function createWaterfallCurve(entry: Vector2, exit: Vector2): BezierPath {
  const dx = exit.x - entry.x;
  const dy = exit.y - entry.y;

  // Waterfall has a steeper drop in the middle
  const points: BezierPoint[] = [
    { x: entry.x, y: entry.y },
    { x: entry.x + dx * 0.2, y: entry.y + dy * 0.1 },
    { x: entry.x + dx * 0.35, y: entry.y + dy * 0.25 },
    { x: entry.x + dx * 0.5, y: entry.y + dy * 0.55 }, // Steeper middle
    { x: entry.x + dx * 0.65, y: entry.y + dy * 0.75 },
    { x: exit.x - dx * 0.15, y: exit.y - dy * 0.1 },
    { x: exit.x, y: exit.y },
  ];

  const path: BezierPath = { points, length: 0 };
  path.length = calculatePathLength(path);
  return path;
}

// Rollercoaster curve with optional mini-loop feel
function createRollercoasterCurve(entry: Vector2, exit: Vector2, index: number): BezierPath {
  const dx = exit.x - entry.x;
  const dy = exit.y - entry.y;

  // Every 3rd segment gets a more dramatic curve
  const isLoopy = index % 3 === 0;
  const loopFactor = isLoopy ? 1.5 : 1;
  const bulge = Math.abs(dx) * 0.4 * loopFactor;
  const direction = dx > 0 ? 1 : -1;

  const points: BezierPoint[] = [
    { x: entry.x, y: entry.y },
    { x: entry.x + direction * bulge * 0.3, y: entry.y + dy * 0.15 },
    { x: entry.x + direction * bulge * 0.6, y: entry.y + dy * 0.3 },
    { x: entry.x + dx * 0.5 + direction * bulge * 0.2, y: entry.y + dy * 0.5 },
    { x: exit.x - direction * bulge * 0.4, y: exit.y - dy * 0.3 },
    { x: exit.x - direction * bulge * 0.15, y: exit.y - dy * 0.1 },
    { x: exit.x, y: exit.y },
  ];

  const path: BezierPath = { points, length: 0 };
  path.length = calculatePathLength(path);
  return path;
}

// ============================================
// FUNNEL & BUCKET CREATION
// ============================================

// Create funnel segment(s) to guide marbles to buckets
function createFunnelToGoal(
  fromPoint: Vector2,
  screenWidth: number,
  screenHeight: number,
  theme: TrackTheme,
  startId: number
): TrackSegment[] {
  const segments: TrackSegment[] = [];
  const centerX = screenWidth / 2;
  const bucketY = screenHeight - 100;

  // Create a gentle curve to center
  const entry = fromPoint;
  const exit: Vector2 = { x: centerX, y: bucketY };

  const dx = exit.x - entry.x;
  const dy = exit.y - entry.y;
  const curveOffset = dx * 0.3;

  const points: BezierPoint[] = [
    { x: entry.x, y: entry.y },
    { x: entry.x + curveOffset, y: entry.y + dy * 0.3 },
    { x: centerX - curveOffset * 0.5, y: exit.y - dy * 0.3 },
    { x: exit.x, y: exit.y },
  ];

  const path: BezierPath = { points, length: 0 };
  path.length = calculatePathLength(path);

  const funnelSegment: TrackSegment = {
    id: `segment-${startId}`,
    type: 'funnel',
    path,
    width: PHYSICS.TRACK_WIDTH * 1.3,
    friction: PHYSICS.DEFAULT_FRICTION * 1.2,
    bounciness: 0.2,
    entryPoint: entry,
    exitPoint: exit,
    nextSegments: [],
    theme,
  };

  segments.push(funnelSegment);
  return segments;
}

// Create collection buckets at the bottom
function createBuckets(screenWidth: number, screenHeight: number, theme: TrackTheme): Bucket[] {
  const bucketCount = 3;
  const bucketWidth = 65;
  const bucketHeight = 55;
  const totalWidth = bucketCount * bucketWidth + (bucketCount - 1) * 15;
  const startX = screenWidth / 2 - totalWidth / 2 + bucketWidth / 2;
  const bucketY = screenHeight - bucketHeight - 15;

  const buckets: Bucket[] = [];
  for (let i = 0; i < bucketCount; i++) {
    buckets.push({
      id: `bucket-${i}`,
      position: {
        x: startX + i * (bucketWidth + 15),
        y: bucketY,
      },
      width: bucketWidth,
      height: bucketHeight,
      theme,
    });
  }

  return buckets;
}

export default generateTrack;
