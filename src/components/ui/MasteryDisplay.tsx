import { motion, AnimatePresence } from 'framer-motion';
import { useParentStore } from '@/store/parentStore';
import { Subject } from '@/types';
import { getEncouragementMessage, getStreakMultiplier } from '@/systems/difficultyEngine';
import { calculateStreak } from '@/systems/progressTracker';

const subjectEmojis: Record<Subject, string> = {
  colors: '🎨',
  counting: '🔢',
  math: '➕',
  patterns: '🔷',
  letters: '🔤',
  logic: '🧩',
  memory: '🧠',
};

interface MasteryDisplayProps {
  show: boolean;
  onClose: () => void;
}

export function MasteryDisplay({ show, onClose }: MasteryDisplayProps) {
  const { subjectMastery, recentChallenges } = useParentStore();

  const streak = calculateStreak(recentChallenges);
  const multiplier = getStreakMultiplier();
  const encouragement = getEncouragementMessage();

  // Sort by mastery for display
  const sorted = [...subjectMastery].sort((a, b) => b.mastery - a.mastery);
  const top3 = sorted.slice(0, 3);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-x-4 top-20 z-30 pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 max-w-sm mx-auto pointer-events-auto">
          {/* Streak indicator */}
          {streak >= 3 && (
            <motion.div
              className="flex items-center justify-center gap-2 mb-3 text-yellow-300 font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <span className="text-2xl">🔥</span>
              <span>{streak} in a row!</span>
              {multiplier > 1 && (
                <span className="text-sm bg-yellow-400/30 px-2 py-0.5 rounded-full">
                  x{multiplier}
                </span>
              )}
            </motion.div>
          )}

          {/* Encouragement message */}
          {encouragement && (
            <motion.p
              className="text-center text-white font-medium mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {encouragement}
            </motion.p>
          )}

          {/* Top subjects mini display */}
          <div className="flex justify-center gap-3">
            {top3.map((subject, index) => (
              <motion.div
                key={subject.subject}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-2xl mb-1">
                  {subjectEmojis[subject.subject]}
                </span>
                <div className="w-12 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.mastery}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white/50 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Compact streak indicator for HUD
export function StreakIndicator() {
  const { recentChallenges } = useParentStore();
  const streak = calculateStreak(recentChallenges);

  if (streak < 3) return null;

  return (
    <motion.div
      className="flex items-center gap-1 bg-orange-500/30 backdrop-blur-sm rounded-full px-3 py-1"
      initial={{ scale: 0, x: -20 }}
      animate={{ scale: 1, x: 0 }}
      exit={{ scale: 0, x: -20 }}
    >
      <span className="text-lg">🔥</span>
      <span className="text-white font-bold text-sm">{streak}</span>
    </motion.div>
  );
}

export default MasteryDisplay;
