import type { Routine } from '../types';

export const mensRoutine: Routine = {
  id: 'mens-ppl',
  gender: 'male',
  days: [
    {
      dayType: 'Push',
      warmups: [
        { id: 'push-stretch-1', name: 'Doorway Chest Stretch', duration: '30 sec', illustration: 'doorway-chest-stretch', alternative: { name: 'Wall Chest Stretch', duration: '30 sec', illustration: 'wall-chest-stretch' } },
        { id: 'push-stretch-2', name: 'Overhead Triceps Stretch', duration: '30 sec', illustration: 'overhead-triceps-stretch', alternative: { name: 'Triceps Towel Stretch', duration: '30 sec', illustration: 'triceps-towel-stretch' } },
        { id: 'push-stretch-3', name: 'Cross-Body Shoulder Stretch', duration: '30 sec', illustration: 'cross-body-shoulder-stretch', alternative: { name: 'Behind-Back Shoulder Stretch', duration: '30 sec', illustration: 'behind-back-shoulder-stretch' } },
      ],
      muscleGroups: [
        {
          name: 'Chest',
          exercises: [
            { id: 'push-chest-1', name: 'Bench Press', sets: 4, reps: '8-10', youtubeId: 'rT7DgCr-3pg' },
            { id: 'push-chest-2', name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', youtubeId: '8iPEnn-ltC8' },
            { id: 'push-chest-3', name: 'Cable Flyes', sets: 3, reps: '12-15', youtubeId: 'Iwe6AmxVf7o' },
            { id: 'push-chest-4', name: 'Push-Ups', sets: 3, reps: '15-20', youtubeId: 'IODxDxX7oi4' },
            { id: 'push-chest-5', name: 'Decline Bench Press', sets: 3, reps: '8-10', youtubeId: 'oIgci8aNsG0' },
            { id: 'push-chest-6', name: 'Dumbbell Chest Fly', sets: 3, reps: '12-15', youtubeId: 'Nhvz9EzdJ4U' },
          ],
        },
        {
          name: 'Triceps',
          exercises: [
            { id: 'push-tri-1', name: 'Tricep Pushdowns', sets: 3, reps: '12-15', youtubeId: '2-LAMcpzODU' },
            { id: 'push-tri-2', name: 'Overhead Tricep Extension', sets: 3, reps: '10-12', youtubeId: 'YbX7Wd8jQ-Q' },
            { id: 'push-tri-3', name: 'Skull Crushers', sets: 3, reps: '10-12', youtubeId: 'd_KZxkY_0cM' },
            { id: 'push-tri-4', name: 'Close-Grip Bench Press', sets: 3, reps: '8-10', youtubeId: 'nEF0bv2FW94' },
            { id: 'push-tri-5', name: 'Diamond Push-Ups', sets: 3, reps: '12-15', youtubeId: 'K8bKxVcwjrk' },
            { id: 'push-tri-6', name: 'Dips', sets: 3, reps: '8-12', youtubeId: '2z8JmcrW-As' },
          ],
        },
      ],
    },
    {
      dayType: 'Pull',
      warmups: [
        { id: 'pull-stretch-1', name: 'Pelvic Tilts (On Floor)', duration: '30 sec', illustration: 'pelvic-tilts', alternative: { name: 'Lying Knee-to-Chest Stretch', duration: '30 sec', illustration: 'lying-knee-to-chest' } },
        { id: 'pull-stretch-2', name: 'Standing Biceps Wall Stretch', duration: '30 sec', illustration: 'standing-biceps-wall-stretch', alternative: { name: 'Seated Biceps Stretch', duration: '30 sec', illustration: 'seated-biceps-stretch' } },
        { id: 'pull-stretch-3', name: 'Child\'s Pose', duration: '30 sec', illustration: 'childs-pose', alternative: { name: 'Thread the Needle Stretch', duration: '30 sec', illustration: 'thread-the-needle' } },
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
            { id: 'pull-back-6', name: 'Single-Arm Dumbbell Rows', sets: 3, reps: '10-12 each', youtubeId: 'ZRSGpBUVcNw' },
          ],
        },
        {
          name: 'Biceps',
          exercises: [
            { id: 'pull-bi-1', name: 'Barbell Curls', sets: 3, reps: '10-12', youtubeId: 'llqu4IFYSQw' },
            { id: 'pull-bi-2', name: 'Hammer Curls', sets: 3, reps: '10-12', youtubeId: 'zC3nLlEvin4' },
            { id: 'pull-bi-3', name: 'Incline Dumbbell Curls', sets: 3, reps: '10-12', youtubeId: 'soxrZlIl35U' },
            { id: 'pull-bi-4', name: 'Preacher Curls', sets: 3, reps: '10-12', youtubeId: 'fIWP-FRFNU0' },
            { id: 'pull-bi-5', name: 'Cable Curls', sets: 3, reps: '12-15', youtubeId: 'NFzTWp2qpiE' },
            { id: 'pull-bi-6', name: 'Concentration Curls', sets: 3, reps: '10-12', youtubeId: 'llD6MImgqe8' },
          ],
        },
      ],
    },
    {
      dayType: 'Legs + Shoulders',
      warmups: [
        { id: 'legs-stretch-1', name: 'Standing Quad Stretch', duration: '30 sec', illustration: 'standing-quad-stretch', alternative: { name: 'Lying Quad Stretch', duration: '30 sec', illustration: 'lying-quad-stretch' } },
        { id: 'legs-stretch-2', name: 'Seated Hamstring Stretch', duration: '30 sec', illustration: 'seated-hamstring-stretch', alternative: { name: 'Standing Hamstring Stretch', duration: '30 sec', illustration: 'standing-hamstring-stretch' } },
        { id: 'legs-stretch-3', name: 'Cross-Body Shoulder Stretch', duration: '30 sec', illustration: 'cross-body-shoulder-stretch', alternative: { name: 'Behind-Back Shoulder Stretch', duration: '30 sec', illustration: 'behind-back-shoulder-stretch' } },
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
            { id: 'legs-leg-6', name: 'Leg Extensions', sets: 3, reps: '12-15', youtubeId: '0fl1RRgJ83I' },
          ],
        },
        {
          name: 'Shoulders',
          exercises: [
            { id: 'legs-sh-1', name: 'Overhead Press', sets: 4, reps: '8-10', youtubeId: '2yjwXTZQDDI' },
            { id: 'legs-sh-2', name: 'Lateral Raises', sets: 3, reps: '12-15', youtubeId: '3VcKaXpzqRo' },
            { id: 'legs-sh-3', name: 'Front Raises', sets: 3, reps: '12-15', youtubeId: 'zkP0MsTcIVU' },
            { id: 'legs-sh-4', name: 'Reverse Flyes', sets: 3, reps: '12-15', youtubeId: 'Fgz_FdzDukE' },
            { id: 'legs-sh-5', name: 'Shrugs', sets: 3, reps: '12-15', youtubeId: 'cJRVVxmytaM' },
            { id: 'legs-sh-6', name: 'Arnold Press', sets: 3, reps: '10-12', youtubeId: 'jeJttN2EWCo' },
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
        { id: 'wlg-stretch-1', name: 'Pigeon Stretch', duration: '30 sec', illustration: 'pigeon-stretch', alternative: { name: 'Seated Figure-4 Stretch', duration: '30 sec', illustration: 'seated-figure-4-stretch' } },
        { id: 'wlg-stretch-2', name: 'Lying Hamstring Stretch', duration: '30 sec', illustration: 'lying-hamstring-stretch', alternative: { name: 'Standing Hamstring Stretch', duration: '30 sec', illustration: 'standing-hamstring-stretch' } },
        { id: 'wlg-stretch-3', name: 'Figure-4 Stretch', duration: '30 sec', illustration: 'figure-4-stretch', alternative: { name: 'Knee-to-Chest Stretch', duration: '30 sec', illustration: 'knee-to-chest-stretch' } },
      ],
      muscleGroups: [
        {
          name: 'Glutes',
          exercises: [
            { id: 'wlg-glute-1', name: 'Hip Thrusts', sets: 4, reps: '10-12', youtubeId: 'SEdqd1n0cvg' },
            { id: 'wlg-glute-2', name: 'Romanian Deadlifts', sets: 4, reps: '8-10', youtubeId: 'jEy_czb3RKA' },
            { id: 'wlg-glute-3', name: 'Cable Kickbacks', sets: 3, reps: '12-15', youtubeId: 'SqO-VUEak2M' },
            { id: 'wlg-glute-4', name: 'Glute Bridges', sets: 3, reps: '12-15', youtubeId: '8bbE64NuDTU' },
            { id: 'wlg-glute-5', name: 'Sumo Squats', sets: 3, reps: '10-12', youtubeId: '9ZuXKqRbT9k' },
          ],
        },
        {
          name: 'Hamstrings',
          exercises: [
            { id: 'wlg-ham-1', name: 'Leg Curls', sets: 3, reps: '12-15', youtubeId: '1Tq3QdYUuHs' },
            { id: 'wlg-ham-2', name: 'Good Mornings', sets: 3, reps: '10-12', youtubeId: 'YA-h3n9L4YU' },
            { id: 'wlg-ham-3', name: 'Nordic Curls', sets: 3, reps: '8-10', youtubeId: 'rzK7glg8OnA' },
            { id: 'wlg-ham-4', name: 'Stiff Leg Deadlifts', sets: 3, reps: '10-12', youtubeId: 'CN_7cz3P-1U' },
          ],
        },
      ],
    },
    {
      dayType: 'Upper Body',
      warmups: [
        { id: 'wub-stretch-1', name: 'Doorway Chest Stretch', duration: '30 sec', illustration: 'doorway-chest-stretch', alternative: { name: 'Wall Chest Stretch', duration: '30 sec', illustration: 'wall-chest-stretch' } },
        { id: 'wub-stretch-2', name: 'Cross-Body Shoulder Stretch', duration: '30 sec', illustration: 'cross-body-shoulder-stretch', alternative: { name: 'Behind-Back Shoulder Stretch', duration: '30 sec', illustration: 'behind-back-shoulder-stretch' } },
        { id: 'wub-stretch-3', name: 'Overhead Triceps Stretch', duration: '30 sec', illustration: 'overhead-triceps-stretch', alternative: { name: 'Triceps Towel Stretch', duration: '30 sec', illustration: 'triceps-towel-stretch' } },
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
        { id: 'wlq-stretch-1', name: 'Standing Quad Stretch', duration: '30 sec', illustration: 'standing-quad-stretch', alternative: { name: 'Lying Quad Stretch', duration: '30 sec', illustration: 'lying-quad-stretch' } },
        { id: 'wlq-stretch-2', name: 'Calf Stretch (Wall)', duration: '30 sec', illustration: 'calf-wall-stretch', alternative: { name: 'Step Calf Stretch', duration: '30 sec', illustration: 'step-calf-stretch' } },
        { id: 'wlq-stretch-3', name: 'Hip Flexor Stretch', duration: '30 sec', illustration: 'hip-flexor-stretch', alternative: { name: 'Butterfly Stretch', duration: '30 sec', illustration: 'butterfly-stretch' } },
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

export function getRoutineByGender(gender: 'male' | 'female'): Routine {
  if (gender === 'female') return womensRoutine;
  return mensRoutine;
}
