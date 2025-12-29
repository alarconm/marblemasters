import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTutorialStore } from '@/store/tutorialStore';
import { useAccessibility, useFocusTrap } from '@/hooks/useAccessibility';
import { HELP_CONTENT } from './tutorialContent';

// ============================================
// HELP OVERLAY
// Quick reference overlay for how to play
// ============================================

interface HelpOverlayProps {
  playerAge: number;
}

export function HelpOverlay({ playerAge }: HelpOverlayProps) {
  const { helpOverlayOpen, closeHelp, getAgeGroup, startTutorial } = useTutorialStore();
  const { reducedMotion } = useAccessibility();
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(helpOverlayOpen, modalRef);

  const ageGroup = getAgeGroup(playerAge);
  const helpItems = HELP_CONTENT[ageGroup];

  // Font sizes based on age
  const textSize = playerAge <= 4 ? 'text-2xl' : playerAge <= 6 ? 'text-xl' : 'text-lg';
  const iconSize = playerAge <= 4 ? 'text-5xl' : playerAge <= 6 ? 'text-4xl' : 'text-3xl';

  const handleReplayTutorial = () => {
    closeHelp();
    startTutorial();
  };

  return (
    <AnimatePresence>
      {helpOverlayOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-title"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeHelp}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            initial={reducedMotion ? { opacity: 0 } : { scale: 0.8, y: 50 }}
            animate={reducedMotion ? { opacity: 1 } : { scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { scale: 0.8, y: 50 }}
            transition={reducedMotion ? { duration: 0.15 } : { type: 'spring', damping: 15 }}
            tabIndex={-1}
          >
            {/* Header */}
            <h2
              id="help-title"
              className="text-2xl font-bold text-center text-gray-800 mb-6"
            >
              How to Play
            </h2>

            {/* Help items */}
            <div className="space-y-4 mb-6">
              {helpItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4"
                  initial={reducedMotion ? { opacity: 0 } : { x: -20, opacity: 0 }}
                  animate={reducedMotion ? { opacity: 1 } : { x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className={iconSize} aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className={`${textSize} font-medium text-gray-700`}>
                    {item.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                className="flex-1 py-3 bg-blue-500 text-white rounded-2xl font-bold text-lg touch-target focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={handleReplayTutorial}
                whileTap={reducedMotion ? undefined : { scale: 0.95 }}
              >
                Show Tutorial
              </motion.button>

              <motion.button
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold text-lg touch-target focus:outline-none focus:ring-4 focus:ring-gray-300"
                onClick={closeHelp}
                whileTap={reducedMotion ? undefined : { scale: 0.95 }}
              >
                Got It!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default HelpOverlay;
