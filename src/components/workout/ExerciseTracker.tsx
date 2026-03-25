import { useState, useCallback, useEffect } from 'react';
import YouTubeThumb from '../ui/YouTubeThumb';
import {
  CircularTimer,
  unlockAudio,
  startAudioKeepAlive,
  stopAudioKeepAlive,
  requestTimerNotificationPermission,
  showRestNotification,
} from '../ui/CircularTimer';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SwipeableRow } from '../ui/SwipeableRow';
import { useWorkoutContext } from '../../contexts/WorkoutContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { getEquipmentType } from '../../utils/exerciseEquipment';
import type { SetRow } from '../../contexts/WorkoutContext';
import type { Exercise, ExerciseLog, SetLog } from '../../types';

interface ExerciseTrackerProps {
  exercises: Exercise[];
  previousLogs?: ExerciseLog[];
  onComplete: (logs: ExerciseLog[]) => void;
  onBack: () => void;
  onDeleteExercise: (index: number) => void;
  onAddExercise: () => void;
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

export function ExerciseTracker({ exercises, previousLogs, onComplete, onBack, onDeleteExercise, onAddExercise }: ExerciseTrackerProps) {
  const { profile } = useAuthContext();
  const restSeconds = profile?.restSeconds ?? 90;

  const {
    currentExerciseIndex,
    setCurrentExerciseIndex,
    inProgressLogs,
    setInProgressLogs,
    currentSets: sets,
    setCurrentSets: setSets,
    restTimerEnd,
    setRestTimerEnd,
  } = useWorkoutContext();

  // Show rest overlay if there's an active timer
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);

  const [showRest, setShowRest] = useState(() => {
    return restTimerEnd !== null && restTimerEnd > Date.now();
  });
  const [restCompleted, setRestCompleted] = useState(false);

