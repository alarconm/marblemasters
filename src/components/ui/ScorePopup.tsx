import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

// Particle colors for the burst effect
const PARTICLE_COLORS = [
  '#FFD700', // gold
  '#FF6B6B', // coral
  '#4ECDC4', // teal
  '#FFE66D', // yellow
  '#95E1D3', // mint
  '#FF69B4', // pink
];

interface ParticleProps {
  color: string;
  angle: number;
  distance: number;
  size: number;
}

function Particle({ color, angle, distance, size }: ParticleProps) {
  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size}px ${color}`,
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{
        x,
        y,
        opacity: 0,
        scale: 0.5,
      }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
    />
  );
}

interface ScorePopupItemProps {
  id: string;
  x: number;
  y: number;
  points: number;
  onComplete: () => void;
}

function ScorePopupItem({ x, y, points, onComplete }: ScorePopupItemProps) {
  // Generate random particles
  const particles = useMemo(() => {
    const count = 12;
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      angle: (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5,
      distance: 40 + Math.random() * 30,
      size: 6 + Math.random() * 6,
    }));
  }, []);

  useEffect(() => {
    // Remove popup after animation completes
    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        zIndex: 100,
      }}
    >
      {/* Particle burst */}
      <div className="absolute" style={{ left: 0, top: 0 }}>
        {particles.map((p) => (
          <Particle
            key={p.id}
            color={p.color}
            angle={p.angle}
            distance={p.distance}
            size={p.size}
          />
        ))}
      </div>

      {/* Score text */}
      <motion.div
        className="font-bold text-2xl"
        style={{
          textShadow: '2px 2px 4px rgba(0,0,0,0.5), 0 0 10px rgba(255,255,255,0.5)',
        }}
        initial={{ opacity: 1, y: 0, scale: 0.5 }}
        animate={{
          opacity: [1, 1, 0],
          y: -60,
          scale: [0.5, 1.2, 1],
        }}
        transition={{
          duration: 1,
          ease: 'easeOut',
        }}
      >
        <span className="text-yellow-300">+{points}</span>
      </motion.div>
    </div>
  );
}

export function ScorePopups() {
  const { scorePopups, removeScorePopup } = useGameStore();

  return (
    <>
      {scorePopups.map((popup) => (
        <ScorePopupItem
          key={popup.id}
          id={popup.id}
          x={popup.x}
          y={popup.y}
          points={popup.points}
          onComplete={() => removeScorePopup(popup.id)}
        />
      ))}
    </>
  );
}

export default ScorePopups;
