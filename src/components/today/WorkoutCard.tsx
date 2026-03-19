import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useWorkoutContext } from '../../contexts/WorkoutContext';
import { useCollection, useDocument } from '../../hooks/useFirestore';
import { getRoutineByGender } from '../../data/defaultRoutines';
import { getLocalDateString } from '../../utils/date';
import type { WorkoutLog, Routine } from '../../types';

export function WorkoutCard() {
  const navigate = useNavigate();
  const { user, profile } = useAuthContext();
  const {
    currentStep,
    selectedDayType: activeDayTypeFromContext,
    selectedExercises,
    inProgressLogs,
    startTime,
  } = useWorkoutContext();
  const today = getLocalDateString();

  const { data: workoutLogs } = useCollection<WorkoutLog>(
    user ? `users/${user.uid}/workoutLogs` : null
  );

  const { data: firestoreRoutine } = useDocument<Routine>(
    user ? `users/${user.uid}/routine/current` : null
  );

  const routine = useMemo(() => {
    const gender = profile?.gender || 'male';
    if (!firestoreRoutine || firestoreRoutine.id === 'mens-ppl' || firestoreRoutine.id === 'womens-fbs') {
      return getRoutineByGender(gender);
    }
    return firestoreRoutine;
  }, [firestoreRoutine, profile?.gender]);

  const dayTypes = routine.days.map((d) => d.dayType);

  // Find today's completed workout (if any)
  const todaysLog = workoutLogs.find((l) => l.date === today && l.completedAt);

  // Determine suggested day — cycle based on last completed workout
  const sortedLogs = [...workoutLogs]
    .filter((l) => l.completedAt)
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));

  let suggestedDayType = dayTypes[0];
  if (sortedLogs.length > 0) {
    const lastDayType = sortedLogs[0].dayType;
    const lastIdx = dayTypes.indexOf(lastDayType);
    if (lastIdx >= 0) {
      suggestedDayType = dayTypes[(lastIdx + 1) % dayTypes.length];
    }
  }

  // Check if there's an active workout in progress
  const isWorkoutInProgress = currentStep !== 'daySelect';

  if (isWorkoutInProgress && activeDayTypeFromContext) {
    // Show active workout card
    const exerciseCount = selectedExercises.length;
    // After logging is complete, exerciseLogs is populated and inProgressLogs is reset
    const completedExercises = (currentStep === 'cardioAbs' || currentStep === 'summary')
      ? exerciseCount
      : inProgressLogs.length;
    const progressPct = exerciseCount > 0
      ? Math.round((completedExercises / exerciseCount) * 100)
      : 0;
    const elapsedMin = Math.floor((Date.now() - startTime) / 60000);

    const activeRoutineDay = routine.days.find((d) => d.dayType === activeDayTypeFromContext);
    const muscleNames = activeRoutineDay
      ? activeRoutineDay.muscleGroups.map((g) => g.name).join(' & ')
      : '';

    return (
      <button
        onClick={() => navigate('/workout')}
        className="group relative w-full text-left rounded-2xl overflow-hidden transition-transform active:scale-[0.98]"
      >
        {/* Gradient border — green to indicate active */}
        <div className="absolute -inset-px bg-gradient-to-br from-success/50 via-success/20 to-primary/5 rounded-2xl" />

        {/* Card body */}
        <div className="relative bg-card m-px rounded-2xl p-5 overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-success/[0.06] rounded-full blur-[60px] pointer-events-none" />

          {/* Label */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-success">
              Workout In Progress
            </span>
            <span className="ml-auto text-[11px] font-bold text-muted">{elapsedMin} min</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-black text-text tracking-tight leading-snug">
            {activeDayTypeFromContext}
            {muscleNames && (
              <>
                <span className="text-muted font-bold"> — </span>
                <span className="text-muted font-semibold text-lg">{muscleNames}</span>
              </>
            )}
          </h3>

          {/* Meta */}
          <p className="text-muted text-sm mt-1">
            {completedExercises}/{exerciseCount} exercises done
          </p>

          {/* Progress bar */}
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 h-1.5 bg-border/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs font-bold text-success">{progressPct}%</span>
          </div>

          {/* Continue button hint */}
          <p className="text-success text-sm font-bold mt-3">
            Tap to continue
          </p>
        </div>
      </button>
    );
  }

  // Default: no active workout
  const activeDayType = todaysLog ? todaysLog.dayType : suggestedDayType;
  const routineDay = routine.days.find((d) => d.dayType === activeDayType);

  if (!routineDay) return null;

  const muscleNames = routineDay.muscleGroups.map((g) => g.name).join(' & ');
  const totalExercises = routineDay.muscleGroups.reduce((sum, g) => sum + g.exercises.length, 0);
  const estMinutes = Math.round(totalExercises * 5.5);

  // Progress — if todaysLog exists it's always a completed workout (filtered by completedAt on line 40)
  const progressPct = todaysLog ? 100 : 0;

  return (
    <div className="space-y-3">
      <button
        onClick={() => navigate(todaysLog ? `/workout/edit/${todaysLog.id}` : '/workout')}
        className="group relative w-full text-left rounded-2xl overflow-hidden transition-transform active:scale-[0.98]"
      >
        {/* Gradient border */}
        <div className="absolute -inset-px bg-gradient-to-br from-primary/50 via-primary/20 to-primary/5 rounded-2xl" />

        {/* Card body */}
        <div className="relative bg-card m-px rounded-2xl p-5 overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/[0.06] rounded-full blur-[60px] pointer-events-none" />

          {/* Label */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              Today's Workout
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-black text-text tracking-tight leading-snug">
            {activeDayType}
            <span className="text-muted font-bold"> — </span>
            <span className="text-muted font-semibold text-lg">{muscleNames}</span>
          </h3>

          {/* Meta */}
          <p className="text-muted text-sm mt-1">
            {totalExercises} exercises · ~{estMinutes} min
          </p>

          {/* Progress bar (only if workout started today) */}
          {todaysLog && (
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 h-1.5 bg-border/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-primary">{progressPct}%</span>
            </div>
          )}

          {/* Start Workout / Edit button */}
          <div className="mt-5 flex justify-center">
            <span className="inline-flex items-center justify-center gap-2.5 w-full px-6 py-3.5 bg-primary rounded-xl text-base font-bold text-white shadow-lg shadow-primary/25 group-active:shadow-primary/10 transition-all">
              {todaysLog ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                  </svg>
                  View & Edit Workout
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                  </svg>
                  Start Workout
                </>
              )}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
