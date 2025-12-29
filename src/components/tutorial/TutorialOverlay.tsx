import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useTutorialStore } from '@/store/tutorialStore';
import { voicePrompts } from '@/systems/voicePrompts';
import { useAccessibility } from '@/hooks/useAccessibility';
import { getStepContent, shouldShowSkip } from './tutorialContent';
import { TutorialHand } from './TutorialHand';
import { TutorialHighlight } from './TutorialHighlight';

// ============================================
// TUTORIAL OVERLAY
// Main orchestrator for the tutorial system
// ============================================

// Target positions for highlights (relative to screen)
const getTargetBounds = (
  target: string,
  launcherPosition: { x: number; y: number }
) => {
  switch (target) {
    case 'launcher':
      return {
        x: launcherPosition.x - 60,
        y: launcherPosition.y - 40,
        width: 120,
        height: 80,
      };
    case 'progress':
      // Progress bar in HUD (approximate)
      return {
        x: window.innerWidth / 2 - 100,
        y: 10,
        width: 200,
        height: 40,
      };
    case 'bucket':
      // Buckets at bottom (approximate)
      return {
        x: window.innerWidth / 2 - 120,
        y: window.innerHeight - 100,
        width: 240,
        height: 80,
      };
    default:
      return null;
  }
};

export function TutorialOverlay() {
  const { reducedMotion } = useAccessibility();
  const {
    isActive,
    currentStep,
    advanceStep,
    skipTutorial,
    completeTutorial,
    getAgeGroup,
  } = useTutorialStore();

  const {
    playerAge,
    launcherPosition,
    marblesDropped,
    marblesCollected,
  } = useGameStore();

  const [showText, setShowText] = useState(false);

  const ageGroup = getAgeGroup(playerAge);
  const content = getStepContent(currentStep, ageGroup);
  const targetBounds = getTargetBounds(content.highlightTarget, launcherPosition);

  // Auto-advance based on duration
  useEffect(() => {
    if (!isActive || currentStep === 'complete') return;

    if (content.duration > 0) {
      const timer = setTimeout(() => {
        advanceStep();
      }, content.duration);
      return () => clearTimeout(timer);
    }
  }, [isActive, currentStep, content.duration, advanceStep]);

  // Watch for action completion
  useEffect(() => {
    if (!isActive || !content.waitForAction) return;

    if (content.waitForAction === 'marble-dropped' && marblesDropped > 0) {
      advanceStep();
    }
  }, [isActive, content.waitForAction, marblesDropped, advanceStep]);

  // Watch for marble collection
  useEffect(() => {
    if (!isActive) return;

    // After first marble collected, move to collect-first step
    if (currentStep === 'watch-marble' && marblesCollected > 0) {
      advanceStep();
    }
  }, [isActive, currentStep, marblesCollected, advanceStep]);

  // Complete tutorial after free-play step
  useEffect(() => {
    if (currentStep === 'complete' && isActive) {
      completeTutorial(playerAge);
    }
  }, [currentStep, isActive, playerAge, completeTutorial]);

  // Show text with delay
  useEffect(() => {
    if (!isActive) return;

    setShowText(false);
    const timer = setTimeout(() => setShowText(true), 300);
    return () => clearTimeout(timer);
  }, [currentStep, isActive]);

  // Speak voice prompt
  useEffect(() => {
    if (!isActive || !content.voice) return;

    const timer = setTimeout(() => {
      voicePrompts.speak(content.voice!);
    }, 400);
    return () => clearTimeout(timer);
  }, [isActive, currentStep, content.voice]);

  // Don't render if not active or complete
  if (!isActive || currentStep === 'complete') return null;

  const canSkip = shouldShowSkip(playerAge, currentStep);

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Spotlight highlight */}
      <AnimatePresence>
        {targetBounds && content.highlightTarget !== 'none' && (
          <TutorialHighlight
            targetX={targetBounds.x}
            targetY={targetBounds.y}
            targetWidth={targetBounds.width}
            targetHeight={targetBounds.height}
            padding={content.handSize === 'large' ? 40 : content.handSize === 'medium' ? 30 : 20}
          />
        )}
      </AnimatePresence>

      {/* Animated hand */}
      <AnimatePresence>
        {content.showHand && targetBounds && (
          <TutorialHand
            targetX={targetBounds.x + targetBounds.width / 2}
            targetY={targetBounds.y + targetBounds.height}
            size={content.handSize}
          />
        )}
      </AnimatePresence>

      {/* Text instruction */}
      <AnimatePresence>
        {showText && content.text && (
          <motion.div
            className="fixed left-0 right-0 flex justify-center pointer-events-none"
            style={{
              bottom: content.highlightTarget === 'bucket' ? '40%' : '25%',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={reducedMotion ? { duration: 0.15 } : { type: 'spring', damping: 15 }}
          >
            <div
              className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-2xl max-w-xs mx-4"
              style={{
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              }}
            >
              <p
                className={`text-center font-bold text-gray-800 ${
                  content.handSize === 'large'
                    ? 'text-2xl'
                    : content.handSize === 'medium'
                    ? 'text-xl'
                    : 'text-lg'
                }`}
              >
                {content.text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip button */}
      {canSkip && (
        <motion.button
          className="fixed top-20 right-4 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-gray-600 font-medium text-sm shadow-lg pointer-events-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileTap={{ scale: 0.95 }}
          onClick={skipTutorial}
        >
          Skip Tutorial
        </motion.button>
      )}
    </div>
  );
}

export default TutorialOverlay;
