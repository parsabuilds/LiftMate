import type { Exercise, Routine, RoutineDay } from '../types';
import { mensRoutine, womensRoutine } from './defaultRoutines';
import { MUSCLE_GROUPS } from './exerciseCatalog';
import { getEquipmentType } from '../utils/exerciseEquipment';

// Every exercise the app knows about, merged from the built-in routines and
// the custom-routine catalog. Powers two things: demo videos for exercises
// that were saved without one, and the Add Exercise search.

export interface LibraryExercise extends Exercise {
  // Heading the exercise is listed under in the Add Exercise picker
  group: string;
}

// Picker headings, in display order. Unknown groups are listed after these.
export const LIBRARY_GROUPS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Legs', 'Glutes', 'Calves', 'Core'];

// Muscles each exercise trains. The first one is the heading it's listed
// under; the rest only help search. Keyed by lowercase name, punctuation as spaces.
const EXERCISE_MUSCLES: Record<string, string[]> = {
  'bench press': ['Chest'],
  'incline dumbbell press': ['Chest'],
  'incline barbell bench press': ['Chest'],
  'decline bench press': ['Chest'],
  'chest press machine': ['Chest'],
  'cable flyes': ['Chest'],
  'low cable flyes low to high': ['Chest'],
  'dumbbell chest fly': ['Chest'],
  'push ups': ['Chest'],
  'pull ups': ['Back'],
  'close grip pull ups': ['Back'],
  'lat pulldowns': ['Back'],
  'barbell rows': ['Back'],
  'seated cable rows': ['Back'],
  'seated rows': ['Back'],
  'face pulls': ['Back', 'Shoulders'],
  'overhead press': ['Shoulders'],
  'arnold press': ['Shoulders'],
  'lateral raises': ['Shoulders'],
  'front raises': ['Shoulders'],
  'reverse flyes': ['Shoulders', 'Back'],
  'shrugs': ['Shoulders', 'Traps'],
  'barbell curls': ['Biceps'],
  'bicep curls': ['Biceps'],
  'hammer curls': ['Biceps', 'Forearms'],
  'incline dumbbell curls': ['Biceps'],
  'preacher curls': ['Biceps'],
  'cable curls': ['Biceps'],
  'concentration curls': ['Biceps'],
  'tricep pushdowns': ['Triceps'],
  'overhead tricep extension': ['Triceps'],
  'skull crushers': ['Triceps'],
  'close grip bench press': ['Triceps', 'Chest'],
  'diamond push ups': ['Triceps', 'Chest'],
  'dips': ['Triceps', 'Chest'],
  'tricep dips': ['Triceps'],
  'wrist curls': ['Forearms'],
  'reverse wrist curls': ['Forearms'],
  'reverse curls': ['Forearms', 'Biceps'],
  'squats': ['Legs', 'Quads', 'Glutes'],
  'goblet squats': ['Legs', 'Quads', 'Glutes'],
  'bulgarian split squats': ['Legs', 'Quads', 'Glutes'],
  'leg press': ['Legs', 'Quads', 'Glutes'],
  'lunges': ['Legs', 'Quads', 'Glutes'],
  'walking lunges': ['Legs', 'Quads', 'Glutes'],
  'step ups': ['Legs', 'Quads', 'Glutes'],
  'leg extensions': ['Legs', 'Quads'],
  'leg curls': ['Legs', 'Hamstrings'],
  'nordic curls': ['Legs', 'Hamstrings'],
  'romanian deadlifts': ['Legs', 'Hamstrings', 'Glutes'],
  'stiff leg deadlifts': ['Legs', 'Hamstrings', 'Glutes'],
  'good mornings': ['Legs', 'Hamstrings', 'Glutes'],
  'hip adduction machine closing': ['Legs', 'Adductors'],
  'hip thrusts': ['Glutes'],
  'glute bridges': ['Glutes'],
  'cable kickbacks': ['Glutes'],
  'sumo squats': ['Glutes', 'Quads', 'Adductors'],
  'hip abduction machine opening': ['Glutes'],
  'calf raises': ['Calves'],
  'standing calf raises bodyweight on edge': ['Calves'],
  'planks': ['Core'],
  'crunches': ['Core'],
  'russian twists': ['Core'],
  'dead bug': ['Core'],
};

// Other words people use for a muscle.
const MUSCLE_ALIASES: Record<string, string[]> = {
  Chest: ['pec', 'pecs', 'pectoral'],
  Back: ['lat', 'lats'],
  Shoulders: ['delt', 'delts', 'deltoid'],
  Traps: ['trap', 'trapezius'],
  Biceps: ['arm', 'arms'],
  Triceps: ['arm', 'arms'],
  Forearms: ['grip', 'wrist', 'arm', 'arms'],
  Quads: ['quadricep', 'quadriceps', 'thigh', 'leg', 'legs'],
  Hamstrings: ['hammies', 'leg', 'legs'],
  Glutes: ['butt', 'booty', 'leg', 'legs'],
  Calves: ['leg', 'legs'],
  Adductors: ['inner thigh', 'groin', 'leg', 'legs'],
  Core: ['abs', 'ab', 'abdominal', 'abdominals', 'oblique', 'obliques', 'stomach'],
};

