import { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { AgeSelector } from '@/components/ui/AgeSelector';
import { GameCanvas } from '@/components/game/GameCanvas';
import { GameHUD } from '@/components/ui/GameHUD';
import { CelebrationOverlay } from '@/components/ui/CelebrationOverlay';
import { ChallengeModal } from '@/components/education/ChallengeModal';
import { ParentGate, ParentDashboard } from '@/components/parent';

function App() {
  const {
    showAgeSelector,
    showCelebration,
    showChallenge,
    currentChallenge,
    playerAge,
    startGame,
    answerChallenge,
    skipChallenge,
    pauseGame,
    resumeGame,
  } = useGameStore();

  const [showParentGate, setShowParentGate] = useState(false);
  const [showParentDashboard, setShowParentDashboard] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);

  const handleLongPressStart = useCallback(() => {
    setIsLongPressing(true);
    longPressTimer.current = setTimeout(() => {
      setShowParentGate(true);
      pauseGame();
      setIsLongPressing(false);
    }, 2000); // 2 second long press
  }, [pauseGame]);

  const handleLongPressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsLongPressing(false);
  }, []);

  const handleParentUnlock = useCallback(() => {
    setShowParentGate(false);
    setShowParentDashboard(true);
  }, []);

  const handleCloseDashboard = useCallback(() => {
    setShowParentDashboard(false);
    resumeGame();
  }, [resumeGame]);

  return (
    <div className="w-full h-full">
      <AnimatePresence mode="wait">
        {showAgeSelector ? (
          <AgeSelector key="age-selector" onSelectAge={startGame} />
        ) : (
          <div key="game" className="relative w-full h-full">
            <GameCanvas />
            <GameHUD />
            <AnimatePresence>
              {showCelebration && <CelebrationOverlay />}
            </AnimatePresence>
            <AnimatePresence>
              {showChallenge && currentChallenge && (
                <ChallengeModal
                  challenge={currentChallenge}
                  playerAge={playerAge}
                  onAnswer={answerChallenge}
                  onClose={skipChallenge}
                />
              )}
            </AnimatePresence>

            {/* Parent Access Button - Long press to open */}
            <motion.button
              className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center z-40"
              onMouseDown={handleLongPressStart}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              onTouchStart={handleLongPressStart}
              onTouchEnd={handleLongPressEnd}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="text-xl"
                animate={isLongPressing ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 2, ease: 'linear' }}
              >
                👨‍👩‍👧‍👦
              </motion.div>
              {isLongPressing && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-yellow-400"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 2, ease: 'linear' }}
                />
              )}
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Parent Gate */}
      <AnimatePresence>
        {showParentGate && (
          <ParentGate
            onUnlock={handleParentUnlock}
            onCancel={() => {
              setShowParentGate(false);
              resumeGame();
            }}
          />
        )}
      </AnimatePresence>

      {/* Parent Dashboard */}
      <AnimatePresence>
        {showParentDashboard && (
          <ParentDashboard onClose={handleCloseDashboard} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
