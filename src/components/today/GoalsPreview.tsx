import { useAuthContext } from '../../contexts/AuthContext';
import { useCollection } from '../../hooks/useFirestore';
import type { Goal } from '../../types';

function ProgressRing({ progress, size = 52, strokeWidth = 4, color = '#3B82F6' }: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="flex-shrink-0 -rotate-90">
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#334155"
        strokeWidth={strokeWidth}
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

export function GoalsPreview() {
  const { user } = useAuthContext();
  const { data: goals, loading } = useCollection<Goal>(
    user ? `users/${user.uid}/goals` : null
  );

  if (loading) return null;

  const activeGoals = goals
    .filter((g) => !g.completed)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 2);

  if (activeGoals.length === 0) return null;

  const ringColors = ['#3B82F6', '#10B981', '#A855F7'];

  return (
    <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <h3 className="text-text font-bold text-base">Goals</h3>
        </div>
        <a
          href="/goals"
          className="text-xs font-semibold text-primary hover:text-blue-400 transition-colors uppercase tracking-wider"
        >
          View All
        </a>
      </div>

      {/* Goal items */}
      <div className="space-y-3">
        {activeGoals.map((goal, i) => {
          const completed = goal.milestones.filter((m) => m.completed).length;
          const total = goal.milestones.length;
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
          const color = ringColors[i % ringColors.length];

          return (
            <div
              key={goal.id}
              className="flex items-center gap-4 p-3 bg-bg/40 rounded-xl border border-white/[0.03]"
            >
              {/* Progress ring */}
              <div className="relative">
                <ProgressRing progress={progress} color={color} />
                <span
                  className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                  style={{ color }}
                >
                  {progress}%
                </span>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text truncate">
                  {goal.title}
                </p>
                {total > 0 && (
                  <p className="text-xs text-muted mt-0.5">
                    {completed}/{total} milestones
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
