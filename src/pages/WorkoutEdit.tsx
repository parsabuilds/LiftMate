import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/ui/Layout';
import { Button } from '../components/ui/Button';
import { useAuthContext } from '../contexts/AuthContext';
import { useDocument, updateDocument } from '../hooks/useFirestore';
import { getEquipmentType, isBodyweight } from '../utils/exerciseEquipment';
import type { WorkoutLog, ExerciseLog, SetLog } from '../types';

export function WorkoutEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const path = user && id ? `users/${user.uid}/workoutLogs/${id}` : null;
  const { data: workoutLog, loading } = useDocument<WorkoutLog>(path);

  // Local editable state — initialized from Firestore data
  const [editedExercises, setEditedExercises] = useState<ExerciseLog[] | null>(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Initialize editable state from loaded data
  const exercises = editedExercises ?? workoutLog?.exercises ?? [];

  const initIfNeeded = useCallback(() => {
    if (!editedExercises && workoutLog) {
      setEditedExercises(
        workoutLog.exercises.map((ex) => ({
          ...ex,
          sets: ex.sets.map((s) => ({ ...s })),
        }))
      );
    }
  }, [editedExercises, workoutLog]);

  // Trigger init when data loads
  if (workoutLog && !editedExercises) {
    initIfNeeded();
  }

  const updateSet = (exerciseIdx: number, setIdx: number, field: 'reps' | 'weight', value: number) => {
    if (!editedExercises) return;
    const updated = editedExercises.map((ex, ei) => {
      if (ei !== exerciseIdx) return ex;
      return {
        ...ex,
        sets: ex.sets.map((s, si) => {
          if (si !== setIdx) return s;
          return { ...s, [field]: value };
        }),
      };
    });
    setEditedExercises(updated);
    setSaved(false);
  };

  const addSet = (exerciseIdx: number) => {
    if (!editedExercises) return;
    const updated = editedExercises.map((ex, ei) => {
      if (ei !== exerciseIdx) return ex;
      const newSet: SetLog = {
        setNumber: ex.sets.length + 1,
        reps: 0,
        weight: 0,
        completed: true,
      };
      return { ...ex, sets: [...ex.sets, newSet] };
    });
    setEditedExercises(updated);
    setSaved(false);
  };

  const removeSet = (exerciseIdx: number, setIdx: number) => {
    if (!editedExercises) return;
    const updated = editedExercises.map((ex, ei) => {
      if (ei !== exerciseIdx) return ex;
      const newSets = ex.sets
        .filter((_, si) => si !== setIdx)
        .map((s, i) => ({ ...s, setNumber: i + 1 }));
      return { ...ex, sets: newSets };
    });
    setEditedExercises(updated);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!user || !id || !editedExercises) return;
    setSaving(true);
    setSaveError(null);
    try {
      // Filter out sets with zero reps (allow weight=0 for bodyweight exercises)
      const cleanedExercises = editedExercises
        .map((ex) => ({
          ...ex,
          sets: ex.sets.filter((s) => s.reps > 0 && (s.weight > 0 || isBodyweight(ex.exerciseName))),
        }))
        .filter((ex) => ex.sets.length > 0);

      await updateDocument(`users/${user.uid}/workoutLogs/${id}`, {
        exercises: cleanedExercises,
      });
      setSaved(true);
    } catch (err) {
      console.error('Failed to update workout:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!workoutLog) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-text font-semibold">Workout not found</p>
          <button onClick={() => navigate('/')} className="text-primary text-sm font-semibold mt-3 hover:underline">
            Go Home
          </button>
        </div>
      </Layout>
    );
  }

  const activeExercise = exercises[activeExerciseIndex];
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const totalVolume = exercises.reduce(
    (sum, ex) => sum + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0),
    0
  );
  const duration = workoutLog.completedAt && workoutLog.startedAt
    ? Math.floor((workoutLog.completedAt - workoutLog.startedAt) / 1000)
    : 0;
  const durationMin = Math.floor(duration / 60);

  return (
    <Layout>
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-primary/[0.07] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <h1 className="text-3xl font-black text-text tracking-tight">Edit Workout</h1>

        {/* Workout meta */}
        <div className="flex items-center gap-3 text-sm text-muted">
          <span className="font-bold text-text">{workoutLog.dayType}</span>
          <span>·</span>
          <span>{workoutLog.date}</span>
          {durationMin > 0 && (
            <>
              <span>·</span>
              <span>{durationMin} min</span>
            </>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-card/60 border border-white/[0.06] rounded-xl p-3 text-center">
            <p className="text-xs text-muted font-semibold uppercase tracking-wider">Exercises</p>
            <p className="text-lg font-black text-text mt-0.5">{exercises.length}</p>
          </div>
          <div className="bg-card/60 border border-white/[0.06] rounded-xl p-3 text-center">
            <p className="text-xs text-muted font-semibold uppercase tracking-wider">Sets</p>
            <p className="text-lg font-black text-text mt-0.5">{totalSets}</p>
          </div>
          <div className="bg-card/60 border border-white/[0.06] rounded-xl p-3 text-center">
            <p className="text-xs text-muted font-semibold uppercase tracking-wider">Volume</p>
            <p className="text-lg font-black text-text mt-0.5">{totalVolume.toLocaleString()}</p>
          </div>
        </div>

        {/* Exercise navigation pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {exercises.map((ex, i) => (
            <button
              key={ex.exerciseId + i}
              onClick={() => setActiveExerciseIndex(i)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                i === activeExerciseIndex
                  ? 'bg-primary text-white'
                  : 'bg-card/60 text-muted border border-white/[0.06]'
              }`}
            >
              {ex.exerciseName.length > 15 ? ex.exerciseName.slice(0, 15) + '\u2026' : ex.exerciseName}
            </button>
          ))}
        </div>

        {/* Active exercise edit */}
        {activeExercise && (() => {
          const eqType = getEquipmentType(activeExercise.exerciseName);
          const isBW = eqType === 'bodyweight';
          const isDB = eqType === 'dumbbell';
          return (
          <div className="space-y-3">
            <h3 className="text-text font-black text-xl tracking-tight">{activeExercise.exerciseName}</h3>

            {/* Equipment hint */}
            {isBW && (
              <p className="text-muted text-xs italic">
                Bodyweight exercise — weight is optional. If adding weight, enter total (body + added).
              </p>
            )}
            {isDB && (
              <p className="text-muted text-xs italic">
                Enter weight per dumbbell (one arm).
              </p>
            )}

            {/* Set table */}
            <div className="bg-card/60 border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="grid grid-cols-[1fr_2fr_2fr_auto] gap-2 px-4 py-2.5 text-xs text-muted font-bold uppercase tracking-wider border-b border-white/[0.06]">
                <span>Set</span>
                <span>Reps</span>
                <span className="flex flex-col">
                  <span>Weight</span>
                  {isBW && <span className="text-[10px] font-medium normal-case tracking-normal text-muted/70">(optional)</span>}
                  {isDB && <span className="text-[10px] font-medium normal-case tracking-normal text-muted/70">(per dumbbell)</span>}
                </span>
                <span></span>
              </div>
              {activeExercise.sets.map((set, si) => (
                <div
                  key={si}
                  className="grid grid-cols-[1fr_2fr_2fr_auto] gap-2 px-4 py-2.5 items-center border-b border-white/[0.04] last:border-0"
                >
                  <span className="text-text text-sm font-bold">{set.setNumber}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={set.reps || ''}
                    onChange={(e) => updateSet(activeExerciseIndex, si, 'reps', parseInt(e.target.value) || 0)}
                    className="bg-bg/50 border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-text text-base w-full min-h-[36px] focus:outline-none focus:border-primary transition-colors"
                    placeholder="reps"
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    value={set.weight || ''}
                    onChange={(e) => updateSet(activeExerciseIndex, si, 'weight', parseInt(e.target.value) || 0)}
                    className="bg-bg/50 border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-text text-base w-full min-h-[36px] focus:outline-none focus:border-primary transition-colors"
                    placeholder={isBW ? '+lbs' : 'lbs'}
                  />
                  <button
                    onClick={() => removeSet(activeExerciseIndex, si)}
                    className="w-8 h-8 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/10 flex items-center justify-center transition-colors"
                    title="Remove set"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => addSet(activeExerciseIndex)} className="text-primary text-sm font-bold hover:underline">
              + Add Set
            </button>
          </div>
          );
        })()}

        {/* Error display */}
        {saveError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
            {saveError}
          </div>
        )}

        {/* Save button */}
        <Button fullWidth onClick={handleSave} disabled={saving || saved}>
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </Layout>
  );
}
