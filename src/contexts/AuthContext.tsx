import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { GoogleAuthProvider, reauthenticateWithPopup, deleteUser } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { useDocument, deleteDocument } from '../hooks/useFirestore';
import { seedUserData } from '../data/seedData';
import { db, firebaseInitError } from '../lib/firebase';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function deleteCollection(path: string) {
  if (!db) return;
  const snapshot = await getDocs(collection(db, path));
  await Promise.all(snapshot.docs.map((d) => deleteDocument(`${path}/${d.id}`)));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  if (firebaseInitError) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-[#F8FAFC] mb-3">Connection Blocked</h1>
          <p className="text-[#94A3B8] text-sm mb-6">
            LiftMate couldn't connect to its servers. If you're using Brave or a privacy-focused browser, try disabling shields for this site.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#3B82F6] hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const deletingRef = useRef(false);
  const [deleting, setDeleting] = useState(false);
  const { data: profile, loading: profileLoading } = useDocument<UserProfile>(
    user ? `users/${user.uid}` : null
  );
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (user && !authLoading && !profileLoading && !profile && !seeding && !deletingRef.current) {
      setSeeding(true);
      seedUserData(user).finally(() => setSeeding(false));
    }
  }, [user, authLoading, profileLoading, profile, seeding]);

  const deleteAccount = async () => {
    if (!user) return;
    const uid = user.uid;
    deletingRef.current = true;
    setDeleting(true);

    try {
      // Delete Firestore data FIRST while still authenticated
      await Promise.all([
        deleteCollection(`users/${uid}/checklist`),
        deleteCollection(`users/${uid}/workoutLogs`),
        deleteCollection(`users/${uid}/dailyLogs`),
      ]);
      await deleteDocument(`users/${uid}/routine/current`);
      await deleteDocument(`users/${uid}`);

      // Then delete the Firebase Auth account
      try {
        await deleteUser(user);
      } catch (err: unknown) {
        if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'auth/requires-recent-login') {
          await reauthenticateWithPopup(user, new GoogleAuthProvider());
          await deleteUser(user);
        } else {
          throw err;
        }
      }
    } finally {
      deletingRef.current = false;
      setDeleting(false);
    }
  };

  const loading = authLoading || profileLoading || seeding || deleting;

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
