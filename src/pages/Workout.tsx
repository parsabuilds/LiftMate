import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { DaySelector } from '../components/workout/DaySelector';
import { ExerciseSelector } from '../components/workout/ExerciseSelector';
import { WarmupCarousel } from '../components/workout/WarmupCarousel';
import { ExerciseTracker } from '../components/workout/ExerciseTracker';
import { CardioAbsSelector } from '../components/workout/CardioAbsSelector';
import { WorkoutSummary } from '../components/workout/WorkoutSummary';
import { useAuthContext } from '../contexts/AuthContext';
import { useCollection } from '../hooks/useFirestore';
import { addDocument } from '../hooks/useFirestore';
import { getRoutineByGender } from '../data/defaultRoutines';
import type { WorkoutStep, DayType, CardioAbsChoice, Exercise, ExerciseLog, RoutineDay, WorkoutLog } from '../types';

const STEP_ORDER: WorkoutStep[] = ['daySelect', 'exerciseSelect', 'warmup', 'logging', 'cardioAbs', 'summary'];

function stepIndex(step: WorkoutStep): number {
  return STEP_ORDER.indexOf(step);
}

export function Workout() {
  const { user, profile } = useAuthContext();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<WorkoutStep>('daySelect');
  const [selectedDayType, setSelectedDayType] = useState<DayType | null>(null);
  const [routineDay, setRoutineDay] = useState<RoutineDay | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [cardioChoice, setCardioChoice] = useState<CardioAbsChoice>('skip');
  const [startTime] = useState(Date.now());
  const [isRest, setIsRest] = useState(false);

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

  // Rest day
  if (isRest) {
    return (
      <Layout title="Rest Day">
        <Card className="text-center py-8">
          <div className="text-5xl mb-4">😴</div>
          <h2 className="text-xl font-semibold text-text mb-2">Enjoy Your Rest Day</h2>
          <p className="text-muted">Recovery is when your muscles grow. Take it easy today!</p>
          <button
            onClick={() => { setIsRest(false); setCurrentStep('daySelect'); }}
            className="mt-4 text-primary text-sm hover:underline"
          >
            &larr; Choose a different day
          </button>
        </Card>
      </Layout>
    );
  }

  const handleDaySelect = (day: DayType | 'rest') => {
    if (day === 'rest') {
      setIsRest(true);
      return;
    }
    const gender = profile?.gender ?? 'male';
    const routine = getRoutineByGender(gender);
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
    setCurrentStep('warmup');
  };

  const handleWarmupComplete = () => {
    setCurrentStep('logging');
  };

  const handleLoggingComplete = (logs: ExerciseLog[]) => {
    setExerciseLogs(logs);
    setCurrentStep('cardioAbs');
  };

  const handleCardioSelect = (choice: CardioAbsChoice) => {
    setCardioChoice(choice);
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
    };
    await addDocument(`users/${user.uid}/workoutLogs`, workoutLog);
    navigate('/');
  };

  const goBack = () => {
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
    <Layout title={titles[currentStep]}>
      {/* Progress bar */}
      <div className="h-1 bg-border rounded-full mb-4 -mt-2">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Back button */}
      {currentStep !== 'daySelect' && currentStep !== 'summary' && (
        <button onClick={goBack} className="text-primary text-sm mb-4 hover:underline">
          &larr; Back
        </button>
      )}

      {currentStep === 'daySelect' && (
        <>
          <p className="text-muted mb-4">Choose your workout for today</p>
          <DaySelector onSelectDay={handleDaySelect} />
        </>
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
        />
      )}

      {currentStep === 'cardioAbs' && (
        <CardioAbsSelector onSelect={handleCardioSelect} />
      )}

      {currentStep === 'summary' && (
        <WorkoutSummary
          duration={duration}
          exercises={exerciseLogs}
          prs={prs}
          onSave={handleSave}
        />
      )}
    </Layout>
  );
}
