import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '@/hooks/useAccessibility';

// ============================================
// SPLASH SCREEN
// Animated loading screen on app start
// ============================================

interface SplashScreenProps {
  onComplete: () => void;
  minDuration?: number; // Minimum time to show splash (ms)
}

export function SplashScreen({ onComplete, minDuration = 2000 }: SplashScreenProps) {
  const { reducedMotion } = useAccessibility();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, reducedMotion ? 200 : 500);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete, reducedMotion]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.5 }}
        >
          {/* Animated background marbles */}
          {!reducedMotion && <BackgroundMarbles />}

          {/* Logo area */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={reducedMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
            transition={reducedMotion ? { duration: 0.2 } : { type: 'spring', damping: 15 }}
          >
            {/* Marble icon */}
            <motion.div
              className="text-8xl mb-4"
              animate={reducedMotion ? undefined : {
                rotate: [0, 10, -10, 0],
                y: [0, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            >
              🔵
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl font-bold text-white mb-2"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Marble Masters
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl text-white/80"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Learn & Play!
            </motion.p>

            {/* Loading indicator */}
            <motion.div
              className="mt-8 flex gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-white rounded-full"
                  animate={reducedMotion ? undefined : {
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Floating background marbles
function BackgroundMarbles() {
  const marbles = [
    { emoji: '🔴', x: 15, delay: 0 },
    { emoji: '🟡', x: 35, delay: 0.5 },
    { emoji: '🟢', x: 55, delay: 1 },
    { emoji: '🟣', x: 75, delay: 1.5 },
    { emoji: '🟠', x: 25, delay: 2 },
    { emoji: '🔵', x: 85, delay: 0.3 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {marbles.map((marble, i) => (
        <motion.div
          key={i}
          className="absolute text-4xl opacity-30"
          style={{ left: `${marble.x}%` }}
          initial={{ y: '110vh' }}
          animate={{ y: '-10vh' }}
          transition={{
            duration: 8,
            delay: marble.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {marble.emoji}
        </motion.div>
      ))}
    </div>
  );
}

export default SplashScreen;
