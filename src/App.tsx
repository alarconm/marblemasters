import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { AgeSelector } from '@/components/ui/AgeSelector';
import { GameCanvas } from '@/components/game/GameCanvas';
import { GameHUD } from '@/components/ui/GameHUD';
import { CelebrationOverlay } from '@/components/ui/CelebrationOverlay';
import { ChallengeModal } from '@/components/education/ChallengeModal';

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
  } = useGameStore();

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
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
