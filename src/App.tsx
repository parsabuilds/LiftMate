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

  if (loading) {
    return <RouteSpinner />;
  }

  if (!user) {
    return <Landing />;
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
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Navigation />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WorkoutProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </WorkoutProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
