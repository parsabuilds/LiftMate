interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
      <div
        className={`
          relative w-11 h-6 rounded-full transition-colors duration-200
          ${checked ? 'bg-primary' : 'bg-card border border-border'}
        `}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`
            absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
            ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}
          `}
        />
      </div>
      {label && <span className="text-text">{label}</span>}
    </label>
  );
}
