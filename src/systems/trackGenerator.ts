import {
  TrackSegment,
  Bucket,
  TrackTheme,
  Vector2,
  BezierPath,
  PHYSICS,
} from '@/types';
import {
  createCurvedPath,
  createStraightPath,
  createSCurvePath,
  randomBetween,
} from '@/utils/mathHelpers';

// ============================================
// SIMPLE TRACK GENERATOR
// Creates playable tracks for Phase 1 testing
// ============================================

interface TrackGeneratorParams {
  theme: TrackTheme;
  screenWidth: number;
  screenHeight: number;
  difficulty: number;
}

// Generate a complete track with buckets
export function generateTrack(params: TrackGeneratorParams): {
  track: TrackSegment[];
  buckets: Bucket[];
  launcherPosition: Vector2;
} {
  const { theme, screenWidth, screenHeight, difficulty } = params;
  const centerX = screenWidth / 2;
  const trackWidth = PHYSICS.TRACK_WIDTH;

  const segments: TrackSegment[] = [];
  let currentY = 120; // Start below launcher
  let currentX = centerX;
  let segmentId = 0;

  // Launcher position
  const launcherPosition: Vector2 = { x: centerX, y: 60 };

  // Generate 3-6 track segments based on difficulty
  const segmentCount = 3 + Math.min(Math.floor(difficulty / 2), 3);

  for (let i = 0; i < segmentCount; i++) {
    const segmentHeight = randomBetween(100, 180);
    const nextY = currentY + segmentHeight;

    // Create zigzag pattern - alternate left and right
    const direction = i % 2 === 0 ? 1 : -1;
    const minOffset = 60; // Minimum horizontal movement
    const maxOffset = Math.min(150, (screenWidth / 2) - 100);
    const offset = randomBetween(minOffset, maxOffset) * direction;

    let nextX = currentX + offset;
    // Keep within screen bounds with padding
    nextX = Math.max(100, Math.min(screenWidth - 100, nextX));

    // Choose segment type based on direction
    const segmentType = chooseSegmentType(i, segmentCount, offset);

    // Create the segment
    const entry: Vector2 = { x: currentX, y: currentY };
    const exit: Vector2 = { x: nextX, y: nextY };

    const path = createSegmentPath(entry, exit, segmentType);

    const segment: TrackSegment = {
      id: `segment-${segmentId++}`,
      type: segmentType,
      path,
      width: trackWidth,
      friction: PHYSICS.DEFAULT_FRICTION,
      bounciness: 0.3,
      entryPoint: entry,
      exitPoint: exit,
      nextSegments: [], // Will be filled in later
      theme,
    };

    segments.push(segment);
    currentX = nextX;
    currentY = nextY;
  }

  // Link segments together
  for (let i = 0; i < segments.length - 1; i++) {
    segments[i].nextSegments = [segments[i + 1].id];
  }

  // Create buckets at the bottom
  const bucketCount = 3;
  const bucketWidth = 70;
  const bucketHeight = 60;
  const totalBucketWidth = bucketCount * bucketWidth + (bucketCount - 1) * 20;
  const bucketStartX = centerX - totalBucketWidth / 2 + bucketWidth / 2;
  const bucketY = screenHeight - bucketHeight - 20;

  const buckets: Bucket[] = [];
  for (let i = 0; i < bucketCount; i++) {
    buckets.push({
      id: `bucket-${i}`,
      position: {
        x: bucketStartX + i * (bucketWidth + 20),
        y: bucketY,
      },
      width: bucketWidth,
      height: bucketHeight,
      theme,
    });
  }

  // Add final segment to guide marbles to buckets
  const lastSegment = segments[segments.length - 1];
  const funnelEntry = lastSegment.exitPoint;
  const funnelExit: Vector2 = { x: centerX, y: bucketY - 10 };

  const funnelPath = createCurvedPath(
    funnelEntry,
    funnelExit,
    funnelEntry.x > centerX ? 'left' : 'right',
    0.3
  );

  const funnelSegment: TrackSegment = {
    id: `segment-${segmentId++}`,
    type: 'funnel',
    path: funnelPath,
    width: trackWidth * 1.2,
    friction: PHYSICS.DEFAULT_FRICTION * 1.5,
    bounciness: 0.2,
    entryPoint: funnelEntry,
    exitPoint: funnelExit,
    nextSegments: [],
    theme,
  };

  segments.push(funnelSegment);
  lastSegment.nextSegments = [funnelSegment.id];

  return { track: segments, buckets, launcherPosition };
}

// Choose segment type based on position and direction
function chooseSegmentType(
  index: number,
  _total: number,
  offset: number
): TrackSegment['type'] {
  // First segment is always straight for easy entry
  if (index === 0) {
    return 'straight';
  }

  // Choose curve direction based on horizontal movement
  if (offset > 0) {
    return 'curve-right';
  } else if (offset < 0) {
    return 'curve-left';
  }

  return 'straight';
}

// Create bezier path for segment
function createSegmentPath(
  entry: Vector2,
  exit: Vector2,
  type: TrackSegment['type']
): BezierPath {
  switch (type) {
    case 'straight':
      return createStraightPath(entry, exit);

    case 'curve-left':
      return createCurvedPath(entry, exit, 'left', 0.5);

    case 'curve-right':
      return createCurvedPath(entry, exit, 'right', 0.5);

    case 'spiral':
    case 'funnel':
      return createSCurvePath(entry, exit, 60);

    default:
      return createStraightPath(entry, exit);
  }
}

export default generateTrack;
