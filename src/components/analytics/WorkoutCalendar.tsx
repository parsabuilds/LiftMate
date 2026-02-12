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
      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {DAY_LABELS.map((label, i) => (
          <div key={i} className="text-center text-xs text-muted/70 font-bold uppercase">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarData.flat().map((cell) => {
          const colorClass = cell.dayType ? (DAY_COLORS[cell.dayType] || 'bg-muted') : 'bg-white/[0.04]';
          return (
            <button
              key={cell.date}
              onClick={() => setTooltip(tooltip?.date === cell.date ? null : { date: cell.date, dayType: cell.dayType || 'rest' })}
              className={`aspect-square rounded-md ${colorClass} transition-all hover:opacity-80 hover:scale-110`}
              aria-label={`${cell.date}: ${cell.dayType || 'rest'}`}
            />
          );
        })}
      </div>

      {tooltip && (
        <div className="mt-3 text-center text-sm text-muted bg-card/60 border border-white/[0.06] rounded-xl py-2 px-3">
          {tooltip.date} — <span className="text-text font-bold capitalize">{tooltip.dayType}</span>
        </div>
      )}

      <div className="flex items-center gap-4 mt-4 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-md bg-blue-500" />
          <span className="text-xs text-muted font-medium">Push</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-md bg-purple-500" />
          <span className="text-xs text-muted font-medium">Pull</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-md bg-green-500" />
          <span className="text-xs text-muted font-medium">Legs</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-md bg-white/[0.04]" />
          <span className="text-xs text-muted font-medium">Rest</span>
        </div>
      </div>
    </div>
  );
}
