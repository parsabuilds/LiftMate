import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { initExerciseLog } from '../utils/superset';
import { getLocalDateString } from '../utils/date';
import type { WorkoutStep, DayType, Exercise, ExerciseLog, RoutineDay, PostWorkoutActivities, SupersetPair } from '../types';

const STORAGE_KEY = 'liftmate_active_workout';

interface WorkoutState {
  currentStep: WorkoutStep;
  selectedDayType: DayType | null;
  routineDay: RoutineDay | null;
  selectedExercises: Exercise[];
  exerciseLogs: ExerciseLog[];
  postWorkout: PostWorkoutActivities;
  startTime: number;
  isRest: boolean;
  // Index into the station list (a station is one exercise or a superset pair)
  currentStationIndex: number;
  // Live log for every selected exercise, kept in lockstep with selectedExercises
  inProgressLogs: ExerciseLog[];
  firstSetConfirmedAt: number | null;
  // Exercises paired to be performed back to back as supersets
  supersetPairs: SupersetPair[];
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
  currentStationIndex: 0,
  inProgressLogs: [],
  firstSetConfirmedAt: null,
  supersetPairs: [],
};

// Pre-superset sessions stored a currentExerciseIndex plus a currentSets
// scratch buffer for the exercise being logged, and only wrote inProgressLogs
// on navigation. Rebuild a complete inProgressLogs from what they saved.
interface LegacySetRow {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
  isPR?: boolean;
}
interface LegacyState extends Partial<WorkoutState> {
  currentExerciseIndex?: number;
  currentSets?: LegacySetRow[];
}

function migrateState(parsed: LegacyState): WorkoutState {
  const state: WorkoutState = { ...defaultState, ...parsed, startTime: parsed.startTime ?? Date.now() };
  if (parsed.currentStationIndex === undefined && parsed.currentExerciseIndex !== undefined) {
    state.currentStationIndex = parsed.currentExerciseIndex;
  }
  if (state.selectedExercises.length > 0) {
    const legacyIndex = parsed.currentExerciseIndex;
    state.inProgressLogs = state.selectedExercises.map((ex, i) => {
      const existing = state.inProgressLogs[i];
      if (existing && existing.sets.length > 0) return existing;
      if (i === legacyIndex && parsed.currentSets && parsed.currentSets.length > 0) {
        return {
          exerciseId: ex.id,
          exerciseName: ex.name,
          sets: parsed.currentSets.map((s) => ({ ...s, isPR: s.isPR ?? false })),
        };
      }
      return initExerciseLog(ex);
    });
  }
  return state;
}

function loadState(): WorkoutState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const state = migrateState(JSON.parse(raw) as LegacyState);
    // A rest day only covers the day it was picked
    if (state.isRest && getLocalDateString(new Date(state.startTime)) !== getLocalDateString()) {
      return null;
    }
    return state;
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
  setCurrentStationIndex: (index: number) => void;
  setInProgressLogs: (logs: ExerciseLog[]) => void;
  updateInProgressLog: (index: number, log: ExerciseLog) => void;
  setFirstSetConfirmedAt: (time: number | null) => void;
  setSupersetPairs: (pairs: SupersetPair[]) => void;
  // Restart the clock when a workout (or rest day) actually begins
  resetStartTime: () => void;
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

  const setCurrentStationIndex = useCallback((index: number) => {
    setState((prev) => ({ ...prev, currentStationIndex: index }));
  }, []);

  const setInProgressLogs = useCallback((logs: ExerciseLog[]) => {
    setState((prev) => ({ ...prev, inProgressLogs: logs }));
  }, []);

  const updateInProgressLog = useCallback((index: number, log: ExerciseLog) => {
    setState((prev) => ({
      ...prev,
      inProgressLogs: prev.inProgressLogs.map((l, i) => (i === index ? log : l)),
    }));
  }, []);

  const setFirstSetConfirmedAt = useCallback((time: number | null) => {
    setState((prev) => ({ ...prev, firstSetConfirmedAt: time }));
  }, []);

  const setSupersetPairs = useCallback((pairs: SupersetPair[]) => {
    setState((prev) => ({ ...prev, supersetPairs: pairs }));
  }, []);

  const resetStartTime = useCallback(() => {
    setState((prev) => ({ ...prev, startTime: Date.now() }));
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
        setCurrentStationIndex,
        setInProgressLogs,
        updateInProgressLog,
        setFirstSetConfirmedAt,
        setSupersetPairs,
        resetStartTime,
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
