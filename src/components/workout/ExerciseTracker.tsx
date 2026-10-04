import { useState, useEffect, useMemo, useCallback } from 'react';
import YouTubeThumb from '../ui/YouTubeThumb';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SwipeableRow } from '../ui/SwipeableRow';
import { WeightInput } from '../ui/WeightInput';
import { useWorkoutContext } from '../../contexts/WorkoutContext';
import { getEquipmentType } from '../../utils/exerciseEquipment';
import { initExerciseLog, buildStations } from '../../utils/superset';
import { flagPRSets } from '../../utils/prs';
import { exerciseKey, getVideoId } from '../../data/exerciseLibrary';
import type { Exercise, ExerciseLog, SetLog, SupersetPair } from '../../types';

interface ExerciseTrackerProps {
  exercises: Exercise[];
  supersetPairs: SupersetPair[];
  // Both keyed by exerciseKey(name)
  previousLogs?: Record<string, ExerciseLog>;
  bestWeights?: Record<string, number>;
  onComplete: (logs: ExerciseLog[]) => void;
  onBack: () => void;
  onDeleteExercise: (index: number) => void;
  onAddExercise: () => void;
}

function truncate(name: string, max: number): string {
  return name.length > max ? name.slice(0, max) + '…' : name;
}

interface ExercisePanelProps {
  exercise: Exercise;
  sets: SetLog[];
  prevLog?: ExerciseLog;
  onUpdateReps: (setIdx: number, value: string) => void;
  onUpdateWeight: (setIdx: number, value: number) => void;
  onConfirmSet: (setIdx: number) => void;
  onEditSet: (setIdx: number) => void;
  onAddSet: () => void;
  onRemoveSet: (setIdx: number) => void;
}

