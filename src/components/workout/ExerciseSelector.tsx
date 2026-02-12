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
    <div className="space-y-8">
      {muscleGroups.map((mg) => (
        <div key={mg.name}>
          <h3 className="text-text font-bold text-lg mb-3">Choose exercises for <span className="text-primary">{mg.name}</span></h3>
          <div className="grid grid-cols-2 gap-3">
            {mg.exercises.map((exercise) => {
              const isSelected = selections[mg.name]?.some((e) => e.id === exercise.id) ?? false;
              return (
                <button
                  key={exercise.id}
                  onClick={() => toggleExercise(mg.name, exercise)}
                  className={`relative bg-card/60 border-2 rounded-2xl p-3 text-left transition-all backdrop-blur-sm ${
                    isSelected
                      ? 'border-primary shadow-lg shadow-primary/10'
                      : 'border-white/[0.06] hover:border-white/10'
                  }`}
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
                  <p className="text-text text-sm font-bold leading-tight">{exercise.name}</p>
                  <p className="text-muted text-xs mt-1">
                    {exercise.sets} sets x {exercise.reps}
                  </p>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
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
