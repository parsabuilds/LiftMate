import { useState } from 'react';
import type { Goal } from '../../types';
import { MilestoneList } from './MilestoneList';

interface GoalCardProps {
  goal: Goal;
  color: string;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
}

function ProgressRing({ progress, color, size = 72, strokeWidth = 6 }: {
  progress: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#334155"
          strokeWidth={strokeWidth}
        />
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
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-extrabold leading-none" style={{ color }}>
          {progress}%
        </span>
        <span className="text-[9px] text-muted mt-0.5">complete</span>
      </div>
    </div>
  );
}

export function GoalCard({ goal, color, onEdit, onDelete, onToggleMilestone }: GoalCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const completedCount = goal.milestones.filter((m) => m.completed).length;
  const totalCount = goal.milestones.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const remaining = totalCount - completedCount;

  return (
    <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex gap-4">
        {/* Progress Ring */}
        {totalCount > 0 && (
          <ProgressRing progress={progress} color={color} />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title row with action buttons */}
          <div className="flex items-start justify-between gap-1">
            <button
              type="button"
              className="flex-1 text-left min-h-[44px] flex flex-col justify-center"
              onClick={() => setExpanded(!expanded)}
            >
              <h3 className="text-[15px] font-bold text-text leading-snug">{goal.title}</h3>
            </button>
            <div className="flex items-center gap-0 shrink-0 -mr-2 -mt-1">
              <button
                type="button"
                onClick={() => onEdit(goal)}
                className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-muted hover:text-text transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center text-muted hover:text-red-400 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Description */}
          {goal.description && (
            <p className="text-muted text-xs mt-0.5 line-clamp-1">{goal.description}</p>
          )}

          {/* Status text */}
          {totalCount > 0 && (
            <p className="text-[11px] font-semibold mt-2" style={{ color }}>
              {goal.completed
                ? 'Goal completed!'
                : `${remaining} milestone${remaining !== 1 ? 's' : ''} remaining`}
            </p>
          )}

          {/* Progress bar */}
          {totalCount > 0 && (
            <div className="h-1.5 bg-border/50 rounded-full overflow-hidden mt-2">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%`, backgroundColor: color }}
              />
            </div>
          )}

          {/* Target date */}
          {goal.targetDate && (
            <p className="text-xs text-muted mt-2">Target: {goal.targetDate}</p>
          )}
        </div>
      </div>

      {/* Expanded milestones */}
      {expanded && totalCount > 0 && (
        <div className="mt-4 pt-3 border-t border-white/[0.04]">
          <MilestoneList
            milestones={goal.milestones}
            onToggle={(milestoneId) => onToggleMilestone(goal.id, milestoneId)}
          />
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="mt-3 p-3 bg-bg/60 rounded-xl border border-border/50">
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
    </div>
  );
}
