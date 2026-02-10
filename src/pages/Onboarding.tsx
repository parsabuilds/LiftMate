import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { setDocument, updateDocument } from '../hooks/useFirestore';
import { getRoutineByGender } from '../data/defaultRoutines';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
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
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
        <div className="max-w-[430px] w-full text-center space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-text">LiftMate</h1>
            <p className="text-muted text-lg">
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
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
        <div className="max-w-[430px] w-full space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-text">What should we call you?</h2>
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
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
      <div className="max-w-[430px] w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-text">Select your program</h2>
          <p className="text-muted">This helps us pick the right routine for you.</p>
        </div>
        <div className="space-y-3">
          {genderOptions.map((opt) => (
            <Card
              key={opt.value}
              onClick={() => setGender(opt.value)}
              className={`flex items-center gap-4 min-h-[72px] ${
                gender === opt.value
                  ? 'border-primary bg-primary/10'
                  : ''
              }`}
            >
              <span className="text-3xl">{opt.emoji}</span>
              <span className="text-text text-lg font-medium">{opt.label}</span>
            </Card>
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
