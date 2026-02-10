export type DayType = string;

export type WorkoutStep = 'daySelect' | 'exerciseSelect' | 'warmup' | 'logging' | 'cardioAbs' | 'summary';

export type CardioAbsChoice = 'cardio' | 'abs' | 'skip';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  gender?: 'male' | 'female';
  createdAt: number;
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
}

export interface ChecklistItem {
  id: string;
  label: string;
  emoji: string;
  order: number;
}

export interface MuscleGroup {
  name: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  youtubeId?: string;
}

export interface Warmup {
  id: string;
  name: string;
  duration: string;
}

export interface Routine {
  id: string;
  gender: 'male' | 'female';
  days: RoutineDay[];
}

export interface RoutineDay {
  dayType: DayType;
  warmups: Warmup[];
  muscleGroups: MuscleGroup[];
}

export interface WorkoutLog {
  id: string;
  date: string;
  dayType: DayType;
  startedAt: number;
  completedAt: number | null;
  exercises: ExerciseLog[];
  energyRating?: number;
  cardioOrAbs?: CardioAbsChoice;
}

export interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
}

export interface SetLog {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
  isPR?: boolean;
}

export interface DailyLog {
  date: string;
  weight: number | null;
  sauna: boolean;
  coldPlunge: boolean;
  checklist: Record<string, boolean>;
}
