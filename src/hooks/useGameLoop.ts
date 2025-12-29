import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { updateMarble } from '@/systems/physics';

export function useGameLoop() {
  const animationIdRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      // Get current state directly from store (not from closure)
      const state = useGameStore.getState();
      const { marbles, track, buckets, updateMarbles, isPlaying, isPaused } = state;

      if (!isPlaying || isPaused) {
        lastTimeRef.current = currentTime;
        animationIdRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Calculate delta time in seconds
      const deltaTime = lastTimeRef.current
        ? Math.min((currentTime - lastTimeRef.current) / 1000, 0.05)
        : 0.016;
      lastTimeRef.current = currentTime;

      // Update all marbles
      if (marbles.length > 0 && track.length > 0) {
        const updatedMarbles = marbles.map((marble) =>
          updateMarble(marble, track, buckets, deltaTime)
        );
        updateMarbles(updatedMarbles);
      }

      // Continue the loop
      animationIdRef.current = requestAnimationFrame(gameLoop);
    };

    // Start the loop
    animationIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []); // Empty dependency array - loop runs independently
}

export default useGameLoop;
