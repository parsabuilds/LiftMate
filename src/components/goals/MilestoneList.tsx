import type { Milestone } from '../../types';

interface MilestoneListProps {
  milestones: Milestone[];
  onToggle: (milestoneId: string) => void;
}

export function MilestoneList({ milestones, onToggle }: MilestoneListProps) {
  return (
    <ul className="space-y-2 mt-3">
      {milestones.map((m) => (
        <li key={m.id} className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onToggle(m.id)}
            className="min-w-[24px] min-h-[24px] w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors"
            style={{
              borderColor: m.completed ? '#10B981' : '#334155',
              backgroundColor: m.completed ? '#10B981' : 'transparent',
            }}
          >
            {m.completed && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <div className="flex-1 min-w-0">
            <span className={`text-sm ${m.completed ? 'line-through text-muted' : 'text-text'}`}>
              {m.title}
            </span>
            {m.targetDate && !m.completed && (
              <span className="text-xs text-muted ml-2">{m.targetDate}</span>
            )}
            {m.completed && m.completedAt && (
              <span className="text-xs text-green-400 ml-2">
                {new Date(m.completedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
