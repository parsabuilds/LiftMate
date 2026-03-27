import type { WorkoutLog } from '../../types';

interface ThisWeekChartProps {
  workoutLogs: WorkoutLog[];
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function getWeekDates(): string[] {
  const now = new Date();
  const day = now.getDay();
  // Monday = 0 offset, Sunday = 6 offset
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function ThisWeekChart({ workoutLogs }: ThisWeekChartProps) {
  const weekDates = getWeekDates();
  const today = getToday();
  const workoutDates = new Set(workoutLogs.map((w) => w.date));

  return (
    <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
      <h3 className="text-text font-extrabold text-sm tracking-widest uppercase mb-4">
        This Week
      </h3>

      <div className="grid grid-cols-7 gap-2">
        {/* Day labels */}
        {DAY_LABELS.map((label, idx) => (
          <div key={`label-${idx}`} className="text-center text-muted text-xs font-semibold mb-1.5">
            {label}
          </div>
        ))}

        {/* Day squares */}
        {weekDates.map((date) => {
          const didWorkout = workoutDates.has(date);
          const isToday = date === today;
          const isFuture = date > today;

          return (
            <div key={date} className="flex justify-center">
              <div
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center transition-all
                  ${didWorkout
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : isToday
                      ? 'bg-emerald-900/50 border border-emerald-700/40'
                      : isFuture
                        ? 'bg-white/[0.04] border border-white/[0.06]'
                        : 'bg-white/[0.06] border border-white/[0.06]'
                  }
                `}
              >
                {didWorkout && (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
