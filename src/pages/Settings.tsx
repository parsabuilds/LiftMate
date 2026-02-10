import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export function Settings() {
  const { user, profile, signOut, deleteAccount } = useAuthContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteAccount();
    } catch {
      setError('Failed to delete account. Please try again.');
      setDeleting(false);
    }
  };

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

      <div className="space-y-3">
        <Button variant="danger" fullWidth onClick={signOut}>
          Sign Out
        </Button>
        <Button variant="ghost" fullWidth onClick={() => setShowDeleteModal(true)}>
          <span className="text-red-400">Delete Account</span>
        </Button>
      </div>

      <Modal isOpen={showDeleteModal} onClose={() => !deleting && setShowDeleteModal(false)} title="Delete Account">
        <p className="text-muted text-sm mb-4">
          This will permanently delete your account and all your data including workouts, logs, and settings. This action cannot be undone.
        </p>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={handleDelete}
            loading={deleting}
          >
            Delete My Account
          </Button>
        </div>
      </Modal>
    </Layout>
  );
}
