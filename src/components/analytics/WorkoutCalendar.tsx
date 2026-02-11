import { useMemo, useState } from 'react';
import type { WorkoutLog } from '../../types';

interface WorkoutCalendarProps {
  workoutLogs: WorkoutLog[];
}

const DAY_COLORS: Record<string, string> = {
  push: 'bg-blue-500',
  pull: 'bg-purple-500',
  legs: 'bg-green-500',
};

const DAY_LABELS: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function WorkoutCalendar({ workoutLogs }: WorkoutCalendarProps) {
  const [tooltip, setTooltip] = useState<{ date: string; dayType: string } | null>(null);

  const calendarData = useMemo(() => {
    const workoutMap = new Map<string, string>();
    workoutLogs.forEach((log) => {
      workoutMap.set(log.date, log.dayType.toLowerCase());
    });

    const today = new Date();
    const currentMonday = getMondayOfWeek(today);
    const startDate = new Date(currentMonday);
    startDate.setDate(startDate.getDate() - 11 * 7); // 12 weeks back

    const weeks: { date: string; dayType: string | null }[][] = [];
    for (let w = 0; w < 12; w++) {
      const week: { date: string; dayType: string | null }[] = [];
      for (let d = 0; d < 7; d++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(cellDate.getDate() + w * 7 + d);
        const dateStr = cellDate.toISOString().slice(0, 10);
        const isFuture = cellDate > today;
        week.push({
          date: dateStr,
          dayType: isFuture ? null : (workoutMap.get(dateStr) || null),
        });
      }
      weeks.push(week);
    }
    return weeks;
  }, [workoutLogs]);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map((label, i) => (
          <div key={i} className="text-center text-xs text-muted font-medium">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarData.flat().map((cell) => {
          const colorClass = cell.dayType ? (DAY_COLORS[cell.dayType] || 'bg-muted') : 'bg-slate-800';
          return (
            <button
              key={cell.date}
              onClick={() => setTooltip(tooltip?.date === cell.date ? null : { date: cell.date, dayType: cell.dayType || 'rest' })}
              className={`aspect-square rounded-sm ${colorClass} transition-opacity hover:opacity-80`}
              aria-label={`${cell.date}: ${cell.dayType || 'rest'}`}
            />
          );
        })}
      </div>

      {tooltip && (
        <div className="mt-2 text-center text-sm text-muted">
          {tooltip.date} — <span className="text-text capitalize">{tooltip.dayType}</span>
        </div>
      )}

      <div className="flex items-center gap-3 mt-3 justify-center">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-blue-500" />
          <span className="text-xs text-muted">Push</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-purple-500" />
          <span className="text-xs text-muted">Pull</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-green-500" />
          <span className="text-xs text-muted">Legs</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-slate-800" />
          <span className="text-xs text-muted">Rest</span>
        </div>
      </div>
    </div>
  );
}
