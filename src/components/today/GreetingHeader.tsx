import { useAuthContext } from '../../contexts/AuthContext';
import { Badge } from '../ui/Badge';

export function GreetingHeader() {
  const { profile } = useAuthContext();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = profile?.displayName?.split(' ')[0] || 'there';

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-text">{getGreeting()}, {firstName}</h1>
        <p className="text-muted text-sm mt-1">Let's crush it today</p>
      </div>
      {profile && profile.currentStreak > 0 && (
        <Badge text={`${profile.currentStreak} day streak`} variant="success" />
      )}
    </div>
  );
}
