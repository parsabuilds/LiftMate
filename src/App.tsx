import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { Navigation } from './components/Navigation';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { Today } from './pages/Today';
import { Workout } from './pages/Workout';
import { Analytics } from './pages/Analytics';
import { Goals } from './pages/Goals';
import { Settings } from './pages/Settings';
import Nutrition from './pages/Nutrition';
import { RoutineBuilder } from './pages/RoutineBuilder';

function AppContent() {
  const { user, profile, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Landing />;
  }

  if (!profile?.gender) {
    return <Onboarding />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/nutrition" element={<Nutrition />} />
        <Route path="/routine-builder" element={<RoutineBuilder />} />
      </Routes>
      <Navigation />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
