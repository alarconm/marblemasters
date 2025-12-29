import { useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useGameLoop } from '@/hooks/useGameLoop';
import { generateTrack } from '@/systems/trackGenerator';
import { THEME_COLORS } from '@/types';
import { Marble } from './Marble';
import { Track } from './Track';
import { Bucket } from './Bucket';
import { Launcher } from './Launcher';
import { ScorePopups } from '@/components/ui/ScorePopup';

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    track,
    buckets,
    marbles,
    theme,
    launcherPosition,
    nextMarbleColors,
    marblesDropped,
    marblesRequired,
    isPlaying,
    isPaused,
    setTrack,
    dropNextMarble,
  } = useGameStore();

  // Initialize game loop
  useGameLoop();

  // Generate initial track on mount
  useEffect(() => {
    if (isPlaying && track.length === 0) {
      const screenWidth = containerRef.current?.clientWidth || 400;
      const screenHeight = containerRef.current?.clientHeight || 700;

      const generated = generateTrack({
        theme,
        screenWidth,
        screenHeight,
        difficulty: 1,
      });

      setTrack(generated.track, generated.buckets, generated.launcherPosition);
    }
  }, [isPlaying, track.length, theme, setTrack]);

  // Regenerate track when level changes
  useEffect(() => {
    if (isPlaying && containerRef.current) {
      const screenWidth = containerRef.current.clientWidth;
      const screenHeight = containerRef.current.clientHeight;

      const generated = generateTrack({
        theme,
        screenWidth,
        screenHeight,
        difficulty: 1,
      });

      setTrack(generated.track, generated.buckets, generated.launcherPosition);
    }
  }, [theme]);

  const colors = THEME_COLORS[theme];
  const canDrop = marblesDropped < marblesRequired && !isPaused;

  // Handle keyboard shortcuts at game level
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && !isPaused) {
        // Pause on Escape
        e.preventDefault();
      }
    },
    [isPaused]
  );

  return (
    <div
      ref={containerRef}
      id="game-canvas"
      className="relative w-full h-full overflow-hidden"
      style={{
        background: colors.background,
      }}
      role="application"
      aria-label="Marble Masters game area"
      aria-describedby="game-instructions"
      onKeyDown={handleKeyDown}
    >
      {/* Screen reader instructions */}
      <span id="game-instructions" className="sr-only">
        Drop marbles to collect them in buckets. Use the launcher button to drop marbles.
        Current progress: {marbles.filter(m => m.state === 'collected').length} marbles collected.
      </span>

      {/* SVG layer for track */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
        role="img"
        aria-label={`Marble track with ${track.length} segments`}
      >
        {track.map((segment) => (
          <Track key={segment.id} segment={segment} />
        ))}
      </svg>

      {/* Launcher */}
      <Launcher
        position={launcherPosition}
        nextColors={nextMarbleColors}
        onDrop={dropNextMarble}
        theme={theme}
        disabled={!canDrop}
      />

      {/* Marbles */}
      <AnimatePresence>
        {marbles.map((marble) => (
          <Marble key={marble.id} marble={marble} />
        ))}
      </AnimatePresence>

      {/* Buckets */}
      {buckets.map((bucket) => (
        <Bucket key={bucket.id} bucket={bucket} />
      ))}

      {/* Score Popups */}
      <ScorePopups />

      {/* Touch area removed - use launcher only */}
    </div>
  );
}

export default GameCanvas;
