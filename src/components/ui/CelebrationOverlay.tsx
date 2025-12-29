import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/systems/audioManager';
import { voicePrompts } from '@/systems/voicePrompts';

export function CelebrationOverlay() {
  const { currentLevel, score, nextLevel } = useGameStore();

  // Play sounds on mount
  useEffect(() => {
    audioManager.playLevelComplete();
    voicePrompts.speakLevelComplete();
  }, []);

  // Generate confetti particles
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: [
      '#FF6B6B',
      '#4ECDC4',
      '#FFE66D',
      '#95E1D3',
      '#F38181',
      '#AA96DA',
    ][Math.floor(Math.random() * 6)],
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
  }));

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              left: `${particle.x}%`,
              background: particle.color,
            }}
            initial={{ y: -20, rotate: 0, opacity: 1 }}
            animate={{
              y: '120vh',
              rotate: 720,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: 'easeIn',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 12 }}
      >
        {/* Star burst */}
        <motion.div
          className="text-8xl mb-4"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        >
          🎉
        </motion.div>

        {/* Level complete text */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-white mb-2"
          style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Level {currentLevel} Complete!
        </motion.h2>

        <motion.p
          className="text-2xl text-yellow-300 mb-8"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Score: {score.toLocaleString()} ⭐
        </motion.p>

        {/* Next level button */}
        <motion.button
          className="px-8 py-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full font-bold text-white text-2xl shadow-lg touch-target"
          style={{
            boxShadow: '0 4px 20px rgba(72, 187, 120, 0.5)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}
          onClick={nextLevel}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
        >
          Next Level →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default CelebrationOverlay;
