import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { useAuthContext } from '../contexts/AuthContext';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useCollection, setDocument, deleteDocument, addDocument } from '../hooks/useFirestore';
import { db } from '../lib/firebase';
import type { Routine, ChecklistItem } from '../types';

interface CustomRoutine extends Routine {
  name?: string;
}

export function Settings() {
  const navigate = useNavigate();
  const { user, profile, signOut, deleteAccount } = useAuthContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable display name
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [savingName, setSavingName] = useState(false);

  // Custom routines
  const { data: customRoutines } = useCollection<CustomRoutine>(
    user ? `users/${user.uid}/routines` : null
  );

  // Checklist management
  const { data: checklistItems } = useCollection<ChecklistItem>(
    user ? `users/${user.uid}/checklist` : null
  );
  const [showAddChecklist, setShowAddChecklist] = useState(false);
  const [newChecklistEmoji, setNewChecklistEmoji] = useState('');
  const [newChecklistLabel, setNewChecklistLabel] = useState('');

  // Export
  const [exporting, setExporting] = useState(false);

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

  const handleEditName = () => {
    setEditingName(true);
    setNameValue(profile?.displayName || '');
  };

  const handleSaveName = async () => {
    if (!user || !nameValue.trim()) return;
    setSavingName(true);
    await setDocument(`users/${user.uid}`, { displayName: nameValue.trim() });
    setSavingName(false);
    setEditingName(false);
  };

  const handleDeleteRoutine = async (routineId: string) => {
    if (!user) return;
    await deleteDocument(`users/${user.uid}/routines/${routineId}`);
  };

  const handleAddChecklistItem = async () => {
    if (!user || !newChecklistLabel.trim()) return;
    await addDocument(`users/${user.uid}/checklist`, {
      label: newChecklistLabel.trim(),
      emoji: newChecklistEmoji.trim() || '✅',
      order: checklistItems.length,
    });
    setNewChecklistLabel('');
    setNewChecklistEmoji('');
    setShowAddChecklist(false);
  };

  const handleDeleteChecklistItem = async (itemId: string) => {
    if (!user) return;
    await deleteDocument(`users/${user.uid}/checklist/${itemId}`);
  };

  const handleExport = async () => {
    if (!user || !db) return;
    setExporting(true);
    try {
      const collections = ['workoutLogs', 'dailyLogs', 'checklist', 'goals', 'routines'];
      const exportData: Record<string, unknown> = { profile };

      for (const col of collections) {
        const snapshot = await getDocs(collection(db, `users/${user.uid}/${col}`));
        exportData[col] = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `liftmate-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Layout title="Settings">
      {/* Profile Card */}
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
          <div className="flex-1">
            {editingName ? (
              <div className="flex gap-2 items-center">
                <Input
                  value={nameValue}
                  onChange={e => setNameValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                  autoFocus
                  className="text-sm"
                />
                <Button size="sm" onClick={handleSaveName} loading={savingName}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingName(false)}>Cancel</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-text font-semibold">{profile?.displayName || user?.displayName}</h3>
                <button onClick={handleEditName} className="text-primary text-xs">Edit</button>
              </div>
            )}
            <p className="text-muted text-sm">{profile?.email || user?.email}</p>
            {profile?.gender && (
              <p className="text-muted text-xs capitalize">{profile.gender}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Routine Management */}
      <Card title="Routines" className="mb-4">
        <div className="space-y-2 text-sm mb-3">
          <div className="flex justify-between">
            <span className="text-muted">Default Routine</span>
            <span className="text-text">Push/Pull/Legs ({profile?.gender || 'male'})</span>
          </div>
        </div>

        {customRoutines.length > 0 && (
          <div className="space-y-2 mb-3">
            <p className="text-muted text-xs uppercase tracking-wider">Custom Routines</p>
            {customRoutines.map(r => (
              <div key={r.id} className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="text-text text-sm font-medium">{r.name || r.id}</p>
                  <p className="text-muted text-xs">{r.days.length} day{r.days.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                  onClick={() => handleDeleteRoutine(r.id)}
                  className="text-red-400 text-sm min-h-[44px] px-2"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <Button variant="secondary" fullWidth onClick={() => navigate('/routine-builder')}>
          Create Custom Routine
        </Button>
      </Card>

      {/* Nutrition */}
      <Card className="mb-4">
        <button
          onClick={() => navigate('/nutrition')}
          className="flex items-center justify-between w-full min-h-[44px]"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍎</span>
            <div className="text-left">
              <p className="text-text font-medium">Nutrition Ideas</p>
              <p className="text-muted text-xs">Snacks, meals & macros</p>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </Card>

      {/* Checklist Management */}
      <Card title="Daily Checklist" className="mb-4">
        {checklistItems.length > 0 ? (
          <div className="space-y-1 mb-3">
            {checklistItems.map(item => (
              <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-text text-sm">{item.emoji} {item.label}</span>
                <button
                  onClick={() => handleDeleteChecklistItem(item.id)}
                  className="text-red-400 text-xs min-h-[44px] px-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-sm mb-3">No checklist items yet.</p>
        )}

        {showAddChecklist ? (
          <div className="space-y-2 border-t border-border pt-2">
            <div className="flex gap-2">
              <Input
                placeholder="Emoji"
                value={newChecklistEmoji}
                onChange={e => setNewChecklistEmoji(e.target.value)}
                className="w-16 text-center"
                maxLength={4}
              />
              <Input
                placeholder="Label"
                value={newChecklistLabel}
                onChange={e => setNewChecklistLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddChecklistItem()}
                className="flex-1"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" fullWidth onClick={() => setShowAddChecklist(false)}>Cancel</Button>
              <Button size="sm" fullWidth onClick={handleAddChecklistItem} disabled={!newChecklistLabel.trim()}>Add</Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" fullWidth size="sm" onClick={() => setShowAddChecklist(true)}>
            + Add Item
          </Button>
        )}
      </Card>

      {/* Data Export */}
      <Card title="Data" className="mb-4">
        <Button variant="secondary" fullWidth onClick={handleExport} loading={exporting}>
          Export Data as JSON
        </Button>
      </Card>

      {/* App Info */}
      <Card title="App Info" className="mb-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Version</span>
            <span className="text-text">1.0.0</span>
          </div>
        </div>
      </Card>

      {/* Sign Out / Delete */}
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
