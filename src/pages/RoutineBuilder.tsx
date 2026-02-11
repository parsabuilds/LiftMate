import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { setDocument } from '../hooks/useFirestore';
import type { RoutineDay, MuscleGroup, Exercise } from '../types';

type Step = 'name' | 'days' | 'muscles' | 'review';

interface DayDraft {
  dayType: string;
  muscleGroups: MuscleGroupDraft[];
}

interface MuscleGroupDraft {
  name: string;
  exercises: ExerciseDraft[];
}

interface ExerciseDraft {
  name: string;
  sets: number;
  reps: string;
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const STEPS: Step[] = ['name', 'days', 'muscles', 'review'];
const STEP_LABELS: Record<Step, string> = {
  name: 'Name',
  days: 'Day Types',
  muscles: 'Exercises',
  review: 'Review',
};

export function RoutineBuilder() {
  const navigate = useNavigate();
  const { user, profile } = useAuthContext();
  const [step, setStep] = useState<Step>('name');
  const [routineName, setRoutineName] = useState('');
  const [days, setDays] = useState<DayDraft[]>([]);
  const [saving, setSaving] = useState(false);

  // Day editing
  const [editingDayIdx, setEditingDayIdx] = useState<number | null>(null);
  const [dayTypeName, setDayTypeName] = useState('');

  // Muscle group editing for a specific day
  const [editingMuscleDay, setEditingMuscleDay] = useState(0);
  const [newMuscleGroupName, setNewMuscleGroupName] = useState('');
  const [newExercise, setNewExercise] = useState<Record<string, { name: string; sets: string; reps: string }>>({});

  const stepIndex = STEPS.indexOf(step);

  const goBack = () => {
    if (stepIndex > 0) {
      setStep(STEPS[stepIndex - 1]);
    } else {
      navigate('/settings');
    }
  };

  const goNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStep(STEPS[stepIndex + 1]);
    }
  };

  const addDay = () => {
    if (!dayTypeName.trim()) return;
    if (editingDayIdx !== null) {
      setDays(prev => prev.map((d, i) => i === editingDayIdx ? { ...d, dayType: dayTypeName.trim() } : d));
      setEditingDayIdx(null);
    } else {
      setDays(prev => [...prev, { dayType: dayTypeName.trim(), muscleGroups: [] }]);
    }
    setDayTypeName('');
  };

  const editDay = (idx: number) => {
    setEditingDayIdx(idx);
    setDayTypeName(days[idx].dayType);
  };

  const removeDay = (idx: number) => {
    setDays(prev => prev.filter((_, i) => i !== idx));
    if (editingDayIdx === idx) {
      setEditingDayIdx(null);
      setDayTypeName('');
    }
  };

  const addMuscleGroup = (dayIdx: number) => {
    if (!newMuscleGroupName.trim()) return;
    setDays(prev => prev.map((d, i) =>
      i === dayIdx
        ? { ...d, muscleGroups: [...d.muscleGroups, { name: newMuscleGroupName.trim(), exercises: [] }] }
        : d
    ));
    setNewMuscleGroupName('');
  };

  const removeMuscleGroup = (dayIdx: number, mgIdx: number) => {
    setDays(prev => prev.map((d, i) =>
      i === dayIdx
        ? { ...d, muscleGroups: d.muscleGroups.filter((_, j) => j !== mgIdx) }
        : d
    ));
  };

  const getExKey = (dayIdx: number, mgIdx: number) => `${dayIdx}-${mgIdx}`;

  const addExercise = (dayIdx: number, mgIdx: number) => {
    const key = getExKey(dayIdx, mgIdx);
    const ex = newExercise[key];
    if (!ex || !ex.name.trim()) return;
    const sets = parseInt(ex.sets) || 3;
    const reps = ex.reps.trim() || '8-12';
    setDays(prev => prev.map((d, i) =>
      i === dayIdx
        ? {
            ...d,
            muscleGroups: d.muscleGroups.map((mg, j) =>
              j === mgIdx
                ? { ...mg, exercises: [...mg.exercises, { name: ex.name.trim(), sets, reps }] }
                : mg
            ),
          }
        : d
    ));
    setNewExercise(prev => ({ ...prev, [key]: { name: '', sets: '3', reps: '8-12' } }));
  };

  const removeExercise = (dayIdx: number, mgIdx: number, exIdx: number) => {
    setDays(prev => prev.map((d, i) =>
      i === dayIdx
        ? {
            ...d,
            muscleGroups: d.muscleGroups.map((mg, j) =>
              j === mgIdx
                ? { ...mg, exercises: mg.exercises.filter((_, k) => k !== exIdx) }
                : mg
            ),
          }
        : d
    ));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const routineId = genId();
    const routineDays: RoutineDay[] = days.map(d => ({
      dayType: d.dayType,
      warmups: [],
      muscleGroups: d.muscleGroups.map((mg): MuscleGroup => ({
        name: mg.name,
        exercises: mg.exercises.map((ex): Exercise => ({
          id: genId(),
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
        })),
      })),
    }));

    await setDocument(`users/${user.uid}/routines/${routineId}`, {
      id: routineId,
      name: routineName,
      gender: profile?.gender ?? 'male',
      days: routineDays,
    });

    navigate('/settings');
  };

  const canProceedFromName = routineName.trim().length > 0;
  const canProceedFromDays = days.length > 0;
  const canProceedFromMuscles = days.every(d => d.muscleGroups.length > 0 && d.muscleGroups.every(mg => mg.exercises.length > 0));

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={goBack} className="text-muted hover:text-text p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-text">Create Routine</h1>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-1">
            <div className={`h-1 w-full rounded-full ${i <= stepIndex ? 'bg-primary' : 'bg-border'}`} />
            <span className={`text-xs ${i <= stepIndex ? 'text-primary' : 'text-muted'}`}>{STEP_LABELS[s]}</span>
          </div>
        ))}
      </div>

      {/* Step: Name */}
      {step === 'name' && (
        <div className="space-y-4">
          <Card>
            <Input
              label="Routine Name"
              placeholder="e.g., Push/Pull/Legs, Upper/Lower"
              value={routineName}
              onChange={e => setRoutineName(e.target.value)}
              autoFocus
            />
          </Card>
          <Button fullWidth onClick={goNext} disabled={!canProceedFromName}>
            Continue
          </Button>
        </div>
      )}

      {/* Step: Day Types */}
      {step === 'days' && (
        <div className="space-y-4">
          {days.map((d, i) => (
            <Card key={i}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text font-medium">{d.dayType}</p>
                  <p className="text-muted text-sm">{d.muscleGroups.length} muscle group{d.muscleGroups.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => editDay(i)} className="text-primary text-sm min-h-[44px] px-2">Edit</button>
                  <button onClick={() => removeDay(i)} className="text-red-400 text-sm min-h-[44px] px-2">Delete</button>
                </div>
              </div>
            </Card>
          ))}

          <Card>
            <p className="text-muted text-sm mb-2">{editingDayIdx !== null ? 'Edit Day Type' : 'Add Day Type'}</p>
            <div className="flex gap-2">
              <Input
                placeholder='e.g., "Push", "Upper Body"'
                value={dayTypeName}
                onChange={e => setDayTypeName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addDay()}
                className="flex-1"
              />
              <Button onClick={addDay} disabled={!dayTypeName.trim()}>
                {editingDayIdx !== null ? 'Save' : 'Add'}
              </Button>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={goBack}>
              Back
            </Button>
            <Button fullWidth onClick={goNext} disabled={!canProceedFromDays}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step: Muscle Groups & Exercises */}
      {step === 'muscles' && (
        <div className="space-y-4">
          {/* Day tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {days.map((d, i) => (
              <button
                key={i}
                onClick={() => setEditingMuscleDay(i)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap min-h-[44px] transition-colors ${
                  editingMuscleDay === i ? 'bg-primary text-white' : 'bg-card text-muted border border-border'
                }`}
              >
                {d.dayType}
              </button>
            ))}
          </div>

          {days[editingMuscleDay] && (
            <>
              {/* Existing muscle groups */}
              {days[editingMuscleDay].muscleGroups.map((mg, mgIdx) => (
                <Card key={mgIdx}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-text font-semibold">{mg.name}</h4>
                    <button onClick={() => removeMuscleGroup(editingMuscleDay, mgIdx)} className="text-red-400 text-sm min-h-[44px] px-2">Remove</button>
                  </div>

                  {/* Exercises */}
                  {mg.exercises.map((ex, exIdx) => (
                    <div key={exIdx} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                      <span className="text-text text-sm">{ex.name} <span className="text-muted">({ex.sets}x{ex.reps})</span></span>
                      <button onClick={() => removeExercise(editingMuscleDay, mgIdx, exIdx)} className="text-red-400 text-xs min-h-[44px] px-2">X</button>
                    </div>
                  ))}

                  {/* Add exercise form */}
                  <div className="mt-2 space-y-2">
                    <Input
                      placeholder="Exercise name"
                      value={newExercise[getExKey(editingMuscleDay, mgIdx)]?.name ?? ''}
                      onChange={e => setNewExercise(prev => ({
                        ...prev,
                        [getExKey(editingMuscleDay, mgIdx)]: {
                          ...prev[getExKey(editingMuscleDay, mgIdx)] ?? { name: '', sets: '3', reps: '8-12' },
                          name: e.target.value,
                        },
                      }))}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Sets"
                        type="number"
                        value={newExercise[getExKey(editingMuscleDay, mgIdx)]?.sets ?? '3'}
                        onChange={e => setNewExercise(prev => ({
                          ...prev,
                          [getExKey(editingMuscleDay, mgIdx)]: {
                            ...prev[getExKey(editingMuscleDay, mgIdx)] ?? { name: '', sets: '3', reps: '8-12' },
                            sets: e.target.value,
                          },
                        }))}
                        className="w-20"
                      />
                      <Input
                        placeholder="Reps"
                        value={newExercise[getExKey(editingMuscleDay, mgIdx)]?.reps ?? '8-12'}
                        onChange={e => setNewExercise(prev => ({
                          ...prev,
                          [getExKey(editingMuscleDay, mgIdx)]: {
                            ...prev[getExKey(editingMuscleDay, mgIdx)] ?? { name: '', sets: '3', reps: '8-12' },
                            reps: e.target.value,
                          },
                        }))}
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={() => addExercise(editingMuscleDay, mgIdx)}
                        disabled={!newExercise[getExKey(editingMuscleDay, mgIdx)]?.name?.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Add muscle group */}
              <Card>
                <p className="text-muted text-sm mb-2">Add Muscle Group</p>
                <div className="flex gap-2">
                  <Input
                    placeholder='e.g., "Chest", "Biceps"'
                    value={newMuscleGroupName}
                    onChange={e => setNewMuscleGroupName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addMuscleGroup(editingMuscleDay)}
                    className="flex-1"
                  />
                  <Button onClick={() => addMuscleGroup(editingMuscleDay)} disabled={!newMuscleGroupName.trim()}>
                    Add
                  </Button>
                </div>
              </Card>
            </>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={goBack}>
              Back
            </Button>
            <Button fullWidth onClick={goNext} disabled={!canProceedFromMuscles}>
              Review
            </Button>
          </div>
        </div>
      )}

      {/* Step: Review */}
      {step === 'review' && (
        <div className="space-y-4">
          <Card>
            <h3 className="text-text font-bold text-lg mb-3">{routineName}</h3>
            {days.map((d, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <p className="text-primary font-semibold mb-1">{d.dayType}</p>
                {d.muscleGroups.map((mg, j) => (
                  <div key={j} className="ml-3 mb-2">
                    <p className="text-text text-sm font-medium">{mg.name}</p>
                    {mg.exercises.map((ex, k) => (
                      <p key={k} className="text-muted text-sm ml-3">{ex.name} - {ex.sets}x{ex.reps}</p>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </Card>

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
    </Layout>
  );
}
