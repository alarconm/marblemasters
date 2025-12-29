import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeProgress } from '@/systems/achievementChecker';
import { RARITY_COLORS, BADGE_CATEGORY_NAMES, getUnlockedByBadge } from '@/data/badges';
import { useAccessibility, useFocusTrap } from '@/hooks/useAccessibility';

// ============================================
// BADGE DETAIL MODAL
// Shows detailed info about a badge
// ============================================

interface BadgeDetailModalProps {
  badgeProgress: BadgeProgress | null;
  onClose: () => void;
}

export function BadgeDetailModal({ badgeProgress, onClose }: BadgeDetailModalProps) {
  const { reducedMotion } = useAccessibility();
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(!!badgeProgress, modalRef);

  if (!badgeProgress) return null;

  const { badge, isEarned, progress, progressText, earnedAt } = badgeProgress;
  const colors = RARITY_COLORS[badge.rarity];
  const unlockable = getUnlockedByBadge(badge.id);

  // Format earned date
  const earnedDate = earnedAt
    ? new Date(earnedAt).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : null;

  // Rarity display names
  const rarityNames = {
    common: 'Common',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary',
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

        {/* Modal */}
        <motion.div
          ref={modalRef}
          className="relative bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl"
          initial={reducedMotion ? { opacity: 0 } : { scale: 0.8, y: 50 }}
          animate={reducedMotion ? { opacity: 1 } : { scale: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { scale: 0.8, y: 50 }}
          transition={reducedMotion ? { duration: 0.15 } : { type: 'spring', damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
          role="dialog"
          aria-labelledby="badge-detail-title"
        >
          {/* Colored header */}
          <div
            className="p-6 flex flex-col items-center"
            style={{ backgroundColor: colors.bg }}
          >
            {/* Badge icon */}
            <motion.div
              className={`text-6xl ${!isEarned ? 'grayscale opacity-50' : ''}`}
              animate={
                isEarned && !reducedMotion
                  ? { scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }
                  : undefined
              }
              transition={{ duration: 0.5 }}
            >
              {badge.icon}
            </motion.div>

            {/* Badge name */}
            <h3
              id="badge-detail-title"
              className="mt-3 text-xl font-bold text-center"
              style={{ color: colors.text }}
            >
              {badge.name}
            </h3>

            {/* Rarity & Category */}
            <div className="flex gap-2 mt-2">
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: colors.border,
                  color: 'white',
                }}
              >
                {rarityNames[badge.rarity]}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                {BADGE_CATEGORY_NAMES[badge.category]}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Description */}
            <p className="text-center text-gray-600">{badge.description}</p>

            {/* Progress or Earned Date */}
            {isEarned ? (
              <div className="text-center">
                <span className="text-green-600 font-medium">Earned</span>
                {earnedDate && (
                  <p className="text-sm text-gray-500 mt-1">{earnedDate}</p>
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-gray-700">{progressText}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Reward info */}
            {badge.reward && (
              <div className="bg-yellow-50 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden="true">
                    🎁
                  </span>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Reward: {getRewardText(badge.reward)}
                    </p>
                    {unlockable && (
                      <p className="text-xs text-yellow-600">{unlockable.name}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Close button */}
            <button
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function getRewardText(reward: { type: string; value: string | number }): string {
  switch (reward.type) {
    case 'theme':
      return 'New Theme';
    case 'marble-skin':
      return 'New Marble Skin';
    case 'points':
      return `${reward.value} Bonus Points`;
    default:
      return 'Special Reward';
  }
}

export default BadgeDetailModal;
