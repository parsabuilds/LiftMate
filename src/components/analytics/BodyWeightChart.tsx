import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { DailyLog, TimelineEvent } from '../../types';

interface BodyWeightChartProps {
  dailyLogs: DailyLog[];
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

export function BodyWeightChart({ dailyLogs, events }: BodyWeightChartProps) {
  const [range, setRange] = useState<TimeRange>('3M');

  const chartData = useMemo(() => {
    const threshold = getDateThreshold(range);
    return dailyLogs
      .filter((log) => log.weight !== null && log.weight !== undefined)
      .filter((log) => !threshold || log.date >= threshold)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((log) => ({ date: log.date.slice(5), fullDate: log.date, weight: log.weight }));
  }, [dailyLogs, range]);

  const trend = useMemo(() => {
    if (chartData.length < 2) return null;
    const first = chartData[0].weight as number;
    const last = chartData[chartData.length - 1].weight as number;
    const diff = last - first;
    return { diff, direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat' };
  }, [chartData]);

  const filteredEvents = useMemo(() => {
    const threshold = getDateThreshold(range);
    return events.filter((e) => !threshold || e.date >= threshold);
  }, [events, range]);

  const ranges: TimeRange[] = ['1M', '3M', '6M', 'All'];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
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
        {trend && (
          <div className={`text-sm font-medium ${trend.direction === 'down' ? 'text-green-400' : trend.direction === 'up' ? 'text-red-400' : 'text-muted'}`}>
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}{' '}
            {Math.abs(trend.diff).toFixed(1)} lbs
          </div>
        )}
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
                itemStyle={{ color: '#10B981' }}
              />
              <Line type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={2} dot={false} />
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
          <div className="text-4xl mb-3">⚖️</div>
          <p className="text-muted">Log your weight on the Today page to see trends here</p>
        </div>
      )}
    </div>
  );
}
