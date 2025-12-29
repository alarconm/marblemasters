import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useGameLoop } from '@/hooks/useGameLoop';
import { generateTrack } from '@/systems/trackGenerator';
import { THEME_COLORS } from '@/types';
import { Marble } from './Marble';
import { Track } from './Track';
import { Bucket } from './Bucket';
import { Launcher } from './Launcher';

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

      setTrack(generated.track, generated.buckets);
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

      setTrack(generated.track, generated.buckets);
    }
  }, [theme]);

  const colors = THEME_COLORS[theme];
  const canDrop = marblesDropped < marblesRequired && !isPaused;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        background: colors.background,
      }}
    >
      {/* SVG layer for track */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
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

      {/* Touch area for dropping marbles (covers whole screen) */}
      <div
        className="absolute inset-0"
        style={{ pointerEvents: canDrop ? 'auto' : 'none' }}
        onClick={canDrop ? dropNextMarble : undefined}
      />
    </div>
  );
}

export default GameCanvas;
