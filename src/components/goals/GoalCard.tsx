import { useState } from 'react';
import type { Goal } from '../../types';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { MilestoneList } from './MilestoneList';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
}

export function GoalCard({ goal, onEdit, onDelete, onToggleMilestone }: GoalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const completedCount = goal.milestones.filter((m) => m.completed).length;
  const totalCount = goal.milestones.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Card className="mb-3">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          className="flex-1 text-left min-h-[44px] flex flex-col justify-center"
          onClick={() => setExpanded(!expanded)}
        >
          <h3 className="text-text font-semibold">{goal.title}</h3>
          {goal.description && (
            <p className="text-muted text-sm mt-1 line-clamp-2">{goal.description}</p>
          )}
        </button>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(goal)}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted hover:text-text transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted hover:text-red-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {totalCount > 0 && (
        <div className="mt-3">
          <ProgressBar value={progress} className="bg-border" />
          <p className="text-xs text-muted mt-1">{completedCount} of {totalCount} milestones</p>
        </div>
      )}

      {goal.targetDate && (
        <p className="text-xs text-muted mt-2">Target: {goal.targetDate}</p>
      )}

      {expanded && totalCount > 0 && (
        <MilestoneList
          milestones={goal.milestones}
          onToggle={(milestoneId) => onToggleMilestone(goal.id, milestoneId)}
        />
      )}

      {confirmDelete && (
        <div className="mt-3 p-3 bg-bg rounded-xl border border-border">
          <p className="text-sm text-text mb-3">Delete this goal?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onDelete(goal.id);
                setConfirmDelete(false);
              }}
              className="flex-1 min-h-[44px] bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="flex-1 min-h-[44px] bg-card text-text border border-border rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
