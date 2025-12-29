import { motion } from 'framer-motion';
import { Marble as MarbleType, MARBLE_COLORS, PHYSICS } from '@/types';

interface MarbleProps {
  marble: MarbleType;
}

export function Marble({ marble }: MarbleProps) {
  const color = MARBLE_COLORS[marble.color];
  const size = PHYSICS.MARBLE_RADIUS * 2;

  // Don't render collected marbles
  if (marble.state === 'collected') {
    return null;
  }

  return (
    <motion.div
      className="absolute marble-glow rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: marble.position.x - PHYSICS.MARBLE_RADIUS,
        top: marble.position.y - PHYSICS.MARBLE_RADIUS,
        background: `
          radial-gradient(
            circle at 30% 30%,
            ${lightenColor(color, 40)} 0%,
            ${color} 40%,
            ${darkenColor(color, 30)} 100%
          )
        `,
        transform: `rotate(${marble.rotation}rad)`,
        boxShadow: `
          inset -3px -3px 8px rgba(0, 0, 0, 0.4),
          inset 4px 4px 8px rgba(255, 255, 255, 0.3),
          0 4px 12px rgba(0, 0, 0, 0.3)
        `,
      }}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      {/* Shine highlight */}
      <div
        className="absolute rounded-full"
        style={{
          width: size * 0.3,
          height: size * 0.3,
          left: size * 0.2,
          top: size * 0.15,
          background: 'rgba(255, 255, 255, 0.6)',
          filter: 'blur(2px)',
        }}
      />
    </motion.div>
  );
}

// Helper functions for color manipulation
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

export default Marble;
