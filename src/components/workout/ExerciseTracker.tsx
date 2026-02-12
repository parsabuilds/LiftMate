import { useState, useCallback, useEffect } from 'react';
import YouTubeThumb from '../ui/YouTubeThumb';
import { CircularTimer } from '../ui/CircularTimer';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useWorkoutContext } from '../../contexts/WorkoutContext';
import { useAuthContext } from '../../contexts/AuthContext';
import type { SetRow } from '../../contexts/WorkoutContext';
import type { Exercise, ExerciseLog, SetLog } from '../../types';

interface ExerciseTrackerProps {
  exercises: Exercise[];
  previousLogs?: ExerciseLog[];
  onComplete: (logs: ExerciseLog[]) => void;
  onBack: () => void;
}

function initSets(exercise: Exercise): SetRow[] {
  return Array.from({ length: exercise.sets }, (_, i) => ({
    setNumber: i + 1,
    reps: 0,
    weight: 0,
    completed: false,
    isPR: false,
  }));
}

export function ExerciseTracker({ exercises, previousLogs, onComplete, onBack }: ExerciseTrackerProps) {
  const { profile } = useAuthContext();
  const restSeconds = profile?.restSeconds ?? 90;

  const {
    currentExerciseIndex,
    setCurrentExerciseIndex,
    inProgressLogs,
    setInProgressLogs,
    currentSets: sets,
    setCurrentSets: setSets,
  } = useWorkoutContext();

  const [showRest, setShowRest] = useState(false);

  // Initialize sets for current exercise if empty (first mount or after navigation)
  useEffect(() => {
    if (sets.length === 0 && exercises[currentExerciseIndex]) {
      setSets(initSets(exercises[currentExerciseIndex]));
    }
  }, [sets.length, currentExerciseIndex, exercises, setSets]);

  const exercise = exercises[currentExerciseIndex];
  const prevLog = previousLogs?.find((l) => l.exerciseId === exercise?.id);
  const prevMaxWeight = prevLog
    ? Math.max(...prevLog.sets.map((s) => s.weight), 0)
    : 0;

  const prevHint = prevLog
    ? `Last time: ${prevLog.sets.length}x${prevLog.sets[0]?.reps ?? '?'} @ ${prevLog.sets[0]?.weight ?? '?'} lbs`
    : null;

  const updateSet = (index: number, field: 'reps' | 'weight', value: number) => {
    setSets(
      sets.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const confirmSet = (index: number) => {
    setSets(
      sets.map((s, i) => {
        if (i !== index) return s;
        const isPR = prevMaxWeight > 0 && s.weight > prevMaxWeight;
        return { ...s, completed: true, isPR };
      })
    );
    setShowRest(true);
  };

  const addSet = () => {
    setSets([
      ...sets,
      { setNumber: sets.length + 1, reps: 0, weight: 0, completed: false, isPR: false },
    ]);
  };

  const buildLogForCurrentExercise = useCallback((): ExerciseLog => ({
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    sets: sets
      .filter((s) => s.completed)
      .map((s): SetLog => ({
        setNumber: s.setNumber,
        reps: s.reps,
        weight: s.weight,
        completed: true,
        isPR: s.isPR,
      })),
  }), [exercise, sets]);

  const goToNext = useCallback(() => {
    const exerciseLog = buildLogForCurrentExercise();
    const updatedLogs = [...inProgressLogs, exerciseLog];

    if (currentExerciseIndex >= exercises.length - 1) {
      onComplete(updatedLogs);
      // Reset exercise-level state for next workout
      setCurrentExerciseIndex(0);
      setInProgressLogs([]);
      setSets([]);
    } else {
      setInProgressLogs(updatedLogs);
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setSets(initSets(exercises[nextIndex]));
    }
  }, [buildLogForCurrentExercise, inProgressLogs, currentExerciseIndex, exercises, onComplete, setCurrentExerciseIndex, setInProgressLogs, setSets]);

  const goToPrev = useCallback(() => {
    if (currentExerciseIndex === 0) {
      onBack();
      return;
    }

    const prevIndex = currentExerciseIndex - 1;
    // Restore the previous exercise's log from inProgressLogs
    const prevExerciseLog = inProgressLogs[prevIndex];
    // Remove the previous exercise from inProgressLogs (we'll re-add when moving forward)
    const updatedLogs = inProgressLogs.slice(0, prevIndex);

    setInProgressLogs(updatedLogs);
    setCurrentExerciseIndex(prevIndex);

    // Restore sets from the previous exercise's log, or reinitialize
    if (prevExerciseLog && prevExerciseLog.sets.length > 0) {
      setSets(prevExerciseLog.sets.map((s): SetRow => ({
        setNumber: s.setNumber,
        reps: s.reps,
        weight: s.weight,
        completed: s.completed,
        isPR: s.isPR ?? false,
      })));
    } else {
      setSets(initSets(exercises[prevIndex]));
    }
  }, [currentExerciseIndex, inProgressLogs, exercises, onBack, setCurrentExerciseIndex, setInProgressLogs, setSets]);

  if (!exercise) return null;

  const hasCompletedSet = sets.some((s) => s.completed);

  return (
    <div className="space-y-4 relative">
      {/* Rest timer overlay */}
      {showRest && (
        <div className="fixed inset-0 bg-bg/95 z-50 flex flex-col items-center justify-center gap-6 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Rest Timer</p>
          <CircularTimer duration={restSeconds} onComplete={() => setShowRest(false)} size={180} />
          <Button variant="secondary" onClick={() => setShowRest(false)}>
            Skip Rest
          </Button>
        </div>
      )}

      {/* Back button */}
      <button onClick={goToPrev} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        {currentExerciseIndex === 0 ? 'Back' : 'Previous Exercise'}
      </button>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Exercise {currentExerciseIndex + 1}/{exercises.length}
        </p>
        <div className="flex-1 h-1 bg-white/[0.06] rounded-full">
          <div
            className="h-1 bg-primary rounded-full transition-all"
            style={{ width: `${((currentExerciseIndex + 1) / exercises.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Exercise info */}
      <div className="flex items-start gap-3">
        {exercise.youtubeId && (
          <YouTubeThumb youtubeId={exercise.youtubeId} exerciseName={exercise.name} size="md" />
        )}
        <div className="flex-1">
          <h3 className="text-text font-black text-xl tracking-tight">{exercise.name}</h3>
          {prevHint && <p className="text-muted text-xs mt-1">{prevHint}</p>}
        </div>
      </div>

      {/* Set table */}
      <div className="bg-card/60 border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="grid grid-cols-4 gap-2 px-4 py-2.5 text-xs text-muted font-bold uppercase tracking-wider border-b border-white/[0.06]">
          <span>Set</span>
          <span>Reps</span>
          <span>Weight</span>
          <span></span>
        </div>
        {sets.map((set, i) => (
          <div
            key={i}
            className={`grid grid-cols-4 gap-2 px-4 py-2.5 items-center border-b border-white/[0.04] last:border-0 ${
              set.completed ? 'bg-success/[0.04]' : ''
            }`}
          >
            <span className="text-text text-sm font-bold">{set.setNumber}</span>
            <input
              type="number"
              inputMode="numeric"
              value={set.reps || ''}
              onChange={(e) => updateSet(i, 'reps', parseInt(e.target.value) || 0)}
              disabled={set.completed}
              className="bg-bg/50 border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-text text-sm w-full min-h-[36px] focus:outline-none focus:border-primary transition-colors"
              placeholder="0"
            />
            <input
              type="number"
              inputMode="numeric"
              value={set.weight || ''}
              onChange={(e) => updateSet(i, 'weight', parseInt(e.target.value) || 0)}
              disabled={set.completed}
              className="bg-bg/50 border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-text text-sm w-full min-h-[36px] focus:outline-none focus:border-primary transition-colors"
              placeholder="0"
            />
            <div className="flex items-center gap-1">
              {set.completed ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {set.isPR && <Badge text="NEW PR!" variant="success" />}
                </>
              ) : (
                <button
                  onClick={() => confirmSet(i)}
                  disabled={set.reps === 0 || set.weight === 0}
                  className="w-9 h-9 rounded-xl bg-primary/20 text-primary flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/30 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button onClick={addSet} className="text-primary text-sm font-bold hover:underline">
        + Add Set
      </button>

      <Button fullWidth disabled={!hasCompletedSet} onClick={goToNext}>
        {currentExerciseIndex >= exercises.length - 1 ? 'Finish Exercises' : 'Next Exercise'}
      </Button>
    </div>
  );
}
