export type EquipmentType = 'bodyweight' | 'dumbbell' | 'barbell' | 'cable' | 'machine' | 'other';

const equipmentMap = new Map<string, EquipmentType>([
  // Bodyweight
  ['push-ups', 'bodyweight'],
  ['push ups', 'bodyweight'],
  ['pull-ups', 'bodyweight'],
  ['pull ups', 'bodyweight'],
  ['dips', 'bodyweight'],
  ['tricep dips', 'bodyweight'],
  ['diamond push-ups', 'bodyweight'],
  ['diamond push ups', 'bodyweight'],
  ['planks', 'bodyweight'],
  ['plank', 'bodyweight'],
  ['crunches', 'bodyweight'],
  ['dead bug', 'bodyweight'],
  ['russian twists', 'bodyweight'],
  ['nordic curls', 'bodyweight'],
  ['glute bridges', 'bodyweight'],
  ['calf raises', 'bodyweight'],
  ['step ups', 'bodyweight'],
  ['step-ups', 'bodyweight'],
  ['walking lunges', 'bodyweight'],
  ['chin-ups', 'bodyweight'],
  ['chin ups', 'bodyweight'],
  ['burpees', 'bodyweight'],
  ['mountain climbers', 'bodyweight'],
  ['leg raises', 'bodyweight'],
  ['hanging leg raises', 'bodyweight'],
  ['sit-ups', 'bodyweight'],
  ['sit ups', 'bodyweight'],
  ['pike push-ups', 'bodyweight'],
  ['pike push ups', 'bodyweight'],
  // Dumbbell (exact matches beyond substring)
  ['lateral raises', 'dumbbell'],
  ['front raises', 'dumbbell'],
  ['hammer curls', 'dumbbell'],
  ['concentration curls', 'dumbbell'],
  ['bicep curls', 'dumbbell'],
  ['reverse flyes', 'dumbbell'],
  ['arnold press', 'dumbbell'],
  ['goblet squats', 'dumbbell'],
  ['shrugs', 'dumbbell'],
]);

export function getEquipmentType(exerciseName: string): EquipmentType {
  const lower = exerciseName.toLowerCase().trim();

  // Exact match first
  const exact = equipmentMap.get(lower);
  if (exact) return exact;

  // Substring checks
  if (lower.includes('dumbbell') || lower.includes('db ')) return 'dumbbell';
  if (lower.includes('barbell') || lower.includes('bb ')) return 'barbell';
  if (lower.includes('cable')) return 'cable';
  if (lower.includes('machine') || lower.includes('smith')) return 'machine';

  return 'other';
}

export function isBodyweight(exerciseName: string): boolean {
  return getEquipmentType(exerciseName) === 'bodyweight';
}
