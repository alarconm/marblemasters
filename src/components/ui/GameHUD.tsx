import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export function GameHUD() {
  const {
    currentLevel,
    score,
    marblesDropped,
    marblesCollected,
    marblesRequired,
    isPaused,
    pauseGame,
    resumeGame,
  } = useGameStore();

  const progress = marblesCollected / marblesRequired;

  return (
    <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between bg-gradient-to-b from-black/30 to-transparent">
      {/* Level indicator */}
      <motion.div
        className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <span className="text-white font-bold text-lg">Level</span>
        <span
          className="text-yellow-300 font-bold text-2xl"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
        >
          {currentLevel}
        </span>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="flex-1 mx-4 max-w-xs"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative h-6 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: 'spring', damping: 15 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
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
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-2xl">⭐</span>
        <span
          className="text-white font-bold text-xl"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
        >
          {score.toLocaleString()}
        </span>
      </motion.div>

      {/* Pause button */}
      <motion.button
        className="ml-3 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center touch-target"
        onClick={isPaused ? resumeGame : pauseGame}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-white text-xl">{isPaused ? '▶' : '⏸'}</span>
      </motion.button>
    </div>
  );
}

export default GameHUD;
