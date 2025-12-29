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
        updated.speed = Math.abs(updated.velocity.y) * 0.8; // Convert vertical velocity
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

      // Get path geometry at current position
      const pathPoint = getPointOnPath(segment.path, updated.trackProgress);
      const pathTangent = getTangentOnPath(segment.path, updated.trackProgress);

      // Calculate slope angle for gravity component
      const slopeAngle = vectorAngle(pathTangent);

      // Gravity component along track direction (positive when going downhill)
      // sin(angle) gives the component of gravity along the slope
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

      // Update track progress (convert linear distance to t parameter)
      const distanceTraveled = updated.speed * deltaTime;
      const progressDelta = distanceTraveled / segment.path.length;
      updated.trackProgress += progressDelta;

      // Update visual position (constrained to track)
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

      // Check for landing on track
      const nextSegment = checkTrackCollision(updated, track);
      if (nextSegment) {
        updated.state = 'on-track';
        updated.currentTrackSegment = nextSegment.id;
        updated.trackProgress = 0;
      }

      // Check for bucket collection
      const hitBucket = checkBucketCollision(updated, buckets);
      if (hitBucket) {
        updated.state = 'collected';
      }

      // Check if fell off screen
      if (updated.position.y > 1200) {
        updated.state = 'collected';
      }
      break;

    case 'collected':
      // Marble has been collected - no more updates
      break;
  }

  return updated;
}

// Check if marble collides with any track segment
function checkTrackCollision(
  marble: Marble,
  track: TrackSegment[]
): TrackSegment | null {
  for (const segment of track) {
    // Check if marble is near the track entry point
    const entryDist = distanceBetween(marble.position, segment.entryPoint);
    if (entryDist < segment.width / 2 + PHYSICS.MARBLE_RADIUS) {
      // Check if marble is moving in the right direction (downward)
      if (marble.velocity.y > 0) {
        return segment;
      }
    }

    // Check if marble intersects with the track path
    // Sample the path and check distance to marble
    for (let t = 0; t < 1; t += 0.1) {
      const pathPoint = getPointOnPath(segment.path, t);
      const dist = distanceBetween(marble.position, pathPoint);
      if (dist < segment.width / 2 + PHYSICS.MARBLE_RADIUS * 0.5) {
        return segment;
      }
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
    velocity: createVector(0, 50), // Initial downward velocity
  };
}
