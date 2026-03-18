import { useState } from 'react';
import { Button } from '../ui/Button';
import type { CardioAbsChoice } from '../../types';

interface CardioAbsSelectorProps {
  initialChoice?: CardioAbsChoice;
  initialMinutes?: number;
  initialCalories?: number;
  onSelect: (choice: CardioAbsChoice, minutes: number, calories: number) => void;
  onBack: () => void;
}

const options: { choice: CardioAbsChoice; emoji: string; title: string; subtitle: string }[] = [
  { choice: 'cardio', emoji: '\u{1F3C3}', title: 'Cardio', subtitle: '10-20 min cardio session' },
  { choice: 'abs', emoji: '\u{1F4AA}', title: 'Abs', subtitle: 'Quick abs circuit' },
  { choice: 'skip', emoji: '\u23ED\uFE0F', title: 'Skip', subtitle: 'Finish workout' },
];

export function CardioAbsSelector({ initialChoice, initialMinutes, initialCalories, onSelect, onBack }: CardioAbsSelectorProps) {
  const [selected, setSelected] = useState<CardioAbsChoice | null>(initialChoice ?? null);
  const [minutes, setMinutes] = useState(initialMinutes ?? 0);
  const [calories, setCalories] = useState(initialCalories ?? 0);

  const handleContinue = () => {
    if (!selected) return;
    onSelect(selected, minutes, calories);
  };

  return (
    <div className="space-y-3">
      {/* Back button */}
      <button onClick={onBack} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1 mb-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {options.map((opt) => (
        <button
          key={opt.choice}
          onClick={() => setSelected(opt.choice)}
          className={`w-full text-left bg-card/60 border-2 rounded-2xl p-5 backdrop-blur-sm active:scale-[0.98] transition-all ${
            selected === opt.choice
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
            {selected === opt.choice && (
              <div className="ml-auto w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
            )}
          </div>
        </button>
      ))}

      {/* Input fields for cardio/abs */}
      {selected && selected !== 'skip' && (
        <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm space-y-3 mt-2">
          <p className="text-muted text-xs font-semibold uppercase tracking-wider">
            {selected === 'cardio' ? 'Cardio Details' : 'Abs Details'}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-muted text-xs font-medium block mb-1">Duration (min)</label>
              <input
                type="number"
                inputMode="numeric"
                value={minutes || ''}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                placeholder="15"
                className="bg-bg/50 border border-white/[0.08] rounded-xl px-3 py-2.5 text-text text-sm w-full focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-muted text-xs font-medium block mb-1">Calories burnt</label>
              <input
                type="number"
                inputMode="numeric"
                value={calories || ''}
                onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                placeholder="150"
                className="bg-bg/50 border border-white/[0.08] rounded-xl px-3 py-2.5 text-text text-sm w-full focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      <Button fullWidth disabled={!selected} onClick={handleContinue}>
        Continue
      </Button>
    </div>
  );
}
