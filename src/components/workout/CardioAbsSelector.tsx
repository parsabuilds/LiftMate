import type { CardioAbsChoice } from '../../types';

interface CardioAbsSelectorProps {
  onSelect: (choice: CardioAbsChoice) => void;
}

const options: { choice: CardioAbsChoice; emoji: string; title: string; subtitle: string }[] = [
  { choice: 'cardio', emoji: '\u{1F3C3}', title: 'Cardio', subtitle: '10-20 min cardio session' },
  { choice: 'abs', emoji: '\u{1F4AA}', title: 'Abs', subtitle: 'Quick abs circuit' },
  { choice: 'skip', emoji: '\u23ED\uFE0F', title: 'Skip', subtitle: 'Finish workout' },
];

export function CardioAbsSelector({ onSelect }: CardioAbsSelectorProps) {
  return (
    <div className="space-y-3">
      {options.map((opt) => (
        <button
          key={opt.choice}
          onClick={() => onSelect(opt.choice)}
          className="w-full text-left bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm hover:border-primary/30 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4 py-1">
            <div className="text-3xl">{opt.emoji}</div>
            <div>
              <h3 className="text-text font-bold text-lg">{opt.title}</h3>
              <p className="text-muted text-sm">{opt.subtitle}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
