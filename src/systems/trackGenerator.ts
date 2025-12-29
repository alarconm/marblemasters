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
  const { theme, screenWidth, screenHeight } = params;
  // difficulty is available for future use: params.difficulty
  const centerX = screenWidth / 2;
  const trackWidth = PHYSICS.TRACK_WIDTH;

  const segments: TrackSegment[] = [];
  let currentY = 120; // Start below launcher
  let currentX = centerX;
  let segmentId = 0;

  // Launcher position
  const launcherPosition: Vector2 = { x: centerX, y: 60 };

  // Define left and right edges for zigzag pattern
  const leftEdge = screenWidth * 0.25;  // 25% from left
  const rightEdge = screenWidth * 0.75; // 75% from left

  // Generate 3 track segments for a good zigzag pattern
  const segmentCount = 3;

  for (let i = 0; i < segmentCount; i++) {
    // Segment height - taller segments for more dramatic curves
    const segmentHeight = randomBetween(100, 140);
    const nextY = currentY + segmentHeight;

    // Alternate between left and right edges for true zigzag
    // Even segments go RIGHT, odd segments go LEFT
    let nextX: number;
    if (i % 2 === 0) {
      // Go to right side
      nextX = randomBetween(rightEdge - 50, rightEdge);
    } else {
      // Go to left side
      nextX = randomBetween(leftEdge, leftEdge + 50);
    }

    // Choose segment type based on direction (positive = going right, negative = going left)
    const horizontalDirection = nextX - currentX;
    const segmentType = chooseSegmentType(i, segmentCount, horizontalDirection);

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
  _index: number,
  _total: number,
  offset: number
): TrackSegment['type'] {
  // Choose curve direction based on horizontal movement
  // All segments curve now for more interesting tracks
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
      return createCurvedPath(entry, exit, 'left', 0.3);

    case 'curve-right':
      return createCurvedPath(entry, exit, 'right', 0.3);

    case 'spiral':
    case 'funnel':
      return createSCurvePath(entry, exit, 60);

    default:
      return createStraightPath(entry, exit);
  }
}

export default generateTrack;
