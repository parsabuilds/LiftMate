import { useMemo } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useCollection } from './useFirestore';
import { useToday } from './useToday';
import { computeStreaks } from '../utils/streak';
import type { ManualWorkout, WorkoutLog } from '../types';

// Workout streak, computed from completed workouts and days marked as worked
// out on the calendar.
export function useStreak(): { current: number; longest: number } {
  const { user } = useAuthContext();
  const today = useToday();
  const { data: logs } = useCollection<WorkoutLog>(user ? `users/${user.uid}/workoutLogs` : null);
  const { data: manual } = useCollection<ManualWorkout>(user ? `users/${user.uid}/manualWorkouts` : null);

  return useMemo(() => {
    const dates = [
      ...logs.filter((l) => l.completedAt).map((l) => l.date),
      ...manual.map((m) => m.date),
    ];
    return computeStreaks(dates, today);
  }, [logs, manual, today]);
}
