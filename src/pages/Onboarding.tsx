import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { setDocument, updateDocument } from '../hooks/useFirestore';
import { getRoutineByGender } from '../data/defaultRoutines';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

type Gender = 'male' | 'female';

const genderOptions: { value: Gender; label: string; emoji: string }[] = [
  { value: 'male', label: 'Male', emoji: '\uD83D\uDCAA' },
  { value: 'female', label: 'Female', emoji: '\uD83D\uDC83' },
];

export function Onboarding() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(user?.displayName || '');
  const [gender, setGender] = useState<Gender | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!user || !gender) return;
    setSubmitting(true);
    try {
      await updateDocument(`users/${user.uid}`, {
        displayName: name,
        gender,
      });

      const routine = getRoutineByGender(gender);
      await setDocument(`users/${user.uid}/routine/current`, routine);

      navigate('/');
    } catch {
      setSubmitting(false);
    }
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-primary/[0.08] rounded-full blur-[120px]" />
        <div className="max-w-[430px] w-full text-center space-y-8 relative z-10">
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

  if (step === 2) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-primary/[0.08] rounded-full blur-[120px]" />
        <div className="max-w-[430px] w-full space-y-8 relative z-10">
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

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-primary/[0.08] rounded-full blur-[120px]" />
      <div className="max-w-[430px] w-full space-y-8 relative z-10">
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
          loading={submitting}
          onClick={handleSubmit}
        >
          Finish Setup
        </Button>
      </div>
    </div>
  );
}
