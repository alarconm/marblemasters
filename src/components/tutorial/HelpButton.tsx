import { motion } from 'framer-motion';
import { useTutorialStore } from '@/store/tutorialStore';
import { useAccessibility } from '@/hooks/useAccessibility';

// ============================================
// HELP BUTTON
// "?" button to access help during gameplay
// ============================================

interface HelpButtonProps {
  playerAge: number;
}

export function HelpButton({ playerAge }: HelpButtonProps) {
  const { openHelp, isActive: tutorialActive } = useTutorialStore();
  const { reducedMotion } = useAccessibility();

  // Don't show during active tutorial
  if (tutorialActive) return null;

  // Larger button for younger kids
  const buttonSize = playerAge <= 4 ? 56 : 44;
  const fontSize = playerAge <= 4 ? 'text-2xl' : 'text-xl';

  return (
    <motion.button
      className={`fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center touch-target focus:outline-none focus:ring-4 focus:ring-blue-400 z-30 ${fontSize}`}
      style={{
        width: buttonSize,
        height: buttonSize,
      }}
      onClick={openHelp}
      initial={reducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
      animate={reducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
      whileHover={reducedMotion ? undefined : { scale: 1.1 }}
      whileTap={reducedMotion ? undefined : { scale: 0.95 }}
      aria-label="Open help"
    >
      {/* Use marble icon for young kids, "?" for older */}
      {playerAge <= 4 ? '🔵' : '?'}
    </motion.button>
  );
}

export default HelpButton;