// Other names for an exercise, matched like the name itself.
const EXERCISE_ALIASES: Record<string, string[]> = {
  'overhead press': ['ohp', 'military press', 'shoulder press'],
  'arnold press': ['shoulder press'],
  'romanian deadlifts': ['rdl'],
  'stiff leg deadlifts': ['sldl', 'straight leg deadlift'],
  'pull ups': ['chin ups'],
  'close grip pull ups': ['chin ups'],
  'tricep pushdowns': ['rope pushdown', 'cable pushdown'],
  'skull crushers': ['lying tricep extension'],
  'crunches': ['sit ups'],
  'cable flyes': ['crossover'],
  'reverse flyes': ['rear delt fly'],
  'leg curls': ['hamstring curl'],
  'hip abduction machine opening': ['abductor', 'outer thigh'],
  'hip adduction machine closing': ['adductor', 'inner thigh'],
};

const EQUIPMENT_WORDS: Record<string, string[]> = {
  bodyweight: ['bodyweight'],
  dumbbell: ['dumbbell', 'db'],
  barbell: ['barbell', 'bb'],
  cable: ['cable'],
  machine: ['machine'],
};

const STOP_WORDS = new Set(['a', 'an', 'the', 'and', 'with', 'for', 'of', 'to', 'on', 'exercise', 'exercises', 'workout', 'workouts']);

// "Push-Ups (Wide)" -> "push ups wide"
function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function words(text: string): string[] {
  const n = normalize(text);
  return n ? n.split(' ') : [];
}

