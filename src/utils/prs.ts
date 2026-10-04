import { exerciseKey } from '../data/exerciseLibrary';
import type { ExerciseLog, SetLog } from '../types';

// At most one PR per exercise per workout: the heaviest completed set, when it
// beats the all-time best from earlier workouts. A first-ever attempt isn't a PR.
export function flagPRSets(sets: SetLog[], bestWeight: number): SetLog[] {
  let top = -1;
  sets.forEach((s, i) => {
    if (s.completed && (top < 0 || s.weight > sets[top].weight)) top = i;
  });
  return sets.map((s, i) => ({ ...s, isPR: bestWeight > 0 && i === top && s.weight > bestWeight }));
}

// Best weights are keyed by exerciseKey(name).
export function markPRs(logs: ExerciseLog[], bestWeights: Record<string, number>): ExerciseLog[] {
  return logs.map((log) => ({
    ...log,
    sets: flagPRSets(log.sets, bestWeights[exerciseKey(log.exerciseName)] ?? 0),
  }));
}
