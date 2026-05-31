import { useMemo, useState } from 'react';
import type { WorkoutLog } from '../../types';
import { getLocalDateString } from '../../utils/date';

interface WorkoutCalendarProps {
  workoutLogs: WorkoutLog[];
  manualDates: Set<string>;
  onLogWorkout: (date: string) => void | Promise<void>;
  onRemoveManual: (date: string) => void | Promise<void>;
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatLong(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function WorkoutCalendar({
  workoutLogs,
  manualDates,
  onLogWorkout,
  onRemoveManual,
}: WorkoutCalendarProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const workoutMap = useMemo(() => {
    const map = new Map<string, WorkoutLog[]>();
    workoutLogs.forEach((log) => {
      const arr = map.get(log.date);
      if (arr) arr.push(log);
      else map.set(log.date, [log]);
    });
    return map;
  }, [workoutLogs]);

  // 28 days (4 weeks) ending with the current week as the bottom row.
  const cells = useMemo(() => {
    const start = getMondayOfWeek(new Date());
    start.setDate(start.getDate() - 21);
    return Array.from({ length: 28 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return { day: d.getDate(), dateStr: getLocalDateString(d) };
    });
  }, []);

  const todayStr = getLocalDateString();
  const monday = getMondayOfWeek(new Date());
  const weekStart = getLocalDateString(monday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const weekEnd = getLocalDateString(sunday);

  const selectedLogs = selected ? workoutMap.get(selected) ?? [] : [];

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {DAY_LABELS.map((label, i) => (
          <div key={i} className="text-center text-[11px] text-muted/70 font-bold">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((cell) => {
          const logs = workoutMap.get(cell.dateStr);
          const didWorkout = (!!logs && logs.length > 0) || manualDates.has(cell.dateStr);
          const isToday = cell.dateStr === todayStr;
          const isFuture = cell.dateStr > todayStr;
          const inWeek = cell.dateStr >= weekStart && cell.dateStr <= weekEnd;
          const isSelected = cell.dateStr === selected;

          return (
            <button
              key={cell.dateStr}
              disabled={isFuture}
              onClick={() =>
                setSelected((prev) => (prev === cell.dateStr ? null : cell.dateStr))
              }
              aria-label={`${cell.dateStr}${didWorkout ? ', worked out' : ''}`}
              className={`relative aspect-square rounded-lg flex items-center justify-center transition-all
                ${
                  didWorkout
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                    : inWeek
                      ? 'bg-emerald-900/20 border border-emerald-700/20'
                      : 'bg-white/[0.04] border border-white/[0.05]'
                }
                ${isFuture ? 'opacity-30' : 'hover:scale-105 active:scale-95'}
                ${isSelected ? 'ring-2 ring-white/80' : isToday ? 'ring-2 ring-primary' : ''}
              `}
            >
              {didWorkout ? (
                <>
                  <span className="absolute top-1 left-1.5 text-[9px] font-bold text-white/80">
                    {cell.day}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </>
              ) : (
                <span
                  className={`text-xs font-semibold ${isFuture ? 'text-muted/40' : 'text-muted'}`}
                >
                  {cell.day}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!selected && (
        <p className="text-center text-[11px] text-muted/60 mt-3">
          Tap a day to view or log a workout
        </p>
      )}

      {selected && (
        <div className="mt-4 bg-bg/40 border border-white/[0.06] rounded-xl p-4">
          <p className="text-text font-bold text-sm">{formatLong(selected)}</p>

          {selectedLogs.length === 0 ? (
            manualDates.has(selected) ? (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-emerald-400 font-semibold">
                  ✓ Marked as worked out
                </span>
                <button
                  onClick={() => onRemoveManual(selected)}
                  className="text-xs text-muted hover:text-red-400 font-semibold transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <p className="text-muted text-sm mt-1">Rest day — no workout logged.</p>
                <button
                  onClick={() => onLogWorkout(selected)}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold text-sm rounded-xl py-2.5 transition-colors active:scale-[0.98]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  I worked out this day
                </button>
              </>
            )
          ) : (
            <div className="space-y-4 mt-3">
              {selectedLogs.map((log) => {
                const totalSets = log.exercises.reduce(
                  (sum, ex) => sum + ex.sets.length,
                  0
                );
                return (
                  <div key={log.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        {log.dayType}
                      </span>
                      <span className="text-xs text-muted">
                        {log.exercises.length} exercises · {totalSets} sets
                      </span>
                    </div>
                    <div className="space-y-2">
                      {log.exercises.map((ex) => {
                        const completed = ex.sets.filter((s) => s.completed);
                        const sets = completed.length ? completed : ex.sets;
                        return (
                          <div
                            key={ex.exerciseId}
                            className="flex items-start justify-between gap-3"
                          >
                            <span className="text-sm text-text font-medium">
                              {ex.exerciseName}
                            </span>
                            <div className="flex flex-wrap gap-1 justify-end">
                              {sets.map((s, i) => (
                                <span
                                  key={i}
                                  className="text-[11px] text-muted bg-white/[0.05] rounded px-1.5 py-0.5 whitespace-nowrap"
                                >
                                  {s.weight}×{s.reps}
                                  {s.isPR ? ' ★' : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
