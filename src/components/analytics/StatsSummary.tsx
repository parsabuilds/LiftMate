import { useMemo } from 'react';
import type { WorkoutLog, UserProfile } from '../../types';

interface StatsSummaryProps {
  workoutLogs: WorkoutLog[];
  profile: UserProfile | null;
}

const statMeta = [
  { label: 'Total Workouts', color: '#3B82F6' },
  { label: 'Current Streak', color: '#F59E0B' },
  { label: 'Weekly Volume', color: '#10B981' },
  { label: 'PRs This Month', color: '#A855F7' },
];

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

  const values = [
    String(workoutLogs.length),
    `${profile?.currentStreak ?? 0} days`,
    `${formatVolume(stats.weeklyVolume)} lbs`,
    String(stats.prsThisMonth),
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {statMeta.map((meta, i) => (
        <div
          key={meta.label}
          className="relative overflow-hidden bg-card/60 border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm"
        >
          {/* Color accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
            style={{ backgroundColor: meta.color }}
          />
          <p className="text-muted text-xs font-semibold uppercase tracking-wider">{meta.label}</p>
          <p className="text-2xl font-black text-text mt-1.5 tracking-tight">{values[i]}</p>
        </div>
      ))}
    </div>
  );
}
