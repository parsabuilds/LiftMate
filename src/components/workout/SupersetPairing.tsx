import { useState } from 'react';
import { Button } from '../ui/Button';
import type { Exercise, SupersetPair } from '../../types';

interface SupersetPairingProps {
  exercises: Exercise[];
  pairs: SupersetPair[];
  onConfirm: (exercises: Exercise[], pairs: SupersetPair[]) => void;
}

type Slot =
  | { kind: 'pair'; pairIdx: number; pos: 0 | 1 }
  | { kind: 'single'; idx: number };

function sameSlot(a: Slot, b: Slot): boolean {
  if (a.kind === 'pair' && b.kind === 'pair') return a.pairIdx === b.pairIdx && a.pos === b.pos;
  if (a.kind === 'single' && b.kind === 'single') return a.idx === b.idx;
  return false;
}

export function SupersetPairing({ exercises, pairs, onConfirm }: SupersetPairingProps) {
  const [pairSlots, setPairSlots] = useState<[Exercise, Exercise][]>(() => {
    const byId = new Map(exercises.map((e) => [e.id, e]));
    return pairs
      .map((p) => [byId.get(p.a), byId.get(p.b)] as [Exercise | undefined, Exercise | undefined])
      .filter((pair): pair is [Exercise, Exercise] => Boolean(pair[0] && pair[1]));
  });
  const [singles, setSingles] = useState<Exercise[]>(() => {
    const inPair = new Set(pairs.flatMap((p) => [p.a, p.b]));
    return exercises.filter((e) => !inPair.has(e.id));
  });
  const [selected, setSelected] = useState<Slot | null>(null);

  const getExercise = (slot: Slot): Exercise =>
    slot.kind === 'pair' ? pairSlots[slot.pairIdx][slot.pos] : singles[slot.idx];

  const handleTap = (slot: Slot) => {
    if (!selected) {
      setSelected(slot);
      return;
    }
    if (sameSlot(selected, slot)) {
      setSelected(null);
      return;
    }

    if (selected.kind === 'single' && slot.kind === 'single') {
      // Link two exercises into a new superset
      const a = singles[selected.idx];
      const b = singles[slot.idx];
      setSingles(singles.filter((_, i) => i !== selected.idx && i !== slot.idx));
      setPairSlots([...pairSlots, [a, b]]);
      setSelected(null);
      return;
    }

    // Swap the occupants of the two slots
    const exA = getExercise(selected);
    const exB = getExercise(slot);
    const place = (target: Slot, ex: Exercise, nextPairs: [Exercise, Exercise][], nextSingles: Exercise[]) => {
      if (target.kind === 'pair') {
        nextPairs[target.pairIdx] = [...nextPairs[target.pairIdx]] as [Exercise, Exercise];
        nextPairs[target.pairIdx][target.pos] = ex;
      } else {
        nextSingles[target.idx] = ex;
      }
    };
    const nextPairs = [...pairSlots];
    const nextSingles = [...singles];
    place(selected, exB, nextPairs, nextSingles);
    place(slot, exA, nextPairs, nextSingles);
    setPairSlots(nextPairs);
    setSingles(nextSingles);
    setSelected(null);
  };

  const unlinkPair = (pairIdx: number) => {
    const pair = pairSlots[pairIdx];
    setPairSlots(pairSlots.filter((_, i) => i !== pairIdx));
    setSingles([...singles, ...pair]);
    setSelected(null);
  };

  const handleConfirm = () => {
    // Keep the original exercise order; a pair slots in where its
    // earliest member was picked, with the partner pulled up next to it.
    const pairFor = new Map<string, [Exercise, Exercise]>();
    for (const pair of pairSlots) {
      pairFor.set(pair[0].id, pair);
      pairFor.set(pair[1].id, pair);
    }
    const placed = new Set<string>();
    const ordered: Exercise[] = [];
    for (const ex of exercises) {
      if (placed.has(ex.id)) continue;
      const pair = pairFor.get(ex.id);
      if (pair) {
        ordered.push(pair[0], pair[1]);
        placed.add(pair[0].id);
        placed.add(pair[1].id);
      } else {
        ordered.push(ex);
        placed.add(ex.id);
      }
    }
    const confirmedPairs: SupersetPair[] = pairSlots.map(([a, b]) => ({ a: a.id, b: b.id }));
    onConfirm(ordered, confirmedPairs);
  };

  const chip = (slot: Slot) => {
    const exercise = getExercise(slot);
    const isSelected = selected !== null && sameSlot(selected, slot);
    return (
      <button
        onClick={() => handleTap(slot)}
        className={`flex-1 min-w-0 text-left bg-card/60 border-2 rounded-xl px-3 py-2.5 transition-all backdrop-blur-sm ${
          isSelected
            ? 'border-violet-400 shadow-lg shadow-violet-500/20 scale-[1.02]'
            : 'border-white/[0.06] hover:border-white/15 active:scale-[0.98]'
        }`}
      >
        <p className="text-text text-sm font-bold leading-tight">{exercise.name}</p>
        <p className="text-muted text-[11px] font-medium mt-0.5">
          {exercise.sets} sets × {exercise.reps}
        </p>
      </button>
    );
  };

  return (
    <div className="space-y-5">
      <div className="bg-violet-500/[0.08] border border-violet-500/25 rounded-xl px-3.5 py-2.5">
        <p className="text-violet-300 text-sm font-bold">{'⚡'} Pair exercises into supersets</p>
        <p className="text-muted text-xs mt-0.5">
          Tap two exercises to pair them — you'll do them back to back: one set of each, rest, repeat. Both get logged together so your history knows they were supersetted.
        </p>
      </div>

      {pairSlots.length > 0 && (
        <div className="space-y-3">
          {pairSlots.map((pair, pairIdx) => (
            <div key={`${pair[0].id}+${pair[1].id}`} className="bg-card/40 border border-violet-500/20 rounded-2xl p-3 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300">
                  Superset {pairIdx + 1}
                </span>
                <button
                  onClick={() => unlinkPair(pairIdx)}
                  className="text-muted text-[11px] font-semibold hover:text-text transition-colors flex items-center gap-1"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="M6 6l12 12" />
                  </svg>
                  Unpair
                </button>
              </div>
              <div className="flex items-center gap-2">
                {chip({ kind: 'pair', pairIdx, pos: 0 })}
                <span className="text-violet-300 text-sm flex-shrink-0">{'⚡'}</span>
                {chip({ kind: 'pair', pairIdx, pos: 1 })}
              </div>
            </div>
          ))}
        </div>
      )}

      {pairSlots.length === 0 && (
        <p className="text-muted text-sm text-center py-2">
          No supersets yet — tap two exercises below to pair them.
        </p>
      )}

      {singles.length > 0 && (
        <div>
          <h3 className="text-text font-bold text-sm mb-2">
            Straight sets <span className="text-muted font-medium">(done one at a time)</span>
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {singles.map((exercise, idx) => (
              <div key={exercise.id} className="flex">
                {chip({ kind: 'single', idx })}
              </div>
            ))}
          </div>
        </div>
      )}

      <Button fullWidth onClick={handleConfirm}>
        Start Workout
      </Button>
    </div>
  );
}
