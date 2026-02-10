import { useState, useCallback } from 'react';
import { CircularTimer } from '../ui/CircularTimer';
import { Button } from '../ui/Button';
import type { Warmup } from '../../types';

interface WarmupCarouselProps {
  warmups: Warmup[];
  onComplete: () => void;
}

function parseDuration(duration: string): number {
  const lower = duration.toLowerCase().trim();
  const num = parseFloat(lower);
  if (lower.includes('min')) return Math.round(num * 60);
  if (lower.includes('sec')) return Math.round(num);
  return 60;
}

export function WarmupCarousel({ warmups, onComplete }: WarmupCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  const advance = useCallback(() => {
    if (currentIndex >= warmups.length - 1) {
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setTimerKey((prev) => prev + 1);
    }
  }, [currentIndex, warmups.length, onComplete]);

  if (warmups.length === 0) {
    onComplete();
    return null;
  }

  const warmup = warmups[currentIndex];
  const duration = parseDuration(warmup.duration);

  return (
    <div className="flex flex-col items-center space-y-6">
      <h3 className="text-text text-xl font-semibold text-center">{warmup.name}</h3>

      <CircularTimer key={timerKey} duration={duration} onComplete={advance} size={160} />

      <div className="flex gap-1.5 justify-center">
        {warmups.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === currentIndex ? 'bg-primary' : i < currentIndex ? 'bg-primary/40' : 'bg-border'
            }`}
          />
        ))}
      </div>

      <div className="flex gap-3 w-full">
        <Button variant="secondary" fullWidth onClick={advance}>
          Skip
        </Button>
        <Button variant="ghost" fullWidth onClick={onComplete}>
          Skip All
        </Button>
      </div>
    </div>
  );
}
