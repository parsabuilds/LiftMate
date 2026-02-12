import { useAuthContext } from '../../contexts/AuthContext';
import { useDocument, useCollection, setDocument } from '../../hooks/useFirestore';
import type { ChecklistItem, DailyLog } from '../../types';

export function Checklist() {
  const { user } = useAuthContext();
  const today = new Date().toISOString().split('T')[0];

  const { data: items } = useCollection<ChecklistItem>(
    user ? `users/${user.uid}/checklist` : null
  );

  const { data: dailyLog } = useDocument<DailyLog>(
    user ? `users/${user.uid}/dailyLogs/${today}` : null
  );

  const checklist = dailyLog?.checklist || {};

  const toggleItem = async (itemId: string) => {
    if (!user) return;
    const current = checklist[itemId] || false;
    await setDocument(`users/${user.uid}/dailyLogs/${today}`, {
      date: today,
      checklist: { ...checklist, [itemId]: !current },
    });
  };

  const sortedItems = [...items].sort((a, b) => a.order - b.order);
  const completedCount = Object.values(checklist).filter(Boolean).length;
  const total = items.length;
  const progressPct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
      {/* Section header with progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <h3 className="text-text font-bold text-base">Daily Checklist</h3>
        </div>
        {total > 0 && (
          <span className={`text-xs font-bold uppercase tracking-wider ${
            completedCount === total ? 'text-success' : 'text-muted'
          }`}>
            {completedCount}/{total}
          </span>
        )}
      </div>

      {/* Mini progress bar */}
      {total > 0 && (
        <div className="h-1 bg-border/50 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-success rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}

      {/* Checklist items */}
      <div className="space-y-1">
        {sortedItems.map((item) => {
          const isChecked = !!checklist[item.id];
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all min-h-[44px] ${
                isChecked
                  ? 'bg-success/[0.06]'
                  : 'hover:bg-white/[0.02] active:bg-white/[0.04]'
              }`}
            >
              {/* Checkbox */}
              <div className="relative flex-shrink-0">
                {isChecked && (
                  <div className="absolute inset-0 bg-success/30 rounded-lg blur-sm" />
                )}
                <div className={`relative w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                  isChecked
                    ? 'bg-success border-success shadow-sm shadow-success/30'
                    : 'border-border hover:border-muted'
                }`}>
                  {isChecked && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Emoji + label */}
              <span className="text-lg mr-0.5">{item.emoji}</span>
              <span className={`text-sm font-medium transition-colors ${
                isChecked ? 'text-muted line-through' : 'text-text'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
