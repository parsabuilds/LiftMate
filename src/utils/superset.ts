import type { Exercise, ExerciseLog, SupersetPair } from '../types';

export function initExerciseLog(exercise: Exercise): ExerciseLog {
  return {
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    sets: Array.from({ length: exercise.sets }, (_, i) => ({
      setNumber: i + 1,
      reps: 0,
      weight: 0,
      completed: false,
      isPR: false,
    })),
  };
}

// A station is what you stand at before moving on: a single exercise, or a
// superset pair logged together on one screen.
export interface Station {
  indices: number[];
}

export function buildStations(exercises: Exercise[], pairs: SupersetPair[]): Station[] {
  const partnerOf: Record<string, string> = {};
  for (const p of pairs) {
    partnerOf[p.a] = p.b;
    partnerOf[p.b] = p.a;
  }
  const stations: Station[] = [];
  const used = new Set<number>();
  for (let i = 0; i < exercises.length; i++) {
    if (used.has(i)) continue;
    used.add(i);
    const partnerId = partnerOf[exercises[i].id];
    if (partnerId) {
      const j = exercises.findIndex((ex, k) => k > i && !used.has(k) && ex.id === partnerId);
      if (j >= 0) {
        used.add(j);
        stations.push({ indices: [i, j] });
        continue;
      }
    }
    stations.push({ indices: [i] });
  }
  return stations;
}
