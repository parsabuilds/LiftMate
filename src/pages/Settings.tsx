import { useAuthContext } from '../contexts/AuthContext';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Settings() {
  const { user, profile, signOut } = useAuthContext();

  return (
    <Layout title="Settings">
      <Card className="mb-4">
        <div className="flex items-center gap-4">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-14 h-14 rounded-full"
              referrerPolicy="no-referrer"
            />
          )}
          <div>
            <h3 className="text-text font-semibold">{profile?.displayName || user?.displayName}</h3>
            <p className="text-muted text-sm">{profile?.email || user?.email}</p>
          </div>
        </div>
      </Card>

      <Card title="App Info" className="mb-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Version</span>
            <span className="text-text">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Routine</span>
            <span className="text-text">Push/Pull/Legs</span>
          </div>
        </div>
      </Card>

      <Button variant="danger" fullWidth onClick={signOut}>
        Sign Out
      </Button>
    </Layout>
  );
}