// Crude singular so "curls"/"curl", "flyes"/"flies"/"fly" and "calves"/"calf" compare equal.
function stem(word: string): string {
  if (word === 'calves') return 'calf';
  if (word.length > 4 && word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.length > 4 && /(yes|ches|shes|xes|sses)$/.test(word)) return word.slice(0, -2);
  if (word.length > 2 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
}

// Identity of an exercise by name, ignoring case, punctuation and plurals:
// "Push-Ups", "push ups" and "Push Up" share a key.
export function exerciseKey(name: string): string {
  return words(name).map(stem).join(' ');
}

function keyedTable(table: Record<string, string[]>): Map<string, string[]> {
  return new Map(Object.entries(table).map(([name, values]) => [exerciseKey(name), values]));
}

const MUSCLES_BY_KEY = keyedTable(EXERCISE_MUSCLES);
const ALIASES_BY_KEY = keyedTable(EXERCISE_ALIASES);

interface Sourced {
  exercise: Exercise;
  group: string;
}

function dayExercises(day: RoutineDay | null | undefined): Sourced[] {
  return (day?.muscleGroups ?? []).flatMap((mg) =>
    (mg.exercises ?? []).map((exercise) => ({ exercise, group: mg.name }))
  );
}

const BUILT_IN: Sourced[] = [
  ...[mensRoutine, womensRoutine].flatMap((r) => r.days.flatMap(dayExercises)),
  ...MUSCLE_GROUPS.flatMap((mg) => mg.exercises.map((exercise) => ({ exercise, group: mg.name }))),
];

const VIDEO_BY_KEY = new Map<string, string>();
for (const { exercise } of BUILT_IN) {
  const key = exerciseKey(exercise.name);
  if (exercise.youtubeId && !VIDEO_BY_KEY.has(key)) VIDEO_BY_KEY.set(key, exercise.youtubeId);
}

// Demo video for an exercise. Exercises saved without one (custom routines,
// catalog picks, workouts already in progress) use the video of the
// built-in exercise with the same name.
export function getVideoId(exercise: Pick<Exercise, 'name' | 'youtubeId'>): string | undefined {
  return exercise.youtubeId || VIDEO_BY_KEY.get(exerciseKey(exercise.name));
}

// Unknown exercises fall back to the group they were listed under, with
// combined groups like "Back & Shoulders" split into their muscles.
function musclesFor(name: string, sourceGroup: string): string[] {
  const known = MUSCLES_BY_KEY.get(exerciseKey(name));
  if (known) return known;
  const parts = sourceGroup.split(/\s*(?:&|\+|,|\/|\band\b)\s*/i).filter(Boolean);
  return parts.length > 0 ? parts : ['Other'];
}

function muscleWords(muscle: string): string[] {
  return [...words(muscle), ...(MUSCLE_ALIASES[muscle] ?? []).flatMap(words)];
}

interface SearchIndex {
  normalized: string;
  key: string;
  // Name, alternate names, and the name with spaces removed ("pushups")
  names: string[];
  compact: string;
  primary: string[];
  secondary: string[];
}

const INDEX = new WeakMap<LibraryExercise, SearchIndex>();

function buildIndex(exercise: Exercise, muscles: string[]): SearchIndex {
  const key = exerciseKey(exercise.name);
  const nameWords = words(exercise.name);
  const [primary, ...secondary] = muscles;
  return {
    normalized: nameWords.join(' '),
    key,
    names: [...nameWords, ...(ALIASES_BY_KEY.get(key) ?? []).flatMap(words)],
    compact: nameWords.join(''),
    primary: muscleWords(primary),
    secondary: [
      ...secondary.flatMap(muscleWords),
      ...(EQUIPMENT_WORDS[getEquipmentType(exercise.name)] ?? []),
    ],
  };
}

// Everything that can be added to a workout, de-duplicated by name. Earlier
// sources win, so an exercise keeps the id (and with it the history and PRs)
// it has in the user's own routine: today's day first, then the rest of the
// routine, then the built-in routines and the catalog.
export function buildExerciseLibrary(routineDay: RoutineDay | null, routine: Routine | null): LibraryExercise[] {
  const sources = [
    ...dayExercises(routineDay),
    ...(routine?.days ?? []).flatMap(dayExercises),
    ...BUILT_IN,
  ];
  const seen = new Set<string>();
  const library: LibraryExercise[] = [];
  for (const { exercise, group } of sources) {
    if (!exercise?.name) continue;
    const key = exerciseKey(exercise.name);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const muscles = musclesFor(exercise.name, group);
    const entry: LibraryExercise = { ...exercise, youtubeId: getVideoId(exercise), group: muscles[0] };
    INDEX.set(entry, buildIndex(entry, muscles));
    library.push(entry);
  }
  return library;
}

export function toExercise({ id, name, sets, reps, youtubeId }: LibraryExercise): Exercise {
  return youtubeId ? { id, name, sets, reps, youtubeId } : { id, name, sets, reps };
}

const EXACT = 2;
const PREFIX = 1;

function matchWords(list: string[], term: string, termStem: string): number {
  let best = 0;
  for (const w of list) {
    if (w === term || stem(w) === termStem) return EXACT;
    if (w.startsWith(term)) best = PREFIX;
  }
  return best;
}

// Optimal string alignment distance (edits, with adjacent swaps counting as one).
function editDistance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

// Typo match against a whole word or the start of one ("shoudler", "bicpe").
function fuzzyWords(list: string[], term: string): boolean {
  if (term.length < 4) return false;
  const max = term.length >= 7 ? 2 : 1;
  return list.some((w) =>
    editDistance(term, w) <= max ||
    (w.length > term.length && editDistance(term, w.slice(0, term.length)) <= max)
  );
}

function termScore(idx: SearchIndex, term: string, fuzzy: boolean): number {
  const termStem = stem(term);
  const name = matchWords(idx.names, term, termStem);
  if (name === EXACT) return 6;
  const primary = matchWords(idx.primary, term, termStem);
  if (primary === EXACT) return 5;
  if (name === PREFIX || (term.length >= 4 && idx.compact.includes(term))) return 4;
  if (primary === PREFIX) return 3;
  const secondary = matchWords(idx.secondary, term, termStem);
  if (secondary) return secondary + 1;
  if (fuzzy) {
    if (fuzzyWords(idx.names, term)) return 2;
    if (fuzzyWords([...idx.primary, ...idx.secondary], term)) return 1;
  }
  return 0;
}

// Ranked search over a library. Every word in the query has to match the
// exercise's name, an alternate name, a muscle it trains, or its equipment —
// so "bicep" finds Hammer Curls and "pushup" finds Push-Ups. If nothing
// matches, it retries allowing small typos.
export function searchExercises(library: LibraryExercise[], query: string): LibraryExercise[] {
  const all = words(query);
  const meaningful = all.filter((w) => !STOP_WORDS.has(w));
  const terms = meaningful.length > 0 ? meaningful : all;
  if (terms.length === 0) return [];
  const phrase = all.join(' ');
  const phraseKey = exerciseKey(query);

  const run = (fuzzy: boolean) =>
    library
      .map((entry, order) => {
        const idx = INDEX.get(entry) ?? buildIndex(entry, musclesFor(entry.name, entry.group));
        let score = 0;
        for (const term of terms) {
          const s = termScore(idx, term, fuzzy);
          if (s === 0) return null;
          score += s;
        }
        if (idx.key === phraseKey) score += 6;
        else if (idx.normalized.startsWith(phrase)) score += 3;
        return { entry, order, score };
      })
      .filter((r): r is { entry: LibraryExercise; order: number; score: number } => r !== null)
      .sort((a, b) => b.score - a.score || a.order - b.order)
      .map((r) => r.entry);

  const strict = run(false);
  return strict.length > 0 ? strict : run(true);
}