  // Sync showRest with restTimerEnd from context (e.g., after page navigation)
  useEffect(() => {
    if (restTimerEnd !== null && restTimerEnd > Date.now()) {
      setShowRest(true);
    }
  }, [restTimerEnd]);

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
    // Unlock audio & request notification permission on user gesture (iOS requirement)
    unlockAudio();
    startAudioKeepAlive();
    requestTimerNotificationPermission();
    // Start rest timer
    setRestCompleted(false);
    const end = Date.now() + restSeconds * 1000;
    setRestTimerEnd(end);
    setShowRest(true);
  };

  const editSet = (index: number) => {
    setSets(
      sets.map((s, i) => (i === index ? { ...s, completed: false, isPR: false } : s))
    );
  };

  const handleRestComplete = () => {
    setRestCompleted(true);
    showRestNotification();
  };

  const dismissRest = () => {
    stopAudioKeepAlive();
    setRestTimerEnd(null);
    setShowRest(false);
    setRestCompleted(false);
  };

  const addSet = () => {
    setSets([
      ...sets,
      { setNumber: sets.length + 1, reps: 0, weight: 0, completed: false, isPR: false },
    ]);
  };

  const removeSet = (index: number) => {
    if (sets.length <= 1) return;
    setSets(
      sets.filter((_, i) => i !== index)
          .map((s, i) => ({ ...s, setNumber: i + 1 }))
    );
  };

  // Build log saving ALL sets (including uncompleted with data)
  const buildLogForCurrentExercise = useCallback((): ExerciseLog => ({
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    sets: sets.map((s): SetLog => ({
      setNumber: s.setNumber,
      reps: s.reps,
      weight: s.weight,
      completed: s.completed,
      isPR: s.isPR ?? false,
    })),
  }), [exercise, sets]);

  const restoreSetsFromLog = useCallback((log: ExerciseLog | undefined, targetExercise: Exercise) => {
    if (log && log.sets.length > 0) {
      setSets(log.sets.map((s): SetRow => ({
        setNumber: s.setNumber,
        reps: s.reps,
        weight: s.weight,
        completed: s.completed,
        isPR: s.isPR ?? false,
      })));
    } else {
      setSets(initSets(targetExercise));
    }
  }, [setSets]);

  // Save current exercise and navigate to a target index
  const navigateToExercise = useCallback((targetIndex: number) => {
    if (targetIndex === currentExerciseIndex || targetIndex < 0 || targetIndex >= exercises.length) return;

    // Save current exercise data at current index
    const exerciseLog = buildLogForCurrentExercise();
    const updatedLogs = [...inProgressLogs];
    updatedLogs[currentExerciseIndex] = exerciseLog;

    setInProgressLogs(updatedLogs);
    setCurrentExerciseIndex(targetIndex);
    restoreSetsFromLog(updatedLogs[targetIndex], exercises[targetIndex]);
  }, [currentExerciseIndex, exercises, inProgressLogs, buildLogForCurrentExercise, setInProgressLogs, setCurrentExerciseIndex, restoreSetsFromLog]);

  const goToNext = useCallback(() => {
    const exerciseLog = buildLogForCurrentExercise();
    const updatedLogs = [...inProgressLogs];
    updatedLogs[currentExerciseIndex] = exerciseLog;

    if (currentExerciseIndex >= exercises.length - 1) {
      // Filter to completed sets only for final submission
      const finalLogs = updatedLogs
        .filter(Boolean)
        .map(log => ({
          ...log,
          sets: log.sets.filter(s => s.completed),
        }))
        .filter(log => log.sets.length > 0);
      onComplete(finalLogs);
    } else {
      setInProgressLogs(updatedLogs);
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      restoreSetsFromLog(updatedLogs[nextIndex], exercises[nextIndex]);
    }
  }, [buildLogForCurrentExercise, inProgressLogs, currentExerciseIndex, exercises, onComplete, setCurrentExerciseIndex, setInProgressLogs, restoreSetsFromLog]);

  const goToPrev = useCallback(() => {
    if (currentExerciseIndex === 0) {
      onBack();
      return;
    }
    navigateToExercise(currentExerciseIndex - 1);
  }, [currentExerciseIndex, navigateToExercise, onBack]);

  const skipExercise = useCallback(() => {
    const exerciseLog = buildLogForCurrentExercise();
    const updatedLogs = [...inProgressLogs];
    updatedLogs[currentExerciseIndex] = exerciseLog;

    if (currentExerciseIndex >= exercises.length - 1) {
      const finalLogs = updatedLogs
        .filter(Boolean)
        .map(log => ({
          ...log,
          sets: log.sets.filter(s => s.completed),
        }))
        .filter(log => log.sets.length > 0);
      onComplete(finalLogs);
    } else {
      setInProgressLogs(updatedLogs);
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      restoreSetsFromLog(updatedLogs[nextIndex], exercises[nextIndex]);
    }
  }, [buildLogForCurrentExercise, inProgressLogs, currentExerciseIndex, exercises, onComplete, setCurrentExerciseIndex, setInProgressLogs, restoreSetsFromLog]);

  if (!exercise) return null;

  const equipmentType = getEquipmentType(exercise.name);
  const isBW = equipmentType === 'bodyweight';
  const isDB = equipmentType === 'dumbbell';
  const hasCompletedSet = sets.some((s) => s.completed);

  return (
    <div className="space-y-4 relative">
      {/* Rest timer overlay */}
      {showRest && restTimerEnd !== null && (
        <div className="fixed inset-0 bg-bg/95 z-50 flex flex-col items-center justify-center gap-6 backdrop-blur-sm">
          {restCompleted ? (
            <>
              {/* Green screen flash */}
              <div className="fixed inset-0 bg-emerald-400/20 pointer-events-none animate-timer-flash" />

              {/* Bell icon */}
              <div className="animate-bounce">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                </div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-4xl font-black text-emerald-400 animate-pulse tracking-tight">
                  TIME'S UP!
                </h2>
                <p className="text-muted text-sm">Get back to your next set</p>
              </div>

              <Button onClick={dismissRest} fullWidth>
                Let's Go!
              </Button>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Rest Timer</p>
              <CircularTimer duration={restSeconds} endTime={restTimerEnd} onComplete={handleRestComplete} size={180} />
              <Button variant="secondary" onClick={dismissRest}>
                Skip Rest
              </Button>
            </>
          )}
        </div>
      )}

      {/* Exercise navigation pills — tap to jump to any exercise */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 items-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {exercises.map((ex, i) => {
          const hasData = inProgressLogs[i] && inProgressLogs[i].sets.some(s => s.completed);
          const isCurrent = i === currentExerciseIndex;
          return (
            <div key={ex.id} className="flex-shrink-0 relative">
              <button
                onClick={() => navigateToExercise(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isCurrent
                    ? `bg-primary text-white ${exercises.length > 1 ? 'pr-7' : ''}`
                    : hasData
                      ? 'bg-success/20 text-success border border-success/30'
                      : 'bg-card/60 text-muted border border-white/[0.06]'
                }`}
              >
                {ex.name.length > 15 ? ex.name.slice(0, 15) + '\u2026' : ex.name}
              </button>
              {isCurrent && exercises.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteIndex(i); }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center hover:bg-red-500/40 transition-colors"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
        <button
          onClick={onAddExercise}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-card/60 border border-dashed border-white/20 flex items-center justify-center text-muted hover:text-primary hover:border-primary/50 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" /><path d="M5 12h14" />
          </svg>
        </button>
      </div>

      {/* Delete exercise confirmation */}
      {confirmDeleteIndex !== null && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-text">
            Remove <span className="font-bold">{exercises[confirmDeleteIndex]?.name}</span>?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDeleteIndex(null)}
              className="px-3 py-1 text-xs font-bold text-muted hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const exerciseLog = buildLogForCurrentExercise();
                const updatedLogs = [...inProgressLogs];
                updatedLogs[currentExerciseIndex] = exerciseLog;
                setInProgressLogs(updatedLogs);
                onDeleteExercise(confirmDeleteIndex);
                setConfirmDeleteIndex(null);
              }}
              className="px-3 py-1 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Back / Previous button */}
      <button onClick={goToPrev} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        {currentExerciseIndex === 0 ? 'Back' : 'Previous Exercise'}
      </button>

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

      {/* Coach recommendation */}
      <div className="flex items-center gap-2.5 bg-primary/[0.08] border border-primary/20 rounded-xl px-3.5 py-2.5">
        <span className="text-base leading-none">🎯</span>
        <div className="flex-1 min-w-0">
          <p className="text-primary text-sm font-bold">
            {exercise.sets} sets × {exercise.reps} reps
          </p>
          <p className="text-muted text-xs mt-0.5">Recommended target</p>
        </div>
      </div>

      {/* Equipment hint */}
      {isBW && (
        <p className="text-muted text-xs italic px-1">
          Enter your body weight + any added weight. For assisted exercises, subtract the assisted weight.
        </p>
      )}
      {isDB && (
        <p className="text-muted text-xs italic px-1">
          Enter weight per dumbbell (one arm).
        </p>
      )}

      {/* Set table */}
      <div className="bg-card/60 border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="grid grid-cols-4 gap-2 px-4 py-2.5 text-xs text-muted font-bold uppercase tracking-wider border-b border-white/[0.06]">
          <span>Set</span>
          <span>Reps</span>
          <span className="flex flex-col">
            <span>Weight</span>
            {isBW && <span className="text-[10px] font-medium normal-case tracking-normal text-muted/70">(body + added)</span>}
            {isDB && <span className="text-[10px] font-medium normal-case tracking-normal text-muted/70">(per dumbbell)</span>}
          </span>
          <span></span>
        </div>
        {sets.map((set, i) => (
          <SwipeableRow
            key={i}
            onDelete={() => removeSet(i)}
            disabled={set.completed || sets.length <= 1}
          >
            <div
              className={`grid grid-cols-4 gap-2 px-4 py-2.5 items-center border-b border-white/[0.04] last:border-0 transition-colors duration-500 ${
                set.completed
                  ? 'bg-success/[0.15] border-l-[3px] border-l-success'
                  : ''
              }`}
            >
              <span className="text-text text-sm font-bold">{set.setNumber}</span>
              <input
                type="number"
                inputMode="numeric"
                value={set.reps || ''}
                onChange={(e) => updateSet(i, 'reps', parseInt(e.target.value) || 0)}
                disabled={set.completed}
                className="bg-bg/50 border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-text text-base w-full min-h-[36px] focus:outline-none focus:border-primary transition-colors"
                placeholder={exercise.reps}
              />
              <input
                type="number"
                inputMode="numeric"
                value={set.weight || ''}
                onChange={(e) => updateSet(i, 'weight', parseInt(e.target.value) || 0)}
                disabled={set.completed}
                className="bg-bg/50 border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-text text-base w-full min-h-[36px] focus:outline-none focus:border-primary transition-colors"
                placeholder="lbs"
              />
              <div className="flex items-center gap-1">
                {set.completed ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {set.isPR && <Badge text="NEW PR!" variant="success" />}
                    <button
                      onClick={() => editSet(i)}
                      className="w-7 h-7 rounded-lg text-muted hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-colors ml-1"
                      title="Edit set"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </button>
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
          </SwipeableRow>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={addSet} className="text-primary text-sm font-bold hover:underline">
          + Add Set
        </button>
        <p className="text-muted text-xs">Swipe left to remove a set</p>
      </div>

      <Button fullWidth disabled={!hasCompletedSet} onClick={goToNext}>
        {currentExerciseIndex >= exercises.length - 1 ? 'Finish Exercises' : 'Next Exercise'}
      </Button>

      {!hasCompletedSet && (
        <button
          onClick={skipExercise}
          className="w-full text-center text-muted text-sm font-semibold hover:text-text transition-colors py-1"
        >
          Skip Exercise
        </button>
      )}
    </div>
  );
}
