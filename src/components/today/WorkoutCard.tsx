import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';

export function WorkoutCard() {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate('/workout')} className="mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 6.5h-3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3" />
            <path d="M17.5 6.5h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3" />
            <rect x="6.5" y="4" width="4" height="16" rx="1" />
            <rect x="13.5" y="4" width="4" height="16" rx="1" />
            <path d="M10.5 12h3" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-text font-semibold">Start Workout</h3>
          <p className="text-muted text-sm">Choose your workout for today</p>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </div>
    </Card>
  );
}
