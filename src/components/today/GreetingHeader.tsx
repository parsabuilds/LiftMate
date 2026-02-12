import { useAuthContext } from '../../contexts/AuthContext';

export function GreetingHeader() {
  const { profile } = useAuthContext();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = profile?.displayName?.split(' ')[0] || 'there';

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="pb-2">
      {/* Date label */}
      <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
        {dateStr}
      </p>

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-3xl font-black text-text tracking-tight leading-tight">
            {getGreeting()},
          </h1>
          <h1 className="text-3xl font-black text-text tracking-tight leading-tight">
            {firstName}
          </h1>
          <p className="text-muted text-sm mt-1.5 font-medium">
            Let's crush it today
          </p>
        </div>

        {/* Streak badge */}
        {profile && profile.currentStreak > 0 && (
          <div className="relative flex-shrink-0">
            {/* Glow behind badge */}
            <div className="absolute inset-0 bg-orange-500/20 rounded-2xl blur-lg" />
            <div className="relative bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-2xl px-4 py-2.5 text-center">
              <span className="block text-2xl leading-none mb-0.5">
                {profile.currentStreak}
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-orange-400">
                day streak
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
