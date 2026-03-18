import { useEffect, useState, useRef } from 'react';

interface CircularTimerProps {
  duration: number; // total seconds (for progress ring)
  endTime: number;  // absolute timestamp (ms) when timer should end
  onComplete?: () => void;
  size?: number;
}

function playNotificationSound() {
  try {
    const ctx = new AudioContext();
    // Three ascending beeps
    const freqs = [660, 880, 1100];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.value = 0.3;
      osc.start(ctx.currentTime + i * 0.25);
      osc.stop(ctx.currentTime + i * 0.25 + 0.2);
    });
  } catch {
    // Audio not available
  }
}

function vibrateDevice() {
  try {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }
  } catch {
    // Vibration not available
  }
}

export function CircularTimer({ duration, endTime, onComplete, size = 120 }: CircularTimerProps) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const completedRef = useRef(false);

  const calcRemaining = () => Math.max(0, Math.ceil((endTime - Date.now()) / 1000));

  const [remaining, setRemaining] = useState(calcRemaining);

  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = remaining / duration;
  const dashoffset = circumference * (1 - progress);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  useEffect(() => {
    if (remaining <= 0 && !completedRef.current) {
      completedRef.current = true;
      playNotificationSound();
      vibrateDevice();
      onCompleteRef.current?.();
      return;
    }

    const timer = setInterval(() => {
      const left = calcRemaining();
      setRemaining(left);
      if (left <= 0) {
        clearInterval(timer);
      }
    }, 250); // Check more frequently for accuracy

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTime]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-card"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-1000 ease-linear"
        />
      </svg>
      <span className="absolute text-text font-mono text-lg font-semibold">
        {display}
      </span>
    </div>
  );
}
