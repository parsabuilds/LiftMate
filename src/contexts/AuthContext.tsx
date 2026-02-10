import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { useDocument } from '../hooks/useFirestore';
import { seedUserData } from '../data/seedData';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const { data: profile, loading: profileLoading } = useDocument<UserProfile>(
    user ? `users/${user.uid}` : null
  );
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (user && !authLoading && !profileLoading && !profile && !seeding) {
      setSeeding(true);
      seedUserData(user).finally(() => setSeeding(false));
    }
  }, [user, authLoading, profileLoading, profile, seeding]);

  const loading = authLoading || profileLoading || seeding;

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut }}>
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
