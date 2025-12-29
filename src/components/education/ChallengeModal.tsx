import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Challenge, ChallengeOption, MARBLE_COLORS, MarbleColor } from '@/types';
import { voicePrompts } from '@/systems/voicePrompts';
import { audioManager } from '@/systems/audioManager';
import { haptics } from '@/systems/haptics';
import { announcer } from '@/systems/announcer';
import { shuffleArray } from '@/utils/mathHelpers';
import { useFocusTrap, useAccessibility, useArrowNavigation } from '@/hooks/useAccessibility';

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
  const [startTime, setStartTime] = useState(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);

  // Accessibility
  const modalRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useAccessibility();
  useFocusTrap(true, modalRef);
  const handleArrowNav = useArrowNavigation(optionsRef, 2);

  // Memory challenge specific state
  const isMemoryChallenge = challenge.type === 'memory-sequence';
  const [memoryPhase, setMemoryPhase] = useState<'showing' | 'asking'>(
    isMemoryChallenge ? 'showing' : 'asking'
  );
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);

  // Announce challenge to screen readers
  useEffect(() => {
    if (memoryPhase === 'asking') {
      announcer.announceChallengeStart(challenge.prompt);
    }
  }, [challenge.prompt, memoryPhase]);

  // Shuffle options on mount
  useEffect(() => {
    setShuffledOptions(shuffleArray(challenge.options));
  }, [challenge]);

  // Memory sequence animation
  useEffect(() => {
    if (!isMemoryChallenge || memoryPhase !== 'showing') return;

    const sequence = challenge.memorySequence || [];
    if (currentMemoryIndex < sequence.length) {
      const timer = setTimeout(() => {
        setCurrentMemoryIndex((prev) => prev + 1);
      }, 1200); // Show each marble for 1.2 seconds
      return () => clearTimeout(timer);
    } else {
      // Sequence complete, switch to asking phase
      const timer = setTimeout(() => {
        setMemoryPhase('asking');
        setStartTime(Date.now()); // Reset timer for response
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isMemoryChallenge, memoryPhase, currentMemoryIndex, challenge.memorySequence]);

  // Speak voice prompt for young children
  useEffect(() => {
    if (playerAge <= 5 && challenge.voicePrompt && memoryPhase === 'asking') {
      // Small delay before speaking
      const timer = setTimeout(() => {
        voicePrompts.speak(challenge.voicePrompt!);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [challenge, playerAge, memoryPhase]);

  const handleOptionSelect = (option: ChallengeOption) => {
    if (selectedOption) return; // Already answered

    setSelectedOption(option.id);
    const correct = option.isCorrect;
    setIsCorrect(correct);
    setShowFeedback(true);

    const responseTime = Date.now() - startTime;

    // Audio, haptic, voice, and screen reader feedback
    if (correct) {
      audioManager.playCorrect();
      haptics.success();
      voicePrompts.speakCorrect();
      announcer.announceCorrect();
    } else {
      audioManager.playIncorrect();
      haptics.error();
      voicePrompts.speakTryAgain();
      announcer.announceIncorrect();
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

  // Render memory sequence showing phase
  const renderMemorySequence = () => {
    if (!isMemoryChallenge || memoryPhase !== 'showing') return null;

    const sequence = challenge.memorySequence || [];
    const currentColor = currentMemoryIndex < sequence.length ? sequence[currentMemoryIndex] : null;

    return (
      <div className="flex flex-col items-center mb-6">
        <motion.div
          className="text-lg text-gray-600 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Watch carefully! 👀
        </motion.div>

        {/* Memory marble display */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentColor && (
              <motion.div
                key={currentMemoryIndex}
                className="w-20 h-20 rounded-full marble-glow"
                style={{
                  background: `radial-gradient(circle at 30% 30%,
                    ${lightenColor(MARBLE_COLORS[currentColor], 40)} 0%,
                    ${MARBLE_COLORS[currentColor]} 50%,
                    ${darkenColor(MARBLE_COLORS[currentColor], 30)} 100%)`,
                  boxShadow: `0 0 30px ${MARBLE_COLORS[currentColor]}80`,
                }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                transition={{ type: 'spring', damping: 12 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-4">
          {sequence.map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < currentMemoryIndex
                  ? 'bg-green-400'
                  : i === currentMemoryIndex
                  ? 'bg-yellow-400'
                  : 'bg-gray-300'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="challenge-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

      {/* Modal */}
      <motion.div
        ref={modalRef}
        className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
        initial={reducedMotion ? { opacity: 0 } : { scale: 0.8, y: 50 }}
        animate={reducedMotion ? { opacity: 1 } : { scale: 1, y: 0 }}
        transition={reducedMotion ? { duration: 0.15 } : { type: 'spring', damping: 15 }}
        tabIndex={-1}
      >
        {/* Memory sequence display */}
        {renderMemorySequence()}

        {/* Prompt - only show when not in memory showing phase */}
        {memoryPhase === 'asking' && (
          <motion.h2
            id="challenge-title"
            className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4"
            initial={reducedMotion ? { opacity: 0 } : { y: -20, opacity: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {challenge.prompt}
          </motion.h2>
        )}

        {/* Visual marbles for counting challenges */}
        {memoryPhase === 'asking' && renderMarbles()}

        {/* Options grid - only show when not in memory showing phase */}
        <div
          ref={optionsRef}
          className={`grid grid-cols-2 gap-3 ${memoryPhase !== 'asking' ? 'hidden' : ''}`}
          role="group"
          aria-label="Answer options"
          onKeyDown={handleArrowNav}
        >
          {shuffledOptions.map((option, index) => (
            <motion.button
              key={option.id}
              className={`
                touch-target rounded-2xl font-bold text-2xl p-4
                transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-blue-400
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
              whileTap={reducedMotion ? undefined : { scale: 0.95 }}
              initial={reducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
              animate={reducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              aria-label={option.color ? `${option.label} (${option.color} marble)` : option.label}
              aria-pressed={selectedOption === option.id}
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
