import { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDocument, setDocument } from '../../hooks/useFirestore';
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
    <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <h3 className="text-text font-bold text-base">Quick Log</h3>
      </div>

      <div className="space-y-4">
        {/* Weight input */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted mb-2 block">
            Body Weight (lbs)
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="3" />
                <path d="M12 22V8" />
                <path d="m5 12 7-4 7 4" />
              </svg>
            </div>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onBlur={handleWeightBlur}
              placeholder="Enter weight"
              className="w-full min-h-[44px] bg-bg/60 border border-border/60 rounded-xl pl-11 pr-4 py-2.5 text-text placeholder:text-muted/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm font-medium"
            />
          </div>
        </div>

        {/* Toggle grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Sauna toggle */}
          <button
            onClick={() => updateLog({ sauna: !dailyLog?.sauna })}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all min-h-[44px] ${
              dailyLog?.sauna
                ? 'bg-orange-500/10 border-orange-500/30 shadow-sm shadow-orange-500/10'
                : 'bg-bg/40 border-border/40 hover:border-border'
            }`}
          >
            <span className="text-2xl">
              {dailyLog?.sauna ? '\u2668\uFE0F' : '\u2668\uFE0F'}
            </span>
            <span className={`text-xs font-bold uppercase tracking-wider ${
              dailyLog?.sauna ? 'text-orange-400' : 'text-muted'
            }`}>
              Sauna
            </span>
          </button>

          {/* Cold Plunge toggle */}
          <button
            onClick={() => updateLog({ coldPlunge: !dailyLog?.coldPlunge })}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all min-h-[44px] ${
              dailyLog?.coldPlunge
                ? 'bg-cyan-500/10 border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                : 'bg-bg/40 border-border/40 hover:border-border'
            }`}
          >
            <span className="text-2xl">
              {dailyLog?.coldPlunge ? '\u2744\uFE0F' : '\u2744\uFE0F'}
            </span>
            <span className={`text-xs font-bold uppercase tracking-wider ${
              dailyLog?.coldPlunge ? 'text-cyan-400' : 'text-muted'
            }`}>
              Cold Plunge
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
