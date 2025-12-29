import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export function PauseOverlay() {
  const { resumeGame, resetGame, currentLevel, score } = useGameStore();

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-40 bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Paused icon */}
      <motion.div
        className="text-8xl mb-4"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        ⏸️
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-5xl font-bold text-white mb-8"
        style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Paused
      </motion.h2>

      {/* Stats */}
      <motion.div
        className="flex gap-8 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-300">{currentLevel}</div>
          <div className="text-white/80 text-sm">Level</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-300">{score.toLocaleString()}</div>
          <div className="text-white/80 text-sm">Score</div>
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        className="flex flex-col gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          className="px-12 py-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full font-bold text-white text-2xl shadow-lg"
          onClick={resumeGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ▶ Resume
        </motion.button>

        <motion.button
          className="px-12 py-4 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full font-bold text-white text-xl shadow-lg"
          onClick={resetGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🏠 Quit Game
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default PauseOverlay;
