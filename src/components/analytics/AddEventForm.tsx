import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { TimelineEvent } from '../../types';

interface AddEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<TimelineEvent, 'id'>) => void;
  editingEvent?: TimelineEvent | null;
}

const EVENT_TYPES: { value: TimelineEvent['type']; label: string }[] = [
  { value: 'supplement_start', label: 'Started Supplement' },
  { value: 'supplement_stop', label: 'Stopped Supplement' },
  { value: 'diet_change', label: 'Diet Change' },
  { value: 'injury', label: 'Injury' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'other', label: 'Other' },
];

const TYPE_COLORS: Record<TimelineEvent['type'], string> = {
  supplement_start: '#10B981',
  supplement_stop: '#EF4444',
  diet_change: '#F97316',
  injury: '#EF4444',
  milestone: '#3B82F6',
  other: '#94A3B8',
};

export function AddEventForm({ isOpen, onClose, onSave, editingEvent }: AddEventFormProps) {
  const [date, setDate] = useState('');
  const [type, setType] = useState<TimelineEvent['type']>('milestone');
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingEvent) {
      setDate(editingEvent.date);
      setType(editingEvent.type);
      setLabel(editingEvent.label);
      setNotes(editingEvent.notes || '');
    } else {
      setDate(new Date().toISOString().slice(0, 10));
      setType('milestone');
      setLabel('');
      setNotes('');
    }
  }, [editingEvent, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !date) return;
    onSave({
      date,
      type,
      label: label.trim(),
      color: TYPE_COLORS[type],
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingEvent ? 'Edit Event' : 'Add Event'}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TimelineEvent['type'])}
            className="min-h-[44px] bg-card border border-border rounded-xl px-4 py-2.5 text-text focus:outline-none focus:border-primary"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <Input
          label="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., Started Creatine"
          required
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional details..."
            rows={3}
            className="bg-card border border-border rounded-xl px-4 py-2.5 text-text placeholder:text-muted/50 focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" type="button" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button variant="primary" type="submit" fullWidth>
            {editingEvent ? 'Save' : 'Add'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
