import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Challenge, ChallengeOption, MARBLE_COLORS, MarbleColor } from '@/types';
import { voicePrompts } from '@/systems/voicePrompts';
import { audioManager } from '@/systems/audioManager';
import { shuffleArray } from '@/utils/mathHelpers';

interface ChallengeModalProps {
  challenge: Challenge;
  playerAge: number;
  onAnswer: (correct: boolean, responseTime: number) => void;
  onClose: () => void;
}

export function ChallengeModal({
  challenge,
  playerAge,
  onAnswer,
  onClose,
}: ChallengeModalProps) {
  const [shuffledOptions, setShuffledOptions] = useState<ChallengeOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [startTime] = useState(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);

  // Shuffle options on mount
  useEffect(() => {
    setShuffledOptions(shuffleArray(challenge.options));
  }, [challenge]);

  // Speak voice prompt for young children
  useEffect(() => {
    if (playerAge <= 5 && challenge.voicePrompt) {
      // Small delay before speaking
      const timer = setTimeout(() => {
        voicePrompts.speak(challenge.voicePrompt!);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [challenge, playerAge]);

  const handleOptionSelect = (option: ChallengeOption) => {
    if (selectedOption) return; // Already answered

    setSelectedOption(option.id);
    const correct = option.isCorrect;
    setIsCorrect(correct);
    setShowFeedback(true);

    const responseTime = Date.now() - startTime;

    // Audio and voice feedback
    if (correct) {
      audioManager.playCorrect();
      voicePrompts.speakCorrect();
    } else {
      audioManager.playIncorrect();
      voicePrompts.speakTryAgain();
    }

    // Delay before closing (show feedback)
    setTimeout(() => {
      onAnswer(correct, responseTime);
      if (correct) {
        onClose();
      } else {
        // Reset for another try
        setSelectedOption(null);
        setIsCorrect(null);
        setShowFeedback(false);
      }
    }, correct ? 1500 : 1000);
  };

  // Generate display marbles for counting/visual challenges
  const renderMarbles = () => {
    if (!challenge.showMarbles || !challenge.marbleCount) return null;

    const colors: MarbleColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const marbles = Array.from({ length: challenge.marbleCount }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
    }));

    return (
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {marbles.map((marble) => (
          <motion.div
            key={marble.id}
            className="w-10 h-10 rounded-full marble-glow"
            style={{
              background: `radial-gradient(circle at 30% 30%,
                ${lightenColor(MARBLE_COLORS[marble.color], 40)} 0%,
                ${MARBLE_COLORS[marble.color]} 50%,
                ${darkenColor(MARBLE_COLORS[marble.color], 30)} 100%)`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: marble.id * 0.1 }}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        {/* Prompt */}
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {challenge.prompt}
        </motion.h2>

        {/* Visual marbles for counting challenges */}
        {renderMarbles()}

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-3">
          {shuffledOptions.map((option, index) => (
            <motion.button
              key={option.id}
              className={`
                touch-target rounded-2xl font-bold text-2xl p-4
                transition-all duration-200
                ${selectedOption === option.id
                  ? isCorrect
                    ? 'bg-green-400 text-white ring-4 ring-green-300'
                    : 'bg-red-400 text-white ring-4 ring-red-300 animate-shake'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }
              `}
              style={{
                minHeight: 70,
              }}
              onClick={() => handleOptionSelect(option)}
              disabled={selectedOption !== null}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              {option.color ? (
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full marble-glow"
                    style={{
                      background: `radial-gradient(circle at 30% 30%,
                        ${lightenColor(MARBLE_COLORS[option.color as MarbleColor], 40)} 0%,
                        ${MARBLE_COLORS[option.color as MarbleColor]} 50%,
                        ${darkenColor(MARBLE_COLORS[option.color as MarbleColor], 30)} 100%)`,
                    }}
                  />
                  <span>{option.label}</span>
                </div>
              ) : (
                option.label
              )}
            </motion.button>
          ))}
        </div>

        {/* Feedback overlay */}
        <AnimatePresence>
          {showFeedback && isCorrect && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-green-400/90 rounded-3xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className="text-center">
                <motion.div
                  className="text-6xl mb-2"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ duration: 0.5 }}
                >
                  🎉
                </motion.div>
                <span className="text-3xl font-bold text-white">
                  Great job!
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// Helper functions
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

export default ChallengeModal;
