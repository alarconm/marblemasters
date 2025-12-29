import { useEffect, useState, useCallback } from 'react';
import { useParentStore } from '@/store/parentStore';
import { useGameStore } from '@/store/gameStore';

// ============================================
// SESSION TIMER HOOK
// Tracks play time and enforces limits
// ============================================

interface SessionTimerState {
  sessionMinutes: number;
  showBreakReminder: boolean;
  showTimeLimit: boolean;
  timeUntilBreak: number; // minutes until next break reminder
  timeUntilLimit: number; // minutes until session limit
}

export function useSessionTimer(): SessionTimerState & {
  dismissBreakReminder: () => void;
  acknowledgeTimeLimit: () => void;
} {
  const {
    sessionTimeLimit,
    breakReminderInterval,
    currentSessionStart,
  } = useParentStore();

  const { isPlaying, pauseGame } = useGameStore();

  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const [showTimeLimit, setShowTimeLimit] = useState(false);
  const [lastBreakReminder, setLastBreakReminder] = useState(0);

  // Update session time every minute
  useEffect(() => {
    if (!isPlaying || !currentSessionStart) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - currentSessionStart) / 60000);
      setSessionMinutes(elapsed);
    }, 10000); // Check every 10 seconds for responsiveness

    return () => clearInterval(interval);
  }, [isPlaying, currentSessionStart]);

  // Check for break reminder
  useEffect(() => {
    if (!isPlaying || breakReminderInterval === 0) return;

    const minutesSinceLastBreak = sessionMinutes - lastBreakReminder;

    if (minutesSinceLastBreak >= breakReminderInterval) {
      setShowBreakReminder(true);
      pauseGame();
    }
  }, [sessionMinutes, breakReminderInterval, lastBreakReminder, isPlaying, pauseGame]);

  // Check for session time limit
  useEffect(() => {
    if (!isPlaying || sessionTimeLimit === 0) return;

    if (sessionMinutes >= sessionTimeLimit) {
      setShowTimeLimit(true);
      pauseGame();
    }
  }, [sessionMinutes, sessionTimeLimit, isPlaying, pauseGame]);

  const dismissBreakReminder = useCallback(() => {
    setShowBreakReminder(false);
    setLastBreakReminder(sessionMinutes);
  }, [sessionMinutes]);

  const acknowledgeTimeLimit = useCallback(() => {
    setShowTimeLimit(false);
    // Don't reset - user needs to end session
  }, []);

  // Calculate time until next events
  const timeUntilBreak = breakReminderInterval > 0
    ? Math.max(0, breakReminderInterval - (sessionMinutes - lastBreakReminder))
    : -1;

  const timeUntilLimit = sessionTimeLimit > 0
    ? Math.max(0, sessionTimeLimit - sessionMinutes)
    : -1;

  return {
    sessionMinutes,
    showBreakReminder,
    showTimeLimit,
    timeUntilBreak,
    timeUntilLimit,
    dismissBreakReminder,
    acknowledgeTimeLimit,
  };
}

export default useSessionTimer;
