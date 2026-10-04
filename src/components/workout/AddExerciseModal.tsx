import { useCallback, useMemo, useState } from 'react';
import Modal from '../ui/Modal';
import { MUSCLE_GROUPS } from '../../data/exerciseCatalog';
import { LIBRARY_GROUPS, buildExerciseLibrary, exerciseKey, searchExercises, toExercise } from '../../data/exerciseLibrary';
import type { LibraryExercise } from '../../data/exerciseLibrary';
import type { Exercise, Routine, RoutineDay } from '../../types';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (exercise: Exercise) => void;
  selectedExercises: Exercise[];
  routineDay: RoutineDay | null;
  routine: Routine;
}

const GROUP_EMOJI: Record<string, string> = {
  ...Object.fromEntries(MUSCLE_GROUPS.map((mg) => [mg.name, mg.emoji])),
  Forearms: '\uD83D\uDCAA',
  Calves: '\uD83E\uDDB5',
};

function ExerciseRow({ exercise, showGroup, onAdd }: { exercise: LibraryExercise; showGroup?: boolean; onAdd: (ex: LibraryExercise) => void }) {
  return (
    <button
      onClick={() => onAdd(exercise)}
      className="w-full text-left px-3 py-2.5 rounded-xl bg-card/60 border border-white/[0.06] hover:border-primary/30 transition-colors"
    >
      <p className="text-text text-sm font-bold">{exercise.name}</p>
      <p className="text-muted text-xs">
        {showGroup && `${exercise.group} · `}{exercise.sets} sets x {exercise.reps}
      </p>
    </button>
  );
}

export function AddExerciseModal({ isOpen, onClose, onAdd, selectedExercises, routineDay, routine }: AddExerciseModalProps) {
  const [search, setSearch] = useState('');

  const library = useMemo(() => buildExerciseLibrary(routineDay, routine), [routineDay, routine]);

  // Leave out anything already in the workout, matched by id or by name.
  const available = useMemo(() => {
    const ids = new Set(selectedExercises.map((ex) => ex.id));
    const keys = new Set(selectedExercises.map((ex) => exerciseKey(ex.name)));
    return library.filter((ex) => !ids.has(ex.id) && !keys.has(exerciseKey(ex.name)));
  }, [library, selectedExercises]);

  const query = search.trim();
  const results = useMemo(() => (query ? searchExercises(available, query) : []), [available, query]);

  const todayIds = useMemo(
    () => new Set(routineDay?.muscleGroups.flatMap((mg) => mg.exercises.map((ex) => ex.id)) ?? []),
    [routineDay]
  );
  const fromToday = available.filter((ex) => todayIds.has(ex.id));

  const groups = useMemo(() => {
    const byGroup = new Map<string, LibraryExercise[]>(LIBRARY_GROUPS.map((g) => [g, []]));
    for (const ex of available) {
      if (todayIds.has(ex.id)) continue;
      const list = byGroup.get(ex.group);
      if (list) list.push(ex);
      else byGroup.set(ex.group, [ex]);
    }
    return [...byGroup].filter(([, exercises]) => exercises.length > 0);
  }, [available, todayIds]);

  const handleClose = useCallback(() => {
    setSearch('');
    onClose();
  }, [onClose]);

  const handleAdd = (exercise: LibraryExercise) => {
    onAdd(toExercise(exercise));
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Exercise">
      <div className="relative mb-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or muscle, e.g. biceps"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="search"
          className="w-full bg-bg/50 border border-white/[0.08] rounded-xl pl-3 pr-9 py-2 text-text text-base focus:outline-none focus:border-primary"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            aria-label="Clear search"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-text"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="max-h-[60vh] overflow-y-auto space-y-4">
        {query ? (
          results.length > 0 ? (
            <div className="space-y-1">
              {results.map((ex) => (
                <ExerciseRow key={ex.id} exercise={ex} showGroup onAdd={handleAdd} />
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm text-center py-4">No exercises match "{query}"</p>
          )
        ) : (
          <>
            {fromToday.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  From Today's Routine
                </h4>
                <div className="space-y-1">
                  {fromToday.map((ex) => (
                    <ExerciseRow key={ex.id} exercise={ex} onAdd={handleAdd} />
                  ))}
                </div>
              </div>
            )}

            {groups.map(([group, exercises]) => (
              <div key={group}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  {GROUP_EMOJI[group] ? `${GROUP_EMOJI[group]} ` : ''}{group}
                </h4>
                <div className="space-y-1">
                  {exercises.map((ex) => (
                    <ExerciseRow key={ex.id} exercise={ex} onAdd={handleAdd} />
                  ))}
                </div>
              </div>
            ))}

            {fromToday.length === 0 && groups.length === 0 && (
              <p className="text-muted text-sm text-center py-4">No exercises found</p>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
