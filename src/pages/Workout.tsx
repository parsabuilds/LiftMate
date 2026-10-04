import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/ui/Layout';
import { Button } from '../components/ui/Button';
import { DaySelector } from '../components/workout/DaySelector';
import { ExerciseSelector } from '../components/workout/ExerciseSelector';
import { SupersetPairing } from '../components/workout/SupersetPairing';
import { WarmupCarousel } from '../components/workout/WarmupCarousel';
import { ExerciseTracker } from '../components/workout/ExerciseTracker';
import { CardioAbsSelector } from '../components/workout/CardioAbsSelector';
import { WorkoutSummary } from '../components/workout/WorkoutSummary';
import { AddExerciseModal } from '../components/workout/AddExerciseModal';
import { useAuthContext } from '../contexts/AuthContext';
import { useWorkoutContext } from '../contexts/WorkoutContext';
import { initExerciseLog, buildStations } from '../utils/superset';
import { useCollection, useDocument } from '../hooks/useFirestore';
import { addDocument } from '../hooks/useFirestore';
import { getRoutineByGender } from '../data/defaultRoutines';
import { exerciseKey } from '../data/exerciseLibrary';
import { getLocalDateString } from '../utils/date';
import type { WorkoutStep, DayType, Exercise, ExerciseLog, WorkoutLog, Routine, PostWorkoutActivities, SupersetPair } from '../types';

const STEP_ORDER: WorkoutStep[] = ['daySelect', 'exerciseSelect', 'supersetPair', 'warmup', 'logging', 'cardioAbs', 'summary'];

function stepIndex(step: WorkoutStep): number {
  return STEP_ORDER.indexOf(step);
}

// Reorder in-progress logs to match a new exercise arrangement, keeping any
// sets already logged and seeding fresh logs for unseen exercises.
function alignLogs(exercises: Exercise[], logs: ExerciseLog[]): ExerciseLog[] {
  const byId = new Map(logs.filter(Boolean).map((l) => [l.exerciseId, l]));
  return exercises.map((ex) => byId.get(ex.id) ?? initExerciseLog(ex));
}

