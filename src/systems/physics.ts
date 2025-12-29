import {
  Marble,
  TrackSegment,
  Vector2,
  PHYSICS,
  Bucket,
} from '@/types';
import {
  getPointOnPath,
  getTangentOnPath,
  clamp,
  vectorAngle,
  distanceBetween,
  createVector,
} from '@/utils/mathHelpers';

// ============================================
// PHYSICS ENGINE
// The core of marble movement - marbles follow
// bezier curve paths, NOT free 2D physics
// ============================================

export interface PhysicsWorld {
  marbles: Marble[];
  track: TrackSegment[];
  buckets: Bucket[];
}

// Update a single marble's physics
export function updateMarble(
  marble: Marble,
  track: TrackSegment[],
  buckets: Bucket[],
  deltaTime: number
): Marble {
  // Clone marble for immutable update
  const updated = { ...marble };

  switch (updated.state) {
    case 'waiting':
      // Marble is waiting to be dropped - no physics
      break;

    case 'falling':
      // Marble is falling from launcher - projectile physics
      updated.velocity.y += PHYSICS.GRAVITY * deltaTime;
      updated.position.x += updated.velocity.x * deltaTime;
      updated.position.y += updated.velocity.y * deltaTime;
      updated.rotation += updated.angularVelocity * deltaTime;

      // Check if marble lands on track
      const landedSegment = checkTrackCollision(updated, track);
      if (landedSegment) {
        updated.state = 'on-track';
        updated.currentTrackSegment = landedSegment.id;
        updated.trackProgress = 0;
        updated.speed = Math.max(PHYSICS.MIN_SPEED, Math.abs(updated.velocity.y) * 0.8);
        // Immediately snap to track position
        const entryPoint = getPointOnPath(landedSegment.path, 0);
        updated.position = { ...entryPoint };
      }

      // Check if marble went off screen (missed track)
      if (updated.position.y > 1200) {
        updated.state = 'collected'; // Remove it
      }
      break;

    case 'on-track':
      // CRITICAL: Marble follows bezier curve path
      const segment = track.find((s) => s.id === updated.currentTrackSegment);
      if (!segment) {
        updated.state = 'falling';
        break;
      }

      // Ensure path has valid length
      if (!segment.path.length || segment.path.length < 10) {
        // Invalid path, skip to end
        updated.trackProgress = 1;
        break;
      }

      // Get path geometry at current position
      const pathTangent = getTangentOnPath(segment.path, updated.trackProgress);

      // Calculate slope angle for gravity component
      const slopeAngle = vectorAngle(pathTangent);

      // Gravity component along track direction (positive when going downhill)
      const gravityForce = PHYSICS.GRAVITY * Math.sin(slopeAngle);

      // Friction opposes motion
      const frictionForce = -segment.friction * updated.speed * Math.sign(updated.speed || 1);

      // Net acceleration
      const acceleration = (gravityForce + frictionForce) / PHYSICS.MARBLE_MASS;

      // Update speed
      updated.speed = clamp(
        updated.speed + acceleration * deltaTime,
        PHYSICS.MIN_SPEED,
        PHYSICS.MAX_SPEED
      );

      // Update track progress - leisurely pace for kids to watch and enjoy
      // Use path length to determine time (longer paths take longer)
      const pathLength = segment.path.length || 200;
      const baseTime = pathLength / 400; // ~400 pixels per second base speed
      const SEGMENT_TIME = Math.max(0.8, Math.min(2, baseTime)); // 0.8-2 seconds per segment
      const progressDelta = deltaTime / SEGMENT_TIME;
      updated.trackProgress = Math.min(1, updated.trackProgress + progressDelta);

      // Smooth speed based on slope - faster going down, slower on flats
      const slopeFactor = Math.max(0.5, Math.min(1.5, 1 + Math.sin(slopeAngle) * 0.5));
      updated.speed = PHYSICS.MIN_SPEED + (PHYSICS.MAX_SPEED - PHYSICS.MIN_SPEED) * 0.5 * slopeFactor;

      // Update visual position to CURRENT progress (after update)
      const pathPoint = getPointOnPath(segment.path, updated.trackProgress);
      updated.position = { ...pathPoint };

      // Update velocity direction (for visual effects and transitions)
      updated.velocity = {
        x: pathTangent.x * updated.speed,
        y: pathTangent.y * updated.speed,
      };

      // Angular velocity for visual rotation (marble rolls)
      updated.angularVelocity = updated.speed / PHYSICS.MARBLE_RADIUS;
      updated.rotation += updated.angularVelocity * deltaTime;

      // Check for segment transition
      if (updated.trackProgress >= 1) {
        const nextSegmentId = segment.nextSegments[0];
        if (nextSegmentId) {
          const nextSegment = track.find((s) => s.id === nextSegmentId);
          if (nextSegment) {
            updated.currentTrackSegment = nextSegmentId;
            updated.trackProgress = 0;
          } else {
            // End of track - become airborne or check for bucket
            updated.state = 'airborne';
            updated.currentTrackSegment = null;
          }
        } else {
          // No next segment - check for bucket collection
          const bucket = checkBucketCollision(updated, buckets);
          if (bucket) {
            updated.state = 'collected';
          } else {
            updated.state = 'airborne';
            updated.currentTrackSegment = null;
          }
        }
      }
      break;

    case 'airborne':
      // Standard projectile physics (marble in the air between segments)
      updated.velocity.y += PHYSICS.GRAVITY * deltaTime;
      updated.position.x += updated.velocity.x * deltaTime;
      updated.position.y += updated.velocity.y * deltaTime;
      updated.rotation += updated.angularVelocity * deltaTime;
      updated.speed = Math.sqrt(
        updated.velocity.x ** 2 + updated.velocity.y ** 2
      );

      // Check for bucket collection FIRST (priority over track landing)
      const hitBucket = checkBucketCollision(updated, buckets);
      if (hitBucket) {
        updated.state = 'collected';
        break;
      }

      // Check if fell off screen
      if (updated.position.y > 1200) {
        updated.state = 'collected';
        break;
      }

      // Only check for track landing if moving downward significantly
      // This prevents re-collision with segments we just left
      if (updated.velocity.y > 50) {
        const nextSegment = checkTrackCollisionBelow(updated, track);
        if (nextSegment) {
          updated.state = 'on-track';
          updated.currentTrackSegment = nextSegment.id;
          updated.trackProgress = 0;
        }
      }
      break;

    case 'collected':
      // Marble has been collected - no more updates
      break;
  }

  return updated;
}

