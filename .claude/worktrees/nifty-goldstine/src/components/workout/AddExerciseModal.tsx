import { useState } from 'react';
import Modal from '../ui/Modal';
import { MUSCLE_GROUPS } from '../../data/exerciseCatalog';
import type { Exercise, RoutineDay } from '../../types';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (exercise: Exercise) => void;
  selectedExerciseIds: Set<string>;
  routineDay: RoutineDay | null;
}

export function AddExerciseModal({ isOpen, onClose, onAdd, selectedExerciseIds, routineDay }: AddExerciseModalProps) {
  const [search, setSearch] = useState('');

  const routineExercises = routineDay
    ? routineDay.muscleGroups.flatMap(mg =>
        mg.exercises.filter(ex => !selectedExerciseIds.has(ex.id))
      )
    : [];

  const catalogGroups = MUSCLE_GROUPS.map(mg => ({
    ...mg,
    exercises: mg.exercises.filter(ex =>
      !selectedExerciseIds.has(ex.id) &&
      ex.name.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(mg => mg.exercises.length > 0);

  const handleAdd = (exercise: Exercise) => {
    onAdd(exercise);
    onClose();
    setSearch('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Exercise">
      <div className="max-h-[60vh] overflow-y-auto space-y-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises..."
          className="w-full bg-bg/50 border border-white/[0.08] rounded-xl px-3 py-2 text-text text-sm focus:outline-none focus:border-primary"
        />

        {routineExercises.length > 0 && !search && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
              From Today's Routine
            </h4>
            <div className="space-y-1">
              {routineExercises.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => handleAdd(ex)}
                  className="w-full text-left px-3 py-2.5 rounded-xl bg-card/60 border border-white/[0.06] hover:border-primary/30 transition-colors"
                >
                  <p className="text-text text-sm font-bold">{ex.name}</p>
                  <p className="text-muted text-xs">{ex.sets} sets x {ex.reps}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {catalogGroups.map(mg => (
          <div key={mg.name}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
              {mg.emoji} {mg.name}
            </h4>
            <div className="space-y-1">
              {mg.exercises.map(ex => (
                <button
                  key={ex.id}
                  onClick={() => handleAdd(ex)}
                  className="w-full text-left px-3 py-2.5 rounded-xl bg-card/60 border border-white/[0.06] hover:border-primary/30 transition-colors"
                >
                  <p className="text-text text-sm font-bold">{ex.name}</p>
                  <p className="text-muted text-xs">{ex.sets} sets x {ex.reps}</p>
                </button>
              ))}
            </div>
          </div>
        ))}

        {catalogGroups.length === 0 && routineExercises.length === 0 && (
          <p className="text-muted text-sm text-center py-4">No exercises found</p>
        )}
      </div>
    </Modal>
  );
}
