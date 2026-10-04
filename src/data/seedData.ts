import type { User } from 'firebase/auth';
import { db, firebaseReady } from '../lib/firebase';
import { setDocument } from '../hooks/useFirestore';
import { defaultChecklistItems } from './defaultChecklist';

export async function seedUserData(user: User): Promise<void> {
  await firebaseReady;
  if (!db) return;
  // Ask the server, not the local cache: an empty cache (or being offline)
  // must never look like a brand-new user and overwrite a real profile.
  const { doc, getDocFromServer } = await import('firebase/firestore');
  const profileRef = doc(db, `users/${user.uid}`);
  const profileSnap = await getDocFromServer(profileRef);

  if (profileSnap.exists()) return; // Already seeded

  const profile = {
    uid: user.uid,
    displayName: user.displayName || 'User',
    email: user.email || '',
    photoURL: user.photoURL || '',
    createdAt: Date.now(),
    currentStreak: 0,
    longestStreak: 0,
    lastWorkoutDate: null,
  };

  await setDocument(`users/${user.uid}`, profile);

  // Seed checklist items
  for (const item of defaultChecklistItems) {
    await setDocument(`users/${user.uid}/checklist/${item.id}`, item);
  }
}
