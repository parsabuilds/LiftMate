import type { Exercise, Warmup } from '../types';

export interface CatalogMuscleGroup {
  name: string;
  emoji: string;
  exercises: Exercise[];
}

export const MUSCLE_GROUPS: CatalogMuscleGroup[] = [
  {
    name: 'Chest',
    emoji: '\uD83D\uDCAA',
    exercises: [
      { id: 'cat-chest-1', name: 'Bench Press', sets: 4, reps: '8-10' },
      { id: 'cat-chest-2', name: 'Incline Dumbbell Press', sets: 3, reps: '10-12' },
      { id: 'cat-chest-3', name: 'Cable Flyes', sets: 3, reps: '12-15' },
      { id: 'cat-chest-4', name: 'Push-Ups', sets: 3, reps: '15-20' },
      { id: 'cat-chest-5', name: 'Chest Press Machine', sets: 3, reps: '10-12' },
    ],
  },
  {
    name: 'Back',
    emoji: '\uD83C\uDFCB\uFE0F',
    exercises: [
      { id: 'cat-back-1', name: 'Pull-Ups', sets: 4, reps: '6-10' },
      { id: 'cat-back-2', name: 'Barbell Rows', sets: 4, reps: '8-10' },
      { id: 'cat-back-3', name: 'Seated Cable Rows', sets: 3, reps: '10-12' },
      { id: 'cat-back-4', name: 'Lat Pulldowns', sets: 3, reps: '10-12' },
      { id: 'cat-back-5', name: 'Face Pulls', sets: 3, reps: '15-20' },
    ],
  },
  {
    name: 'Shoulders',
    emoji: '\uD83E\uDEE8',
    exercises: [
      { id: 'cat-sh-1', name: 'Overhead Press', sets: 4, reps: '8-10' },
      { id: 'cat-sh-2', name: 'Lateral Raises', sets: 3, reps: '12-15' },
      { id: 'cat-sh-3', name: 'Front Raises', sets: 3, reps: '12-15' },
      { id: 'cat-sh-4', name: 'Reverse Flyes', sets: 3, reps: '12-15' },
      { id: 'cat-sh-5', name: 'Shrugs', sets: 3, reps: '12-15' },
    ],
  },
  {
    name: 'Biceps',
    emoji: '\uD83D\uDCAA',
    exercises: [
      { id: 'cat-bi-1', name: 'Barbell Curls', sets: 3, reps: '10-12' },
      { id: 'cat-bi-2', name: 'Hammer Curls', sets: 3, reps: '10-12' },
      { id: 'cat-bi-3', name: 'Incline Dumbbell Curls', sets: 3, reps: '10-12' },
      { id: 'cat-bi-4', name: 'Preacher Curls', sets: 3, reps: '10-12' },
      { id: 'cat-bi-5', name: 'Cable Curls', sets: 3, reps: '12-15' },
    ],
  },
  {
    name: 'Triceps',
    emoji: '\uD83D\uDCAA',
    exercises: [
      { id: 'cat-tri-1', name: 'Tricep Pushdowns', sets: 3, reps: '12-15' },
      { id: 'cat-tri-2', name: 'Overhead Tricep Extension', sets: 3, reps: '10-12' },
      { id: 'cat-tri-3', name: 'Skull Crushers', sets: 3, reps: '10-12' },
      { id: 'cat-tri-4', name: 'Close-Grip Bench Press', sets: 3, reps: '8-10' },
      { id: 'cat-tri-5', name: 'Dips', sets: 3, reps: '8-12' },
    ],
  },
  {
    name: 'Legs',
    emoji: '\uD83E\uDDB5',
    exercises: [
      { id: 'cat-legs-1', name: 'Squats', sets: 4, reps: '8-10' },
      { id: 'cat-legs-2', name: 'Romanian Deadlifts', sets: 4, reps: '8-10' },
      { id: 'cat-legs-3', name: 'Leg Press', sets: 3, reps: '10-12' },
      { id: 'cat-legs-4', name: 'Lunges', sets: 3, reps: '10-12 each' },
      { id: 'cat-legs-5', name: 'Leg Curls', sets: 3, reps: '12-15' },
    ],
  },
  {
    name: 'Glutes',
    emoji: '\uD83C\uDF51',
    exercises: [
      { id: 'cat-glute-1', name: 'Hip Thrusts', sets: 4, reps: '10-12' },
      { id: 'cat-glute-2', name: 'Cable Kickbacks', sets: 3, reps: '12-15' },
      { id: 'cat-glute-3', name: 'Glute Bridges', sets: 3, reps: '12-15' },
      { id: 'cat-glute-4', name: 'Sumo Squats', sets: 3, reps: '10-12' },
      { id: 'cat-glute-5', name: 'Bulgarian Split Squats', sets: 3, reps: '10-12 each' },
    ],
  },
  {
    name: 'Hamstrings',
    emoji: '\uD83E\uDDB5',
    exercises: [
      { id: 'cat-ham-1', name: 'Leg Curls', sets: 3, reps: '12-15' },
      { id: 'cat-ham-2', name: 'Good Mornings', sets: 3, reps: '10-12' },
      { id: 'cat-ham-3', name: 'Nordic Curls', sets: 3, reps: '8-10' },
      { id: 'cat-ham-4', name: 'Stiff Leg Deadlifts', sets: 3, reps: '10-12' },
    ],
  },
  {
    name: 'Quads',
    emoji: '\uD83E\uDDB5',
    exercises: [
      { id: 'cat-quad-1', name: 'Goblet Squats', sets: 4, reps: '10-12' },
      { id: 'cat-quad-2', name: 'Leg Press', sets: 4, reps: '10-12' },
      { id: 'cat-quad-3', name: 'Leg Extensions', sets: 3, reps: '12-15' },
      { id: 'cat-quad-4', name: 'Walking Lunges', sets: 3, reps: '10-12 each' },
      { id: 'cat-quad-5', name: 'Step Ups', sets: 3, reps: '10-12 each' },
    ],
  },
  {
    name: 'Core',
    emoji: '\uD83E\uDDBB',
    exercises: [
      { id: 'cat-core-1', name: 'Planks', sets: 3, reps: '30-60s' },
      { id: 'cat-core-2', name: 'Russian Twists', sets: 3, reps: '15-20' },
      { id: 'cat-core-3', name: 'Dead Bug', sets: 3, reps: '10-12 each' },
      { id: 'cat-core-4', name: 'Crunches', sets: 3, reps: '15-20' },
    ],
  },
];

