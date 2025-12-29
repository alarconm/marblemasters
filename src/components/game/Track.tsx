import { TrackSegment, THEME_COLORS, PHYSICS } from '@/types';
import { useMemo } from 'react';

interface TrackProps {
  segment: TrackSegment;
  index?: number;
}

// Rainbow colors for colorful tracks
const RAINBOW_COLORS = [
  '#FF6B6B', // Red
  '#FF9F43', // Orange
  '#FECA57', // Yellow
  '#48DBFB', // Cyan
  '#5F27CD', // Purple
  '#FF6B9D', // Pink
  '#00D2D3', // Teal
  '#54A0FF', // Blue
];

export function Track({ segment, index = 0 }: TrackProps) {
  const colors = THEME_COLORS[segment.theme];

  // Generate unique gradient ID for this segment
  const gradientId = useMemo(() => `track-gradient-${segment.id}`, [segment.id]);

  // Pick colors based on segment index for rainbow effect on candy theme
  const gradientColors = useMemo(() => {
    if (segment.theme === 'rainbow-candy') {
      const color1 = RAINBOW_COLORS[index % RAINBOW_COLORS.length];
      const color2 = RAINBOW_COLORS[(index + 1) % RAINBOW_COLORS.length];
      return { start: color1, end: color2 };
    }
    return { start: colors.trackFill, end: colors.trackFill };
  }, [segment.theme, index, colors.trackFill]);

  // Convert bezier points to SVG path
  const pathData = generateSVGPath(segment);

  // Get stroke color based on theme
  const strokeColor = segment.theme === 'rainbow-candy'
    ? `url(#${gradientId})`
    : colors.trackFill;

  const outerStrokeColor = segment.theme === 'rainbow-candy'
    ? darkenColor(gradientColors.start, 20)
    : colors.trackStroke;

  return (
    <g className="track-segment">
      {/* Gradient definition for rainbow candy theme */}
      {segment.theme === 'rainbow-candy' && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={gradientColors.start} />
            <stop offset="100%" stopColor={gradientColors.end} />
          </linearGradient>
        </defs>
      )}

      {/* Track shadow - soft drop shadow */}
      <path
        d={pathData}
        fill="none"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth={segment.width + 10}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(3, 5)"
        style={{ filter: 'blur(3px)' }}
      />

      {/* Track outer edge (darker border) */}
      <path
        d={pathData}
        fill="none"
        stroke={outerStrokeColor}
        strokeWidth={segment.width + 8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Track main surface */}
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth={segment.width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Track inner groove (darker channel for marble) */}
      <path
        d={pathData}
        fill="none"
        stroke={segment.theme === 'rainbow-candy'
          ? 'rgba(0,0,0,0.15)'
          : darkenColor(colors.trackFill, 20)}
        strokeWidth={PHYSICS.MARBLE_RADIUS * 2 + 6}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.4}
      />

      {/* Track highlight streak (glossy effect) */}
      <path
        d={pathData}
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={segment.width * 0.3}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(-2, -2)"
      />

      {/* Track sparkle dots (candy theme only) */}
      {segment.theme === 'rainbow-candy' && (
        <path
          d={pathData}
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2 30"
        />
      )}

      {/* Wooden plank lines (wooden theme only) */}
      {segment.theme === 'wooden-classic' && (
        <path
          d={pathData}
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth={segment.width - 4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="8 16"
        />
      )}

      {/* Space theme glowing edge */}
      {segment.theme === 'space-station' && (
        <>
          <path
            d={pathData}
            fill="none"
            stroke="rgba(56,178,172,0.5)"
            strokeWidth={segment.width + 16}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'blur(8px)' }}
          />
          <path
            d={pathData}
            fill="none"
            stroke="rgba(246,224,94,0.3)"
            strokeWidth={segment.width + 4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="4 20"
          />
        </>
      )}
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
