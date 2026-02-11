import { useState } from 'react';
import type { Goal } from '../types';
import { useAuthContext } from '../contexts/AuthContext';
import { useCollection, addDocument, setDocument, deleteDocument } from '../hooks/useFirestore';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { GoalCard } from '../components/goals/GoalCard';
import { GoalForm } from '../components/goals/GoalForm';

export function Goals() {
  const { user } = useAuthContext();
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

  return (
    <Layout title="Goals">
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4 animate-pulse">
              <div className="h-5 bg-border rounded w-2/3 mb-2" />
              <div className="h-3 bg-border rounded w-full mb-3" />
              <div className="h-2 bg-border rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {activeGoals.length === 0 && completedGoals.length === 0 ? (
            <Card className="text-center py-8">
              <h2 className="text-xl font-semibold text-text mb-2">Set your first fitness goal!</h2>
              <p className="text-muted text-sm">Track your progress with goals and milestones.</p>
            </Card>
          ) : (
            <>
              {activeGoals.length > 0 && (
                <section className="mb-6">
                  <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-3">
                    Active Goals ({activeGoals.length})
                  </h2>
                  {activeGoals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleMilestone={handleToggleMilestone}
                    />
                  ))}
                </section>
              )}

              {completedGoals.length > 0 && (
                <section>
                  <button
                    type="button"
                    onClick={() => setShowCompleted(!showCompleted)}
                    className="flex items-center gap-2 text-sm font-semibold text-muted uppercase tracking-wider mb-3 min-h-[44px]"
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
                  {showCompleted &&
                    completedGoals.map((goal) => (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleMilestone={handleToggleMilestone}
                      />
                    ))}
                </section>
              )}
            </>
          )}
        </>
      )}

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
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-blue-600 active:bg-blue-700 transition-colors flex items-center justify-center z-40"
        style={{ maxWidth: 'calc(50% + 215px - 16px)', right: 'max(16px, calc(50% - 215px + 16px))' }}
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </Layout>
  );
}
