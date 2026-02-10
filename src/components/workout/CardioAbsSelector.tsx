import { Card } from '../ui/Card';
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
        <Card key={opt.choice} onClick={() => onSelect(opt.choice)}>
          <div className="flex items-center gap-4 py-2">
            <div className="text-3xl">{opt.emoji}</div>
            <div>
              <h3 className="text-text font-semibold text-lg">{opt.title}</h3>
              <p className="text-muted text-sm">{opt.subtitle}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
