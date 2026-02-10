import { useAuthContext } from '../../contexts/AuthContext';
import { useDocument, useCollection, setDocument } from '../../hooks/useFirestore';
import { Card } from '../ui/Card';
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

  return (
    <Card title="Daily Checklist" className="mb-4">
      <div className="space-y-2">
        {sortedItems.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-bg/50 transition-colors min-h-[44px]"
          >
            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
              checklist[item.id] ? 'bg-success border-success' : 'border-border'
            }`}>
              {checklist[item.id] && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="text-lg mr-1">{item.emoji}</span>
            <span className={`text-sm ${checklist[item.id] ? 'text-muted line-through' : 'text-text'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
      {items.length > 0 && (
        <p className="text-xs text-muted mt-3">{completedCount}/{items.length} completed</p>
      )}
    </Card>
  );
}
