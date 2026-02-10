import { useAuthContext } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

export function Login() {
  const { signIn } = useAuthContext();

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-8 max-w-sm w-full">
        {/* App Icon */}
        <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 6.5h-3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3" />
            <path d="M17.5 6.5h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3" />
            <rect x="6.5" y="4" width="4" height="16" rx="1" />
            <rect x="13.5" y="4" width="4" height="16" rx="1" />
            <path d="M10.5 12h3" />
          </svg>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text">LiftMate</h1>
          <p className="text-muted mt-2">Your workout companion</p>
        </div>

        {/* Sign In Button */}
        <Button onClick={signIn} fullWidth size="lg">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
