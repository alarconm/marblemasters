import { motion } from 'framer-motion';
import { StarRating as StarRatingType } from '@/types';
import { useAccessibility } from '@/hooks/useAccessibility';

// ============================================
// STAR RATING
// Displays 1-3 stars for level completion
// ============================================

interface StarRatingProps {
  stars: StarRatingType;
  maxStars?: 3;
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  showEmpty?: boolean;
}

export function StarRating({
  stars,
  maxStars = 3,
  size = 'medium',
  animated = true,
  showEmpty = true,
}: StarRatingProps) {
  const { reducedMotion } = useAccessibility();
  const shouldAnimate = animated && !reducedMotion;

  // Size configurations
  const sizeConfig = {
    small: { star: 'text-xl', gap: 'gap-0.5' },
    medium: { star: 'text-3xl', gap: 'gap-1' },
    large: { star: 'text-5xl', gap: 'gap-2' },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={`flex items-center justify-center ${config.gap}`}
      role="img"
      aria-label={`${stars} out of ${maxStars} stars`}
    >
      {Array.from({ length: maxStars }, (_, index) => {
        const isFilled = index < stars;

        if (!showEmpty && !isFilled) return null;

        return (
          <motion.span
            key={index}
            className={`${config.star} ${isFilled ? '' : 'opacity-30'}`}
            initial={
              shouldAnimate ? { scale: 0, rotate: -180 } : { opacity: 1 }
            }
            animate={
              shouldAnimate
                ? {
                    scale: 1,
                    rotate: 0,
                  }
                : { opacity: 1 }
            }
            transition={{
              delay: shouldAnimate ? index * 0.15 : 0,
              type: 'spring',
              damping: 10,
              stiffness: 200,
            }}
            aria-hidden="true"
          >
            {isFilled ? '⭐' : '☆'}
          </motion.span>
        );
      })}
    </div>
  );
}

// Level completion star criteria display
interface StarCriteriaProps {
  criteria: {
    oneStar: string;
    twoStar: string;
    threeStar: string;
  };
  currentStars: StarRatingType;
}

export function StarCriteria({ criteria, currentStars }: StarCriteriaProps) {
  const items = [
    { stars: 1, text: criteria.oneStar },
    { stars: 2, text: criteria.twoStar },
    { stars: 3, text: criteria.threeStar },
  ];

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isAchieved = currentStars >= item.stars;

        return (
          <div
            key={item.stars}
            className={`flex items-center gap-2 ${
              isAchieved ? 'text-yellow-600' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">{isAchieved ? '⭐' : '☆'}</span>
            <span className="text-sm">{item.text}</span>
            {isAchieved && <span className="text-green-500 text-sm">✓</span>}
          </div>
        );
      })}
    </div>
  );
}

// Animated star burst for celebrations
interface StarBurstProps {
  onComplete?: () => void;
}

export function StarBurst({ onComplete }: StarBurstProps) {
  const { reducedMotion } = useAccessibility();

  if (reducedMotion) {
    return (
      <motion.div
        className="text-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onAnimationComplete={onComplete}
      >
        ⭐⭐⭐
      </motion.div>
    );
  }

  return (
    <div className="relative">
      {/* Center star */}
      <motion.span
        className="text-6xl"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: [0, 1.5, 1], rotate: 0 }}
        transition={{ duration: 0.6, times: [0, 0.6, 1] }}
        onAnimationComplete={onComplete}
      >
        ⭐
      </motion.span>

      {/* Burst particles */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 text-2xl"
          initial={{ x: '-50%', y: '-50%', scale: 0, opacity: 1 }}
          animate={{
            x: `calc(-50% + ${Math.cos((i * Math.PI) / 4) * 80}px)`,
            y: `calc(-50% + ${Math.sin((i * Math.PI) / 4) * 80}px)`,
            scale: [0, 1, 0.5],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.8, delay: 0.2 }}
          aria-hidden="true"
        >
          ✨
        </motion.span>
      ))}
    </div>
  );
}

export default StarRating;
