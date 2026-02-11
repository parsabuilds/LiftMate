import { useState, useEffect } from 'react';
import type { Goal, Milestone } from '../../types';
import Modal from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Omit<Goal, 'id'>) => void;
  editingGoal?: Goal | null;
}

function createEmptyMilestone(): Milestone {
  return {
    id: crypto.randomUUID(),
    title: '',
    completed: false,
  };
}

export function GoalForm({ isOpen, onClose, onSave, editingGoal }: GoalFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingGoal) {
        setTitle(editingGoal.title);
        setDescription(editingGoal.description ?? '');
        setTargetDate(editingGoal.targetDate ?? '');
        setMilestones(editingGoal.milestones.map((m) => ({ ...m })));
      } else {
        setTitle('');
        setDescription('');
        setTargetDate('');
        setMilestones([]);
      }
      setTitleError('');
    }
  }, [isOpen, editingGoal]);

  const handleSave = () => {
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    const validMilestones = milestones
      .filter((m) => m.title.trim())
      .map((m) => {
        const clean: Record<string, unknown> = { id: m.id, title: m.title.trim(), completed: m.completed };
        if (m.targetDate) clean.targetDate = m.targetDate;
        if (m.completedAt) clean.completedAt = m.completedAt;
        return clean as unknown as Milestone;
      });

    const goalData: Record<string, unknown> = {
      title: title.trim(),
      completed: editingGoal?.completed ?? false,
      createdAt: editingGoal?.createdAt ?? Date.now(),
      milestones: validMilestones,
    };
    if (description.trim()) goalData.description = description.trim();
    if (targetDate) goalData.targetDate = targetDate;
    if (editingGoal?.completedAt) goalData.completedAt = editingGoal.completedAt;

    onSave(goalData as Omit<Goal, 'id'>);

    onClose();
  };

  const addMilestone = () => {
    setMilestones([...milestones, createEmptyMilestone()]);
  };

  const removeMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const updateMilestoneTitle = (id: string, newTitle: string) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, title: newTitle } : m)));
  };

  const updateMilestoneDate = (id: string, date: string) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, targetDate: date || undefined } : m)));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingGoal ? 'Edit Goal' : 'New Goal'}>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        <Input
          label="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError('');
          }}
          placeholder="e.g. Bench press 225 lbs"
          error={titleError}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details about your goal..."
            rows={3}
            className="min-h-[44px] bg-card border border-border rounded-xl px-4 py-2.5 text-text placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
          />
        </div>

        <Input
          label="Target Date"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-muted">Milestones</label>
            <button
              type="button"
              onClick={addMilestone}
              className="text-sm text-primary hover:text-blue-400 font-medium min-h-[44px] px-2 flex items-center"
            >
              + Add Milestone
            </button>
          </div>

          {milestones.length > 0 && (
            <div className="space-y-2">
              {milestones.map((m) => (
                <div key={m.id} className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={m.title}
                      onChange={(e) => updateMilestoneTitle(m.id, e.target.value)}
                      placeholder="Milestone title"
                      className="w-full min-h-[44px] bg-card border border-border rounded-xl px-4 py-2.5 text-text placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
                    />
                    <input
                      type="date"
                      value={m.targetDate ?? ''}
                      onChange={(e) => updateMilestoneDate(m.id, e.target.value)}
                      className="w-full min-h-[36px] bg-card border border-border rounded-lg px-3 py-1.5 text-text text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMilestone(m.id)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted hover:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleSave}>
            {editingGoal ? 'Save Changes' : 'Create Goal'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
