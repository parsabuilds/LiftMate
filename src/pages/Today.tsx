import { Layout } from '../components/ui/Layout';
import { GreetingHeader } from '../components/today/GreetingHeader';
import { WorkoutCard } from '../components/today/WorkoutCard';
import { Checklist } from '../components/today/Checklist';
import { QuickLog } from '../components/today/QuickLog';
import { GoalsPreview } from '../components/today/GoalsPreview';

export function Today() {
  return (
    <Layout>
      {/* Ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-primary/[0.07] rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-40 w-[350px] h-[350px] bg-primary/[0.04] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 -left-32 w-[280px] h-[280px] bg-success/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 space-y-5">
        <GreetingHeader />
        <WorkoutCard />
        <GoalsPreview />
        <Checklist />
        <QuickLog />
      </div>
    </Layout>
  );
}
