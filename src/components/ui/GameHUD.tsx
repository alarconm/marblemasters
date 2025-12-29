import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useParentStore } from '@/store/parentStore';
import { StreakIndicator } from './MasteryDisplay';
import { useAccessibility } from '@/hooks/useAccessibility';
import { announcer } from '@/systems/announcer';
import { BadgeGrid } from '@/components/achievements';

// Animated score counter that counts up and bounces
function AnimatedScore({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value !== prevValue.current && value > prevValue.current) {
      setIsAnimating(true);
      const diff = value - prevValue.current;
      const startValue = prevValue.current;
      const duration = Math.min(300, diff * 3); // Cap at 300ms
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startValue + diff * eased);
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(value);
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
      prevValue.current = value;
    } else if (value !== prevValue.current) {
      setDisplayValue(value);
      prevValue.current = value;
    }
  }, [value]);

  return (
    <motion.span
      animate={{
        scale: isAnimating ? [1, 1.3, 1] : 1,
        color: isAnimating ? ['#ffffff', '#fde047', '#ffffff'] : '#ffffff',
      }}
      transition={{ duration: 0.3 }}
      className="font-bold text-xl"
      style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  );
}

export function GameHUD() {
  const {
    currentLevel,
    score,
    marblesCollected,
    marblesRequired,
    isPaused,
    pauseGame,
    resumeGame,
  } = useGameStore();

  const { earnedBadges } = useParentStore();
  const { reducedMotion } = useAccessibility();
  const [showBadgeGrid, setShowBadgeGrid] = useState(false);
  const progress = marblesCollected / marblesRequired;

  // Handle pause/resume with announcements
  const handlePauseToggle = () => {
    if (isPaused) {
      resumeGame();
      announcer.announceResumed();
    } else {
      pauseGame();
      announcer.announcePaused();
    }
  };

  // Open badge grid (pauses game)
  const handleOpenBadges = () => {
    pauseGame();
    setShowBadgeGrid(true);
  };

  // Close badge grid (resumes game)
  const handleCloseBadges = () => {
    setShowBadgeGrid(false);
    resumeGame();
  };

  return (
    <header
      className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between bg-gradient-to-b from-black/30 to-transparent"
      role="banner"
      aria-label="Game status"
    >
      {/* Level indicator */}
      <motion.div
        className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
        initial={reducedMotion ? { opacity: 0 } : { x: -50, opacity: 0 }}
        animate={reducedMotion ? { opacity: 1 } : { x: 0, opacity: 1 }}
        aria-label={`Level ${currentLevel}`}
      >
        <span className="text-white font-bold text-lg">Level</span>
        <span
          className="text-yellow-300 font-bold text-2xl"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          aria-hidden="true"
        >
          {currentLevel}
        </span>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="flex-1 mx-4 max-w-xs"
        initial={reducedMotion ? { opacity: 0 } : { y: -20, opacity: 0 }}
        animate={reducedMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div
          className="relative h-6 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={marblesRequired}
          aria-valuenow={marblesCollected}
          aria-label={`Marble collection progress: ${marblesCollected} of ${marblesRequired}`}
        >
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={reducedMotion ? { duration: 0.15 } : { type: 'spring', damping: 15 }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <span
              className="text-white font-bold text-sm"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              {marblesCollected} / {marblesRequired}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Score */}
      <motion.div
        className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
        initial={reducedMotion ? { opacity: 0 } : { x: 50, opacity: 0 }}
        animate={reducedMotion ? { opacity: 1 } : { x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        aria-label={`Score: ${score}`}
      >
        <span className="text-2xl" aria-hidden="true">⭐</span>
        <AnimatedScore value={score} />
      </motion.div>

      {/* Streak indicator */}
      <AnimatePresence>
        <StreakIndicator />
      </AnimatePresence>

      {/* Trophy button (badge collection) */}
      <motion.button
        className="ml-3 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center touch-target focus:outline-none focus:ring-4 focus:ring-yellow-400 relative"
        onClick={handleOpenBadges}
        whileTap={reducedMotion ? undefined : { scale: 0.9 }}
        initial={reducedMotion ? { opacity: 0 } : { scale: 0 }}
        animate={reducedMotion ? { opacity: 1 } : { scale: 1 }}
        transition={{ delay: 0.3 }}
        aria-label={`View badges. ${earnedBadges.length} badges earned`}
      >
        <span className="text-xl" aria-hidden="true">🏆</span>
        {earnedBadges.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full text-xs font-bold text-yellow-900 flex items-center justify-center">
            {earnedBadges.length}
          </span>
        )}
      </motion.button>

      {/* Pause button */}
      <motion.button
        className="ml-2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center touch-target focus:outline-none focus:ring-4 focus:ring-yellow-400"
        onClick={handlePauseToggle}
        whileTap={reducedMotion ? undefined : { scale: 0.9 }}
        initial={reducedMotion ? { opacity: 0 } : { scale: 0 }}
        animate={reducedMotion ? { opacity: 1 } : { scale: 1 }}
        transition={{ delay: 0.35 }}
        aria-label={isPaused ? 'Resume game' : 'Pause game'}
        aria-pressed={isPaused}
      >
        <span className="text-white text-xl" aria-hidden="true">{isPaused ? '▶' : '⏸'}</span>
      </motion.button>

      {/* Badge Grid Modal */}
      <BadgeGrid isOpen={showBadgeGrid} onClose={handleCloseBadges} />
    </header>
  );
}

export default GameHUD;
