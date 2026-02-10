import { useState } from 'react';
import YouTubeThumb from '../ui/YouTubeThumb';
import { Button } from '../ui/Button';
import type { MuscleGroup, Exercise } from '../../types';

interface ExerciseSelectorProps {
  muscleGroups: MuscleGroup[];
  onComplete: (selected: Record<string, Exercise[]>) => void;
}

export function ExerciseSelector({ muscleGroups, onComplete }: ExerciseSelectorProps) {
  const [selections, setSelections] = useState<Record<string, Exercise[]>>(() => {
    const init: Record<string, Exercise[]> = {};
    for (const mg of muscleGroups) {
      init[mg.name] = [];
    }
    return init;
  });

  const toggleExercise = (groupName: string, exercise: Exercise) => {
    setSelections((prev) => {
      const current = prev[groupName] ?? [];
      const exists = current.some((e) => e.id === exercise.id);
      return {
        ...prev,
        [groupName]: exists
          ? current.filter((e) => e.id !== exercise.id)
          : [...current, exercise],
      };
    });
  };

  const allGroupsHaveSelection = muscleGroups.every(
    (mg) => (selections[mg.name]?.length ?? 0) > 0
  );

  return (
    <div className="space-y-6">
      {muscleGroups.map((mg) => (
        <div key={mg.name}>
          <h3 className="text-text font-semibold mb-3">Choose exercises for {mg.name}</h3>
          <div className="grid grid-cols-2 gap-3">
            {mg.exercises.map((exercise) => {
              const isSelected = selections[mg.name]?.some((e) => e.id === exercise.id) ?? false;
              return (
                <button
                  key={exercise.id}
                  onClick={() => toggleExercise(mg.name, exercise)}
                  className={`
                    bg-card border-2 rounded-xl p-3 text-left transition-colors
                    ${isSelected ? 'border-primary' : 'border-border'}
                  `}
                >
                  {exercise.youtubeId && (
                    <div className="mb-2">
                      <YouTubeThumb
                        youtubeId={exercise.youtubeId}
                        exerciseName={exercise.name}
                        size="md"
                      />
                    </div>
                  )}
                  <p className="text-text text-sm font-medium leading-tight">{exercise.name}</p>
                  <p className="text-muted text-xs mt-0.5">
                    {exercise.sets} sets x {exercise.reps}
                  </p>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <Button fullWidth disabled={!allGroupsHaveSelection} onClick={() => onComplete(selections)}>
        Continue
      </Button>
    </div>
  );
}
