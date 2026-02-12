import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { auth, firebaseInitError, firebaseReady } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    firebaseReady.then(async () => {
      if (cancelled) return;
      if (firebaseInitError || !auth) {
        setInitError(firebaseInitError);
        setLoading(false);
        return;
      }
      const { onAuthStateChanged } = await import('firebase/auth');
      if (cancelled) return;
      unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const signIn = async () => {
    await firebaseReady;
    if (!auth) return;
    try {
      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const signOut = async () => {
    await firebaseReady;
    if (!auth) return;
    try {
      const { signOut: firebaseSignOut } = await import('firebase/auth');
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return { user, loading, signIn, signOut, initError };
}
