import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useAccessibility, useArrowNavigation } from '@/hooks/useAccessibility';

interface AgeSelectorProps {
  onSelectAge: (age: number) => void;
}

const ages = [3, 4, 5, 6, 7, 8, 9, 10];

const ageColors = [
  '#FF6B6B', // 3 - Red
  '#FF9F43', // 4 - Orange
  '#FECA57', // 5 - Yellow
  '#48DBFB', // 6 - Cyan
  '#1DD1A1', // 7 - Green
  '#5F27CD', // 8 - Purple
  '#FF6B9D', // 9 - Pink
  '#00D2D3', // 10 - Teal
];

export function AgeSelector({ onSelectAge }: AgeSelectorProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useAccessibility();
  const handleArrowNav = useArrowNavigation(gridRef, 4); // 4 columns

  return (
    <main
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-purple-600 to-blue-500 p-6"
      role="main"
      aria-label="Age selection screen"
    >
      {/* Title */}
      <motion.div
        className="text-center mb-8"
        initial={reducedMotion ? { opacity: 0 } : { y: -50, opacity: 0 }}
        animate={reducedMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
        transition={reducedMotion ? { duration: 0.15 } : { type: 'spring', damping: 15 }}
      >
        <h1
          id="age-title"
          className="text-5xl md:text-6xl font-bold text-white mb-2"
          style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.3)' }}
        >
          Marble Masters
        </h1>
        <p
          id="age-prompt"
          className="text-xl text-white/90"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
        >
          How old are you?
        </p>
      </motion.div>

      {/* Age buttons grid */}
      <motion.div
        ref={gridRef}
        className="grid grid-cols-4 gap-3 md:gap-4 max-w-md"
        initial={reducedMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
        animate={reducedMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={reducedMotion ? { duration: 0.15 } : { delay: 0.2, type: 'spring', damping: 15 }}
        role="group"
        aria-labelledby="age-prompt"
        onKeyDown={handleArrowNav}
      >
        {ages.map((age, index) => (
          <motion.button
            key={age}
            className="touch-target rounded-2xl font-bold text-white text-3xl md:text-4xl shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
            style={{
              background: `linear-gradient(135deg, ${ageColors[index]} 0%, ${darkenColor(ageColors[index], 20)} 100%)`,
              minWidth: 70,
              minHeight: 70,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              boxShadow: `0 4px 15px ${ageColors[index]}50`,
            }}
            whileHover={reducedMotion ? undefined : { scale: 1.1 }}
            whileTap={reducedMotion ? undefined : { scale: 0.95 }}
            initial={reducedMotion ? { opacity: 0 } : { y: 20, opacity: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            transition={
              reducedMotion
                ? { duration: 0.15 }
                : { delay: 0.3 + index * 0.05, type: 'spring', damping: 12 }
            }
            onClick={() => onSelectAge(age)}
            aria-label={`I am ${age} years old`}
          >
            {age}
          </motion.button>
        ))}
      </motion.div>

      {/* Decorative marbles - hidden from screen readers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {!reducedMotion && [...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 20 + Math.random() * 40,
              height: 20 + Math.random() * 40,
              background: `radial-gradient(circle at 30% 30%, white 0%, ${ageColors[i % ageColors.length]} 50%, ${darkenColor(ageColors[i % ageColors.length], 30)} 100%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.6,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </main>
  );
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}

export default AgeSelector;
