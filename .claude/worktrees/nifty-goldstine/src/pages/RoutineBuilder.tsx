import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Layout } from '../components/ui/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { setDocument } from '../hooks/useFirestore';
import { MUSCLE_GROUPS, GENERIC_WARMUPS, getExercisesForMuscleGroups, generateDayName } from '../data/exerciseCatalog';
import type { RoutineDay, MuscleGroup } from '../types';

type Step = 'name' | 'build' | 'review';

const DAY_COUNT_OPTIONS = [2, 3, 4, 5, 6] as const;

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function RoutineBuilder() {
  const navigate = useNavigate();
  const { user, profile } = useAuthContext();
  const [step, setStep] = useState<Step>('name');
  const [routineName, setRoutineName] = useState('');
  const [saving, setSaving] = useState(false);

  // Custom builder state (same as onboarding)
  const [dayCount, setDayCount] = useState(3);
  const [dayMuscles, setDayMuscles] = useState<string[][]>(() => Array.from({ length: 6 }, () => []));

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

  function buildRoutineDays(): RoutineDay[] {
    const days: RoutineDay[] = [];
    for (let i = 0; i < dayCount; i++) {
      const muscles = dayMuscles[i] || [];
      const muscleGroups: MuscleGroup[] = getExercisesForMuscleGroups(muscles).map((mg) => ({
        name: mg.name,
        exercises: mg.exercises,
      }));
      days.push({
        dayType: generateDayName(muscles),
        warmups: GENERIC_WARMUPS,
        muscleGroups,
      });
    }
    return days;
  }

  const goBack = () => {
    if (step === 'build') setStep('name');
    else if (step === 'review') setStep('build');
    else navigate('/settings');
  };

  const hasAtLeastOneMuscle = dayMuscles.slice(0, dayCount).every((d) => d.length > 0);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const routineId = genId();
    const routineDays = buildRoutineDays();

    await setDocument(`users/${user.uid}/routines/${routineId}`, {
      id: routineId,
      name: routineName,
      gender: profile?.gender ?? 'male',
      days: routineDays,
    });

    navigate('/settings');
  };

  const STEPS: Step[] = ['name', 'build', 'review'];
  const STEP_LABELS: Record<Step, string> = {
    name: 'Name',
    build: 'Build',
    review: 'Review',
  };
  const stepIndex = STEPS.indexOf(step);

  return (
    <Layout>
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-primary/[0.06] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={goBack} className="text-muted hover:text-text min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-card/60 border border-white/[0.06]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-black text-text tracking-tight">Create Routine</h1>
            <p className="text-muted text-sm">Build your custom program</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1.5 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`h-1.5 w-full rounded-full transition-colors ${i <= stepIndex ? 'bg-primary' : 'bg-white/[0.06]'}`} />
              <span className={`text-xs font-semibold uppercase tracking-wider ${i <= stepIndex ? 'text-primary' : 'text-muted/60'}`}>{STEP_LABELS[s]}</span>
            </div>
          ))}
        </div>

        {/* Step: Name */}
        {step === 'name' && (
          <div className="space-y-4">
            <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
              <Input
                label="Routine Name"
                placeholder="e.g., Push/Pull/Legs, Upper/Lower"
                value={routineName}
                onChange={e => setRoutineName(e.target.value)}
                autoFocus
              />
            </div>
            <Button fullWidth onClick={() => setStep('build')} disabled={!routineName.trim()}>
              Continue
            </Button>
          </div>
        )}

        {/* Step: Build (matches onboarding custom builder) */}
        {step === 'build' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-black text-text tracking-tight">Build Your Routine</h2>
              <p className="text-muted text-sm">Pick how many days and what muscles to hit each day.</p>
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

            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={goBack}>
                Back
              </Button>
              <Button fullWidth disabled={!hasAtLeastOneMuscle} onClick={() => setStep('review')}>
                Review
              </Button>
            </div>
          </div>
        )}

        {/* Step: Review */}
        {step === 'review' && (
          <div className="space-y-4">
            <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="text-text font-black text-xl mb-4 tracking-tight">{routineName}</h3>
              {buildRoutineDays().map((day, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <p className="text-primary font-bold mb-1.5">Day {i + 1}: {day.dayType}</p>
                  {day.muscleGroups.map((mg, j) => (
                    <div key={j} className="ml-3 mb-2">
                      <p className="text-text text-sm font-semibold">{mg.name}</p>
                      {mg.exercises.map((ex, k) => (
                        <p key={k} className="text-muted text-sm ml-3">{ex.name} — {ex.sets}x{ex.reps}</p>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={goBack}>
                Back
              </Button>
              <Button fullWidth onClick={handleSave} loading={saving}>
                Save Routine
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
