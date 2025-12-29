import { motion } from 'framer-motion';
import { useAccessibility } from '@/hooks/useAccessibility';

// ============================================
// TUTORIAL HAND
// Animated pointing hand for tutorial guidance
// ============================================

interface TutorialHandProps {
  targetX: number;
  targetY: number;
  size: 'small' | 'medium' | 'large';
}

const SIZE_MAP = {
  small: 50,
  medium: 70,
  large: 100,
};

export function TutorialHand({ targetX, targetY, size }: TutorialHandProps) {
  const { reducedMotion } = useAccessibility();
  const handSize = SIZE_MAP[size];

  // Position hand below and slightly to the right of target
  const handX = targetX - handSize / 3;
  const handY = targetY + 20;

  if (reducedMotion) {
    // Static hand for reduced motion
    return (
      <div
        className="absolute pointer-events-none z-50"
        style={{
          left: handX,
          top: handY,
          width: handSize,
          height: handSize,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Pointing hand SVG */}
          <g transform="rotate(-30, 50, 50)">
            {/* Arm */}
            <ellipse
              cx="50"
              cy="75"
              rx="15"
              ry="30"
              fill="#FDBF60"
              stroke="#E5A84B"
              strokeWidth="2"
            />
            {/* Palm */}
            <circle cx="50" cy="45" r="22" fill="#FDBF60" stroke="#E5A84B" strokeWidth="2" />
            {/* Pointing finger */}
            <ellipse
              cx="50"
              cy="15"
              rx="8"
              ry="20"
              fill="#FDBF60"
              stroke="#E5A84B"
              strokeWidth="2"
            />
            {/* Finger tip highlight */}
            <ellipse cx="50" cy="5" rx="5" ry="6" fill="#FFE4B5" />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      style={{
        left: handX,
        top: handY,
        width: handSize,
        height: handSize,
      }}
      initial={{ opacity: 0, scale: 0, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ type: 'spring', damping: 12 }}
    >
      <motion.div
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: size === 'large' ? 1.2 : size === 'medium' ? 1 : 0.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          {/* Pointing hand SVG */}
          <g transform="rotate(-30, 50, 50)">
            {/* Arm */}
            <ellipse
              cx="50"
              cy="75"
              rx="15"
              ry="30"
              fill="#FDBF60"
              stroke="#E5A84B"
              strokeWidth="2"
            />
            {/* Palm */}
            <circle cx="50" cy="45" r="22" fill="#FDBF60" stroke="#E5A84B" strokeWidth="2" />
            {/* Pointing finger */}
            <ellipse
              cx="50"
              cy="15"
              rx="8"
              ry="20"
              fill="#FDBF60"
              stroke="#E5A84B"
              strokeWidth="2"
            />
            {/* Finger tip highlight */}
            <ellipse cx="50" cy="5" rx="5" ry="6" fill="#FFE4B5" />
          </g>
        </svg>
      </motion.div>

      {/* Tap ripple effect */}
      <motion.div
        className="absolute rounded-full border-4 border-yellow-400"
        style={{
          top: -20,
          left: handSize / 2 - 25,
          width: 50,
          height: 50,
        }}
        animate={{
          scale: [0.5, 1.5, 0.5],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />
    </motion.div>
  );
}

export default TutorialHand;
