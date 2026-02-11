import { useAuthContext } from '../../contexts/AuthContext';
import { useCollection } from '../../hooks/useFirestore';
import type { Goal } from '../../types';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

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

  return (
    <Card title="Goals">
      <div className="space-y-3">
        {activeGoals.map((goal) => {
          const completed = goal.milestones.filter((m) => m.completed).length;
          const total = goal.milestones.length;
          const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <div key={goal.id}>
              <p className="text-sm text-text font-medium">{goal.title}</p>
              {total > 0 && (
                <>
                  <ProgressBar value={progress} className="mt-1 bg-border" />
                  <p className="text-xs text-muted mt-1">{completed}/{total} milestones</p>
                </>
              )}
            </div>
          );
        })}
      </div>
      <a href="/goals" className="block text-sm text-primary font-medium mt-3 hover:text-blue-400 transition-colors">
        View All
      </a>
    </Card>
  );
}
