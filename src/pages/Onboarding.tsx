import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { setDocument, updateDocument } from '../hooks/useFirestore';
import { getRoutineByGender } from '../data/defaultRoutines';
import { MUSCLE_GROUPS, GENERIC_WARMUPS, getExercisesForMuscleGroups, generateDayName } from '../data/exerciseCatalog';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import type { Routine, RoutineDay } from '../types';

type Gender = 'male' | 'female';
type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const genderOptions: { value: Gender; label: string; emoji: string }[] = [
  { value: 'male', label: 'Male', emoji: '\uD83D\uDCAA' },
  { value: 'female', label: 'Female', emoji: '\uD83D\uDC83' },
];

const REST_OPTIONS = [30, 60, 90, 120, 180] as const;
const DAY_COUNT_OPTIONS = [2, 3, 4, 5, 6] as const;

function StepFooter() {
  return (
    <p className="text-center text-muted/60 text-sm mt-6">
      You can change this later in Settings.
    </p>
  );
}

export function Onboarding() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [name, setName] = useState(user?.displayName || '');
  const [gender, setGender] = useState<Gender | null>(null);
  const [useDefault, setUseDefault] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Custom builder state
  const [dayCount, setDayCount] = useState(3);
  const [dayMuscles, setDayMuscles] = useState<string[][]>(() => Array.from({ length: 6 }, () => []));

  // Preferences
  const [showWarmups, setShowWarmups] = useState(true);
  const [restSeconds, setRestSeconds] = useState(90);

  function goBack() {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
    else if (step === 5) setStep(4);
    else if (step === 6) setStep(useDefault ? 4 : 5);
    else if (step === 7) setStep(6);
  }

  function buildCustomRoutine(): Routine {
    const days: RoutineDay[] = [];
    for (let i = 0; i < dayCount; i++) {
      const muscles = dayMuscles[i] || [];
      const muscleGroups = getExercisesForMuscleGroups(muscles).map((mg) => ({
        name: mg.name,
        exercises: mg.exercises,
      }));
      days.push({
        dayType: generateDayName(muscles),
        warmups: GENERIC_WARMUPS,
        muscleGroups,
      });
    }
    return { id: 'custom', days };
  }

  async function handleSubmit() {
    if (!user || !gender) return;
    setSubmitting(true);
    try {
      await updateDocument(`users/${user.uid}`, {
        displayName: name,
        gender,
        showWarmups,
        restSeconds,
      });

      const routine = useDefault ? getRoutineByGender(gender) : buildCustomRoutine();
      await setDocument(`users/${user.uid}/routine/current`, routine);

      navigate('/');
    } catch {
      setSubmitting(false);
    }
  }

  function toggleMuscle(dayIndex: number, muscle: string) {
    setDayMuscles((prev) => {
      const updated = [...prev];
      const current = updated[dayIndex];
      if (current.includes(muscle)) {
        updated[dayIndex] = current.filter((m) => m !== muscle);
      } else {
        updated[dayIndex] = [...current, muscle];
      }
      return updated;
    });
  }

  const wrapper = "min-h-screen bg-bg flex flex-col items-center justify-center px-6 relative overflow-hidden";
  const glow = "absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-primary/[0.08] rounded-full blur-[120px]";
  const card = "max-w-[430px] w-full space-y-8 relative z-10";

  // Step 1: Welcome
  if (step === 1) {
    return (
      <div className={wrapper}>
        <div className={glow} />
        <div className={`${card} text-center`}>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6.5 6.5h-3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3" />
                <path d="M17.5 6.5h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-3" />
                <rect x="6.5" y="4" width="4" height="16" rx="1" />
                <rect x="13.5" y="4" width="4" height="16" rx="1" />
                <path d="M10.5 12h3" />
              </svg>
            </div>
            <h1 className="text-4xl font-black text-text tracking-tight">LiftMate</h1>
            <p className="text-muted text-lg leading-relaxed">
              Your personal workout companion. Track lifts, monitor progress, and crush your goals.
            </p>
          </div>
          <Button size="lg" fullWidth onClick={() => setStep(2)}>
            Let's Get Started
          </Button>
        </div>
      </div>
    );
  }

  // Step 2: Name
  if (step === 2) {
    return (
      <div className={wrapper}>
        <div className={glow} />
        <div className={card}>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-text tracking-tight">What should we call you?</h2>
            <p className="text-muted">You can always change this later.</p>
          </div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoFocus
          />
          <Button
            size="lg"
            fullWidth
            disabled={!name.trim()}
            onClick={() => setStep(3)}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Gender
  if (step === 3) {
    return (
      <div className={wrapper}>
        <div className={glow} />
        <div className={card}>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-text tracking-tight">Select your program</h2>
            <p className="text-muted">This helps us pick the right routine for you.</p>
          </div>
          <div className="space-y-3">
            {genderOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setGender(opt.value)}
                className={`w-full text-left flex items-center gap-4 min-h-[72px] rounded-2xl p-5 transition-all active:scale-[0.98] ${
                  gender === opt.value
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-card/60 border border-white/[0.06] hover:border-white/10'
                }`}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <span className="text-text text-lg font-bold">{opt.label}</span>
              </button>
            ))}
          </div>
          <Button
            size="lg"
            fullWidth
            disabled={!gender}
            onClick={() => setStep(4)}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Step 4: Routine Recommendation
  if (step === 4) {
    const routine = gender ? getRoutineByGender(gender) : null;
    return (
      <div className={wrapper}>
        <div className={glow} />
        <div className={card}>
          <button onClick={goBack} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-text tracking-tight">Your Routine</h2>
            <p className="text-muted">We recommend this {routine?.days.length}-day split — it's what our most elite users follow. Ideally repeat it twice per week, or as often as you can.</p>
          </div>

          {routine && (
            <div className="space-y-3">
              {routine.days.map((day, i) => (
                <div key={i} className="bg-card/60 border border-white/[0.06] rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{'\uD83D\uDCC5'}</span>
                    <h3 className="text-text font-bold">Day {i + 1}: {day.dayType} ({day.muscleGroups.map((mg) => mg.name).join(' & ')})</h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <Button size="lg" fullWidth onClick={() => { setUseDefault(true); setStep(6); }}>
              Use This Routine
            </Button>
            <Button size="lg" variant="secondary" fullWidth onClick={() => { setUseDefault(false); setStep(5); }}>
              I'll Create My Own
            </Button>
          </div>
          <StepFooter />
        </div>
      </div>
    );
  }

  // Step 5: Custom Builder
  if (step === 5) {
    const hasAtLeastOneMuscle = dayMuscles.slice(0, dayCount).every((d) => d.length > 0);
    return (
      <div className={wrapper}>
        <div className={glow} />
        <div className="max-w-[430px] w-full space-y-6 relative z-10 max-h-screen overflow-y-auto py-8">
          <button onClick={goBack} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-text tracking-tight">Build Your Routine</h2>
            <p className="text-muted">Pick how many days and what muscles to hit each day.</p>
          </div>

          {/* Day count */}
          <div>
            <p className="text-text font-bold text-sm mb-2">Training Days Per Week</p>
            <div className="flex gap-2">
              {DAY_COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setDayCount(n)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    dayCount === n
                      ? 'bg-primary text-white'
                      : 'bg-card/60 border border-white/[0.06] text-muted hover:border-white/10'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Per-day muscle groups */}
          {Array.from({ length: dayCount }, (_, dayIdx) => (
            <div key={dayIdx}>
              <p className="text-text font-bold text-sm mb-2">
                Day {dayIdx + 1}
                {dayMuscles[dayIdx].length > 0 && (
                  <span className="text-muted font-normal"> — {generateDayName(dayMuscles[dayIdx])}</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {MUSCLE_GROUPS.map((mg) => {
                  const selected = dayMuscles[dayIdx].includes(mg.name);
                  return (
                    <button
                      key={mg.name}
                      onClick={() => toggleMuscle(dayIdx, mg.name)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                        selected
                          ? 'bg-primary/20 border border-primary text-primary'
                          : 'bg-card/60 border border-white/[0.06] text-muted hover:border-white/10'
                      }`}
                    >
                      {mg.emoji} {mg.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <Button size="lg" fullWidth disabled={!hasAtLeastOneMuscle} onClick={() => setStep(6)}>
            Continue
          </Button>
          <StepFooter />
        </div>
      </div>
    );
  }

  // Step 6: Warmup Preference
  if (step === 6) {
    return (
      <div className={wrapper}>
        <div className={glow} />
        <div className={card}>
          <button onClick={goBack} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-text tracking-tight">Warmup Routine</h2>
            <p className="text-muted">Would you like a 3-5 minute warmup before each workout?</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setShowWarmups(true)}
              className={`w-full text-left rounded-2xl p-5 transition-all active:scale-[0.98] ${
                showWarmups
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-card/60 border border-white/[0.06] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{'\uD83D\uDD25'}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-text text-lg font-bold">Yes, warm me up</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary px-2 py-0.5 rounded-md">Recommended</span>
                  </div>
                  <p className="text-muted text-sm mt-0.5">Reduces injury risk and improves performance</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => setShowWarmups(false)}
              className={`w-full text-left rounded-2xl p-5 transition-all active:scale-[0.98] ${
                !showWarmups
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-card/60 border border-white/[0.06] hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{'\u23E9'}</span>
                <div>
                  <span className="text-text text-lg font-bold">Skip warmups</span>
                  <p className="text-muted text-sm mt-0.5">Jump straight into your exercises</p>
                </div>
              </div>
            </button>
          </div>

          <Button size="lg" fullWidth onClick={() => setStep(7)}>
            Continue
          </Button>
          <StepFooter />
        </div>
      </div>
    );
  }

  // Step 7: Rest Timer
  return (
    <div className={wrapper}>
      <div className={glow} />
      <div className={card}>
        <button onClick={goBack} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-text tracking-tight">Rest Timer</h2>
          <p className="text-muted">How long do you want to rest between sets?</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {REST_OPTIONS.map((sec) => (
            <button
              key={sec}
              onClick={() => setRestSeconds(sec)}
              className={`relative min-w-[72px] py-3 px-4 rounded-2xl text-center transition-all active:scale-[0.98] ${
                restSeconds === sec
                  ? 'bg-primary/10 border-2 border-primary'
                  : 'bg-card/60 border border-white/[0.06] hover:border-white/10'
              }`}
            >
              <span className={`text-lg font-bold ${restSeconds === sec ? 'text-primary' : 'text-text'}`}>
                {sec}s
              </span>
              {sec === 90 && (
                <span className="block text-[9px] font-bold uppercase tracking-wider text-primary mt-0.5">Recommended</span>
              )}
            </button>
          ))}
        </div>

        <Button
          size="lg"
          fullWidth
          loading={submitting}
          onClick={handleSubmit}
        >
          Finish Setup
        </Button>
        <StepFooter />
      </div>
    </div>
  );
}
