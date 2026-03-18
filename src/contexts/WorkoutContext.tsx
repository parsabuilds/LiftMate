import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { WorkoutStep, DayType, Exercise, ExerciseLog, RoutineDay, PostWorkoutActivities } from '../types';

const STORAGE_KEY = 'liftmate_active_workout';

export interface SetRow {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
  isPR: boolean;
}

interface WorkoutState {
  currentStep: WorkoutStep;
  selectedDayType: DayType | null;
  routineDay: RoutineDay | null;
  selectedExercises: Exercise[];
  exerciseLogs: ExerciseLog[];
  postWorkout: PostWorkoutActivities;
  startTime: number;
  isRest: boolean;
  currentExerciseIndex: number;
  inProgressLogs: ExerciseLog[];
  currentSets: SetRow[];
  restTimerEnd: number | null;
}

const defaultState: WorkoutState = {
  currentStep: 'daySelect',
  selectedDayType: null,
  routineDay: null,
  selectedExercises: [],
  exerciseLogs: [],
  postWorkout: {},
  startTime: Date.now(),
  isRest: false,
  currentExerciseIndex: 0,
  inProgressLogs: [],
  currentSets: [],
  restTimerEnd: null,
};

function loadState(): WorkoutState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as WorkoutState;
  } catch {
    // private browsing or corrupt data
  }
  return null;
}

function saveState(state: WorkoutState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function removeState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

interface WorkoutContextValue extends WorkoutState {
  setCurrentStep: (step: WorkoutStep) => void;
  setSelectedDayType: (day: DayType | null) => void;
  setRoutineDay: (day: RoutineDay | null) => void;
  setSelectedExercises: (exercises: Exercise[]) => void;
  setExerciseLogs: (logs: ExerciseLog[]) => void;
  setPostWorkout: (activities: PostWorkoutActivities) => void;
  setIsRest: (rest: boolean) => void;
  setCurrentExerciseIndex: (index: number) => void;
  setInProgressLogs: (logs: ExerciseLog[]) => void;
  setCurrentSets: (sets: SetRow[]) => void;
  setRestTimerEnd: (end: number | null) => void;
  clearWorkout: () => void;
}

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkoutState>(() => loadState() ?? { ...defaultState, startTime: Date.now() });

  // Persist to localStorage on every state change
  useEffect(() => {
    if (state.currentStep !== 'daySelect' || state.isRest) {
      saveState(state);
    } else {
      removeState();
    }
  }, [state]);

  const setCurrentStep = useCallback((step: WorkoutStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const setSelectedDayType = useCallback((day: DayType | null) => {
    setState((prev) => ({ ...prev, selectedDayType: day }));
  }, []);

  const setRoutineDay = useCallback((day: RoutineDay | null) => {
    setState((prev) => ({ ...prev, routineDay: day }));
  }, []);

  const setSelectedExercises = useCallback((exercises: Exercise[]) => {
    setState((prev) => ({ ...prev, selectedExercises: exercises }));
  }, []);

  const setExerciseLogs = useCallback((logs: ExerciseLog[]) => {
    setState((prev) => ({ ...prev, exerciseLogs: logs }));
  }, []);

  const setPostWorkout = useCallback((activities: PostWorkoutActivities) => {
    setState((prev) => ({ ...prev, postWorkout: activities }));
  }, []);

  const setIsRest = useCallback((rest: boolean) => {
    setState((prev) => ({ ...prev, isRest: rest }));
  }, []);

  const setCurrentExerciseIndex = useCallback((index: number) => {
    setState((prev) => ({ ...prev, currentExerciseIndex: index }));
  }, []);

  const setInProgressLogs = useCallback((logs: ExerciseLog[]) => {
    setState((prev) => ({ ...prev, inProgressLogs: logs }));
  }, []);

  const setCurrentSets = useCallback((sets: SetRow[]) => {
    setState((prev) => ({ ...prev, currentSets: sets }));
  }, []);

  const setRestTimerEnd = useCallback((end: number | null) => {
    setState((prev) => ({ ...prev, restTimerEnd: end }));
  }, []);

  const clearWorkout = useCallback(() => {
    removeState();
    setState({ ...defaultState, startTime: Date.now() });
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        ...state,
        setCurrentStep,
        setSelectedDayType,
        setRoutineDay,
        setSelectedExercises,
        setExerciseLogs,
        setPostWorkout,
        setIsRest,
        setCurrentExerciseIndex,
        setInProgressLogs,
        setCurrentSets,
        setRestTimerEnd,
        clearWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkoutContext(): WorkoutContextValue {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkoutContext must be used within WorkoutProvider');
  return ctx;
}
