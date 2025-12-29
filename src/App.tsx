import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useTutorialStore } from '@/store/tutorialStore';
import { useParentStore } from '@/store/parentStore';
import { AgeSelector } from '@/components/ui/AgeSelector';
import { GameCanvas } from '@/components/game/GameCanvas';
import { GameHUD } from '@/components/ui/GameHUD';
import { CelebrationOverlay } from '@/components/ui/CelebrationOverlay';
import { PauseOverlay } from '@/components/ui/PauseOverlay';
import { LevelTransition } from '@/components/ui/LevelTransition';
import { ChallengeModal } from '@/components/education/ChallengeModal';
import { ParentGate, ParentDashboard } from '@/components/parent';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { HelpButton } from '@/components/tutorial/HelpButton';
import { HelpOverlay } from '@/components/tutorial/HelpOverlay';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { BreakReminderOverlay, TimeLimitOverlay } from '@/components/ui/BreakReminderOverlay';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { audioManager } from '@/systems/audioManager';

function App() {
  const {
    showAgeSelector,
    showCelebration,
    showChallenge,
    showLevelTransition,
    currentLevel,
    currentChallenge,
    playerAge,
    isPaused,
    isPlaying,
    startGame,
    answerChallenge,
    skipChallenge,
    pauseGame,
    resumeGame,
    completeLevelTransition,
  } = useGameStore();

  const { musicEnabled } = useParentStore();

  const {
    isActive: tutorialActive,
    shouldShowTutorial,
    startTutorial,
  } = useTutorialStore();

  // Session timer for break reminders and time limits
  const {
    sessionMinutes,
    showBreakReminder,
    showTimeLimit,
    dismissBreakReminder,
    acknowledgeTimeLimit,
  } = useSessionTimer();

  const [showSplash, setShowSplash] = useState(true);
  const [showParentGate, setShowParentGate] = useState(false);
  const [showParentDashboard, setShowParentDashboard] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);

  // Start/stop background music based on game state and settings
  useEffect(() => {
    if (isPlaying && musicEnabled && !isPaused) {
      audioManager.startMusic();
    } else {
      audioManager.stopMusic();
    }

    return () => {
      audioManager.stopMusic();
    };
  }, [isPlaying, musicEnabled, isPaused]);

  // Handle game start with optional tutorial
  const handleStartGame = useCallback(
    (age: number) => {
      startGame(age);

      // Resume audio context on first user interaction
      audioManager.resume();

      // Check if tutorial should show for this age
      if (shouldShowTutorial(age)) {
        // Small delay to let game initialize
        setTimeout(() => {
          startTutorial();
        }, 500);
      }
    },
    [startGame, shouldShowTutorial, startTutorial]
  );

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
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      <AnimatePresence mode="wait">
        {showAgeSelector ? (
          <AgeSelector key="age-selector" onSelectAge={handleStartGame} />
        ) : (
          <div key="game" className="relative w-full h-full">
            <GameCanvas />
            <GameHUD />

            {/* Tutorial Overlay */}
            <TutorialOverlay />

            {/* Help Button (bottom right) */}
            <HelpButton playerAge={playerAge} />

            {/* Help Overlay */}
            <HelpOverlay playerAge={playerAge} />

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

            {/* Level Transition */}
            <AnimatePresence>
              {showLevelTransition && (
                <LevelTransition
                  level={currentLevel}
                  onComplete={completeLevelTransition}
                />
              )}
            </AnimatePresence>

            {/* Pause Overlay - only show when paused but not in celebration/challenge/tutorial */}
            <AnimatePresence>
              {isPaused && !showCelebration && !showChallenge && !showParentGate && !showParentDashboard && !tutorialActive && (
                <PauseOverlay />
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
              aria-label="Parent controls - hold for 2 seconds"
            >
              <motion.div
                className="text-xl"
                animate={isLongPressing ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 2, ease: 'linear' }}
                aria-hidden="true"
              >
                👨‍👩‍👧‍👦
              </motion.div>
              {isLongPressing && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-yellow-400"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 2, ease: 'linear' }}
                  aria-hidden="true"
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

      {/* Break Reminder Overlay */}
      <BreakReminderOverlay
        isOpen={showBreakReminder}
        sessionMinutes={sessionMinutes}
        onDismiss={dismissBreakReminder}
      />

      {/* Time Limit Overlay */}
      <TimeLimitOverlay
        isOpen={showTimeLimit}
        sessionMinutes={sessionMinutes}
        onAcknowledge={acknowledgeTimeLimit}
      />
    </div>
  );
}

export default App;
