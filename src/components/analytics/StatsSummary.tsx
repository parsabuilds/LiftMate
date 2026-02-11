import { useMemo } from 'react';
import { Card } from '../ui/Card';
import type { WorkoutLog, UserProfile } from '../../types';

interface StatsSummaryProps {
  workoutLogs: WorkoutLog[];
  profile: UserProfile | null;
}

export function StatsSummary({ workoutLogs, profile }: StatsSummaryProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekStr = weekAgo.toISOString().slice(0, 10);

    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthStr = monthAgo.toISOString().slice(0, 10);

    const weeklyVolume = workoutLogs
      .filter((log) => log.date >= weekStr)
      .reduce((total, log) => {
        return total + log.exercises.reduce((exTotal, ex) => {
          return exTotal + ex.sets.reduce((setTotal, s) => {
            return setTotal + (s.completed ? s.weight * s.reps : 0);
          }, 0);
        }, 0);
      }, 0);

    const prsThisMonth = workoutLogs
      .filter((log) => log.date >= monthStr)
      .reduce((count, log) => {
        return count + log.exercises.reduce((exCount, ex) => {
          return exCount + ex.sets.filter((s) => s.isPR).length;
        }, 0);
      }, 0);

    return { weeklyVolume, prsThisMonth };
  }, [workoutLogs]);

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
    return vol.toLocaleString();
  };

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <Card>
        <p className="text-muted text-sm">Total Workouts</p>
        <p className="text-2xl font-bold text-text mt-1">{workoutLogs.length}</p>
      </Card>
      <Card>
        <p className="text-muted text-sm">Current Streak</p>
        <p className="text-2xl font-bold text-text mt-1">
          {profile?.currentStreak ?? 0} days
        </p>
      </Card>
      <Card>
        <p className="text-muted text-sm">Weekly Volume</p>
        <p className="text-2xl font-bold text-text mt-1">
          {formatVolume(stats.weeklyVolume)} lbs
        </p>
      </Card>
      <Card>
        <p className="text-muted text-sm">PRs This Month</p>
        <p className="text-2xl font-bold text-primary mt-1">{stats.prsThisMonth}</p>
      </Card>
    </div>
  );
}
