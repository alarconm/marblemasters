import { Vector2, BezierPath, BezierPoint } from '@/types';

// ============================================
// VECTOR OPERATIONS
// ============================================

export function createVector(x: number, y: number): Vector2 {
  return { x, y };
}

export function addVectors(a: Vector2, b: Vector2): Vector2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function subtractVectors(a: Vector2, b: Vector2): Vector2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scaleVector(v: Vector2, scalar: number): Vector2 {
  return { x: v.x * scalar, y: v.y * scalar };
}

export function vectorMagnitude(v: Vector2): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function normalizeVector(v: Vector2): Vector2 {
  const mag = vectorMagnitude(v);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
}

export function vectorAngle(v: Vector2): number {
  return Math.atan2(v.y, v.x);
}

export function rotateVector(v: Vector2, angle: number): Vector2 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: v.x * cos - v.y * sin,
    y: v.x * sin + v.y * cos,
  };
}

export function distanceBetween(a: Vector2, b: Vector2): number {
  return vectorMagnitude(subtractVectors(b, a));
}

// ============================================
// CLAMPING & INTERPOLATION
// ============================================

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function lerpVector(start: Vector2, end: Vector2, t: number): Vector2 {
  return {
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t),
  };
}

// ============================================
// BEZIER CURVE MATH
// ============================================

// Cubic bezier evaluation at parameter t (0 to 1)
export function cubicBezier(
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
): number {
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  return mt3 * p0 + 3 * mt2 * t * p1 + 3 * mt * t2 * p2 + t3 * p3;
}

// Cubic bezier derivative (for tangent/velocity direction)
export function cubicBezierDerivative(
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
): number {
  const t2 = t * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  return 3 * mt2 * (p1 - p0) + 6 * mt * t * (p2 - p1) + 3 * t2 * (p3 - p2);
}

// Get point on bezier path at parameter t
export function getPointOnPath(path: BezierPath, t: number): Vector2 {
  if (path.points.length < 2) {
    return path.points[0] || { x: 0, y: 0 };
  }

  // For paths with multiple segments, find which segment t falls in
  const numSegments = Math.floor((path.points.length - 1) / 3);
  if (numSegments === 0) {
    // Linear interpolation for simple 2-point path
    return lerpVector(path.points[0], path.points[1], t);
  }

  // Find segment index and local t
  const segmentT = t * numSegments;
  const segmentIndex = Math.min(Math.floor(segmentT), numSegments - 1);
  const localT = segmentT - segmentIndex;

  const baseIndex = segmentIndex * 3;
  const p0 = path.points[baseIndex];
  const p1 = path.points[baseIndex + 1] || p0;
  const p2 = path.points[baseIndex + 2] || p1;
  const p3 = path.points[baseIndex + 3] || p2;

  return {
    x: cubicBezier(localT, p0.x, p1.x, p2.x, p3.x),
    y: cubicBezier(localT, p0.y, p1.y, p2.y, p3.y),
  };
}

// Get tangent on bezier path at parameter t
export function getTangentOnPath(path: BezierPath, t: number): Vector2 {
  if (path.points.length < 2) {
    return { x: 0, y: 1 };
  }

  const numSegments = Math.floor((path.points.length - 1) / 3);
  if (numSegments === 0) {
    // Linear path - constant tangent
    return normalizeVector(subtractVectors(path.points[1], path.points[0]));
  }

  const segmentT = t * numSegments;
  const segmentIndex = Math.min(Math.floor(segmentT), numSegments - 1);
  const localT = segmentT - segmentIndex;

  const baseIndex = segmentIndex * 3;
  const p0 = path.points[baseIndex];
  const p1 = path.points[baseIndex + 1] || p0;
  const p2 = path.points[baseIndex + 2] || p1;
  const p3 = path.points[baseIndex + 3] || p2;

  const tangent = {
    x: cubicBezierDerivative(localT, p0.x, p1.x, p2.x, p3.x),
    y: cubicBezierDerivative(localT, p0.y, p1.y, p2.y, p3.y),
  };

  return normalizeVector(tangent);
}

// Calculate approximate length of bezier path
export function calculatePathLength(path: BezierPath): number {
  if (path.points.length < 2) return 0;

  let length = 0;
  const steps = 50;
  let prevPoint = getPointOnPath(path, 0);

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const point = getPointOnPath(path, t);
    length += distanceBetween(prevPoint, point);
    prevPoint = point;
  }

  return length;
}

// ============================================
// PATH GENERATION HELPERS
// ============================================

// Create a simple curved path from entry to exit
export function createCurvedPath(
  entry: Vector2,
  exit: Vector2,
  curveDirection: 'left' | 'right' = 'right',
  curvature: number = 0.5
): BezierPath {
  const midY = (entry.y + exit.y) / 2;
  const curveOffset = (exit.x - entry.x) * curvature * (curveDirection === 'left' ? -1 : 1);

  const points: BezierPoint[] = [
    { x: entry.x, y: entry.y },
    { x: entry.x + curveOffset, y: entry.y + (midY - entry.y) * 0.5 },
    { x: exit.x + curveOffset, y: exit.y - (exit.y - midY) * 0.5 },
    { x: exit.x, y: exit.y },
  ];

  const path: BezierPath = { points, length: 0 };
  path.length = calculatePathLength(path);
  return path;
}

// Create a straight ramp path
export function createStraightPath(entry: Vector2, exit: Vector2): BezierPath {
  const points: BezierPoint[] = [
    { x: entry.x, y: entry.y },
    { x: exit.x, y: exit.y },
  ];

  const path: BezierPath = { points, length: 0 };
  path.length = distanceBetween(entry, exit);
  return path;
}

// Create an S-curve path
export function createSCurvePath(
  entry: Vector2,
  exit: Vector2,
  curvature: number = 100
): BezierPath {
  const midY = (entry.y + exit.y) / 2;

  const points: BezierPoint[] = [
    { x: entry.x, y: entry.y },
    { x: entry.x + curvature, y: entry.y + (midY - entry.y) * 0.3 },
    { x: entry.x + curvature, y: midY - (midY - entry.y) * 0.3 },
    { x: entry.x, y: midY },
    { x: entry.x - curvature, y: midY + (exit.y - midY) * 0.3 },
    { x: exit.x - curvature, y: exit.y - (exit.y - midY) * 0.3 },
    { x: exit.x, y: exit.y },
  ];

  const path: BezierPath = { points, length: 0 };
  path.length = calculatePathLength(path);
  return path;
}

// ============================================
// RANDOM & PROBABILITY
// ============================================

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1));
}

export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================
// EASING FUNCTIONS
// ============================================

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutBounce(t: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
}
