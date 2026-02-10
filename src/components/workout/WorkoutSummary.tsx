import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Card } from '../ui/Card';
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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-muted text-xs uppercase tracking-wide">Total Time</p>
          <p className="text-text text-xl font-bold mt-1">{formatTime(duration)}</p>
        </Card>
        <Card>
          <p className="text-muted text-xs uppercase tracking-wide">Exercises</p>
          <p className="text-text text-xl font-bold mt-1">{exercises.length}</p>
        </Card>
        <Card>
          <p className="text-muted text-xs uppercase tracking-wide">Total Sets</p>
          <p className="text-text text-xl font-bold mt-1">{totalSets}</p>
        </Card>
        <Card>
          <p className="text-muted text-xs uppercase tracking-wide">Total Volume</p>
          <p className="text-text text-xl font-bold mt-1">{totalVolume.toLocaleString()} lbs</p>
        </Card>
      </div>

      {prs.length > 0 && (
        <Card className="border-success/50 bg-success/10">
          <h3 className="text-success font-semibold mb-2">New Personal Records!</h3>
          <ul className="space-y-1">
            {prs.map((pr, i) => (
              <li key={i} className="text-text text-sm">
                {pr.exerciseName} — {pr.weight} lbs x {pr.reps} reps
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <p className="text-muted text-sm mb-2">How was your energy?</p>
        <div className="flex gap-2 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="text-2xl transition-transform hover:scale-110"
            >
              {star <= rating ? '\u2B50' : '\u2606'}
            </button>
          ))}
        </div>
      </Card>

      <Button fullWidth onClick={() => onSave(rating)} disabled={rating === 0}>
        Save Workout
      </Button>
    </div>
  );
}
