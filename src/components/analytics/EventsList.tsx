import { Button } from '../ui/Button';
import type { TimelineEvent } from '../../types';

interface EventsListProps {
  events: TimelineEvent[];
  onAdd: () => void;
  onEdit: (event: TimelineEvent) => void;
  onDelete: (id: string) => void;
}

const EVENT_META: Record<TimelineEvent['type'], { icon: string; color: string }> = {
  supplement_start: { icon: '💊', color: 'text-green-400' },
  supplement_stop: { icon: '⏹️', color: 'text-red-400' },
  diet_change: { icon: '🍽️', color: 'text-orange-400' },
  injury: { icon: '🤕', color: 'text-red-400' },
  milestone: { icon: '🎯', color: 'text-blue-400' },
  other: { icon: '📌', color: 'text-gray-400' },
};

export function EventsList({ events, onAdd, onEdit, onDelete }: EventsListProps) {
  const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div className="mb-3">
        <Button variant="secondary" size="sm" onClick={onAdd}>
          + Add Event
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-3xl mb-2">📅</div>
          <p className="text-muted text-sm">No events yet. Add supplements, diet changes, or milestones to track alongside your progress.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((event) => {
            const meta = EVENT_META[event.type];
            return (
              <div
                key={event.id}
                className="flex items-center gap-3 bg-bg rounded-xl p-3 border border-border"
              >
                <span className="text-xl">{meta.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${meta.color}`}>{event.label}</p>
                  <p className="text-xs text-muted">{event.date}</p>
                </div>
                <button
                  onClick={() => onEdit(event)}
                  className="text-muted hover:text-text p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Edit event"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="text-muted hover:text-red-400 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Delete event"
                >
                  🗑️
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
