import { useState, useCallback } from 'react';
import YouTubeThumb from '../ui/YouTubeThumb';
import { CircularTimer } from '../ui/CircularTimer';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { Exercise, ExerciseLog, SetLog } from '../../types';

interface ExerciseTrackerProps {
  exercises: Exercise[];
  previousLogs?: ExerciseLog[];
  onComplete: (logs: ExerciseLog[]) => void;
}

interface SetRow {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
  isPR: boolean;
}

const REST_SECONDS = 90;

export function ExerciseTracker({ exercises, previousLogs, onComplete }: ExerciseTrackerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [sets, setSets] = useState<SetRow[]>(() => initSets(exercises[0]));
  const [showRest, setShowRest] = useState(false);

  function initSets(exercise: Exercise): SetRow[] {
    return Array.from({ length: exercise.sets }, (_, i) => ({
      setNumber: i + 1,
      reps: 0,
      weight: 0,
      completed: false,
      isPR: false,
    }));
  }

  const exercise = exercises[currentIndex];
  const prevLog = previousLogs?.find((l) => l.exerciseId === exercise.id);
  const prevMaxWeight = prevLog
    ? Math.max(...prevLog.sets.map((s) => s.weight), 0)
    : 0;

  const prevHint = prevLog
    ? `Last time: ${prevLog.sets.length}x${prevLog.sets[0]?.reps ?? '?'} @ ${prevLog.sets[0]?.weight ?? '?'} lbs`
    : null;

  const updateSet = (index: number, field: 'reps' | 'weight', value: number) => {
    setSets((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const confirmSet = (index: number) => {
    setSets((prev) =>
      prev.map((s, i) => {
        if (i !== index) return s;
        const isPR = prevMaxWeight > 0 && s.weight > prevMaxWeight;
        return { ...s, completed: true, isPR };
      })
    );
    setShowRest(true);
  };

  const addSet = () => {
    setSets((prev) => [
      ...prev,
      { setNumber: prev.length + 1, reps: 0, weight: 0, completed: false, isPR: false },
    ]);
  };

  const goToNext = useCallback(() => {
    const exerciseLog: ExerciseLog = {
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
    };

    const updatedLogs = [...logs, exerciseLog];

    if (currentIndex >= exercises.length - 1) {
      onComplete(updatedLogs);
    } else {
      setLogs(updatedLogs);
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSets(initSets(exercises[nextIndex]));
    }
  }, [exercise, sets, logs, currentIndex, exercises, onComplete]);

  const hasCompletedSet = sets.some((s) => s.completed);

  return (
    <div className="space-y-4 relative">
      {/* Rest timer overlay */}
      {showRest && (
        <div className="fixed inset-0 bg-background/90 z-50 flex flex-col items-center justify-center gap-6">
          <p className="text-muted text-sm uppercase tracking-wide">Rest</p>
          <CircularTimer duration={REST_SECONDS} onComplete={() => setShowRest(false)} size={180} />
          <Button variant="secondary" onClick={() => setShowRest(false)}>
            Skip Rest
          </Button>
        </div>
      )}

      {/* Progress */}
      <p className="text-muted text-sm">
        Exercise {currentIndex + 1}/{exercises.length}
      </p>

      {/* Exercise info */}
      <div className="flex items-start gap-3">
        {exercise.youtubeId && (
          <YouTubeThumb youtubeId={exercise.youtubeId} exerciseName={exercise.name} size="md" />
        )}
        <div className="flex-1">
          <h3 className="text-text font-semibold text-lg">{exercise.name}</h3>
          {prevHint && <p className="text-muted text-xs mt-1">{prevHint}</p>}
        </div>
      </div>

      {/* Set table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-4 gap-2 px-3 py-2 text-xs text-muted uppercase tracking-wide border-b border-border">
          <span>Set</span>
          <span>Reps</span>
          <span>Weight</span>
          <span></span>
        </div>
        {sets.map((set, i) => (
          <div
            key={i}
            className={`grid grid-cols-4 gap-2 px-3 py-2 items-center ${
              set.completed ? 'opacity-60' : ''
            }`}
          >
            <span className="text-text text-sm font-medium">{set.setNumber}</span>
            <input
              type="number"
              inputMode="numeric"
              value={set.reps || ''}
              onChange={(e) => updateSet(i, 'reps', parseInt(e.target.value) || 0)}
              disabled={set.completed}
              className="bg-background border border-border rounded-lg px-2 py-1.5 text-text text-sm w-full min-h-[36px] focus:outline-none focus:border-primary"
              placeholder="0"
            />
            <input
              type="number"
              inputMode="numeric"
              value={set.weight || ''}
              onChange={(e) => updateSet(i, 'weight', parseInt(e.target.value) || 0)}
              disabled={set.completed}
              className="bg-background border border-border rounded-lg px-2 py-1.5 text-text text-sm w-full min-h-[36px] focus:outline-none focus:border-primary"
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
                  className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
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

      <button onClick={addSet} className="text-primary text-sm hover:underline">
        + Add Set
      </button>

      <Button fullWidth disabled={!hasCompletedSet} onClick={goToNext}>
        {currentIndex >= exercises.length - 1 ? 'Finish Exercises' : 'Next Exercise'}
      </Button>
    </div>
  );
}
