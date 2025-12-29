import { TrackSegment, THEME_COLORS, PHYSICS } from '@/types';

interface TrackProps {
  segment: TrackSegment;
}

export function Track({ segment }: TrackProps) {
  const colors = THEME_COLORS[segment.theme];

  // Convert bezier points to SVG path
  const pathData = generateSVGPath(segment);

  return (
    <g className="track-segment">
      {/* Track shadow */}
      <path
        d={pathData}
        fill="none"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth={segment.width + 8}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(4, 4)"
      />

      {/* Track outer edge (darker) */}
      <path
        d={pathData}
        fill="none"
        stroke={colors.trackStroke}
        strokeWidth={segment.width + 4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Track main surface */}
      <path
        d={pathData}
        fill="none"
        stroke={colors.trackFill}
        strokeWidth={segment.width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Track inner groove (for marble guidance visual) */}
      <path
        d={pathData}
        fill="none"
        stroke={darkenColor(colors.trackFill, 15)}
        strokeWidth={PHYSICS.MARBLE_RADIUS * 2 + 4}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.5}
      />

      {/* Track highlights */}
      <path
        d={pathData}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth={segment.width - 8}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="20 40"
      />
    </g>
  );
}

// Generate SVG path from bezier points
function generateSVGPath(segment: TrackSegment): string {
  const { points } = segment.path;

  if (points.length < 2) {
    return '';
  }

  // Start at first point
  let path = `M ${points[0].x} ${points[0].y}`;

  if (points.length === 2) {
    // Simple line
    path += ` L ${points[1].x} ${points[1].y}`;
  } else if (points.length >= 4) {
    // Cubic bezier curves
    // For every 4 points: start, control1, control2, end
    for (let i = 0; i < points.length - 1; i += 3) {
      const p1 = points[i + 1] || points[i];
      const p2 = points[i + 2] || p1;
      const p3 = points[i + 3] || p2;
      path += ` C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
    }
  } else {
    // Quadratic or simpler
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
  }

  return path;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

export default Track;
