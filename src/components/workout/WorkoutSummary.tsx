import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '../ui/Button';
import type { ExerciseLog } from '../../types';

interface WorkoutSummaryProps {
  duration: number;
  exercises: ExerciseLog[];
  prs: Array<{ exerciseName: string; weight: number; reps: number }>;
  onSave: (energyRating: number) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const statMeta = [
  { label: 'Total Time', color: '#3B82F6' },
  { label: 'Exercises', color: '#10B981' },
  { label: 'Total Sets', color: '#A855F7' },
  { label: 'Total Volume', color: '#F59E0B' },
];

export function WorkoutSummary({ duration, exercises, prs, onSave }: WorkoutSummaryProps) {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (prs.length > 0) {
      confetti();
    }
  }, [prs.length]);

  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const totalVolume = exercises.reduce(
    (sum, ex) => sum + ex.sets.reduce((s, set) => s + set.weight * set.reps, 0),
    0
  );

  const values = [
    formatTime(duration),
    String(exercises.length),
    String(totalSets),
    `${totalVolume.toLocaleString()} lbs`,
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {statMeta.map((meta, i) => (
          <div
            key={meta.label}
            className="relative overflow-hidden bg-card/60 border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm"
          >
            <div
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
              style={{ backgroundColor: meta.color }}
            />
            <p className="text-muted text-xs font-semibold uppercase tracking-wider">{meta.label}</p>
            <p className="text-xl font-black text-text mt-1.5 tracking-tight">{values[i]}</p>
          </div>
        ))}
      </div>

      {prs.length > 0 && (
        <div className="relative overflow-hidden bg-card/60 border border-success/30 rounded-2xl p-5 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/[0.06] rounded-full blur-[40px] pointer-events-none" />
          <h3 className="text-success font-bold mb-2">{'\uD83C\uDFC6'} New Personal Records!</h3>
          <ul className="space-y-1">
            {prs.map((pr, i) => (
              <li key={i} className="text-text text-sm">
                {pr.exerciseName} — {pr.weight} lbs x {pr.reps} reps
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
        <p className="text-muted text-sm font-medium mb-3">How was your energy?</p>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="text-3xl transition-transform hover:scale-110 active:scale-95 min-w-[44px] min-h-[44px]"
            >
              {star <= rating ? '\u2B50' : '\u2606'}
            </button>
          ))}
        </div>
      </div>

      <Button fullWidth onClick={() => onSave(rating)} disabled={rating === 0}>
        Save Workout
      </Button>
    </div>
  );
}
