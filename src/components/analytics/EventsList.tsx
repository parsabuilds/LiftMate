import { Button } from '../ui/Button';
import type { TimelineEvent } from '../../types';

interface EventsListProps {
  events: TimelineEvent[];
  onAdd: () => void;
  onEdit: (event: TimelineEvent) => void;
  onDelete: (id: string) => void;
}

const EVENT_META: Record<TimelineEvent['type'], { icon: string; color: string }> = {
  supplement_start: { icon: '\uD83D\uDC8A', color: 'text-green-400' },
  supplement_stop: { icon: '\u23F9\uFE0F', color: 'text-red-400' },
  diet_change: { icon: '\uD83C\uDF7D\uFE0F', color: 'text-orange-400' },
  injury: { icon: '\uD83E\uDD15', color: 'text-red-400' },
  milestone: { icon: '\uD83C\uDFAF', color: 'text-blue-400' },
  other: { icon: '\uD83D\uDCCC', color: 'text-gray-400' },
};

export function EventsList({ events, onAdd, onEdit, onDelete }: EventsListProps) {
  const sorted = [...events].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div className="mb-4">
        <Button variant="secondary" size="sm" onClick={onAdd}>
          + Add Event
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">{'\uD83D\uDCC5'}</div>
          <p className="text-muted text-sm">No events yet. Add supplements, diet changes, or milestones to track alongside your progress.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sorted.map((event) => {
            const meta = EVENT_META[event.type];
            return (
              <div
                key={event.id}
                className="flex items-center gap-3 bg-card/60 border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm"
              >
                <span className="text-2xl">{meta.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${meta.color}`}>{event.label}</p>
                  <p className="text-xs text-muted/80 mt-0.5">{event.date}</p>
                </div>
                <button
                  onClick={() => onEdit(event)}
                  className="text-muted hover:text-text p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Edit event"
                >
                  {'\u270F\uFE0F'}
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="text-muted hover:text-red-400 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Delete event"
                >
                  {'\uD83D\uDDD1\uFE0F'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
