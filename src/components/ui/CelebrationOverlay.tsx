import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useParentStore } from '@/store/parentStore';
import { audioManager } from '@/systems/audioManager';
import { voicePrompts } from '@/systems/voicePrompts';
import { haptics } from '@/systems/haptics';
import { StarRating } from '@/components/achievements';
import { useAccessibility } from '@/hooks/useAccessibility';
import { StarRating as StarRatingType } from '@/types';

export function CelebrationOverlay() {
  const { currentLevel, score, nextLevel, challengeAnsweredCorrectly, hadWrongAnswer } = useGameStore();
  const { setLevelStars, setPerfectLevel } = useParentStore();
  const { reducedMotion } = useAccessibility();

  // Calculate star rating based on performance
  const starRating: StarRatingType = useMemo(() => {
    // 3 stars: No wrong answers and challenge correct
    if (!hadWrongAnswer && challengeAnsweredCorrectly) {
      return 3;
    }
    // 2 stars: Challenge correct OR no wrong answers
    if (challengeAnsweredCorrectly || !hadWrongAnswer) {
      return 2;
    }
    // 1 star: Level completed (always guaranteed)
    return 1;
  }, [challengeAnsweredCorrectly, hadWrongAnswer]);

  const isPerfect = starRating === 3;

  // Play sounds and haptics on mount, save star rating
  useEffect(() => {
    audioManager.playLevelComplete();
    voicePrompts.speakLevelComplete();
    haptics.celebrate();

    // Save star rating
    setLevelStars(currentLevel, starRating as 1 | 2 | 3, isPerfect, challengeAnsweredCorrectly);

    // Track perfect level for achievements
    if (isPerfect) {
      setPerfectLevel();
    }
  }, [currentLevel, starRating, isPerfect, challengeAnsweredCorrectly, setLevelStars, setPerfectLevel]);

  // Generate confetti particles with varied shapes
  const shapes = ['circle', 'square', 'star', 'triangle'] as const;
  const confetti = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: [
      '#FF6B6B',
      '#4ECDC4',
      '#FFE66D',
      '#95E1D3',
      '#F38181',
      '#AA96DA',
      '#FFB347',
      '#87CEEB',
    ][Math.floor(Math.random() * 8)],
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1.5,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    size: 8 + Math.random() * 8,
    rotateDir: Math.random() > 0.5 ? 720 : -720,
  }));

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Confetti - skip for reduced motion */}
      {!reducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {confetti.map((particle) => {
            // Get shape-specific styles
            const getShapeStyle = () => {
              switch (particle.shape) {
                case 'circle':
                  return { borderRadius: '50%' };
                case 'triangle':
                  return { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' };
                case 'star':
                  return { clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' };
                default: // square
                  return { borderRadius: '2px' };
              }
            };

            return (
              <motion.div
                key={particle.id}
                className="absolute"
                style={{
                  left: `${particle.x}%`,
                  width: particle.size,
                  height: particle.size,
                  background: particle.color,
                  ...getShapeStyle(),
                }}
                initial={{ y: -20, rotate: 0, opacity: 1 }}
                animate={{
                  y: '120vh',
                  rotate: particle.rotateDir,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: 'easeIn',
                }}
              />
            );
          })}
        </div>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={reducedMotion ? { opacity: 0 } : { scale: 0.5, y: 50 }}
        animate={reducedMotion ? { opacity: 1 } : { scale: 1, y: 0 }}
        transition={reducedMotion ? { duration: 0.2 } : { type: 'spring', damping: 12 }}
      >
        {/* Star burst emoji */}
        <motion.div
          className="text-7xl mb-2"
          animate={
            reducedMotion
              ? undefined
              : {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }
          }
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
          aria-hidden="true"
        >
          🎉
        </motion.div>

        {/* Star Rating */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reducedMotion ? 0.1 : 0.2 }}
        >
          <StarRating stars={starRating} size="large" animated={!reducedMotion} />
        </motion.div>

        {/* Level complete text */}
        <motion.h2
          id="celebration-title"
          className="text-4xl md:text-5xl font-bold text-white mb-2"
          style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: reducedMotion ? 0.15 : 0.3 }}
        >
          Level {currentLevel} Complete!
        </motion.h2>

        {/* Perfect run bonus */}
        {isPerfect && (
          <motion.p
            className="text-xl text-green-400 font-bold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reducedMotion ? 0.2 : 0.35 }}
          >
            Perfect Run! 🌟
          </motion.p>
        )}

        <motion.p
          className="text-2xl text-yellow-300 mb-6"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: reducedMotion ? 0.25 : 0.4 }}
        >
          Score: {score.toLocaleString()} ⭐
        </motion.p>

        {/* Next level button */}
        <motion.button
          className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full font-bold text-white text-2xl shadow-lg touch-target focus:outline-none focus:ring-4 focus:ring-green-300"
          style={{
            boxShadow: '0 4px 20px rgba(72, 187, 120, 0.5)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}
          onClick={nextLevel}
          whileHover={reducedMotion ? undefined : { scale: 1.05 }}
          whileTap={reducedMotion ? undefined : { scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: reducedMotion ? 0.3 : 0.5, type: 'spring' }}
        >
          Next Level →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default CelebrationOverlay;
