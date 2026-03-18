import { useState } from 'react';
import { Button } from '../ui/Button';
import type { PostWorkoutActivities } from '../../types';

type ActivityKey = 'cardio' | 'abs' | 'sauna' | 'coldPlunge';

interface CardioAbsSelectorProps {
  initial: PostWorkoutActivities;
  onSelect: (activities: PostWorkoutActivities) => void;
  onBack: () => void;
}

const activityOptions: { key: ActivityKey; emoji: string; title: string; subtitle: string }[] = [
  { key: 'cardio', emoji: '\u{1F3C3}', title: 'Cardio', subtitle: '10-20 min cardio session' },
  { key: 'abs', emoji: '\u{1F4AA}', title: 'Abs', subtitle: 'Quick abs circuit' },
  { key: 'sauna', emoji: '\u2668\uFE0F', title: 'Sauna', subtitle: 'Heat therapy session' },
  { key: 'coldPlunge', emoji: '\u2744\uFE0F', title: 'Cold Plunge', subtitle: 'Cold exposure recovery' },
];

export function CardioAbsSelector({ initial, onSelect, onBack }: CardioAbsSelectorProps) {
  const [selected, setSelected] = useState<Set<ActivityKey>>(() => {
    const s = new Set<ActivityKey>();
    if (initial.cardio) s.add('cardio');
    if (initial.abs) s.add('abs');
    if (initial.sauna) s.add('sauna');
    if (initial.coldPlunge) s.add('coldPlunge');
    return s;
  });

  // Input states
  const [cardioMinutes, setCardioMinutes] = useState(initial.cardio?.minutes ?? 0);
  const [cardioCalories, setCardioCalories] = useState(initial.cardio?.calories ?? 0);
  const [absSets, setAbsSets] = useState(initial.abs?.sets ?? 0);
  const [absReps, setAbsReps] = useState(initial.abs?.reps ?? 0);
  const [saunaMinutes, setSaunaMinutes] = useState(initial.sauna?.minutes ?? 0);
  const [coldPlungeMinutes, setColdPlungeMinutes] = useState(initial.coldPlunge?.minutes ?? 0);

  const toggle = (key: ActivityKey) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleContinue = () => {
    const activities: PostWorkoutActivities = {};
    if (selected.has('cardio')) {
      activities.cardio = { minutes: cardioMinutes, calories: cardioCalories };
    }
    if (selected.has('abs')) {
      activities.abs = { sets: absSets, reps: absReps };
    }
    if (selected.has('sauna')) {
      activities.sauna = { minutes: saunaMinutes };
    }
    if (selected.has('coldPlunge')) {
      activities.coldPlunge = { minutes: coldPlungeMinutes };
    }
    onSelect(activities);
  };

  const inputClass = 'bg-bg/50 border border-white/[0.08] rounded-xl px-3 py-2.5 text-text text-sm w-full focus:outline-none focus:border-primary transition-colors';

  return (
    <div className="space-y-3">
      {/* Back button */}
      <button onClick={onBack} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1 mb-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <p className="text-muted text-sm">Select all that apply, or skip to finish.</p>

      {activityOptions.map((opt) => {
        const isSelected = selected.has(opt.key);
        return (
          <div key={opt.key}>
            <button
              onClick={() => toggle(opt.key)}
              className={`w-full text-left bg-card/60 border-2 rounded-2xl p-5 backdrop-blur-sm active:scale-[0.98] transition-all ${
                isSelected
                  ? 'border-primary shadow-lg shadow-primary/10'
                  : 'border-white/[0.06] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4 py-1">
                <div className="text-3xl">{opt.emoji}</div>
                <div>
                  <h3 className="text-text font-bold text-lg">{opt.title}</h3>
                  <p className="text-muted text-sm">{opt.subtitle}</p>
                </div>
                {isSelected && (
                  <div className="ml-auto w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                )}
              </div>
            </button>

            {/* Cardio inputs */}
            {opt.key === 'cardio' && isSelected && (
              <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm space-y-3 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted text-xs font-medium block mb-1">Duration (min)</label>
                    <input type="number" inputMode="numeric" value={cardioMinutes || ''} onChange={(e) => setCardioMinutes(parseInt(e.target.value) || 0)} placeholder="15" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-muted text-xs font-medium block mb-1">Calories burnt</label>
                    <input type="number" inputMode="numeric" value={cardioCalories || ''} onChange={(e) => setCardioCalories(parseInt(e.target.value) || 0)} placeholder="150" className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* Abs inputs */}
            {opt.key === 'abs' && isSelected && (
              <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm space-y-3 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-muted text-xs font-medium block mb-1">Sets</label>
                    <input type="number" inputMode="numeric" value={absSets || ''} onChange={(e) => setAbsSets(parseInt(e.target.value) || 0)} placeholder="3" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-muted text-xs font-medium block mb-1">Reps</label>
                    <input type="number" inputMode="numeric" value={absReps || ''} onChange={(e) => setAbsReps(parseInt(e.target.value) || 0)} placeholder="15" className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* Sauna input */}
            {opt.key === 'sauna' && isSelected && (
              <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm space-y-3 mt-2">
                <div className="w-1/2">
                  <label className="text-muted text-xs font-medium block mb-1">Duration (min)</label>
                  <input type="number" inputMode="numeric" value={saunaMinutes || ''} onChange={(e) => setSaunaMinutes(parseInt(e.target.value) || 0)} placeholder="15" className={inputClass} />
                </div>
              </div>
            )}

            {/* Cold Plunge input */}
            {opt.key === 'coldPlunge' && isSelected && (
              <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm space-y-3 mt-2">
                <div className="w-1/2">
                  <label className="text-muted text-xs font-medium block mb-1">Duration (min)</label>
                  <input type="number" inputMode="numeric" value={coldPlungeMinutes || ''} onChange={(e) => setColdPlungeMinutes(parseInt(e.target.value) || 0)} placeholder="5" className={inputClass} />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <Button fullWidth onClick={handleContinue}>
        {selected.size === 0 ? 'Skip & Finish' : 'Continue'}
      </Button>
    </div>
  );
}
