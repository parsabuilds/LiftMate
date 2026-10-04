// The in-progress workout is kept in localStorage per signed-in user, so it
// never carries over to a different account on the same device.
const LEGACY_KEY = 'liftmate_active_workout';

export function workoutStorageKey(uid: string): string {
  return `${LEGACY_KEY}:${uid}`;
}

// Reads the user's saved workout, adopting one saved before storage was per user.
export function readStoredWorkout(uid: string): string | null {
  try {
    const own = localStorage.getItem(workoutStorageKey(uid));
    if (own) return own;
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      localStorage.removeItem(LEGACY_KEY);
      localStorage.setItem(workoutStorageKey(uid), legacy);
    }
    return legacy;
  } catch {
    return null;
  }
}

export function clearStoredWorkout(uid: string) {
  try {
    localStorage.removeItem(workoutStorageKey(uid));
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // private browsing
  }
}
