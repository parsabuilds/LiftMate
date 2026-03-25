import { useState, useCallback, useRef, useEffect } from 'react';
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
  const [swapped, setSwapped] = useState<Record<number, boolean>>({});
  const [waiting, setWaiting] = useState(false);

  const advance = useCallback(() => {
    if (currentIndex >= warmups.length - 1) {
      onComplete();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setTimerKey((prev) => prev + 1);
      setWaiting(false);
    }
  }, [currentIndex, warmups.length, onComplete]);

  const handleTimerComplete = useCallback(() => {
    if (currentIndex >= warmups.length - 1) {
      onComplete();
    } else {
      setWaiting(true);
    }
  }, [currentIndex, warmups.length, onComplete]);

  if (warmups.length === 0) {
    onComplete();
    return null;
  }

  const warmup = warmups[currentIndex];
  const isSwapped = swapped[currentIndex] ?? false;
  const alt = warmup.alternative;

  const displayName = isSwapped && alt ? alt.name : warmup.name;
  const displayDuration = isSwapped && alt ? alt.duration : warmup.duration;
  const displayIllustration = isSwapped && alt ? alt.illustration : warmup.illustration;

  const duration = parseDuration(displayDuration);
  const endTimeRef = useRef(Date.now() + duration * 1000);

  useEffect(() => {
    endTimeRef.current = Date.now() + duration * 1000;
  }, [timerKey, duration]);

  const handleSwap = () => {
    setSwapped((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
    setTimerKey((prev) => prev + 1);
    setWaiting(false);
  };

  // Next stretch info for the waiting screen
  const nextWarmup = currentIndex < warmups.length - 1 ? warmups[currentIndex + 1] : null;
  const nextIsSwapped = nextWarmup ? (swapped[currentIndex + 1] ?? false) : false;
  const nextName = nextWarmup
    ? (nextIsSwapped && nextWarmup.alternative ? nextWarmup.alternative.name : nextWarmup.name)
    : null;
  const nextIllustration = nextWarmup
    ? (nextIsSwapped && nextWarmup.alternative ? nextWarmup.alternative.illustration : nextWarmup.illustration)
    : null;

  // Waiting screen: timer done, show next stretch preview
  if (waiting && nextWarmup) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Stretch {currentIndex + 1} of {warmups.length} — Done!</p>

        <p className="text-muted text-sm mt-2">Up next:</p>
        <h3 className="text-text text-2xl font-black text-center tracking-tight">{nextName}</h3>

        {nextIllustration && (
          <img
            src={`/images/stretches/${nextIllustration}.png`}
            alt={nextName ?? ''}
            className="w-full object-contain rounded-xl"
          />
        )}

        <div className="flex gap-2 justify-center">
          {warmups.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i <= currentIndex ? 'bg-primary/40' : i === currentIndex + 1 ? 'bg-primary scale-125' : 'bg-white/[0.08]'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3 w-full">
          <Button variant="primary" fullWidth onClick={advance}>
            Start Next Stretch
          </Button>
          <Button variant="ghost" fullWidth onClick={onComplete}>
            Skip All
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">Stretch {currentIndex + 1} of {warmups.length}</p>
      <h3 className="text-text text-2xl font-black text-center tracking-tight">{displayName}</h3>

      {displayIllustration && (
        <img
          src={`/images/stretches/${displayIllustration}.png`}
          alt={displayName}
          className="w-full object-contain rounded-xl"
        />
      )}

      <CircularTimer key={timerKey} duration={duration} endTime={endTimeRef.current} onComplete={handleTimerComplete} size={120} />

      <div className="flex gap-2 justify-center">
        {warmups.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === currentIndex ? 'bg-primary scale-125' : i < currentIndex ? 'bg-primary/40' : 'bg-white/[0.08]'
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

      {alt && (
        <button
          onClick={handleSwap}
          className="text-xs text-primary/70 hover:text-primary transition-colors mt-1"
        >
          Alternatively, do <span className="underline">{isSwapped ? warmup.name : alt.name}</span>
        </button>
      )}
    </div>
  );
}
