import type { Routine } from '../types';

export const mensRoutine: Routine = {
  id: 'mens-ppl',
  gender: 'male',
  days: [
    {
      dayType: 'Push',
      warmups: [
        { id: 'push-warmup-1', name: 'Jumping Jacks', duration: '2 min' },
        { id: 'push-warmup-2', name: 'Arm Circles', duration: '1 min' },
        { id: 'push-warmup-3', name: 'Band Pull-Aparts', duration: '1 min' },
      ],
      muscleGroups: [
        {
          name: 'Chest',
          exercises: [
            { id: 'push-chest-1', name: 'Bench Press', sets: 4, reps: '8-10', youtubeId: 'rT7DgCr-3pg' },
            { id: 'push-chest-2', name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', youtubeId: '8iPEnn-ltC8' },
            { id: 'push-chest-3', name: 'Cable Flyes', sets: 3, reps: '12-15', youtubeId: 'Iwe6AmxVf7o' },
            { id: 'push-chest-4', name: 'Push-Ups', sets: 3, reps: '15-20', youtubeId: 'IODxDxX7oi4' },
            { id: 'push-chest-5', name: 'Dips', sets: 3, reps: '8-12', youtubeId: '2z8JmcrW-As' },
          ],
        },
        {
          name: 'Triceps',
          exercises: [
            { id: 'push-tri-1', name: 'Tricep Pushdowns', sets: 3, reps: '12-15', youtubeId: '2-LAMcpzODU' },
            { id: 'push-tri-2', name: 'Overhead Tricep Extension', sets: 3, reps: '10-12', youtubeId: 'YbX7Wd8jQ-Q' },
            { id: 'push-tri-3', name: 'Skull Crushers', sets: 3, reps: '10-12', youtubeId: 'd_KZxkY_0cM' },
            { id: 'push-tri-4', name: 'Close-Grip Bench Press', sets: 3, reps: '8-10', youtubeId: 'nEF0bv2FW94' },
            { id: 'push-tri-5', name: 'Diamond Push-Ups', sets: 3, reps: '12-15', youtubeId: 'J0DnG1_S3lr' },
          ],
        },
      ],
    },
    {
      dayType: 'Pull',
      warmups: [
        { id: 'pull-warmup-1', name: 'Jumping Jacks', duration: '2 min' },
        { id: 'pull-warmup-2', name: 'Arm Circles', duration: '1 min' },
        { id: 'pull-warmup-3', name: 'Band Pull-Aparts', duration: '1 min' },
      ],
      muscleGroups: [
        {
          name: 'Back',
          exercises: [
            { id: 'pull-back-1', name: 'Pull-Ups', sets: 4, reps: '6-10', youtubeId: 'eGo4IYlbE5g' },
            { id: 'pull-back-2', name: 'Barbell Rows', sets: 4, reps: '8-10', youtubeId: 'FWJR5Ve8bnQ' },
            { id: 'pull-back-3', name: 'Seated Cable Rows', sets: 3, reps: '10-12', youtubeId: 'GZbfZ033f74' },
            { id: 'pull-back-4', name: 'Lat Pulldowns', sets: 3, reps: '10-12', youtubeId: 'CAwf7n6Luuc' },
            { id: 'pull-back-5', name: 'Face Pulls', sets: 3, reps: '15-20', youtubeId: 'rep-qVOkqgk' },
          ],
        },
        {
          name: 'Biceps',
          exercises: [
            { id: 'pull-bi-1', name: 'Barbell Curls', sets: 3, reps: '10-12', youtubeId: 'kwG2ipFRgFo' },
            { id: 'pull-bi-2', name: 'Hammer Curls', sets: 3, reps: '10-12', youtubeId: 'zC3nLlEvin4' },
            { id: 'pull-bi-3', name: 'Incline Dumbbell Curls', sets: 3, reps: '10-12', youtubeId: 'soxrZlIl35U' },
            { id: 'pull-bi-4', name: 'Preacher Curls', sets: 3, reps: '10-12', youtubeId: 'fIWP-FRFNU0' },
            { id: 'pull-bi-5', name: 'Cable Curls', sets: 3, reps: '12-15', youtubeId: 'NFzTWp2qpiE' },
          ],
        },
      ],
    },
    {
      dayType: 'Legs + Shoulders',
      warmups: [
        { id: 'legs-warmup-1', name: 'Jumping Jacks', duration: '2 min' },
        { id: 'legs-warmup-2', name: 'Bodyweight Squats', duration: '1 min' },
        { id: 'legs-warmup-3', name: 'Leg Swings', duration: '1 min' },
      ],
      muscleGroups: [
        {
          name: 'Legs',
          exercises: [
            { id: 'legs-leg-1', name: 'Squats', sets: 4, reps: '8-10', youtubeId: 'ultWZbUMPL8' },
            { id: 'legs-leg-2', name: 'Romanian Deadlifts', sets: 4, reps: '8-10', youtubeId: 'jEy_czb3RKA' },
            { id: 'legs-leg-3', name: 'Leg Press', sets: 3, reps: '10-12', youtubeId: 'IZxyjW7MPJQ' },
            { id: 'legs-leg-4', name: 'Lunges', sets: 3, reps: '10-12 each', youtubeId: 'QOVaHwm-Q6U' },
            { id: 'legs-leg-5', name: 'Leg Curls', sets: 3, reps: '12-15', youtubeId: '1Tq3QdYUuHs' },
          ],
        },
        {
          name: 'Shoulders',
          exercises: [
            { id: 'legs-sh-1', name: 'Overhead Press', sets: 4, reps: '8-10', youtubeId: '2yjwXTZQDDI' },
            { id: 'legs-sh-2', name: 'Lateral Raises', sets: 3, reps: '12-15', youtubeId: '3VcKaXpzqRo' },
            { id: 'legs-sh-3', name: 'Front Raises', sets: 3, reps: '12-15', youtubeId: 'gzDe2MAkaTc' },
            { id: 'legs-sh-4', name: 'Reverse Flyes', sets: 3, reps: '12-15', youtubeId: 'oLrBuvEnjkE' },
            { id: 'legs-sh-5', name: 'Shrugs', sets: 3, reps: '12-15', youtubeId: 'cJRVVxmytaM' },
          ],
        },
      ],
    },
  ],
};

export const womensRoutine: Routine = {
  id: 'womens-fbs',
  gender: 'female',
  days: [
    {
      dayType: 'Lower Body - Glute Focus',
      warmups: [
        { id: 'wlg-warmup-1', name: 'Hip Circles', duration: '1 min' },
        { id: 'wlg-warmup-2', name: 'Glute Bridges', duration: '1 min' },
        { id: 'wlg-warmup-3', name: 'Leg Swings', duration: '1 min' },
      ],
      muscleGroups: [
        {
          name: 'Glutes',
          exercises: [
            { id: 'wlg-glute-1', name: 'Hip Thrusts', sets: 4, reps: '10-12', youtubeId: 'SEdqd1n0cvg' },
            { id: 'wlg-glute-2', name: 'Romanian Deadlifts', sets: 4, reps: '8-10', youtubeId: 'jEy_czb3RKA' },
            { id: 'wlg-glute-3', name: 'Cable Kickbacks', sets: 3, reps: '12-15', youtubeId: 'KXvE5jK2-nM' },
            { id: 'wlg-glute-4', name: 'Glute Bridges', sets: 3, reps: '12-15', youtubeId: '8bbE64NuDTU' },
            { id: 'wlg-glute-5', name: 'Sumo Squats', sets: 3, reps: '10-12', youtubeId: '9ZuXKqRbT9k' },
          ],
        },
        {
          name: 'Hamstrings',
          exercises: [
            { id: 'wlg-ham-1', name: 'Leg Curls', sets: 3, reps: '12-15', youtubeId: '1Tq3QdYUuHs' },
            { id: 'wlg-ham-2', name: 'Good Mornings', sets: 3, reps: '10-12', youtubeId: 'YA-h3n9L4YU' },
            { id: 'wlg-ham-3', name: 'Nordic Curls', sets: 3, reps: '8-10', youtubeId: 'Cg4qPoGnTLo' },
            { id: 'wlg-ham-4', name: 'Stiff Leg Deadlifts', sets: 3, reps: '10-12', youtubeId: 'CN_7cz3P-1U' },
          ],
        },
      ],
    },
    {
      dayType: 'Upper Body',
      warmups: [
        { id: 'wub-warmup-1', name: 'Arm Circles', duration: '1 min' },
        { id: 'wub-warmup-2', name: 'Shoulder Rolls', duration: '1 min' },
        { id: 'wub-warmup-3', name: 'Cat-Cow', duration: '1 min' },
      ],
      muscleGroups: [
        {
          name: 'Back & Shoulders',
          exercises: [
            { id: 'wub-bs-1', name: 'Lat Pulldowns', sets: 3, reps: '10-12', youtubeId: 'CAwf7n6Luuc' },
            { id: 'wub-bs-2', name: 'Seated Rows', sets: 3, reps: '10-12', youtubeId: 'GZbfZ033f74' },
            { id: 'wub-bs-3', name: 'Face Pulls', sets: 3, reps: '15-20', youtubeId: 'rep-qVOkqgk' },
            { id: 'wub-bs-4', name: 'Lateral Raises', sets: 3, reps: '12-15', youtubeId: '3VcKaXpzqRo' },
            { id: 'wub-bs-5', name: 'Reverse Flyes', sets: 3, reps: '12-15', youtubeId: 'EA7u4Q_8HQ0' },
          ],
        },
        {
          name: 'Arms & Chest',
          exercises: [
            { id: 'wub-ac-1', name: 'Push-ups', sets: 3, reps: '10-15', youtubeId: 'IODxDxX7oi4' },
            { id: 'wub-ac-2', name: 'Tricep Dips', sets: 3, reps: '10-12', youtubeId: '0326dy_-CzM' },
            { id: 'wub-ac-3', name: 'Bicep Curls', sets: 3, reps: '10-12', youtubeId: 'ykJmrZ5v0Oo' },
            { id: 'wub-ac-4', name: 'Chest Press Machine', sets: 3, reps: '10-12', youtubeId: 'xUm0BiZCWlQ' },
          ],
        },
      ],
    },
    {
      dayType: 'Lower Body - Quad Focus',
      warmups: [
        { id: 'wlq-warmup-1', name: 'Bodyweight Squats', duration: '1 min' },
        { id: 'wlq-warmup-2', name: 'Hip Flexor Stretch', duration: '1 min' },
        { id: 'wlq-warmup-3', name: 'Ankle Circles', duration: '1 min' },
      ],
      muscleGroups: [
        {
          name: 'Quads',
          exercises: [
            { id: 'wlq-quad-1', name: 'Goblet Squats', sets: 4, reps: '10-12', youtubeId: 'MeIiIdhvXT4' },
            { id: 'wlq-quad-2', name: 'Leg Press', sets: 4, reps: '10-12', youtubeId: 'IZxyjW7MPJQ' },
            { id: 'wlq-quad-3', name: 'Leg Extensions', sets: 3, reps: '12-15', youtubeId: 'YyvSfVjQeL0' },
            { id: 'wlq-quad-4', name: 'Walking Lunges', sets: 3, reps: '10-12 each', youtubeId: 'L8fvypPrzzs' },
            { id: 'wlq-quad-5', name: 'Step Ups', sets: 3, reps: '10-12 each', youtubeId: 'dQqApCGd5Ss' },
          ],
        },
        {
          name: 'Calves & Core',
          exercises: [
            { id: 'wlq-cc-1', name: 'Calf Raises', sets: 3, reps: '15-20', youtubeId: 'gwLzBJYoWlI' },
            { id: 'wlq-cc-2', name: 'Planks', sets: 3, reps: '30-60s', youtubeId: 'ASdvN_XEl_c' },
            { id: 'wlq-cc-3', name: 'Russian Twists', sets: 3, reps: '15-20', youtubeId: 'wkD8rjkodUI' },
            { id: 'wlq-cc-4', name: 'Dead Bug', sets: 3, reps: '10-12 each', youtubeId: 'I5xbsA71v1A' },
          ],
        },
      ],
    },
  ],
};

export function getRoutineByGender(gender: 'male' | 'female' | 'other'): Routine {
  if (gender === 'female') return womensRoutine;
  return mensRoutine;
}
