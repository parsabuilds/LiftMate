import { useState } from 'react';
import type { Goal } from '../types';
import { useAuthContext } from '../contexts/AuthContext';
import { useCollection, addDocument, setDocument, deleteDocument } from '../hooks/useFirestore';
import { Layout } from '../components/ui/Layout';
import { GoalCard } from '../components/goals/GoalCard';
import { GoalForm } from '../components/goals/GoalForm';

export function Goals() {
  const { user, profile } = useAuthContext();
  const goalsPath = user ? `users/${user.uid}/goals` : null;
  const { data: goals, loading } = useCollection<Goal>(goalsPath);

  const [formOpen, setFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const activeGoals = goals
    .filter((g) => !g.completed)
    .sort((a, b) => b.createdAt - a.createdAt);

  const completedGoals = goals
    .filter((g) => g.completed)
    .sort((a, b) => (b.completedAt ?? b.createdAt) - (a.completedAt ?? a.createdAt));

  const handleSave = async (goalData: Omit<Goal, 'id'>) => {
    if (!goalsPath) return;

    if (editingGoal) {
      await setDocument(`${goalsPath}/${editingGoal.id}`, goalData);
    } else {
      await addDocument(goalsPath, goalData);
    }
    setEditingGoal(null);
  };

  const handleDelete = async (id: string) => {
    if (!goalsPath) return;
    await deleteDocument(`${goalsPath}/${id}`);
  };

  const handleToggleMilestone = async (goalId: string, milestoneId: string) => {
    if (!goalsPath) return;
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const updatedMilestones = goal.milestones.map((m) => {
      if (m.id !== milestoneId) return m;
      const toggled: Record<string, unknown> = { id: m.id, title: m.title, completed: !m.completed };
      if (m.targetDate) toggled.targetDate = m.targetDate;
      if (!m.completed) toggled.completedAt = Date.now();
      return toggled;
    });

    const allCompleted = updatedMilestones.length > 0 && updatedMilestones.every((m) => m.completed);

    const updateData: Record<string, unknown> = {
      ...goal,
      milestones: updatedMilestones,
      completed: allCompleted,
    };
    if (allCompleted) {
      updateData.completedAt = Date.now();
    } else {
      delete updateData.completedAt;
    }

    await setDocument(`${goalsPath}/${goalId}`, updateData);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingGoal(null);
  };

  const streak = profile?.currentStreak ?? 0;
  const longestStreak = profile?.longestStreak ?? 0;
  const isPersonalBest = streak > 0 && streak >= longestStreak;

  const ringColors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];

  return (
    <Layout>
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-primary/[0.07] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Page header */}
        <div className="mb-5">
          <h1 className="text-3xl font-black text-text tracking-tight">Goals</h1>
          <p className="text-muted text-sm mt-1">
            {activeGoals.length > 0
              ? `${activeGoals.length} active goal${activeGoals.length !== 1 ? 's' : ''}`
              : 'Set your targets and crush them'}
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 animate-pulse">
                <div className="h-5 bg-border/50 rounded w-2/3 mb-2" />
                <div className="h-3 bg-border/50 rounded w-full mb-3" />
                <div className="h-2 bg-border/50 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Streak Card */}
            {streak > 0 && (
              <div className="relative overflow-hidden bg-card/60 border border-amber-500/30 rounded-2xl p-5 backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/[0.06] rounded-full blur-[50px] pointer-events-none" />
                <div className="relative">
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-amber-400">
                    {'\uD83D\uDD25'} Current Streak
                  </span>
                  <p className="text-[32px] font-black text-text leading-tight mt-1">
                    {streak} Day{streak !== 1 ? 's' : ''}
                  </p>
                  <p className="text-muted text-sm mt-1">
                    {isPersonalBest ? 'Personal best! Keep it going' : `Best: ${longestStreak} days`}
                  </p>
                </div>
              </div>
            )}

            {/* Empty state */}
            {activeGoals.length === 0 && completedGoals.length === 0 && (
              <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-8 text-center backdrop-blur-sm">
                <div className="text-4xl mb-3">{'\uD83C\uDFAF'}</div>
                <h2 className="text-xl font-bold text-text mb-2">Set your first goal</h2>
                <p className="text-muted text-sm">Track your progress with goals and milestones.</p>
              </div>
            )}

            {/* Active Goals */}
            {activeGoals.map((goal, i) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                color={ringColors[i % ringColors.length]}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleMilestone={handleToggleMilestone}
              />
            ))}

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="flex items-center gap-2 text-sm font-bold text-muted uppercase tracking-wider mb-3 min-h-[44px]"
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${showCompleted ? 'rotate-90' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                  Completed ({completedGoals.length})
                </button>
                {showCompleted && (
                  <div className="space-y-4">
                    {completedGoals.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        color="#10B981"
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleMilestone={handleToggleMilestone}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Achievements bar */}
            {completedGoals.length > 0 && (
              <div className="bg-card/60 border border-white/[0.06] rounded-2xl px-5 py-4 backdrop-blur-sm">
                <span className="text-sm font-bold text-text">
                  {'\uD83C\uDFC6'} Achievements: {completedGoals.length} unlocked
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <GoalForm
        isOpen={formOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
        editingGoal={editingGoal}
      />

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => {
          setEditingGoal(null);
          setFormOpen(true);
        }}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/25 hover:bg-blue-600 active:bg-blue-700 transition-colors flex items-center justify-center z-40"
        style={{ maxWidth: 'calc(50% + 215px - 16px)', right: 'max(16px, calc(50% - 215px + 16px))' }}
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </Layout>
  );
}
