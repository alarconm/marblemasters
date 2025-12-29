import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/types';
import { RARITY_COLORS, getUnlockedByBadge } from '@/data/badges';
import { useAccessibility } from '@/hooks/useAccessibility';
import { audioManager } from '@/systems/audioManager';

// ============================================
// BADGE UNLOCK ANIMATION
// Celebration when a badge is earned
// ============================================

interface BadgeUnlockAnimationProps {
  badge: Badge | null;
  onComplete: () => void;
}

export function BadgeUnlockAnimation({ badge, onComplete }: BadgeUnlockAnimationProps) {
  const { reducedMotion } = useAccessibility();
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter');

  useEffect(() => {
    if (!badge) return;

    // Play celebration sound
    audioManager.playLevelComplete();

    // Phase timing
    const showTimer = setTimeout(() => setPhase('show'), reducedMotion ? 100 : 600);
    const exitTimer = setTimeout(() => setPhase('exit'), reducedMotion ? 2000 : 3500);
    const completeTimer = setTimeout(onComplete, reducedMotion ? 2200 : 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [badge, onComplete, reducedMotion]);

  if (!badge) return null;

  const colors = RARITY_COLORS[badge.rarity];
  const unlockable = getUnlockedByBadge(badge.id);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Dark backdrop with blur */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          aria-hidden="true"
        />

        {/* Celebration particles */}
        {!reducedMotion && <CelebrationParticles color={colors.border} />}

        {/* Main content */}
        <motion.div
          className="relative flex flex-col items-center px-8"
          initial={reducedMotion ? { opacity: 0 } : { scale: 0, rotate: -180 }}
          animate={
            phase === 'enter'
              ? reducedMotion
                ? { opacity: 1 }
                : { scale: 1, rotate: 0 }
              : phase === 'exit'
              ? reducedMotion
                ? { opacity: 0 }
                : { scale: 0, y: -100 }
              : undefined
          }
          transition={
            reducedMotion
              ? { duration: 0.2 }
              : { type: 'spring', damping: 12, stiffness: 100 }
          }
          role="alert"
          aria-live="assertive"
        >
          {/* "Badge Earned" text */}
          <motion.p
            className="text-yellow-400 font-bold text-xl mb-4 tracking-wide"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reducedMotion ? 0 : 0.3 }}
          >
            BADGE EARNED!
          </motion.p>

          {/* Badge circle */}
          <motion.div
            className="relative w-32 h-32 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: colors.bg,
              boxShadow: `0 0 40px ${colors.border}, 0 0 80px ${colors.border}50`,
            }}
            animate={
              !reducedMotion && phase === 'show'
                ? {
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      `0 0 40px ${colors.border}, 0 0 80px ${colors.border}50`,
                      `0 0 60px ${colors.border}, 0 0 120px ${colors.border}70`,
                      `0 0 40px ${colors.border}, 0 0 80px ${colors.border}50`,
                    ],
                  }
                : undefined
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {/* Rotating ring */}
            {!reducedMotion && (
              <motion.div
                className="absolute inset-0 rounded-full border-4"
                style={{ borderColor: colors.border }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                aria-hidden="true"
              />
            )}

            {/* Badge icon */}
            <motion.span
              className="text-6xl"
              animate={
                !reducedMotion && phase === 'show'
                  ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
                  : undefined
              }
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            >
              {badge.icon}
            </motion.span>
          </motion.div>

          {/* Badge name */}
          <motion.h2
            className="mt-6 text-3xl font-bold text-white text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reducedMotion ? 0.1 : 0.5 }}
          >
            {badge.name}
          </motion.h2>

          {/* Badge description */}
          <motion.p
            className="mt-2 text-lg text-gray-300 text-center max-w-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reducedMotion ? 0.15 : 0.7 }}
          >
            {badge.description}
          </motion.p>

          {/* Reward info */}
          {badge.reward && (
            <motion.div
              className="mt-4 px-4 py-2 bg-yellow-500/20 rounded-full flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reducedMotion ? 0.2 : 0.9 }}
            >
              <span className="text-xl" aria-hidden="true">
                🎁
              </span>
              <span className="text-yellow-400 font-medium">
                {unlockable ? `Unlocked: ${unlockable.name}` : 'Reward Unlocked!'}
              </span>
            </motion.div>
          )}

          {/* Rarity badge */}
          <motion.div
            className="mt-4 px-3 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: colors.border, color: 'white' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reducedMotion ? 0.25 : 1.1 }}
          >
            {badge.rarity.toUpperCase()}
          </motion.div>

          {/* Tap to continue */}
          <motion.p
            className="mt-8 text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }}
          >
            Tap anywhere to continue
          </motion.p>
        </motion.div>

        {/* Tap to dismiss */}
        <button
          className="absolute inset-0 z-10"
          onClick={onComplete}
          aria-label="Dismiss badge notification"
        />
      </motion.div>
    </AnimatePresence>
  );
}

// Celebration particles
function CelebrationParticles({ color }: { color: string }) {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 2,
    size: 8 + Math.random() * 16,
    emoji: ['✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-2xl"
          style={{
            left: `${p.x}%`,
            top: '100%',
            fontSize: p.size,
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: -window.innerHeight - 100,
            opacity: [1, 1, 0],
            rotate: 360,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
        >
          {p.emoji}
        </motion.div>
      ))}

      {/* Confetti */}
      {Array.from({ length: 30 }, (_, i) => (
        <motion.div
          key={`confetti-${i}`}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-20px',
            backgroundColor:
              i % 3 === 0 ? color : i % 3 === 1 ? '#FFD700' : '#FF69B4',
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            x: (Math.random() - 0.5) * 200,
            opacity: [1, 1, 0],
            rotate: 720,
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: Math.random() * 0.3,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}

export default BadgeUnlockAnimation;
