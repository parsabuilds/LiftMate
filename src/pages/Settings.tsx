import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Layout } from '../components/ui/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { useCollection, useDocument, setDocument, deleteDocument, addDocument } from '../hooks/useFirestore';

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

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [savingName, setSavingName] = useState(false);

  const { data: currentRoutine } = useDocument<Routine>(
    user ? `users/${user.uid}/routine/current` : null
  );

  const { data: customRoutines } = useCollection<CustomRoutine>(
    user ? `users/${user.uid}/routines` : null
  );

  const { data: checklistItems } = useCollection<ChecklistItem>(
    user ? `users/${user.uid}/checklist` : null
  );
  const [showAddChecklist, setShowAddChecklist] = useState(false);
  const [newChecklistEmoji, setNewChecklistEmoji] = useState('');
  const [newChecklistLabel, setNewChecklistLabel] = useState('');



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
      emoji: newChecklistEmoji.trim() || '\u2705',
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

  const sectionCard = "bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm";

  return (
    <Layout>
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-primary/[0.07] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 space-y-4">
        {/* Page header */}
        <div className="mb-1">
          <h1 className="text-3xl font-black text-text tracking-tight">Settings</h1>
          <p className="text-muted text-sm mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Card */}
        <div className={sectionCard}>
          <div className="flex items-center gap-4">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-14 h-14 rounded-full border-2 border-white/10"
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
                  <h3 className="text-text font-bold">{profile?.displayName || user?.displayName}</h3>
                  <button onClick={handleEditName} className="text-primary text-xs font-semibold">Edit</button>
                </div>
              )}
              <p className="text-muted text-sm">{profile?.email || user?.email}</p>
              {profile?.gender && (
                <p className="text-muted text-xs capitalize">{profile.gender}</p>
              )}
            </div>
          </div>
        </div>

        {/* Workout Preferences */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <h3 className="text-text font-bold text-base">Workout Preferences</h3>
          </div>

          {/* Warmup Toggle */}
          <div className="flex items-center justify-between py-2 mb-3">
            <div>
              <p className="text-text text-sm font-medium">Show Warmups</p>
              <p className="text-muted text-xs">3-5 min warmup before workouts</p>
            </div>
            <button
              onClick={async () => {
                if (!user) return;
                const newVal = !(profile?.showWarmups !== false);
                await setDocument(`users/${user.uid}`, { showWarmups: newVal });
              }}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                profile?.showWarmups !== false ? 'bg-primary' : 'bg-white/10'
              }`}
            >
              <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                profile?.showWarmups !== false ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {/* Rest Timer */}
          <div className="mb-1">
            <p className="text-text text-sm font-medium mb-2">Rest Between Sets</p>
            <div className="flex gap-2">
              {([30, 60, 90, 120, 180] as const).map((sec) => {
                const active = (profile?.restSeconds ?? 90) === sec;
                return (
                  <button
                    key={sec}
                    onClick={async () => {
                      if (!user) return;
                      await setDocument(`users/${user.uid}`, { restSeconds: sec });
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-primary text-white'
                        : 'bg-card/60 border border-white/[0.06] text-muted hover:border-white/10'
                    }`}
                  >
                    {sec}s
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Routines */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3 className="text-text font-bold text-base">Routines</h3>
          </div>

          <div className="space-y-2 text-sm mb-3">
            <div className="flex justify-between">
              <span className="text-muted">Active Routine</span>
              <span className="text-text font-medium">
                {currentRoutine?.gender ? `Default (${currentRoutine.days.length}-day)` : currentRoutine ? `Custom (${currentRoutine.days.length}-day)` : `Default (${profile?.gender || 'male'})`}
              </span>
            </div>
          </div>

          {customRoutines.length > 0 && (
            <div className="space-y-2 mb-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted">Custom Routines</p>
              {customRoutines.map(r => (
                <div key={r.id} className="flex items-center justify-between py-2 border-t border-white/[0.04]">
                  <div>
                    <p className="text-text text-sm font-medium">{r.name || r.id}</p>
                    <p className="text-muted text-xs">{r.days.length} day{r.days.length !== 1 ? 's' : ''}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteRoutine(r.id)}
                    className="text-red-400 text-sm min-h-[44px] px-2 font-medium"
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
        </div>

        {/* Nutrition */}
        <button
          onClick={() => navigate('/nutrition')}
          className={`${sectionCard} w-full text-left`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{'\uD83C\uDF4E'}</span>
              <div>
                <p className="text-text font-bold">Nutrition Ideas</p>
                <p className="text-muted text-xs">Snacks, meals & macros</p>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </button>

        {/* Checklist */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <h3 className="text-text font-bold text-base">Daily Checklist</h3>
          </div>

          {checklistItems.length > 0 ? (
            <div className="space-y-1 mb-3">
              {checklistItems.map(item => (
                <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                  <span className="text-text text-sm">{item.emoji} {item.label}</span>
                  <button
                    onClick={() => handleDeleteChecklistItem(item.id)}
                    className="text-red-400 text-xs min-h-[44px] px-2 font-medium"
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
            <div className="space-y-2 border-t border-white/[0.04] pt-3">
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
        </div>

        {/* App Info */}
        <div className={sectionCard}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 bg-muted/10 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <h3 className="text-text font-bold text-base">App Info</h3>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Version</span>
            <span className="text-text font-medium">1.0.0</span>
          </div>
        </div>

        {/* Sign Out / Delete */}
        <div className="space-y-3 pt-2">
          <Button variant="danger" fullWidth onClick={signOut}>
            Sign Out
          </Button>
          <Button variant="ghost" fullWidth onClick={() => setShowDeleteModal(true)}>
            <span className="text-red-400">Delete Account</span>
          </Button>
        </div>
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
