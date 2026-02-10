import { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDocument, setDocument } from '../../hooks/useFirestore';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import type { DailyLog } from '../../types';

export function QuickLog() {
  const { user } = useAuthContext();
  const today = new Date().toISOString().split('T')[0];

  const { data: dailyLog } = useDocument<DailyLog>(
    user ? `users/${user.uid}/dailyLogs/${today}` : null
  );

  const [weight, setWeight] = useState('');

  useEffect(() => {
    if (dailyLog?.weight) {
      setWeight(String(dailyLog.weight));
    }
  }, [dailyLog?.weight]);

  const updateLog = async (updates: Partial<DailyLog>) => {
    if (!user) return;
    await setDocument(`users/${user.uid}/dailyLogs/${today}`, {
      date: today,
      ...updates,
    });
  };

  const handleWeightBlur = () => {
    const num = parseFloat(weight);
    if (!isNaN(num) && num > 0) {
      updateLog({ weight: num });
    }
  };

  return (
    <Card title="Quick Log" className="mb-4">
      <div className="space-y-4">
        <Input
          label="Weight (lbs)"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          onBlur={handleWeightBlur}
          placeholder="Enter weight"
        />
        <Toggle
          checked={dailyLog?.sauna || false}
          onChange={(checked) => updateLog({ sauna: checked })}
          label="Sauna"
        />
        <Toggle
          checked={dailyLog?.coldPlunge || false}
          onChange={(checked) => updateLog({ coldPlunge: checked })}
          label="Cold Plunge"
        />
      </div>
    </Card>
  );
}