function ExercisePanel({ exercise, sets, prevLog, onUpdateReps, onUpdateWeight, onConfirmSet, onEditSet, onAddSet, onRemoveSet }: ExercisePanelProps) {
  const equipmentType = getEquipmentType(exercise.name);
  const isBW = equipmentType === 'bodyweight';
  const isDB = equipmentType === 'dumbbell';
  const videoId = getVideoId(exercise);

  // Flag superset history so a lighter previous weight isn't read as a
  // standalone-set benchmark.
  const prevHint = prevLog
    ? `Last time: ${prevLog.sets.length}x${prevLog.sets[0]?.reps ?? '?'} @ ${prevLog.sets[0]?.weight ?? '?'} lbs${prevLog.supersetGroup ? ' · ⚡ as superset' : ''}`
    : null;

  return (
    <div className="space-y-4">
      {/* Exercise info */}
      <div className="flex items-start gap-3">
        {videoId && (
          <YouTubeThumb youtubeId={videoId} exerciseName={exercise.name} size="md" />
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
            onDelete={() => onRemoveSet(i)}
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
                onChange={(e) => onUpdateReps(i, e.target.value)}
                disabled={set.completed}
                className="bg-bg/50 border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-text text-base w-full min-h-[36px] focus:outline-none focus:border-primary transition-colors"
                placeholder={exercise.reps}
              />
              <WeightInput
                value={set.weight}
                onChange={(value) => onUpdateWeight(i, value)}
                disabled={set.completed}
              />
              <div className="flex items-center gap-1">
                {set.completed ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {set.isPR && <Badge text="NEW PR!" variant="success" />}
                    <button
                      onClick={() => onEditSet(i)}
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
                    onClick={() => onConfirmSet(i)}
                    disabled={set.reps <= 0 || set.weight <= 0}
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
        <button onClick={onAddSet} className="text-primary text-sm font-bold hover:underline">
          + Add Set
        </button>
        <p className="text-muted text-xs">Swipe left to remove a set</p>
      </div>
    </div>
  );
}

export function ExerciseTracker({ exercises, supersetPairs, previousLogs, bestWeights, onComplete, onBack, onDeleteExercise, onAddExercise }: ExerciseTrackerProps) {
  const {
    currentStationIndex,
    setCurrentStationIndex,
    inProgressLogs,
    updateInProgressLog,
    setInProgressLogs,
    firstSetConfirmedAt,
    setFirstSetConfirmedAt,
  } = useWorkoutContext();

  const [confirmDeleteStation, setConfirmDeleteStation] = useState<number | null>(null);

  const stations = useMemo(() => buildStations(exercises, supersetPairs), [exercises, supersetPairs]);
  const stationIndex = Math.max(0, Math.min(currentStationIndex, stations.length - 1));
  const station = stations[stationIndex];

  // Keep inProgressLogs aligned with the exercise list (covers sessions started
  // before logs were seeded up-front, and any add/delete drift)
  useEffect(() => {
    const aligned =
      inProgressLogs.length === exercises.length &&
      exercises.every((ex, i) => inProgressLogs[i]?.exerciseId === ex.id);
    if (!aligned) {
      const byId = new Map(inProgressLogs.filter(Boolean).map((l) => [l.exerciseId, l]));
      setInProgressLogs(exercises.map((ex) => byId.get(ex.id) ?? initExerciseLog(ex)));
    }
  }, [exercises, inProgressLogs, setInProgressLogs]);

  // Clamp persisted station index if the station list shrank
  useEffect(() => {
    if (stations.length > 0 && currentStationIndex > stations.length - 1) {
      setCurrentStationIndex(stations.length - 1);
    }
  }, [stations.length, currentStationIndex, setCurrentStationIndex]);

  const mutateSets = useCallback((exIdx: number, mut: (sets: SetLog[]) => SetLog[]) => {
    const log = inProgressLogs[exIdx];
    if (!log) return;
    updateInProgressLog(exIdx, { ...log, sets: mut(log.sets) });
  }, [inProgressLogs, updateInProgressLog]);

  const updateReps = useCallback((exIdx: number, setIdx: number, value: string) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    mutateSets(exIdx, (sets) => sets.map((s, i) => (i === setIdx ? { ...s, reps: numValue } : s)));
  }, [mutateSets]);

  const updateWeight = useCallback((exIdx: number, setIdx: number, value: number) => {
    mutateSets(exIdx, (sets) => sets.map((s, i) => (i === setIdx ? { ...s, weight: value } : s)));
  }, [mutateSets]);

  const bestWeightFor = useCallback((exIdx: number) => {
    const exercise = exercises[exIdx];
    return (exercise && bestWeights?.[exerciseKey(exercise.name)]) || 0;
  }, [exercises, bestWeights]);

  const confirmSet = useCallback((exIdx: number, setIdx: number) => {
    if (firstSetConfirmedAt === null) {
      setFirstSetConfirmedAt(Date.now());
    }
    mutateSets(exIdx, (sets) =>
      flagPRSets(sets.map((s, i) => (i === setIdx ? { ...s, completed: true } : s)), bestWeightFor(exIdx))
    );
  }, [firstSetConfirmedAt, setFirstSetConfirmedAt, bestWeightFor, mutateSets]);

  const editSet = useCallback((exIdx: number, setIdx: number) => {
    mutateSets(exIdx, (sets) =>
      flagPRSets(sets.map((s, i) => (i === setIdx ? { ...s, completed: false } : s)), bestWeightFor(exIdx))
    );
  }, [mutateSets, bestWeightFor]);

  const addSet = useCallback((exIdx: number) => {
    mutateSets(exIdx, (sets) => [
      ...sets,
      { setNumber: sets.length + 1, reps: 0, weight: 0, completed: false, isPR: false },
    ]);
  }, [mutateSets]);

  const removeSet = useCallback((exIdx: number, setIdx: number) => {
    mutateSets(exIdx, (sets) => {
      if (sets.length <= 1) return sets;
      return sets.filter((_, i) => i !== setIdx).map((s, i) => ({ ...s, setNumber: i + 1 }));
    });
  }, [mutateSets]);

  const finishLogs = useCallback((): ExerciseLog[] => {
    return inProgressLogs
      .filter(Boolean)
      .map((log) => ({ ...log, sets: log.sets.filter((s) => s.completed) }))
      .filter((log) => log.sets.length > 0);
  }, [inProgressLogs]);

  const goToNext = useCallback(() => {
    if (stationIndex >= stations.length - 1) {
      onComplete(finishLogs());
    } else {
      setCurrentStationIndex(stationIndex + 1);
    }
  }, [stationIndex, stations.length, onComplete, finishLogs, setCurrentStationIndex]);

  const goToPrev = useCallback(() => {
    if (stationIndex === 0) {
      onBack();
      return;
    }
    setCurrentStationIndex(stationIndex - 1);
  }, [stationIndex, setCurrentStationIndex, onBack]);

  if (!station || station.indices.some((i) => !exercises[i])) return null;

  const isPair = station.indices.length === 2;
  const stationExercises = station.indices.map((i) => exercises[i]);
  const hasCompletedSet = station.indices.some((i) =>
    inProgressLogs[i]?.sets.some((s) => s.completed)
  );
  const isLastStation = stationIndex >= stations.length - 1;
  const nextIsPair = !isLastStation && stations[stationIndex + 1].indices.length === 2;
  const prevIsPair = stationIndex > 0 && stations[stationIndex - 1].indices.length === 2;

  return (
    <div className="space-y-4 relative">
      {/* Station navigation pills — tap to jump to any station */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 items-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {stations.map((st, i) => {
          const pair = st.indices.length === 2;
          const hasData = st.indices.some((idx) => inProgressLogs[idx]?.sets.some((s) => s.completed));
          const isCurrent = i === stationIndex;
          const label = pair
            ? `${truncate(exercises[st.indices[0]].name, 10)} ⚡ ${truncate(exercises[st.indices[1]].name, 10)}`
            : truncate(exercises[st.indices[0]].name, 15);
          return (
            <div key={st.indices.map((idx) => exercises[idx].id).join('+')} className="flex-shrink-0 relative">
              <button
                onClick={() => setCurrentStationIndex(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isCurrent
                    ? `${pair ? 'bg-violet-600' : 'bg-primary'} text-white ${exercises.length > 1 ? 'pr-7' : ''}`
                    : hasData
                      ? 'bg-success/20 text-success border border-success/30'
                      : pair
                        ? 'bg-card/60 text-violet-300/80 border border-violet-500/25'
                        : 'bg-card/60 text-muted border border-white/[0.06]'
                }`}
              >
                {label}
              </button>
              {isCurrent && exercises.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteStation(i); }}
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
      {confirmDeleteStation !== null && stations[confirmDeleteStation] && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 space-y-2">
          {stations[confirmDeleteStation].indices.map((exIdx) => (
            <div key={exercises[exIdx].id} className="flex items-center justify-between gap-2">
              <p className="text-sm text-text">
                Remove <span className="font-bold">{exercises[exIdx].name}</span>?
              </p>
              <button
                onClick={() => {
                  onDeleteExercise(exIdx);
                  setConfirmDeleteStation(null);
                }}
                className="px-3 py-1 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              onClick={() => setConfirmDeleteStation(null)}
              className="px-3 py-1 text-xs font-bold text-muted hover:text-text transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Back / Previous button */}
      <button onClick={goToPrev} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        {stationIndex === 0 ? 'Back' : prevIsPair ? 'Previous Superset' : 'Previous Exercise'}
      </button>

      {/* Superset guidance banner */}
      {isPair && (
        <div className="flex items-center gap-2.5 bg-violet-500/[0.08] border border-violet-500/25 rounded-xl px-3.5 py-2.5">
          <span className="text-base leading-none">{'⚡'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-violet-300 text-sm font-bold">Superset</p>
            <p className="text-muted text-xs mt-0.5">
              Alternate: 1 set of {stationExercises[0].name}, then 1 set of {stationExercises[1].name}. Rest, repeat.
            </p>
          </div>
        </div>
      )}

      {/* Exercise panel(s) */}
      {station.indices.map((exIdx, panelIdx) => (
        <div key={exercises[exIdx].id} className="space-y-4">
          {panelIdx > 0 && (
            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 h-px bg-violet-500/25" />
              <span className="text-violet-300 text-xs font-bold tracking-wider">{'⚡'} THEN</span>
              <div className="flex-1 h-px bg-violet-500/25" />
            </div>
          )}
          <ExercisePanel
            exercise={exercises[exIdx]}
            sets={inProgressLogs[exIdx]?.sets ?? []}
            prevLog={previousLogs?.[exerciseKey(exercises[exIdx].name)]}
            onUpdateReps={(setIdx, value) => updateReps(exIdx, setIdx, value)}
            onUpdateWeight={(setIdx, value) => updateWeight(exIdx, setIdx, value)}
            onConfirmSet={(setIdx) => confirmSet(exIdx, setIdx)}
            onEditSet={(setIdx) => editSet(exIdx, setIdx)}
            onAddSet={() => addSet(exIdx)}
            onRemoveSet={(setIdx) => removeSet(exIdx, setIdx)}
          />
        </div>
      ))}

      <Button fullWidth disabled={!hasCompletedSet} onClick={goToNext}>
        {isLastStation ? 'Finish Exercises' : nextIsPair ? 'Next Superset' : 'Next Exercise'}
      </Button>

      {!hasCompletedSet && (
        <button
          onClick={goToNext}
          className="w-full text-center text-muted text-sm font-semibold hover:text-text transition-colors py-1"
        >
          {isPair ? 'Skip Superset' : 'Skip Exercise'}
        </button>
      )}
    </div>
  );
}
