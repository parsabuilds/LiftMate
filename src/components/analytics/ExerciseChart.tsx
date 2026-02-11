import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { WorkoutLog, TimelineEvent } from '../../types';

interface ExerciseChartProps {
  workoutLogs: WorkoutLog[];
  events: TimelineEvent[];
}

type TimeRange = '1M' | '3M' | '6M' | 'All';

function getDateThreshold(range: TimeRange): string | null {
  if (range === 'All') return null;
  const now = new Date();
  const months = range === '1M' ? 1 : range === '3M' ? 3 : 6;
  now.setMonth(now.getMonth() - months);
  return now.toISOString().slice(0, 10);
}

export function ExerciseChart({ workoutLogs, events }: ExerciseChartProps) {
  const [range, setRange] = useState<TimeRange>('3M');
  const [selectedExercise, setSelectedExercise] = useState<string>('');

  const exerciseNames = useMemo(() => {
    const names = new Set<string>();
    workoutLogs.forEach((log) => {
      log.exercises.forEach((ex) => names.add(ex.exerciseName));
    });
    return Array.from(names).sort();
  }, [workoutLogs]);

  // Auto-select first exercise if none selected
  const activeExercise = selectedExercise || exerciseNames[0] || '';

  const chartData = useMemo(() => {
    const threshold = getDateThreshold(range);
    const filtered = workoutLogs
      .filter((log) => !threshold || log.date >= threshold)
      .sort((a, b) => a.date.localeCompare(b.date));

    return filtered
      .map((log) => {
        const exercise = log.exercises.find((ex) => ex.exerciseName === activeExercise);
        if (!exercise) return null;
        const maxWeight = Math.max(...exercise.sets.filter((s) => s.completed).map((s) => s.weight), 0);
        if (maxWeight === 0) return null;
        return { date: log.date.slice(5), fullDate: log.date, weight: maxWeight };
      })
      .filter((d): d is NonNullable<typeof d> => d !== null);
  }, [workoutLogs, activeExercise, range]);

  const filteredEvents = useMemo(() => {
    const threshold = getDateThreshold(range);
    return events.filter((e) => !threshold || e.date >= threshold);
  }, [events, range]);

  const ranges: TimeRange[] = ['1M', '3M', '6M', 'All'];

  if (exerciseNames.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">🏋️</div>
        <p className="text-muted">Complete workouts to see exercise progression</p>
      </div>
    );
  }

  return (
    <div>
      <select
        value={activeExercise}
        onChange={(e) => setSelectedExercise(e.target.value)}
        className="w-full min-h-[44px] bg-card border border-border rounded-xl px-4 py-2.5 text-text mb-3 focus:outline-none focus:border-primary"
      >
        {exerciseNames.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>

      <div className="flex gap-2 mb-3">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              range === r
                ? 'bg-primary text-white'
                : 'bg-card text-muted hover:text-text border border-border'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {chartData.length > 1 ? (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#F8FAFC' }}
                itemStyle={{ color: '#3B82F6' }}
              />
              <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2} dot={false} />
              {filteredEvents.map((event) => (
                <ReferenceLine
                  key={event.id}
                  x={event.date.slice(5)}
                  stroke={event.color || '#94A3B8'}
                  strokeDasharray="4 4"
                  label={{ value: event.label, position: 'top', fill: '#94A3B8', fontSize: 10 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted">Not enough data points for this exercise in the selected range</p>
        </div>
      )}
    </div>
  );
}
