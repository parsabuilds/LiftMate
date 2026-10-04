import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import { ToastProvider } from './components/ui/Toast';
import { Navigation } from './components/Navigation';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import React, { Suspense, Component } from 'react';
import type { ReactNode } from 'react';

const Today = React.lazy(() => import('./pages/Today').then(m => ({ default: m.Today })));
const Workout = React.lazy(() => import('./pages/Workout').then(m => ({ default: m.Workout })));
const Analytics = React.lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const Goals = React.lazy(() => import('./pages/Goals').then(m => ({ default: m.Goals })));
const Settings = React.lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Nutrition = React.lazy(() => import('./pages/Nutrition'));
const RoutineBuilder = React.lazy(() => import('./pages/RoutineBuilder').then(m => ({ default: m.RoutineBuilder })));
const WorkoutEdit = React.lazy(() => import('./pages/WorkoutEdit').then(m => ({ default: m.WorkoutEdit })));

function RouteSpinner() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  // After a deploy, an old page can ask for code files that are gone. One
  // automatic reload picks up the new version.
  componentDidCatch(error: Error) {
    const chunkError = /dynamically imported module|Importing a module script failed|Failed to fetch|error loading/i.test(error.message);
    try {
      // At most once a minute, so a real outage can't cause a reload loop
      const last = Number(sessionStorage.getItem('liftmate_chunk_reload')) || 0;
      if (chunkError && Date.now() - last > 60_000) {
        sessionStorage.setItem('liftmate_chunk_reload', String(Date.now()));
        window.location.reload();
      }
    } catch {
      // storage unavailable
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-text text-lg font-semibold mb-2">Something went wrong</p>
            <p className="text-muted text-sm mb-4">The page failed to load.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { user, profile, loading } = useAuthContext();

  // Show Landing immediately while auth is resolving — don't block
  // unauthenticated visitors behind a spinner while Firebase checks session
  if (!user) {
    return <Landing />;
  }

  // Only show spinner once we know we have a user but are still loading profile
  if (loading) {
    return <RouteSpinner />;
  }

  if (!profile?.gender) {
    return <Onboarding />;
  }

  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<RouteSpinner />}>
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/routine-builder" element={<RoutineBuilder />} />
            <Route path="/workout/edit/:id" element={<WorkoutEdit />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Navigation />
    </>
  );
}

// Each account gets its own in-progress workout
function UserWorkoutProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const uid = user?.uid ?? null;
  return (
    <WorkoutProvider key={uid ?? 'signed-out'} uid={uid}>
      {children}
    </WorkoutProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserWorkoutProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </UserWorkoutProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
