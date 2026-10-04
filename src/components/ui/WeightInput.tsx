import { useState } from 'react';

// Keeps the typed text locally so partial decimals like "22." survive,
// while still following the stored weight when it changes from outside
// (e.g. the set above was removed and this row moved up).
export function WeightInput({ value, onChange, disabled }: { value: number; onChange: (value: number) => void; disabled?: boolean }) {
  const [text, setText] = useState(value ? String(value) : '');
  const parsed = parseFloat(text);
  if ((Number.isFinite(parsed) ? parsed : 0) !== value) {
    setText(value ? String(value) : '');
  }
  return (
    <input
      type="number"
      inputMode="decimal"
      step="any"
      min="0"
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        const next = parseFloat(e.target.value);
        onChange(Number.isFinite(next) && next > 0 ? next : 0);
      }}
      disabled={disabled}
      className="bg-bg/50 border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-text text-base w-full min-h-[36px] focus:outline-none focus:border-primary transition-colors"
      placeholder="lbs"
    />
  );
}