export const GENERIC_WARMUPS: Warmup[] = [
  { id: 'generic-stretch-1', name: 'Standing Quad Stretch', duration: '30 sec', illustration: 'standing-quad-stretch', alternative: { name: 'Lying Quad Stretch', duration: '30 sec', illustration: 'lying-quad-stretch' } },
  { id: 'generic-stretch-2', name: 'Cross-Body Shoulder Stretch', duration: '30 sec', illustration: 'cross-body-shoulder-stretch', alternative: { name: 'Behind-Back Shoulder Stretch', duration: '30 sec', illustration: 'behind-back-shoulder-stretch' } },
  { id: 'generic-stretch-3', name: 'Pelvic Tilts (On Floor)', duration: '30 sec', illustration: 'pelvic-tilts', alternative: { name: 'Lying Knee-to-Chest Stretch', duration: '30 sec', illustration: 'lying-knee-to-chest' } },
];

export function getExercisesForMuscleGroups(names: string[]) {
  return names
    .map((name) => MUSCLE_GROUPS.find((mg) => mg.name === name))
    .filter((mg): mg is CatalogMuscleGroup => mg !== undefined);
}

export function generateDayName(muscleNames: string[]): string {
  if (muscleNames.length === 0) return 'Custom Day';
  if (muscleNames.length <= 2) return muscleNames.join(' & ');
  return muscleNames.slice(0, 2).join(' & ') + ' +' + (muscleNames.length - 2);
}
