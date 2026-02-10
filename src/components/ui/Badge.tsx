interface BadgeProps {
  text: string;
  variant?: 'primary' | 'success' | 'muted';
}

const badgeVariants = {
  primary: 'bg-primary/20 text-primary',
  success: 'bg-success/20 text-success',
  muted: 'bg-card text-muted',
};

export function Badge({ text, variant = 'primary' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeVariants[variant]}`}>
      {text}
    </span>
  );
}
