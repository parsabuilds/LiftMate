import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { useAuthContext } from '../contexts/AuthContext';
import { useCollection } from '../hooks/useFirestore';
import type { DailyLog } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function Analytics() {
  const { user } = useAuthContext();
  const { data: dailyLogs } = useCollection<DailyLog>(
    user ? `users/${user.uid}/dailyLogs` : null
  );

  const weightData = dailyLogs
    .filter((log) => log.weight !== null && log.weight !== undefined)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((log) => ({
      date: log.date.slice(5), // MM-DD
      weight: log.weight,
    }));

  return (
    <Layout title="Analytics">
      <Card title="Weight Trend" className="mb-4">
        {weightData.length > 1 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#F8FAFC' }}
                  itemStyle={{ color: '#3B82F6' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-muted">Log your weight on the Today page to see trends here</p>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-muted text-sm">Total Workouts</p>
          <p className="text-2xl font-bold text-text mt-1">0</p>
        </Card>
        <Card>
          <p className="text-muted text-sm">Current Streak</p>
          <p className="text-2xl font-bold text-text mt-1">0 days</p>
        </Card>
      </div>
    </Layout>
  );
}
