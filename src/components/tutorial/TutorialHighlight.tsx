import { motion } from 'framer-motion';
import { useAccessibility } from '@/hooks/useAccessibility';

// ============================================
// TUTORIAL HIGHLIGHT
// Spotlight effect that dims everything except target
// ============================================

interface TutorialHighlightProps {
  targetX: number;
  targetY: number;
  targetWidth: number;
  targetHeight: number;
  padding?: number;
  shape?: 'circle' | 'rectangle';
}

export function TutorialHighlight({
  targetX,
  targetY,
  targetWidth,
  targetHeight,
  padding = 30,
  shape = 'circle',
}: TutorialHighlightProps) {
  const { reducedMotion } = useAccessibility();

  // Calculate spotlight dimensions
  const spotlightX = targetX - padding;
  const spotlightY = targetY - padding;
  const spotlightWidth = targetWidth + padding * 2;
  const spotlightHeight = targetHeight + padding * 2;

  // Center point for radial gradient
  const centerX = spotlightX + spotlightWidth / 2;
  const centerY = spotlightY + spotlightHeight / 2;

  // Radius for circular spotlight
  const radius = Math.max(spotlightWidth, spotlightHeight) / 2;

  return (
    <>
      {/* Dark overlay with spotlight cutout */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0.15 : 0.3 }}
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          maskImage:
            shape === 'circle'
              ? `radial-gradient(circle ${radius}px at ${centerX}px ${centerY}px, transparent 100%, black 100%)`
              : `linear-gradient(to right, black ${spotlightX}px, transparent ${spotlightX}px, transparent ${spotlightX + spotlightWidth}px, black ${spotlightX + spotlightWidth}px)`,
          WebkitMaskImage:
            shape === 'circle'
              ? `radial-gradient(circle ${radius}px at ${centerX}px ${centerY}px, transparent 100%, black 100%)`
              : `linear-gradient(to right, black ${spotlightX}px, transparent ${spotlightX}px, transparent ${spotlightX + spotlightWidth}px, black ${spotlightX + spotlightWidth}px)`,
        }}
      />

      {/* Pulsing ring around target */}
      {!reducedMotion && (
        <motion.div
          className="fixed pointer-events-none z-40"
          style={{
            left: spotlightX,
            top: spotlightY,
            width: spotlightWidth,
            height: spotlightHeight,
            borderRadius: shape === 'circle' ? '50%' : 16,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Outer pulse ring */}
          <motion.div
            className="absolute inset-0 border-4 border-yellow-400"
            style={{
              borderRadius: shape === 'circle' ? '50%' : 16,
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.8, 0.4, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Inner glow */}
          <motion.div
            className="absolute inset-2 border-2 border-yellow-300"
            style={{
              borderRadius: shape === 'circle' ? '50%' : 12,
              boxShadow: '0 0 20px rgba(250, 204, 21, 0.5)',
            }}
            animate={{
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      )}

      {/* Static ring for reduced motion */}
      {reducedMotion && (
        <div
          className="fixed pointer-events-none z-40 border-4 border-yellow-400"
          style={{
            left: spotlightX,
            top: spotlightY,
            width: spotlightWidth,
            height: spotlightHeight,
            borderRadius: shape === 'circle' ? '50%' : 16,
            boxShadow: '0 0 20px rgba(250, 204, 21, 0.5)',
          }}
        />
      )}
    </>
  );
}

export default TutorialHighlight;