export function Workout() {
  const { user, profile } = useAuthContext();
  const navigate = useNavigate();

  const {
    currentStep, setCurrentStep,
    selectedDayType, setSelectedDayType,
    routineDay, setRoutineDay,
    selectedExercises, setSelectedExercises,
    exerciseLogs, setExerciseLogs,
    postWorkout, setPostWorkout,
    startTime,
    isRest, setIsRest,
    clearWorkout,
    currentStationIndex, setCurrentStationIndex,
    inProgressLogs, setInProgressLogs,
    firstSetConfirmedAt,
    supersetPairs, setSupersetPairs,
    resetStartTime,
  } = useWorkoutContext();

  const { data: firestoreRoutine } = useDocument<Routine>(
    user ? `users/${user.uid}/routine/current` : null
  );

  const routine = useMemo(() => {
    const gender = profile?.gender ?? 'male';
    if (!firestoreRoutine || firestoreRoutine.id === 'mens-ppl' || firestoreRoutine.id === 'womens-fbs') {
      return getRoutineByGender(gender);
    }
    return firestoreRoutine;
  }, [firestoreRoutine, profile?.gender]);

  const { data: previousWorkouts } = useCollection<WorkoutLog>(
    user ? `users/${user.uid}/workoutLogs` : null
  );

  const todaysLogs = useMemo(() => {
    const today = getLocalDateString();
    return previousWorkouts
      .filter((w) => w.date === today && w.completedAt)
      .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
  }, [previousWorkouts]);

  // Most recent log per exercise across the full history, regardless of day
  // type — so "last time" hints also work in mixed superset sessions. Keyed
  // by exercise name, so history carries over however the exercise was added.
  const previousLogsByExercise = useMemo(() => {
    const latest: Record<string, { at: number; log: ExerciseLog }> = {};
    for (const w of previousWorkouts) {
      const at = w.startedAt ?? 0;
      for (const ex of w.exercises) {
        if (!ex.sets.length) continue;
        const key = exerciseKey(ex.exerciseName);
        const current = latest[key];
        if (!current || at > current.at) latest[key] = { at, log: ex };
      }
    }
    return Object.fromEntries(Object.entries(latest).map(([key, v]) => [key, v.log]));
  }, [previousWorkouts]);

  // All-time best (heaviest completed) weight per exercise name, across the
  // full history regardless of day type. Used to flag a set as a PR.
  const bestWeightByExercise = useMemo(() => {
    const best: Record<string, number> = {};
    for (const w of previousWorkouts) {
      for (const ex of w.exercises) {
        const key = exerciseKey(ex.exerciseName);
        for (const s of ex.sets) {
          if (!s.completed) continue;
          if (s.weight > (best[key] ?? 0)) best[key] = s.weight;
        }
      }
    }
    return best;
  }, [previousWorkouts]);

  const prs = useMemo(() => {
    return exerciseLogs.flatMap((log) =>
      log.sets
        .filter((s) => s.isPR)
        .map((s) => ({ exerciseName: log.exerciseName, weight: s.weight, reps: s.reps }))
    );
  }, [exerciseLogs]);

  const warmupsEnabled = profile?.showWarmups !== false;

  const handleDaySelect = (day: DayType | 'rest') => {
    if (day === 'rest') {
      resetStartTime();
      setIsRest(true);
      return;
    }
    const found = routine.days.find((d) => d.dayType === day);
    if (found) {
      resetStartTime();
      setSelectedDayType(day);
      setRoutineDay(found);
      setSupersetPairs([]);
      setCurrentStep('exerciseSelect');
    }
  };

  const handleExerciseSelect = (selected: Record<string, Exercise[]>, buildSupersets: boolean) => {
    const flat: Exercise[] = [];
    const seen = new Set<string>();
    for (const ex of Object.values(selected).flat()) {
      if (seen.has(ex.id)) continue;
      seen.add(ex.id);
      flat.push(ex);
    }

    setSelectedExercises(flat);
    setSupersetPairs([]);
    setInProgressLogs(flat.map(initExerciseLog));
    setCurrentStationIndex(0);
    if (buildSupersets) {
      setCurrentStep('supersetPair');
    } else if (warmupsEnabled) {
      setCurrentStep('warmup');
    } else {
      setCurrentStep('logging');
    }
  };

  const handlePairingConfirm = (ordered: Exercise[], pairs: SupersetPair[]) => {
    setSelectedExercises(ordered);
    setSupersetPairs(pairs);
    setInProgressLogs(alignLogs(ordered, inProgressLogs));
    setCurrentStationIndex(0);
    if (warmupsEnabled) {
      setCurrentStep('warmup');
    } else {
      setCurrentStep('logging');
    }
  };

  const handleWarmupComplete = () => {
    setCurrentStep('logging');
  };

  const handleLoggingComplete = (logs: ExerciseLog[]) => {
    setExerciseLogs(logs);
    setCurrentStep('cardioAbs');
  };

  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);

  const handleDeleteExercise = useCallback((indexToDelete: number) => {
    const deleted = selectedExercises[indexToDelete];
    if (!deleted) return;

    const newExercises = selectedExercises.filter((_, i) => i !== indexToDelete);
    const newLogs = inProgressLogs.filter((_, i) => i !== indexToDelete);
    const newPairs = supersetPairs.filter((p) => p.a !== deleted.id && p.b !== deleted.id);

    if (newExercises.length === 0) {
      setExerciseLogs([]);
      setSelectedExercises([]);
      setInProgressLogs([]);
      setSupersetPairs(newPairs);
      setCurrentStationIndex(0);
      setCurrentStep('cardioAbs');
      return;
    }

    // Land on the station that still holds the rest of the current station's
    // exercises (a pair partner survives a delete), else clamp.
    const oldStations = buildStations(selectedExercises, supersetPairs);
    const oldIndex = Math.max(0, Math.min(currentStationIndex, oldStations.length - 1));
    const survivingId = oldStations[oldIndex].indices
      .map((i) => selectedExercises[i].id)
      .find((id) => id !== deleted.id);

    const newStations = buildStations(newExercises, newPairs);
    let newIndex = Math.min(oldIndex, newStations.length - 1);
    if (survivingId) {
      const found = newStations.findIndex((st) => st.indices.some((i) => newExercises[i].id === survivingId));
      if (found >= 0) newIndex = found;
    }

    setSelectedExercises(newExercises);
    setInProgressLogs(newLogs);
    setSupersetPairs(newPairs);
    setCurrentStationIndex(newIndex);
  }, [selectedExercises, inProgressLogs, supersetPairs, currentStationIndex, setSelectedExercises, setInProgressLogs, setSupersetPairs, setCurrentStationIndex, setExerciseLogs, setCurrentStep]);

  const handleAddExercise = useCallback((exercise: Exercise) => {
    setSelectedExercises([...selectedExercises, exercise]);
    setInProgressLogs([...inProgressLogs, initExerciseLog(exercise)]);
  }, [selectedExercises, inProgressLogs, setSelectedExercises, setInProgressLogs]);

  const handlePostWorkoutSelect = (activities: PostWorkoutActivities) => {
    setPostWorkout(activities);
    setCurrentStep('summary');
  };

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [dismissedSummary, setDismissedSummary] = useState(false);

  const handleSave = async (energyRating: number) => {
    if (!user || !selectedDayType) return;
    setSaving(true);
    setSaveError(null);
    try {
      // Stamp superset groups onto exercises whose pair partner was also
      // logged, so history can show what was performed together.
      let exercisesToSave: ExerciseLog[] = exerciseLogs;
      let supersetCount = 0;
      if (supersetPairs.length > 0) {
        const loggedIds = new Set(exerciseLogs.map((l) => l.exerciseId));
        const groupOf: Record<string, number> = {};
        for (const pair of supersetPairs) {
          if (loggedIds.has(pair.a) && loggedIds.has(pair.b)) {
            supersetCount += 1;
            groupOf[pair.a] = supersetCount;
            groupOf[pair.b] = supersetCount;
          }
        }
        exercisesToSave = exerciseLogs.map((l) =>
          groupOf[l.exerciseId] ? { ...l, supersetGroup: groupOf[l.exerciseId] } : l
        );
      }

      const workoutLog: Record<string, unknown> = {
        date: getLocalDateString(firstSetConfirmedAt ? new Date(firstSetConfirmedAt) : undefined),
        dayType: selectedDayType,
        startedAt: startTime,
        completedAt: Date.now(),
        exercises: exercisesToSave,
        energyRating,
      };
      if (supersetCount > 0) {
        workoutLog.isSuperset = true;
      }
      if (Object.keys(postWorkout).length > 0) {
        workoutLog.postWorkout = postWorkout;
      }
      await addDocument(`users/${user.uid}/workoutLogs`, workoutLog);
      clearWorkout();
      navigate('/');
    } catch (err) {
      console.error('Failed to save workout:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save workout');
      setSaving(false);
    }
  };

  // Rest day
  if (isRest) {
    return (
      <Layout>
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-primary/[0.07] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-text tracking-tight mb-6">Rest Day</h1>
          <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-8 text-center backdrop-blur-sm">
            <div className="text-5xl mb-4">{'😴'}</div>
            <h2 className="text-xl font-bold text-text mb-2">Enjoy Your Rest Day</h2>
            <p className="text-muted">Recovery is when your muscles grow. Take it easy today!</p>
            <button
              onClick={() => { setIsRest(false); setCurrentStep('daySelect'); }}
              className="mt-4 text-primary text-sm font-semibold hover:underline"
            >
              {'←'} Choose a different day
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const goBack = () => {
    // Summary -> CardioAbs
    if (currentStep === 'summary') {
      setCurrentStep('cardioAbs');
      return;
    }
    // CardioAbs -> Logging (logs are live in context; land on the last station)
    if (currentStep === 'cardioAbs' && selectedExercises.length > 0) {
      const stations = buildStations(selectedExercises, supersetPairs);
      setCurrentStationIndex(Math.max(0, stations.length - 1));
      setCurrentStep('logging');
      return;
    }
    // Logging -> warmup / pairing / exercise select
    if (currentStep === 'logging') {
      if (warmupsEnabled) {
        setCurrentStep('warmup');
      } else if (supersetPairs.length > 0) {
        setCurrentStep('supersetPair');
      } else {
        setCurrentStep('exerciseSelect');
      }
      return;
    }
    // Warmup -> pairing when supersets were built, exercise select otherwise
    if (currentStep === 'warmup') {
      setCurrentStep(supersetPairs.length > 0 ? 'supersetPair' : 'exerciseSelect');
      return;
    }
    const idx = stepIndex(currentStep);
    if (idx > 0) {
      setCurrentStep(STEP_ORDER[idx - 1]);
    }
  };

  const workoutPhase: 'pre' | 'main' | 'post' =
    currentStep === 'logging' ? 'main'
    : currentStep === 'cardioAbs' || currentStep === 'summary' ? 'post'
    : 'pre';

  const titles: Record<WorkoutStep, string> = {
    daySelect: 'Workout',
    exerciseSelect: 'Choose Exercises',
    supersetPair: 'Build Supersets',
    warmup: 'Stretches',
    logging: selectedDayType ?? 'Workout',
    cardioAbs: 'Post-Workout',
    summary: 'Workout Complete',
  };

  return (
    <Layout>
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-primary/[0.07] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Page header */}
        <h1 className="text-3xl font-black text-text tracking-tight mb-2">{titles[currentStep]}</h1>

        {/* Workout phase indicator — hidden on daySelect and exerciseSelect */}
        {currentStep !== 'daySelect' && currentStep !== 'exerciseSelect' && <div className="flex items-center gap-1.5 mb-5">
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-full h-1.5 rounded-full transition-all duration-300 ${
              workoutPhase === 'pre' ? 'bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-white/[0.08]'
            }`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              workoutPhase === 'pre' ? 'text-primary' : 'text-muted/50'
            }`}>Warm-Up</span>
          </div>
          <div className="flex-[2] flex flex-col items-center gap-1">
            <div className={`w-full h-1.5 rounded-full transition-all duration-300 ${
              workoutPhase === 'main' ? 'bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-white/[0.08]'
            }`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              workoutPhase === 'main' ? 'text-primary' : 'text-muted/50'
            }`}>Workout</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-full h-1.5 rounded-full transition-all duration-300 ${
              workoutPhase === 'post' ? 'bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-white/[0.08]'
            }`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${
              workoutPhase === 'post' ? 'text-primary' : 'text-muted/50'
            }`}>Cool-Down</span>
          </div>
        </div>}

        {/* Back button — shown for exerciseSelect, supersetPair and warmup (other steps have their own) */}
        {(currentStep === 'exerciseSelect' || currentStep === 'supersetPair' || currentStep === 'warmup') && (
          <button onClick={goBack} className="text-primary text-sm font-semibold mb-4 hover:underline flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}

        {currentStep === 'daySelect' && (
          todaysLogs.length > 0 && !dismissedSummary ? (
            <div className="space-y-4">
              {todaysLogs.map((log) => (
                <div key={log.id} className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-xs font-bold uppercase tracking-wider text-success">
                      Workout Completed
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-text tracking-tight">
                    {log.dayType}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-bg/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted font-semibold uppercase">Exercises</p>
                      <p className="text-lg font-black text-text">{log.exercises.length}</p>
                    </div>
                    <div className="bg-bg/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted font-semibold uppercase">Sets</p>
                      <p className="text-lg font-black text-text">
                        {log.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)}
                      </p>
                    </div>
                    <div className="bg-bg/50 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted font-semibold uppercase">Volume</p>
                      <p className="text-lg font-black text-text">
                        {log.exercises.reduce(
                          (sum, ex) => sum + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0), 0
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button fullWidth variant="secondary" onClick={() => navigate(`/workout/edit/${log.id}`)}>
                    View & Edit
                  </Button>
                </div>
              ))}
              <Button fullWidth onClick={() => setDismissedSummary(true)}>
                Start Another Workout
              </Button>
            </div>
          ) : (
            <DaySelector routine={routine} onSelectDay={handleDaySelect} />
          )
        )}

        {currentStep === 'exerciseSelect' && routineDay && (
          <ExerciseSelector
            muscleGroups={routineDay.muscleGroups}
            onComplete={handleExerciseSelect}
          />
        )}

        {currentStep === 'supersetPair' && (
          <SupersetPairing
            exercises={selectedExercises}
            pairs={supersetPairs}
            onConfirm={handlePairingConfirm}
          />
        )}

        {currentStep === 'warmup' && routineDay && (
          <WarmupCarousel warmups={routineDay.warmups} onComplete={handleWarmupComplete} />
        )}

        {currentStep === 'logging' && (
          <>
            <ExerciseTracker
              exercises={selectedExercises}
              supersetPairs={supersetPairs}
              previousLogs={previousLogsByExercise}
              bestWeights={bestWeightByExercise}
              onComplete={handleLoggingComplete}
              onBack={goBack}
              onDeleteExercise={handleDeleteExercise}
              onAddExercise={() => setShowAddExerciseModal(true)}
            />
            <AddExerciseModal
              isOpen={showAddExerciseModal}
              onClose={() => setShowAddExerciseModal(false)}
              onAdd={handleAddExercise}
              selectedExercises={selectedExercises}
              routineDay={routineDay}
              routine={routine}
            />
          </>
        )}

        {currentStep === 'cardioAbs' && (
          <CardioAbsSelector
            initial={postWorkout}
            onSelect={handlePostWorkoutSelect}
            onBack={goBack}
          />
        )}

        {currentStep === 'summary' && (
          <WorkoutSummary
            startTime={startTime}
            exercises={exerciseLogs}
            prs={prs}
            onSave={handleSave}
            onBack={goBack}
            saving={saving}
            saveError={saveError}
          />
        )}
      </div>
    </Layout>
  );
}
