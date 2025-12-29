import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BadgeCategory } from '@/types';
import { BADGES, BADGE_CATEGORY_NAMES } from '@/data/badges';
import { getAllBadgeProgress, BadgeProgress } from '@/systems/achievementChecker';
import { useParentStore } from '@/store/parentStore';
import { useAccessibility, useFocusTrap } from '@/hooks/useAccessibility';
import { BadgeCard } from './BadgeCard';
import { BadgeDetailModal } from './BadgeDetailModal';

// ============================================
// BADGE GRID
// Collection view showing all badges by category
// ============================================

interface BadgeGridProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BadgeGrid({ isOpen, onClose }: BadgeGridProps) {
  const { reducedMotion } = useAccessibility();
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen, modalRef);

  const [selectedBadge, setSelectedBadge] = useState<BadgeProgress | null>(null);
  const [activeCategory, setActiveCategory] = useState<BadgeCategory>('milestone');

  // Get achievement state from stores
  const parentStore = useParentStore();

  // Create simplified state for progress calculation
  const badgeProgress = getAllBadgeProgress({
    currentLevel: parentStore.childAge >= 5 ? 10 : 5, // Placeholder - should come from gameStore
    totalMarblesCollected: parentStore.totalMarblesCollected,
    challengesCompleted: parentStore.recentChallenges.length,
    totalPlayTimeMinutes: parentStore.totalPlayTime,
    subjectMastery: {
      colors: parentStore.subjectMastery.find(m => m.subject === 'colors')?.mastery ?? 50,
      counting: parentStore.subjectMastery.find(m => m.subject === 'counting')?.mastery ?? 50,
      math: parentStore.subjectMastery.find(m => m.subject === 'math')?.mastery ?? 50,
      patterns: parentStore.subjectMastery.find(m => m.subject === 'patterns')?.mastery ?? 50,
      letters: parentStore.subjectMastery.find(m => m.subject === 'letters')?.mastery ?? 50,
      logic: parentStore.subjectMastery.find(m => m.subject === 'logic')?.mastery ?? 50,
      memory: parentStore.subjectMastery.find(m => m.subject === 'memory')?.mastery ?? 50,
    },
    currentCorrectStreak: parentStore.currentCorrectStreak,
    maxCorrectStreak: parentStore.maxCorrectStreak,
    currentDayStreak: parentStore.currentDayStreak,
    hadPerfectLevel: parentStore.hadPerfectLevel,
    firstChallengeCorrect: parentStore.recentChallenges.length > 0 && parentStore.recentChallenges[0]?.correct,
    earnedBadges: parentStore.earnedBadges,
  });

  // Filter progress by category
  const categoryProgress = badgeProgress.filter(
    (bp) => bp.badge.category === activeCategory
  );

  // Count totals
  const totalEarned = badgeProgress.filter((bp) => bp.isEarned).length;
  const totalBadges = BADGES.length;

  const categories: BadgeCategory[] = ['milestone', 'collection', 'mastery', 'streak', 'special'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="badge-grid-title"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            className="relative bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
            initial={reducedMotion ? { opacity: 0 } : { scale: 0.9, y: 30 }}
            animate={reducedMotion ? { opacity: 1 } : { scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { scale: 0.9, y: 30 }}
            transition={reducedMotion ? { duration: 0.15 } : { type: 'spring', damping: 20 }}
            tabIndex={-1}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2
                  id="badge-grid-title"
                  className="text-2xl font-bold text-gray-800"
                >
                  My Badges
                </h2>
                <button
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={onClose}
                  aria-label="Close badge collection"
                >
                  ✕
                </button>
              </div>

              {/* Progress */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(totalEarned / totalBadges) * 100}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {totalEarned}/{totalBadges}
                </span>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-1 p-2 bg-gray-50 overflow-x-auto">
              {categories.map((cat) => {
                const catProgress = badgeProgress.filter((bp) => bp.badge.category === cat);
                const catEarned = catProgress.filter((bp) => bp.isEarned).length;
                const isActive = activeCategory === cat;

                return (
                  <button
                    key={cat}
                    className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveCategory(cat)}
                    aria-pressed={isActive}
                  >
                    {BADGE_CATEGORY_NAMES[cat]}
                    <span className="ml-1 opacity-70">
                      {catEarned}/{catProgress.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Badge Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-3 gap-3">
                {categoryProgress.map((bp, index) => (
                  <motion.div
                    key={bp.badge.id}
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <BadgeCard
                      badge={bp.badge}
                      isEarned={bp.isEarned}
                      progress={bp.progress}
                      progressText={bp.progressText}
                      earnedAt={bp.earnedAt}
                      size="medium"
                      onClick={() => setSelectedBadge(bp)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Badge Detail Modal */}
          <BadgeDetailModal
            badgeProgress={selectedBadge}
            onClose={() => setSelectedBadge(null)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BadgeGrid;
