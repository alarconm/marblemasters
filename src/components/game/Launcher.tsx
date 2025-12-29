import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { MarbleColor, MARBLE_COLORS, PHYSICS, TrackTheme, THEME_COLORS } from '@/types';
import { audioManager } from '@/systems/audioManager';
import { announcer } from '@/systems/announcer';
import { useAccessibility } from '@/hooks/useAccessibility';

interface LauncherProps {
  position: { x: number; y: number };
  nextColors: MarbleColor[];
  onDrop: () => void;
  theme: TrackTheme;
  disabled?: boolean;
}

export function Launcher({
  position,
  nextColors,
  onDrop,
  theme,
  disabled = false,
}: LauncherProps) {
  const colors = THEME_COLORS[theme];
  const nextColor = nextColors[0];
  const { reducedMotion } = useAccessibility();

  const handleActivate = useCallback(() => {
    if (!disabled) {
      audioManager.resume(); // Resume audio context on first interaction
      audioManager.playDrop();
      announcer.announceMarbleDrop(nextColor);
      onDrop();
    }
  }, [disabled, nextColor, onDrop]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleActivate();
      }
    },
    [handleActivate]
  );

  // Accessible label for screen readers
  const ariaLabel = disabled
    ? 'Marble launcher disabled'
    : `Drop ${nextColor} marble. ${nextColors.length - 1} marbles remaining in queue.`;

  return (
    <motion.button
      id="launcher"
      className="absolute touch-target cursor-pointer focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2 rounded-2xl"
      style={{
        left: position.x - 60,
        top: position.y - 40,
        width: 120,
        height: 80,
        background: 'transparent',
        border: 'none',
      }}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      whileTap={reducedMotion ? undefined : { scale: 0.95 }}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      disabled={disabled}
      tabIndex={0}
    >
      {/* Launcher tube - decorative */}
      <svg
        width={120}
        height={80}
        viewBox="0 0 120 80"
        className="absolute top-0 left-0"
        aria-hidden="true"
      >
        {/* Tube shadow */}
        <ellipse
          cx={62}
          cy={44}
          rx={35}
          ry={12}
          fill="rgba(0,0,0,0.2)"
        />

        {/* Tube body */}
        <path
          d={`
            M 30 20
            L 30 60
            Q 60 75 90 60
            L 90 20
            Q 60 5 30 20
          `}
          fill={colors.trackFill}
          stroke={colors.trackStroke}
          strokeWidth={3}
        />

        {/* Tube opening */}
        <ellipse
          cx={60}
          cy={20}
          rx={30}
          ry={10}
          fill={darkenColor(colors.trackFill, 20)}
          stroke={colors.trackStroke}
          strokeWidth={2}
        />

        {/* Inner hole */}
        <ellipse
          cx={60}
          cy={22}
          rx={20}
          ry={6}
          fill="rgba(0,0,0,0.5)"
        />
      </svg>

      {/* Preview of next marble */}
      <motion.div
        className="absolute rounded-full marble-glow"
        style={{
          width: PHYSICS.MARBLE_RADIUS * 1.8,
          height: PHYSICS.MARBLE_RADIUS * 1.8,
          left: 60 - PHYSICS.MARBLE_RADIUS * 0.9,
          top: 15,
          background: `
            radial-gradient(
              circle at 30% 30%,
              ${lightenColor(MARBLE_COLORS[nextColor], 40)} 0%,
              ${MARBLE_COLORS[nextColor]} 40%,
              ${darkenColor(MARBLE_COLORS[nextColor], 30)} 100%
            )
          `,
        }}
        animate={{
          y: disabled ? 0 : [0, -5, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Tap hint */}
      {!disabled && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 text-center text-white font-bold text-sm"
          style={{
            textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        >
          TAP!
        </motion.div>
      )}

      {/* Upcoming marbles preview */}
      <div
        className="absolute flex gap-1"
        style={{
          left: 130,
          top: 30,
        }}
      >
        {nextColors.slice(1, 4).map((color, index) => (
          <motion.div
            key={index}
            className="rounded-full"
            style={{
              width: 16,
              height: 16,
              background: MARBLE_COLORS[color],
              opacity: 1 - index * 0.25,
              boxShadow: 'inset -1px -1px 3px rgba(0,0,0,0.3)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    </motion.button>
  );
}

// Helper functions
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

export default Launcher;
