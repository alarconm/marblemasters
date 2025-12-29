import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useGameStore } from '@/store/gameStore';

// ============================================
// BREAK REMINDER OVERLAY
// Gentle reminder to take a break
// ============================================

interface BreakReminderOverlayProps {
  isOpen: boolean;
  sessionMinutes: number;
  onDismiss: () => void;
}

export function BreakReminderOverlay({
  isOpen,
  sessionMinutes,
  onDismiss,
}: BreakReminderOverlayProps) {
  const { reducedMotion } = useAccessibility();
  const { resumeGame } = useGameStore();

  const handleContinue = () => {
    onDismiss();
    resumeGame();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="break-title"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-sm" />

          {/* Content */}
          <motion.div
            className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            initial={reducedMotion ? { opacity: 0 } : { scale: 0.8, y: 50 }}
            animate={reducedMotion ? { opacity: 1 } : { scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { scale: 0.8, y: 50 }}
            transition={reducedMotion ? { duration: 0.2 } : { type: 'spring', damping: 20 }}
          >
            {/* Icon */}
            <motion.div
              className="text-7xl mb-4"
              animate={reducedMotion ? undefined : {
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              aria-hidden="true"
            >
              🌟
            </motion.div>

            {/* Title */}
            <h2
              id="break-title"
              className="text-2xl font-bold text-gray-800 mb-2"
            >
              Time for a Break!
            </h2>

            {/* Message */}
            <p className="text-gray-600 mb-2">
              You've been playing for{' '}
              <span className="font-bold text-blue-600">{sessionMinutes} minutes</span>!
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Take a moment to rest your eyes, stretch, and have some water.
            </p>

            {/* Stretching suggestions */}
            <div className="bg-blue-50 rounded-2xl p-4 mb-6">
              <p className="text-blue-700 font-medium text-sm">
                Quick Break Ideas:
              </p>
              <div className="flex justify-center gap-4 mt-2 text-2xl">
                <span title="Stretch">🙆</span>
                <span title="Water">💧</span>
                <span title="Walk">🚶</span>
                <span title="Look outside">🌳</span>
              </div>
            </div>

            {/* Continue button */}
            <motion.button
              className="w-full py-4 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl font-bold text-white text-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300"
              onClick={handleContinue}
              whileTap={reducedMotion ? undefined : { scale: 0.95 }}
            >
              I'm Ready to Play! ✨
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// TIME LIMIT OVERLAY
// Session time limit reached
// ============================================

interface TimeLimitOverlayProps {
  isOpen: boolean;
  sessionMinutes: number;
  onAcknowledge: () => void;
}

export function TimeLimitOverlay({
  isOpen,
  sessionMinutes,
  onAcknowledge,
}: TimeLimitOverlayProps) {
  const { reducedMotion } = useAccessibility();
  const { resetGame } = useGameStore();

  const handleEndSession = () => {
    onAcknowledge();
    resetGame();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="limit-title"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-purple-900/80 backdrop-blur-sm" />

          {/* Content */}
          <motion.div
            className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
            initial={reducedMotion ? { opacity: 0 } : { scale: 0.8, y: 50 }}
            animate={reducedMotion ? { opacity: 1 } : { scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { scale: 0.8, y: 50 }}
            transition={reducedMotion ? { duration: 0.2 } : { type: 'spring', damping: 20 }}
          >
            {/* Icon */}
            <motion.div
              className="text-7xl mb-4"
              animate={reducedMotion ? undefined : { scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              aria-hidden="true"
            >
              🌙
            </motion.div>

            {/* Title */}
            <h2
              id="limit-title"
              className="text-2xl font-bold text-gray-800 mb-2"
            >
              Time's Up!
            </h2>

            {/* Message */}
            <p className="text-gray-600 mb-2">
              You've played for{' '}
              <span className="font-bold text-purple-600">{sessionMinutes} minutes</span> today!
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Great job! It's time to take a longer break and do something else fun.
            </p>

            {/* Activity suggestions */}
            <div className="bg-purple-50 rounded-2xl p-4 mb-6">
              <p className="text-purple-700 font-medium text-sm">
                Fun Things to Do:
              </p>
              <div className="flex justify-center gap-4 mt-2 text-2xl">
                <span title="Read a book">📚</span>
                <span title="Play outside">🏃</span>
                <span title="Draw">🎨</span>
                <span title="Build blocks">🧱</span>
              </div>
            </div>

            {/* End session button */}
            <motion.button
              className="w-full py-4 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl font-bold text-white text-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
              onClick={handleEndSession}
              whileTap={reducedMotion ? undefined : { scale: 0.95 }}
            >
              See You Tomorrow! 👋
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BreakReminderOverlay;
