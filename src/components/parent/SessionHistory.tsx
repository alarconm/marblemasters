import { motion } from 'framer-motion';
import { useParentStore } from '@/store/parentStore';

export function SessionHistory() {
  const { sessionHistory, recentChallenges, totalPlayTime } = useParentStore();

  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  // Get recent challenges grouped by day
  const challengesByDay = recentChallenges.reduce(
    (acc, challenge) => {
      const date = new Date(challenge.timestamp).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(challenge);
      return acc;
    },
    {} as Record<string, typeof recentChallenges>
  );

  // Calculate weekly stats
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekSessions = sessionHistory.filter((s) => s.date > weekAgo);
  const weekChallenges = recentChallenges.filter((c) => c.timestamp > weekAgo);
  const weekCorrect = weekChallenges.filter((c) => c.correct).length;
  const weekAccuracy =
    weekChallenges.length > 0
      ? Math.round((weekCorrect / weekChallenges.length) * 100)
      : 0;
  const weekPlayTime = weekSessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="space-y-6">
      {/* Weekly Summary */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span>📈</span> This Week
        </h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {weekSessions.length}
            </div>
            <div className="text-white/50 text-xs">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{weekPlayTime}m</div>
            <div className="text-white/50 text-xs">Play Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {weekChallenges.length}
            </div>
            <div className="text-white/50 text-xs">Challenges</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{weekAccuracy}%</div>
            <div className="text-white/50 text-xs">Accuracy</div>
          </div>
        </div>
      </div>

      {/* Session History */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span>🎮</span> Recent Sessions
        </h3>

        {sessionHistory.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎲</div>
            <p className="text-white/60">No sessions recorded yet.</p>
            <p className="text-white/40 text-sm">
              Start playing to see session history!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {[...sessionHistory]
              .reverse()
              .slice(0, 10)
              .map((session, index) => (
                <motion.div
                  key={session.date}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-3 bg-white/5 rounded-xl"
                >
                  <div className="text-2xl">🎯</div>
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {formatDate(session.date)}
                    </div>
                    <div className="text-white/50 text-sm">
                      {session.levelsCompleted} levels •{' '}
                      {session.challengesCompleted} challenges •{' '}
                      {session.correctAnswers} correct
                    </div>
                  </div>
                  <div className="text-white/60 text-sm">
                    {session.duration}m
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>

      {/* Challenge Details */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <span>📝</span> Recent Challenges
        </h3>

        {recentChallenges.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">❓</div>
            <p className="text-white/60">No challenges completed yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(challengesByDay)
              .reverse()
              .slice(0, 3)
              .map(([date, challenges]) => (
                <div key={date}>
                  <div className="text-white/60 text-sm mb-2">
                    {new Date(date).toLocaleDateString([], {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="space-y-1">
                    {challenges
                      .slice(-5)
                      .reverse()
                      .map((challenge, i) => (
                        <div
                          key={`${challenge.timestamp}-${i}`}
                          className="flex items-center gap-3 p-2 bg-white/5 rounded-lg"
                        >
                          <span className="text-lg">
                            {challenge.correct ? '✅' : '❌'}
                          </span>
                          <span className="text-white capitalize flex-1">
                            {challenge.subject}
                          </span>
                          <span className="text-white/50 text-sm">
                            {(challenge.responseTime / 1000).toFixed(1)}s
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* All-time Stats */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/30">
        <h3 className="text-purple-300 font-bold mb-3 flex items-center gap-2">
          <span>🏆</span> All-Time Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-white/60 text-sm">Total Play Time</div>
            <div className="text-white text-xl font-bold">
              {Math.floor(totalPlayTime / 60)}h {totalPlayTime % 60}m
            </div>
          </div>
          <div>
            <div className="text-white/60 text-sm">Sessions Played</div>
            <div className="text-white text-xl font-bold">
              {sessionHistory.length}
            </div>
          </div>
          <div>
            <div className="text-white/60 text-sm">Challenges Completed</div>
            <div className="text-white text-xl font-bold">
              {recentChallenges.length}
            </div>
          </div>
          <div>
            <div className="text-white/60 text-sm">Overall Accuracy</div>
            <div className="text-white text-xl font-bold">
              {recentChallenges.length > 0
                ? Math.round(
                    (recentChallenges.filter((c) => c.correct).length /
                      recentChallenges.length) *
                      100
                  )
                : 0}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionHistory;
