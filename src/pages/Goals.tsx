import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';

export function Goals() {
  return (
    <Layout title="Goals">
      <Card className="text-center py-8">
        <div className="text-4xl mb-3">🎯</div>
        <h2 className="text-xl font-semibold text-text mb-2">Coming Soon</h2>
        <p className="text-muted">Set and track your fitness goals here. This feature is coming in a future update.</p>
      </Card>
    </Layout>
  );
}
