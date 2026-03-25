import { useEffect, useState, useRef } from 'react';

interface CircularTimerProps {
  duration: number;
  endTime: number;
  onComplete?: () => void;
  size?: number;
}

// --- iOS-compatible audio system ---
// AudioContext must be created/resumed on a user gesture (tap),
// then kept alive so it can still play when the timer fires.
let audioCtx: AudioContext | null = null;
let keepAliveTimer: number | null = null;

/** Call on user gesture (e.g. confirm-set tap) to unlock audio on iOS */
export function unlockAudio() {
  try {
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    // Silent buffer trick — fully unlocks audio on iOS Safari
    const buffer = audioCtx.createBuffer(1, 1, 22050);
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start(0);
  } catch { /* audio unavailable */ }
}

/** Keep AudioContext alive while timer runs (prevents iOS from suspending it) */
export function startAudioKeepAlive() {
  stopAudioKeepAlive();
  keepAliveTimer = window.setInterval(() => {
    try {
      if (audioCtx?.state === 'suspended') audioCtx.resume();
      if (audioCtx?.state === 'running') {
        const buf = audioCtx.createBuffer(1, 1, 22050);
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        src.connect(audioCtx.destination);
        src.start(0);
      }
    } catch { /* ignore */ }
  }, 5000);
}

export function stopAudioKeepAlive() {
  if (keepAliveTimer !== null) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

/** Request notification permission (call on user gesture) */
export async function requestTimerNotificationPermission() {
  try {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  } catch { /* ignore */ }
}

/** Show a system notification — works in background on iOS 16.4+ PWA */
export function showRestNotification() {
  try {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const title = 'Rest Over!';
    const options: NotificationOptions = {
      body: 'Time to get back to your workout!',
      icon: '/icon.svg',
      tag: 'rest-timer',
    };
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.ready
        .then(reg => reg.showNotification(title, options))
        .catch(() => { try { new Notification(title, options); } catch { /* ignore */ } });
    } else {
      new Notification(title, options);
    }
  } catch { /* ignore */ }
}

// --- Sound effects ---

function playCountdownTick() {
  try {
    if (!audioCtx || audioCtx.state !== 'running') return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.start(now);
    osc.stop(now + 0.15);
  } catch { /* ignore */ }
}

function playCompletionSound() {
  try {
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new AudioContext();
    }
    audioCtx.resume();
    const now = audioCtx.currentTime;
    const dest = audioCtx.destination;

    // Triple gym-bell strike
    function strike(time: number, vol: number) {
      // Fundamental (830 Hz — bright bell tone)
      const o1 = audioCtx!.createOscillator();
      const g1 = audioCtx!.createGain();
      o1.type = 'sine';
      o1.frequency.value = 830;
      o1.connect(g1);
      g1.connect(dest);
      g1.gain.setValueAtTime(0, time);
      g1.gain.linearRampToValueAtTime(vol, time + 0.005);
      g1.gain.exponentialRampToValueAtTime(0.001, time + 0.8);
      o1.start(time);
      o1.stop(time + 0.85);

      // Inharmonic overtone (metallic character)
      const o2 = audioCtx!.createOscillator();
      const g2 = audioCtx!.createGain();
      o2.type = 'sine';
      o2.frequency.value = 830 * 2.4;
      o2.connect(g2);
      g2.connect(dest);
      g2.gain.setValueAtTime(0, time);
      g2.gain.linearRampToValueAtTime(vol * 0.4, time + 0.003);
      g2.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
      o2.start(time);
      o2.stop(time + 0.3);

      // High sparkle partial
      const o3 = audioCtx!.createOscillator();
      const g3 = audioCtx!.createGain();
      o3.type = 'sine';
      o3.frequency.value = 830 * 5.4;
      o3.connect(g3);
      g3.connect(dest);
      g3.gain.setValueAtTime(0, time);
      g3.gain.linearRampToValueAtTime(vol * 0.15, time + 0.002);
      g3.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
      o3.start(time);
      o3.stop(time + 0.12);
    }

    strike(now, 0.5);
    strike(now + 0.35, 0.5);
    strike(now + 0.7, 0.6);
  } catch { /* ignore */ }
}

function notifyCompletion() {
  playCompletionSound();
  stopAudioKeepAlive();
  // Vibration — Android only, no-op on iOS
  try { navigator.vibrate?.([100, 50, 100, 50, 100, 50, 300]); } catch { /* ignore */ }
}

// --- Component ---

export function CircularTimer({ duration, endTime, onComplete, size = 120 }: CircularTimerProps) {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const completedRef = useRef(false);
  const lastTickRef = useRef<number | null>(null);

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

  const isCompleted = remaining <= 0;
  const isAlmostDone = remaining <= 3 && remaining > 0;

  useEffect(() => {
    completedRef.current = false;
    lastTickRef.current = null;

    const timer = setInterval(() => {
      const left = calcRemaining();
      setRemaining(left);

      // Countdown ticks at 3, 2, 1
      if (left > 0 && left <= 3 && lastTickRef.current !== left) {
        lastTickRef.current = left;
        playCountdownTick();
        try { navigator.vibrate?.(50); } catch { /* ignore */ }
      }

      if (left <= 0 && !completedRef.current) {
        completedRef.current = true;
        notifyCompletion();
        onCompleteRef.current?.();
        clearInterval(timer);
      }
    }, 250);

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
          strokeDashoffset={isCompleted ? 0 : dashoffset}
          strokeLinecap="round"
          className={`transition-all duration-500 ease-linear ${
            isCompleted
              ? 'text-emerald-400'
              : isAlmostDone
                ? 'text-amber-400'
                : 'text-primary'
          }`}
        />
      </svg>
      <span className={`absolute font-mono text-lg font-semibold ${
        isCompleted ? 'text-emerald-400' : isAlmostDone ? 'text-amber-400 animate-pulse' : 'text-text'
      }`}>
        {display}
      </span>
    </div>
  );
}
