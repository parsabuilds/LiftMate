import type { Milestone } from '../../types';

interface MilestoneListProps {
  milestones: Milestone[];
  onToggle: (milestoneId: string) => void;
}

export function MilestoneList({ milestones, onToggle }: MilestoneListProps) {
  return (
    <ul className="space-y-2.5 mt-3">
      {milestones.map((m) => (
        <li key={m.id} className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onToggle(m.id)}
            className={`min-w-[28px] min-h-[28px] w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
              m.completed
                ? 'border-success bg-success shadow-md shadow-success/20'
                : 'border-white/[0.12] bg-transparent hover:border-white/20'
            }`}
          >
            {m.completed && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <div className="flex-1 min-w-0">
            <span className={`text-sm font-medium ${m.completed ? 'line-through text-muted/60' : 'text-text'}`}>
              {m.title}
            </span>
            {m.targetDate && !m.completed && (
              <span className="text-xs text-muted/70 ml-2">{m.targetDate}</span>
            )}
            {m.completed && m.completedAt && (
              <span className="text-xs text-success ml-2 font-medium">
                {new Date(m.completedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
