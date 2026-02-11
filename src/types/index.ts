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

// Phase 3: Timeline Events
export interface TimelineEvent {
  id: string;
  date: string;
  type: 'supplement_start' | 'supplement_stop' | 'diet_change' | 'injury' | 'milestone' | 'other';
  label: string;
  color?: string;
  notes?: string;
}

// Phase 3: Goals
export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  completed: boolean;
  completedAt?: number;
  createdAt: number;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  targetDate?: string;
  completed: boolean;
  completedAt?: number;
}

// Phase 3: Nutrition
export interface NutritionItem {
  id: string;
  name: string;
  category: 'snack' | 'meal' | 'drink';
  emoji: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string;
  store?: string;
}
