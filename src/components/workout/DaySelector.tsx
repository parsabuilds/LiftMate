import { getRoutineByGender } from '../../data/defaultRoutines';
import type { DayType } from '../../types';

interface DaySelectorProps {
  gender: 'male' | 'female';
  onSelectDay: (day: DayType | 'rest') => void;
}

const iconMap: Record<string, string> = {
  'Push': '\uD83D\uDCAA',
  'Pull': '\uD83C\uDFCB\uFE0F',
  'Legs + Shoulders': '\uD83E\uDDB5',
  'Lower Body - Glute Focus': '\uD83C\uDF51',
  'Upper Body': '\uD83D\uDCAA',
  'Lower Body - Quad Focus': '\uD83E\uDDB5',
};

export function DaySelector({ gender, onSelectDay }: DaySelectorProps) {
  const routine = getRoutineByGender(gender);
  const dayOptions = routine.days.map((day) => ({
    dayType: day.dayType,
    muscles: day.muscleGroups.map((mg) => mg.name),
    exerciseCount: day.muscleGroups.reduce((sum, mg) => sum + mg.exercises.length, 0),
    icon: iconMap[day.dayType] ?? '\uD83C\uDFCB\uFE0F',
  }));

  return (
    <div className="space-y-3">
      {dayOptions.map((day) => (
        <button
          key={day.dayType}
          onClick={() => onSelectDay(day.dayType)}
          className="group w-full text-left bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm hover:border-primary/30 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="text-3xl">{day.icon}</div>
            <div className="flex-1">
              <h3 className="text-text font-bold text-lg">{day.dayType}</h3>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {day.muscles.map((muscle) => (
                  <span key={muscle} className="text-xs bg-white/[0.05] text-muted px-2 py-0.5 rounded-md font-medium">
                    {muscle}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted/60 mt-1.5">{day.exerciseCount} exercises</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-primary transition-colors">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </button>
      ))}

      {/* Rest Day */}
      <button
        onClick={() => onSelectDay('rest')}
        className="w-full text-left bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm hover:border-white/10 active:scale-[0.98] transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="text-3xl">{'\uD83D\uDE34'}</div>
          <div className="flex-1">
            <h3 className="text-text font-bold text-lg">Rest Day</h3>
            <p className="text-muted text-sm mt-1">Recovery is important too</p>
          </div>
        </div>
      </button>
    </div>
  );
}
