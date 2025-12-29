import { motion } from 'framer-motion';
import { useParentStore } from '@/store/parentStore';
import { Subject } from '@/types';

const subjectInfo: Record<
  Subject,
  { label: string; icon: string; description: string; ageRange: string }
> = {
  colors: {
    label: 'Colors',
    icon: '🎨',
    description: 'Color recognition and matching',
    ageRange: 'Ages 3-6',
  },
  counting: {
    label: 'Counting',
    icon: '🔢',
    description: 'Number recognition and counting',
    ageRange: 'Ages 3-7',
  },
  math: {
    label: 'Math',
    icon: '➕',
    description: 'Addition, subtraction, and more',
    ageRange: 'Ages 5-10',
  },
  patterns: {
    label: 'Patterns',
    icon: '🔷',
    description: 'Pattern recognition and sequences',
    ageRange: 'Ages 3-10',
  },
  letters: {
    label: 'Letters',
    icon: '🔤',
    description: 'Letter recognition and phonics',
    ageRange: 'Ages 4-8',
  },
  logic: {
    label: 'Logic',
    icon: '🧩',
    description: 'Problem solving and reasoning',
    ageRange: 'Ages 5-10',
  },
  memory: {
    label: 'Memory',
    icon: '🧠',
    description: 'Memory and recall exercises',
    ageRange: 'Ages 4-10',
  },
};

const subjectOrder: Subject[] = [
  'colors',
  'counting',
  'math',
  'patterns',
  'letters',
  'logic',
  'memory',
];

export function ContentToggle() {
  const { enabledSubjects, toggleSubject, childAge } = useParentStore();

  // Count enabled subjects
  const enabledCount = Object.values(enabledSubjects).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
        <h3 className="text-white font-bold text-lg mb-2">
          Educational Content
        </h3>
        <p className="text-white/60 text-sm mb-4">
          Choose which subjects to include in challenges. At least one subject
          must be enabled.
        </p>

        <div className="space-y-3">
          {subjectOrder.map((subject, index) => {
            const info = subjectInfo[subject];
            const isEnabled = enabledSubjects[subject];
            const isLast = enabledCount === 1 && isEnabled;

            return (
              <motion.div
                key={subject}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  isEnabled
                    ? 'bg-white/15 border border-white/20'
                    : 'bg-white/5 border border-transparent'
                }`}
              >
                <span className="text-3xl">{info.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{info.label}</span>
                    <span className="text-white/40 text-xs px-2 py-0.5 bg-white/10 rounded-full">
                      {info.ageRange}
                    </span>
                  </div>
                  <p className="text-white/50 text-sm">{info.description}</p>
                </div>
                <button
                  onClick={() => toggleSubject(subject)}
                  disabled={isLast}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    isEnabled ? 'bg-green-500' : 'bg-white/20'
                  } ${isLast ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isLast ? 'At least one subject must be enabled' : ''}
                >
                  <motion.div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow"
                    animate={{ left: isEnabled ? 30 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Age Recommendations */}
      <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-5 border border-blue-500/30">
        <h3 className="text-blue-300 font-bold mb-3 flex items-center gap-2">
          <span>💡</span> Age-Based Recommendations
        </h3>
        <p className="text-white/80 text-sm leading-relaxed">
          Based on the player's age ({childAge}), we recommend:
        </p>
        <ul className="mt-2 space-y-1 text-white/70 text-sm">
          {childAge <= 4 && (
            <>
              <li>• Focus on Colors, Counting, and Patterns</li>
              <li>• Keep Math challenges simple or disabled</li>
              <li>• Voice prompts are highly recommended</li>
            </>
          )}
          {childAge >= 5 && childAge <= 6 && (
            <>
              <li>• All subjects are appropriate</li>
              <li>• Math will include simple addition</li>
              <li>• Letters will focus on recognition</li>
            </>
          )}
          {childAge >= 7 && (
            <>
              <li>• Enable Logic for problem-solving</li>
              <li>• Math will include multiplication</li>
              <li>• Consider disabling Colors for more challenge</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default ContentToggle;
