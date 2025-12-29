import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/store/gameStore';
import { updateMarble } from '@/systems/physics';

export function useGameLoop() {
  const {
    marbles,
    track,
    buckets,
    updateMarbles,
    isPlaying,
    isPaused,
  } = useGameStore();

  const lastTimeRef = useRef<number>(0);
  const animationIdRef = useRef<number>(0);

  const gameLoop = useCallback(
    (currentTime: number) => {
      if (!isPlaying || isPaused) {
        animationIdRef.current = requestAnimationFrame(gameLoop);
        lastTimeRef.current = currentTime;
        return;
      }

      // Calculate delta time in seconds
      const deltaTime = lastTimeRef.current
        ? Math.min((currentTime - lastTimeRef.current) / 1000, 0.05) // Cap at 50ms to prevent huge jumps
        : 0.016; // Default to ~60fps
      lastTimeRef.current = currentTime;

      // Update all marbles
      if (marbles.length > 0) {
        const updatedMarbles = marbles.map((marble) =>
          updateMarble(marble, track, buckets, deltaTime)
        );
        updateMarbles(updatedMarbles);
      }

      // Continue the loop
      animationIdRef.current = requestAnimationFrame(gameLoop);
    },
    [marbles, track, buckets, updateMarbles, isPlaying, isPaused]
  );

  useEffect(() => {
    animationIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [gameLoop]);
}

export default useGameLoop;
