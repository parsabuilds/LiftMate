import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/ui/Layout';
import { DaySelector } from '../components/workout/DaySelector';
import { ExerciseSelector } from '../components/workout/ExerciseSelector';
import { WarmupCarousel } from '../components/workout/WarmupCarousel';
import { ExerciseTracker } from '../components/workout/ExerciseTracker';
import { CardioAbsSelector } from '../components/workout/CardioAbsSelector';
import { WorkoutSummary } from '../components/workout/WorkoutSummary';
import { useAuthContext } from '../contexts/AuthContext';
import { useWorkoutContext } from '../contexts/WorkoutContext';
import { useCollection, useDocument } from '../hooks/useFirestore';
import { addDocument } from '../hooks/useFirestore';
import { getRoutineByGender } from '../data/defaultRoutines';
import type { WorkoutStep, DayType, CardioAbsChoice, Exercise, ExerciseLog, WorkoutLog, Routine } from '../types';

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
    cardioChoice, setCardioChoice,
    cardioMinutes, setCardioMinutes,
    cardioCalories, setCardioCalories,
    startTime,
    isRest, setIsRest,
    clearWorkout,
    setCurrentExerciseIndex,
    setInProgressLogs,
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

  const handleCardioSelect = (choice: CardioAbsChoice, minutes: number, calories: number) => {
    setCardioChoice(choice);
    setCardioMinutes(minutes);
    setCardioCalories(calories);
    setCurrentStep('summary');
  };

  const handleSave = async (energyRating: number) => {
    if (!user || !selectedDayType) return;
    const workoutLog: Omit<WorkoutLog, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      dayType: selectedDayType,
      startedAt: startTime,
      completedAt: Date.now(),
      exercises: exerciseLogs,
      energyRating,
      cardioOrAbs: cardioChoice,
      cardioMinutes: cardioMinutes || undefined,
      cardioCalories: cardioCalories || undefined,
    };
    await addDocument(`users/${user.uid}/workoutLogs`, workoutLog);
    clearWorkout();
    navigate('/');
  };

  const goBack = () => {
    // Summary → CardioAbs
    if (currentStep === 'summary') {
      setCurrentStep('cardioAbs');
      return;
    }
    // CardioAbs → Logging (restore exercise state from exerciseLogs)
    if (currentStep === 'cardioAbs' && exerciseLogs.length > 0) {
      const lastIndex = selectedExercises.length - 1;
      // Restore all exercise logs into inProgressLogs (indexed by exercise position)
      const restoredLogs: ExerciseLog[] = [];
      for (const log of exerciseLogs) {
        const idx = selectedExercises.findIndex(ex => ex.id === log.exerciseId);
        if (idx >= 0) {
          restoredLogs[idx] = log;
        }
      }
      // Put all exercises into inProgressLogs, set current to last
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
    // Logging → skip warmup if disabled
    if (currentStep === 'logging' && !warmupsEnabled) {
      setCurrentStep('exerciseSelect');
      return;
    }
    const idx = stepIndex(currentStep);
    if (idx > 0) {
      setCurrentStep(STEP_ORDER[idx - 1]);
    }
  };

  const stepNum = stepIndex(currentStep) + 1;
  const totalSteps = STEP_ORDER.length;
  const progressPct = (stepNum / totalSteps) * 100;

  const titles: Record<WorkoutStep, string> = {
    daySelect: 'Workout',
    exerciseSelect: 'Choose Exercises',
    warmup: 'Warm Up',
    logging: selectedDayType ?? 'Workout',
    cardioAbs: 'Cardio / Abs',
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

        {/* Progress bar */}
        <div className="h-1.5 bg-border/50 rounded-full mb-5">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

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
          <DaySelector routine={routine} onSelectDay={handleDaySelect} />
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
          <ExerciseTracker
            exercises={selectedExercises}
            previousLogs={previousLogsForDay}
            onComplete={handleLoggingComplete}
            onBack={goBack}
          />
        )}

        {currentStep === 'cardioAbs' && (
          <CardioAbsSelector
            initialChoice={cardioChoice !== 'skip' ? cardioChoice : undefined}
            initialMinutes={cardioMinutes}
            initialCalories={cardioCalories}
            onSelect={handleCardioSelect}
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
          />
        )}
      </div>
    </Layout>
  );
}
