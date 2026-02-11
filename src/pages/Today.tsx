import { Layout } from '../components/ui/Layout';
import { GreetingHeader } from '../components/today/GreetingHeader';
import { WorkoutCard } from '../components/today/WorkoutCard';
import { Checklist } from '../components/today/Checklist';
import { QuickLog } from '../components/today/QuickLog';
import { GoalsPreview } from '../components/today/GoalsPreview';

export function Today() {
  return (
    <Layout>
      <GreetingHeader />
      <WorkoutCard />
      <GoalsPreview />
      <Checklist />
      <QuickLog />
    </Layout>
  );
}
