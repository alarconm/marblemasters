import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { audioManager } from '@/systems/audioManager';

interface LevelTransitionProps {
  level: number;
  onComplete: () => void;
}

export function LevelTransition({ level, onComplete }: LevelTransitionProps) {
  useEffect(() => {
    // Play level start sound
    audioManager.playDrop();

    // Complete transition after animation
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop with radial gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Level number with zoom animation */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
        }}
      >
        {/* Stars burst */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              transform: `rotate(${i * 45}deg)`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 2],
            }}
            transition={{
              duration: 1,
              delay: 0.2 + i * 0.05,
              ease: 'easeOut',
            }}
          >
            <span
              style={{
                display: 'block',
                transform: `translateY(-80px) rotate(-${i * 45}deg)`,
              }}
            >
              ✨
            </span>
          </motion.div>
        ))}

        {/* Level text */}
        <motion.div
          className="text-2xl font-bold text-white/80 mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          LEVEL
        </motion.div>

        {/* Level number */}
        <motion.div
          className="text-8xl font-bold"
          style={{
            color: '#FFD700',
            textShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3), 4px 4px 0 #B8860B',
          }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            times: [0, 0.7, 1],
          }}
        >
          {level}
        </motion.div>

        {/* Encouraging text */}
        <motion.div
          className="text-xl font-bold text-white/90 mt-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {level === 1 ? "Let's Go!" : level < 5 ? 'Keep Going!' : level < 10 ? 'Amazing!' : 'Incredible!'}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default LevelTransition;
