import { motion } from 'framer-motion';
import { Badge, BadgeRarity } from '@/types';
import { RARITY_COLORS } from '@/data/badges';
import { useAccessibility } from '@/hooks/useAccessibility';

// ============================================
// BADGE CARD
// Individual badge display with progress
// ============================================

interface BadgeCardProps {
  badge: Badge;
  isEarned: boolean;
  progress: number;
  progressText: string;
  earnedAt?: number;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export function BadgeCard({
  badge,
  isEarned,
  progress,
  progressText,
  earnedAt,
  size = 'medium',
  onClick,
}: BadgeCardProps) {
  const { reducedMotion } = useAccessibility();
  const colors = RARITY_COLORS[badge.rarity];

  // Size configurations
  const sizeConfig = {
    small: {
      container: 'w-20 h-24',
      icon: 'text-3xl',
      name: 'text-xs',
      showProgress: false,
    },
    medium: {
      container: 'w-28 h-32',
      icon: 'text-4xl',
      name: 'text-sm',
      showProgress: true,
    },
    large: {
      container: 'w-36 h-44',
      icon: 'text-5xl',
      name: 'text-base',
      showProgress: true,
    },
  };

  const config = sizeConfig[size];

  // Format earned date
  const earnedDate = earnedAt
    ? new Date(earnedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <motion.button
      className={`${config.container} rounded-2xl p-2 flex flex-col items-center justify-center gap-1 relative overflow-hidden touch-target focus:outline-none focus:ring-4 focus:ring-offset-2`}
      style={{
        backgroundColor: isEarned ? colors.bg : '#F3F4F6',
        borderWidth: 2,
        borderColor: isEarned ? colors.border : '#E5E7EB',
        boxShadow: isEarned
          ? `0 4px 12px ${colors.border}40`
          : '0 2px 4px rgba(0,0,0,0.1)',
      }}
      onClick={onClick}
      whileHover={reducedMotion ? undefined : { scale: 1.05, y: -2 }}
      whileTap={reducedMotion ? undefined : { scale: 0.98 }}
      aria-label={`${badge.name}: ${isEarned ? 'Earned' : progressText}. ${badge.description}`}
    >
      {/* Locked overlay */}
      {!isEarned && (
        <div
          className="absolute inset-0 bg-gray-200/50 backdrop-blur-[1px] flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-2xl opacity-60">🔒</span>
        </div>
      )}

      {/* Badge icon */}
      <motion.span
        className={`${config.icon} ${!isEarned ? 'grayscale opacity-40' : ''}`}
        animate={
          isEarned && !reducedMotion
            ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }
            : undefined
        }
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        aria-hidden="true"
      >
        {badge.icon}
      </motion.span>

      {/* Badge name */}
      <span
        className={`${config.name} font-bold text-center leading-tight`}
        style={{ color: isEarned ? colors.text : '#9CA3AF' }}
      >
        {badge.name}
      </span>

      {/* Progress bar (if not earned) */}
      {!isEarned && config.showProgress && (
        <div className="w-full px-1 mt-1">
          <div className="h-1.5 bg-gray-300 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Earned date */}
      {isEarned && earnedDate && size !== 'small' && (
        <span className="text-xs text-gray-500">{earnedDate}</span>
      )}

      {/* Rarity indicator */}
      <RarityBadge rarity={badge.rarity} isEarned={isEarned} />
    </motion.button>
  );
}

// Rarity indicator dot
function RarityBadge({ rarity, isEarned }: { rarity: BadgeRarity; isEarned: boolean }) {
  const colors = RARITY_COLORS[rarity];

  return (
    <div
      className="absolute top-1 right-1 w-3 h-3 rounded-full"
      style={{
        backgroundColor: isEarned ? colors.border : '#D1D5DB',
        boxShadow: isEarned ? `0 0 6px ${colors.border}` : 'none',
      }}
      aria-hidden="true"
    />
  );
}

export default BadgeCard;
