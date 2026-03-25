import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/ui/Layout';
import { Button } from '../components/ui/Button';
import { DaySelector } from '../components/workout/DaySelector';
import { ExerciseSelector } from '../components/workout/ExerciseSelector';
import { WarmupCarousel } from '../components/workout/WarmupCarousel';
import { ExerciseTracker } from '../components/workout/ExerciseTracker';
import { CardioAbsSelector } from '../components/workout/CardioAbsSelector';
import { WorkoutSummary } from '../components/workout/WorkoutSummary';
import { AddExerciseModal } from '../components/workout/AddExerciseModal';
import { useAuthContext } from '../contexts/AuthContext';
import { useWorkoutContext } from '../contexts/WorkoutContext';
import { useCollection, useDocument } from '../hooks/useFirestore';
import { addDocument } from '../hooks/useFirestore';
import { getRoutineByGender } from '../data/defaultRoutines';
import { getLocalDateString } from '../utils/date';
import type { WorkoutStep, DayType, Exercise, ExerciseLog, WorkoutLog, Routine, PostWorkoutActivities } from '../types';

const STEP_ORDER: WorkoutStep[] = ['daySelect', 'exerciseSelect', 'warmup', 'logging', 'cardioAbs', 'summary'];

function stepIndex(step: WorkoutStep): number {
  return STEP_ORDER.indexOf(step);
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
    currentExerciseIndex, setCurrentExerciseIndex,
    inProgressLogs, setInProgressLogs,
    setCurrentSets,
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

  const previousLogsForDay = useMemo(() => {
    if (!selectedDayType || !previousWorkouts.length) return undefined;
    const matching = previousWorkouts
      .filter((w) => w.dayType === selectedDayType && w.exercises.length > 0)
      .sort((a, b) => (b.startedAt ?? 0) - (a.startedAt ?? 0));
    return matching[0]?.exercises;
  }, [selectedDayType, previousWorkouts]);

  const prs = useMemo(() => {
    return exerciseLogs.flatMap((log) =>
      log.sets
        .filter((s) => s.isPR)
        .map((s) => ({ exerciseName: log.exerciseName, weight: s.weight, reps: s.reps }))
    );
  }, [exerciseLogs]);

  const duration = Math.floor((Date.now() - startTime) / 1000);

  const warmupsEnabled = profile?.showWarmups !== false;

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
            <div className="text-5xl mb-4">{'\uD83D\uDE34'}</div>
            <h2 className="text-xl font-bold text-text mb-2">Enjoy Your Rest Day</h2>
            <p className="text-muted">Recovery is when your muscles grow. Take it easy today!</p>
            <button
              onClick={() => { setIsRest(false); setCurrentStep('daySelect'); }}
              className="mt-4 text-primary text-sm font-semibold hover:underline"
            >
              {'\u2190'} Choose a different day
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleDaySelect = (day: DayType | 'rest') => {
    if (day === 'rest') {
      setIsRest(true);
      return;
    }
    const found = routine.days.find((d) => d.dayType === day);
    if (found) {
      setSelectedDayType(day);
      setRoutineDay(found);
      setCurrentStep('exerciseSelect');
    }
  };

  const handleExerciseSelect = (selected: Record<string, Exercise[]>) => {
    const flat = Object.values(selected).flat();
    setSelectedExercises(flat);
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
    const newExercises = selectedExercises.filter((_, i) => i !== indexToDelete);

    if (newExercises.length === 0) {
      setExerciseLogs([]);
      setSelectedExercises([]);
      setInProgressLogs([]);
      setCurrentExerciseIndex(0);
      setCurrentSets([]);
      setCurrentStep('cardioAbs');
      return;
    }

    // Rebuild inProgressLogs without the deleted index
    const newLogs: ExerciseLog[] = [];
    for (let i = 0; i < selectedExercises.length; i++) {
      if (i === indexToDelete) continue;
      newLogs.push(inProgressLogs[i]);
    }

    // Adjust currentExerciseIndex
    let newIndex = currentExerciseIndex;
    if (indexToDelete < currentExerciseIndex) {
      newIndex = currentExerciseIndex - 1;
    } else if (indexToDelete === currentExerciseIndex) {
      if (newIndex >= newExercises.length) {
        newIndex = newExercises.length - 1;
      }
    }

    setSelectedExercises(newExercises);
    setInProgressLogs(newLogs);
    setCurrentExerciseIndex(newIndex);

    // Restore sets for the new current exercise
    const targetLog = newLogs[newIndex];
    if (targetLog && targetLog.sets && targetLog.sets.length > 0) {
      setCurrentSets(targetLog.sets.map((s) => ({
        setNumber: s.setNumber,
        reps: s.reps,
        weight: s.weight,
        completed: s.completed,
        isPR: s.isPR ?? false,
      })));
    } else {
      const ex = newExercises[newIndex];
      setCurrentSets(Array.from({ length: ex.sets }, (_, i) => ({
        setNumber: i + 1,
        reps: 0,
        weight: 0,
        completed: false,
        isPR: false,
      })));
    }
  }, [selectedExercises, inProgressLogs, currentExerciseIndex, setSelectedExercises, setInProgressLogs, setCurrentExerciseIndex, setCurrentSets, setExerciseLogs, setCurrentStep]);

  const handleAddExercise = useCallback((exercise: Exercise) => {
    setSelectedExercises([...selectedExercises, exercise]);
  }, [selectedExercises, setSelectedExercises]);

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
      const workoutLog: Record<string, unknown> = {
        date: getLocalDateString(),
        dayType: selectedDayType,
        startedAt: startTime,
        completedAt: Date.now(),
        exercises: exerciseLogs,
        energyRating,
      };
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

  const goBack = () => {
    // Summary -> CardioAbs
    if (currentStep === 'summary') {
      setCurrentStep('cardioAbs');
      return;
    }
    // CardioAbs -> Logging (restore exercise state from exerciseLogs)
    if (currentStep === 'cardioAbs' && exerciseLogs.length > 0) {
      const lastIndex = selectedExercises.length - 1;
      const restoredLogs: ExerciseLog[] = [];
      for (const log of exerciseLogs) {
        const idx = selectedExercises.findIndex(ex => ex.id === log.exerciseId);
        if (idx >= 0) {
          restoredLogs[idx] = log;
        }
      }
      setInProgressLogs(restoredLogs);
      setCurrentExerciseIndex(lastIndex);
      const lastLog = restoredLogs[lastIndex];
      if (lastLog && lastLog.sets.length > 0) {
        setCurrentSets(lastLog.sets.map((s) => ({
          setNumber: s.setNumber,
          reps: s.reps,
          weight: s.weight,
          completed: s.completed,
          isPR: s.isPR ?? false,
        })));
      }
      setCurrentStep('logging');
      return;
    }
    // Logging -> skip warmup if disabled
    if (currentStep === 'logging' && !warmupsEnabled) {
      setCurrentStep('exerciseSelect');
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
    warmup: 'Warm Up',
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

        {/* Back button — shown for exerciseSelect and warmup only (other steps have their own) */}
        {(currentStep === 'exerciseSelect' || currentStep === 'warmup') && (
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

        {currentStep === 'warmup' && routineDay && (
          <WarmupCarousel warmups={routineDay.warmups} onComplete={handleWarmupComplete} />
        )}

        {currentStep === 'logging' && (
          <>
            <ExerciseTracker
              exercises={selectedExercises}
              previousLogs={previousLogsForDay}
              onComplete={handleLoggingComplete}
              onBack={goBack}
              onDeleteExercise={handleDeleteExercise}
              onAddExercise={() => setShowAddExerciseModal(true)}
            />
            <AddExerciseModal
              isOpen={showAddExerciseModal}
              onClose={() => setShowAddExerciseModal(false)}
              onAdd={handleAddExercise}
              selectedExerciseIds={new Set(selectedExercises.map(ex => ex.id))}
              routineDay={routineDay}
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
            duration={duration}
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
