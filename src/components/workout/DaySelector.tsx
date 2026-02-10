import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { DayType } from '../../types';

interface DaySelectorProps {
  onSelectDay: (day: DayType | 'rest') => void;
}

const dayOptions: { dayType: DayType; muscles: string[]; icon: string }[] = [
  { dayType: 'Push', muscles: ['Chest', 'Triceps'], icon: '💪' },
  { dayType: 'Pull', muscles: ['Back', 'Biceps'], icon: '🏋️' },
  { dayType: 'Legs + Shoulders', muscles: ['Legs', 'Shoulders'], icon: '🦵' },
];

export function DaySelector({ onSelectDay }: DaySelectorProps) {
  return (
    <div className="space-y-3">
      {dayOptions.map((day) => (
        <Card key={day.dayType} onClick={() => onSelectDay(day.dayType)}>
          <div className="flex items-center gap-4">
            <div className="text-3xl">{day.icon}</div>
            <div className="flex-1">
              <h3 className="text-text font-semibold text-lg">{day.dayType}</h3>
              <div className="flex gap-2 mt-1">
                {day.muscles.map((muscle) => (
                  <Badge key={muscle} text={muscle} variant="muted" />
                ))}
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </Card>
      ))}

      {/* Rest Day */}
      <Card onClick={() => onSelectDay('rest')}>
        <div className="flex items-center gap-4">
          <div className="text-3xl">😴</div>
          <div className="flex-1">
            <h3 className="text-text font-semibold text-lg">Rest Day</h3>
            <p className="text-muted text-sm mt-1">Recovery is important too</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
