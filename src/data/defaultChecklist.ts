import type { ChecklistItem } from '../types';

export const defaultChecklistItems: ChecklistItem[] = [
  { id: 'vitamins', label: 'Vitamins', emoji: '💊', order: 0 },
  { id: 'protein', label: 'Protein Shake', emoji: '🥤', order: 1 },
  { id: 'creatine', label: 'Creatine', emoji: '⚡', order: 2 },
  { id: 'water', label: 'Water (1 gallon)', emoji: '💧', order: 3 },
  { id: 'stretch', label: 'Stretch', emoji: '🧘', order: 4 },
];