// Check if marble collides with any track segment (for falling state - first landing)
function checkTrackCollision(
  marble: Marble,
  track: TrackSegment[]
): TrackSegment | null {
  // Sort segments by entry point Y to check from top to bottom
  const sortedSegments = [...track].sort((a, b) => a.entryPoint.y - b.entryPoint.y);

  for (const segment of sortedSegments) {
    // Only check the first segment (top of track) for initial landing
    const entryDist = distanceBetween(marble.position, segment.entryPoint);
    const collisionRadius = segment.width / 2 + PHYSICS.MARBLE_RADIUS * 2;

    // Check if marble is near the track entry point
    if (entryDist < collisionRadius) {
      if (marble.velocity.y > 0 && marble.position.y >= segment.entryPoint.y - PHYSICS.MARBLE_RADIUS * 2) {
        return segment;
      }
    }
  }
  return null;
}

// Check if marble collides with track segments BELOW its current position (for airborne state)
function checkTrackCollisionBelow(
  marble: Marble,
  track: TrackSegment[]
): TrackSegment | null {
  // Only check segments whose entry point is below the marble
  const belowSegments = track.filter(
    (s) => s.entryPoint.y > marble.position.y - PHYSICS.MARBLE_RADIUS
  );

  for (const segment of belowSegments) {
    const entryDist = distanceBetween(marble.position, segment.entryPoint);
    const collisionRadius = segment.width / 2 + PHYSICS.MARBLE_RADIUS;

    if (entryDist < collisionRadius && marble.velocity.y > 0) {
      return segment;
    }
  }
  return null;
}

// Check if marble collides with any bucket
function checkBucketCollision(
  marble: Marble,
  buckets: Bucket[]
): Bucket | null {
  for (const bucket of buckets) {
    // Check if marble is within bucket bounds
    const inX =
      marble.position.x >= bucket.position.x - bucket.width / 2 &&
      marble.position.x <= bucket.position.x + bucket.width / 2;
    const inY =
      marble.position.y >= bucket.position.y &&
      marble.position.y <= bucket.position.y + bucket.height;

    if (inX && inY) {
      return bucket;
    }
  }
  return null;
}

// Update all marbles in the world
export function updatePhysicsWorld(
  world: PhysicsWorld,
  deltaTime: number
): Marble[] {
  return world.marbles.map((marble) =>
    updateMarble(marble, world.track, world.buckets, deltaTime)
  );
}

// Create a new marble at the launcher position
export function createMarble(
  id: string,
  color: Marble['color'],
  launcherPosition: Vector2
): Marble {
  return {
    id,
    position: { ...launcherPosition },
    velocity: createVector(0, 0),
    speed: 0,
    angularVelocity: 0,
    radius: PHYSICS.MARBLE_RADIUS,
    mass: PHYSICS.MARBLE_MASS,
    color,
    currentTrackSegment: null,
    trackProgress: 0,
    state: 'waiting',
    rotation: 0,
  };
}

// Drop a marble (transition from waiting to falling)
export function dropMarble(marble: Marble): Marble {
  return {
    ...marble,
    state: 'falling',
    velocity: createVector(0, 150), // Gentle initial drop
  };
}
