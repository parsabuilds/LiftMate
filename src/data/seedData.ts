import type { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { setDocument } from '../hooks/useFirestore';
import { defaultChecklistItems } from './defaultChecklist';

export async function seedUserData(user: User): Promise<void> {
  const profileRef = doc(db, `users/${user.uid}`);
  const profileSnap = await getDoc(profileRef);

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
