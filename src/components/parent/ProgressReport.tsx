import { motion } from 'framer-motion';
import { useParentStore } from '@/store/parentStore';
import { Subject } from '@/types';

const subjectInfo: Record<Subject, { label: string; icon: string; color: string }> = {
  colors: { label: 'Colors', icon: '🎨', color: 'from-red-500 to-orange-500' },
  counting: { label: 'Counting', icon: '🔢', color: 'from-blue-500 to-cyan-500' },
  math: { label: 'Math', icon: '➕', color: 'from-green-500 to-emerald-500' },
  patterns: { label: 'Patterns', icon: '🔷', color: 'from-purple-500 to-pink-500' },
  letters: { label: 'Letters', icon: '🔤', color: 'from-yellow-500 to-amber-500' },
  logic: { label: 'Logic', icon: '🧩', color: 'from-indigo-500 to-violet-500' },
  memory: { label: 'Memory', icon: '🧠', color: 'from-rose-500 to-red-500' },
};

export function ProgressReport() {
  const { subjectMastery, recentChallenges, totalPlayTime } = useParentStore();

  // Calculate overall stats
  const totalChallenges = recentChallenges.length;
  const correctChallenges = recentChallenges.filter((c) => c.correct).length;
  const overallAccuracy =
    totalChallenges > 0 ? Math.round((correctChallenges / totalChallenges) * 100) : 0;

  // Format play time
  const hours = Math.floor(totalPlayTime / 60);
  const minutes = totalPlayTime % 60;
  const playTimeText =
    hours > 0 ? `${hours}h ${minutes}m` : `${minutes} minutes`;

  // Find strengths and areas to improve
  const sorted = [...subjectMastery].sort((a, b) => b.mastery - a.mastery);
  const strengths = sorted.slice(0, 2).filter((s) => s.mastery >= 60);
  const needsWork = sorted.slice(-2).filter((s) => s.mastery < 60);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
          <div className="text-3xl mb-1">⏱️</div>
          <div className="text-white/60 text-sm">Total Play Time</div>
          <div className="text-white text-xl font-bold">{playTimeText}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
          <div className="text-3xl mb-1">🎯</div>
          <div className="text-white/60 text-sm">Challenges</div>
          <div className="text-white text-xl font-bold">{totalChallenges}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
          <div className="text-3xl mb-1">✨</div>
          <div className="text-white/60 text-sm">Accuracy</div>
          <div className="text-white text-xl font-bold">{overallAccuracy}%</div>
        </div>
      </div>

      {/* Subject Mastery */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
        <h3 className="text-white font-bold text-lg mb-4">Subject Mastery</h3>
        <div className="space-y-4">
          {subjectMastery.map((subject, index) => {
            const info = subjectInfo[subject.subject];

            return (
              <motion.div
                key={subject.subject}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xl">{info.icon}</span>
                  <span className="text-white font-medium flex-1">
                    {info.label}
                  </span>
                  <span className="text-white/60 text-sm">
                    {subject.correctAttempts}/{subject.totalAttempts} correct
                  </span>
                </div>
                <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${info.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.mastery}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xs font-bold drop-shadow">
                      {subject.mastery}%
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-5 border border-green-500/30">
          <h3 className="text-green-300 font-bold mb-3 flex items-center gap-2">
            <span>⭐</span> Strengths
          </h3>
          {strengths.length > 0 ? (
            <ul className="space-y-2">
              {strengths.map((s) => (
                <li
                  key={s.subject}
                  className="text-white flex items-center gap-2"
                >
                  <span>{subjectInfo[s.subject].icon}</span>
                  <span>{subjectInfo[s.subject].label}</span>
                  <span className="text-green-300 ml-auto">
                    {s.mastery}%
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/60 text-sm">
              Keep playing to discover strengths!
            </p>
          )}
        </div>

        {/* Areas to Improve */}
        <div className="bg-orange-500/20 backdrop-blur-sm rounded-2xl p-5 border border-orange-500/30">
          <h3 className="text-orange-300 font-bold mb-3 flex items-center gap-2">
            <span>🌱</span> Room to Grow
          </h3>
          {needsWork.length > 0 ? (
            <ul className="space-y-2">
              {needsWork.map((s) => (
                <li
                  key={s.subject}
                  className="text-white flex items-center gap-2"
                >
                  <span>{subjectInfo[s.subject].icon}</span>
                  <span>{subjectInfo[s.subject].label}</span>
                  <span className="text-orange-300 ml-auto">
                    {s.mastery}%
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/60 text-sm">
              Doing great in all subjects!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgressReport;
