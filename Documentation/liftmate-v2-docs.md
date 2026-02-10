# LiftMate - Personal Fitness Tracker PWA

## Overview

A beautifully designed Progressive Web App for tracking workouts, daily habits, nutrition, and fitness goals. Built in three phases: personal use → girlfriend → universal.

---

## What's New in This Version

| Feature | Description |
|---------|-------------|
| **Phased Rollout** | v1 for you, v2 adds girlfriend's routine, v3 universal |
| **Flexible Workouts** | Choose exercises per muscle group (not hardcoded) |
| **YouTube Integration** | Exercise demo videos embedded |
| **Nutrition Section** | Visual snack/meal ideas with macros |
| **Event Timeline** | Track supplement starts, diet changes on analytics charts |
| **Agent Teams** | Prompts designed for parallel Claude Code agents |

---

## Phase Strategy

### Phase 1: Your Personal App (~1.5 hours)
- Firebase auth + Firestore
- Men's Push/Pull/Legs+Shoulders routine (pre-loaded)
- Exercise selection (3-5 options per muscle group)
- Core tracking (sets, reps, weight)
- Today dashboard, basic analytics
- **Result**: Working app for you

### Phase 2: Add Your Girlfriend (~1 hour)
- Simple onboarding (name + gender)
- Women's routine (pre-loaded)
- Route to appropriate routine based on gender
- YouTube exercise videos
- Improved UI polish
- **Result**: App works for both of you

### Phase 3: Universal + Extras (~1.5 hours)
- Full customization (create your own routines)
- Nutrition section with snack gallery
- Event timeline on analytics
- Goals with milestones
- Export/import data
- **Result**: Shareable with any friend

---

## Workout System Architecture

### The Core Concept

```
Day Type (e.g., "Push")
  └── Target Muscle Groups (e.g., Chest, Triceps)
       └── Exercise Options (3-5 per muscle, user picks which ones)
            └── Sets/Reps/Weight (logged during workout)
```

### Example: Push Day

```
PUSH DAY
├── Chest (pick 2)
│   ├── Bench Press
│   ├── Incline Dumbbell Press
│   ├── Cable Flyes
│   ├── Dumbbell Flyes
│   └── Push-ups (weighted)
│
└── Triceps (pick 2)
    ├── Tricep Pushdowns
    ├── Skull Crushers
    ├── Overhead Tricep Extension
    ├── Close-grip Bench Press
    └── Dips
```

### Workout Flow

```
1. Select Day Type → Push / Pull / Legs+Shoulders / Rest
2. For each muscle group in that day:
   → Show 3-5 exercise options with YouTube thumbnails
   → User selects which exercises they want today
3. Warmup phase (stretches for selected day)
4. Execute workout (log sets/reps/weight for each selected exercise)
5. Optional: Cardio or Abs
6. Summary + save
```

---

## Data Model

### Firestore Structure

```
users/{userId}/
├── profile
│   ├── name: string
│   ├── gender: 'male' | 'female' | 'other'
│   ├── defaultRestTimer: number
│   └── createdAt: timestamp
│
├── checklist/{itemId}
│   ├── name: string
│   └── order: number
│
├── routines/{routineId}  // Pre-loaded or custom
│   ├── name: string
│   ├── gender: 'male' | 'female' | 'all'
│   └── dayTypes: DayType[]
│
├── workoutLogs/{logId}
│   ├── date: string
│   ├── dayTypeName: string
│   ├── exercises: ExerciseLog[]
│   ├── cardioOrAbs: object | null
│   ├── energyRating: number
│   └── completedAt: timestamp
│
├── dailyLogs/{YYYY-MM-DD}
│   ├── weight: number
│   ├── checklist: { [itemId]: boolean }
│   ├── sauna: boolean
│   └── coldPlunge: boolean
│
├── goals/{goalId}
│   ├── title: string
│   ├── milestones: Milestone[]
│   └── ...
│
├── events/{eventId}  // NEW: For timeline
│   ├── date: string
│   ├── type: 'supplement_start' | 'supplement_stop' | 'diet_change' | 'injury' | 'other'
│   ├── label: string  // e.g., "Started Creatine"
│   └── color: string  // For chart marker
│
└── nutrition/favorites  // NEW: Saved snack/meal ideas
    └── items: NutritionItem[]
```

### TypeScript Types

```typescript
interface DayType {
  id: string;
  name: string; // 'Push', 'Pull', 'Legs + Shoulders'
  muscleGroups: MuscleGroup[];
  warmups: Warmup[];
}

interface MuscleGroup {
  id: string;
  name: string; // 'Chest', 'Triceps', etc.
  targetExercises: number; // How many to pick (e.g., 2)
  exerciseOptions: Exercise[];
}

interface Exercise {
  id: string;
  name: string;
  youtubeId?: string; // YouTube video ID for demo
  targetSets: number;
  notes?: string;
}

interface Warmup {
  id: string;
  name: string;
  description: string;
  duration: number;
  youtubeId?: string;
}

interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  sets: SetLog[];
}

interface SetLog {
  reps: number;
  weight: number;
  isPR?: boolean;
}

interface TimelineEvent {
  id: string;
  date: string;
  type: 'supplement_start' | 'supplement_stop' | 'diet_change' | 'injury' | 'milestone' | 'other';
  label: string;
  color?: string;
  notes?: string;
}

interface NutritionItem {
  id: string;
  name: string;
  category: 'snack' | 'meal' | 'drink';
  imageUrl: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string;
  store?: string; // Where to buy
}
```

---

## Pre-loaded Routines

### Men's Routine (Phase 1)

```typescript
const mensRoutine: Routine = {
  id: 'mens-ppl',
  name: 'Push/Pull/Legs + Shoulders',
  gender: 'male',
  dayTypes: [
    {
      id: 'push',
      name: 'Push',
      muscleGroups: [
        {
          name: 'Chest',
          targetExercises: 2,
          exerciseOptions: [
            { name: 'Bench Press', youtubeId: 'rT7DgCr-3pg', targetSets: 4 },
            { name: 'Incline Dumbbell Press', youtubeId: '8iPEnn-ltC8', targetSets: 3 },
            { name: 'Cable Flyes', youtubeId: 'Iwe6AmxVf7o', targetSets: 3 },
            { name: 'Dumbbell Flyes', youtubeId: 'eozdVDA78K0', targetSets: 3 },
            { name: 'Push-ups', youtubeId: 'IODxDxX7oi4', targetSets: 3 },
          ]
        },
        {
          name: 'Triceps',
          targetExercises: 2,
          exerciseOptions: [
            { name: 'Tricep Pushdowns', youtubeId: '2-LAMcpzODU', targetSets: 3 },
            { name: 'Skull Crushers', youtubeId: 'd_KZxkY_0cM', targetSets: 3 },
            { name: 'Overhead Extension', youtubeId: 'YbX7Wd8jQ-Q', targetSets: 3 },
            { name: 'Close-grip Bench', youtubeId: 'nEF0bv2FW94', targetSets: 3 },
            { name: 'Dips', youtubeId: 'wjUmnZH528Y', targetSets: 3 },
          ]
        }
      ],
      warmups: [
        { name: 'Arm Circles', description: 'Large circles forward then backward', duration: 30 },
        { name: 'Shoulder Stretch', description: 'Cross-body arm pull', duration: 30 },
        { name: 'Chest Opener', description: 'Doorway stretch', duration: 30 },
      ]
    },
    {
      id: 'pull',
      name: 'Pull',
      muscleGroups: [
        {
          name: 'Back',
          targetExercises: 2,
          exerciseOptions: [
            { name: 'Pull-ups', youtubeId: 'eGo4IYlbE5g', targetSets: 4 },
            { name: 'Barbell Rows', youtubeId: 'FWJR5Ve8bnQ', targetSets: 4 },
            { name: 'Lat Pulldowns', youtubeId: 'CAwf7n6Luuc', targetSets: 3 },
            { name: 'Seated Cable Rows', youtubeId: 'GZbfZ033f74', targetSets: 3 },
            { name: 'Dumbbell Rows', youtubeId: 'roCP6wCXPqo', targetSets: 3 },
          ]
        },
        {
          name: 'Biceps',
          targetExercises: 2,
          exerciseOptions: [
            { name: 'Barbell Curls', youtubeId: 'kwG2ipFRgfo', targetSets: 3 },
            { name: 'Dumbbell Curls', youtubeId: 'ykJmrZ5v0Oo', targetSets: 3 },
            { name: 'Hammer Curls', youtubeId: 'zC3nLlEvin4', targetSets: 3 },
            { name: 'Preacher Curls', youtubeId: 'fIWP-FRFNU0', targetSets: 3 },
            { name: 'Cable Curls', youtubeId: 'NFzTWp2qpiE', targetSets: 3 },
          ]
        }
      ],
      warmups: [
        { name: 'Cat-Cow', description: 'Arch and round your back', duration: 30 },
        { name: 'Band Pull-aparts', description: 'Resistance band pulls', duration: 30 },
        { name: 'Dead Hangs', description: 'Hang from pull-up bar', duration: 30 },
      ]
    },
    {
      id: 'legs-shoulders',
      name: 'Legs + Shoulders',
      muscleGroups: [
        {
          name: 'Quads/Glutes',
          targetExercises: 2,
          exerciseOptions: [
            { name: 'Squats', youtubeId: 'ultWZbUMPL8', targetSets: 4 },
            { name: 'Leg Press', youtubeId: 'IZxyjW7MPJQ', targetSets: 4 },
            { name: 'Lunges', youtubeId: 'QOVaHwm-Q6U', targetSets: 3 },
            { name: 'Leg Extensions', youtubeId: 'YyvSfVjQeL0', targetSets: 3 },
            { name: 'Bulgarian Split Squats', youtubeId: '2C-uNgKwPLE', targetSets: 3 },
          ]
        },
        {
          name: 'Shoulders',
          targetExercises: 2,
          exerciseOptions: [
            { name: 'Overhead Press', youtubeId: '2yjwXTZQDDI', targetSets: 4 },
            { name: 'Lateral Raises', youtubeId: '3VcKaXpzqRo', targetSets: 4 },
            { name: 'Front Raises', youtubeId: '-t7fuZ0KhDA', targetSets: 3 },
            { name: 'Rear Delt Flyes', youtubeId: 'EA7u4Q_8HQ0', targetSets: 3 },
            { name: 'Arnold Press', youtubeId: '3ml7BH7mNwQ', targetSets: 3 },
          ]
        }
      ],
      warmups: [
        { name: 'Hip Circles', description: 'Large circles with hips', duration: 30 },
        { name: 'Leg Swings', description: 'Forward and side swings', duration: 30 },
        { name: 'Bodyweight Squats', description: 'Slow, controlled squats', duration: 30 },
      ]
    }
  ]
};
```

### Women's Routine (Phase 2)

```typescript
const womensRoutine: Routine = {
  id: 'womens-full',
  name: 'Full Body Split',
  gender: 'female',
  dayTypes: [
    {
      id: 'lower-glutes',
      name: 'Lower Body - Glute Focus',
      muscleGroups: [
        {
          name: 'Glutes',
          targetExercises: 2,
          exerciseOptions: [
            { name: 'Hip Thrusts', youtubeId: 'SEdqd1n0cvg', targetSets: 4 },
            { name: 'Romanian Deadlifts', youtubeId: 'jEy_czb3RKA', targetSets: 4 },
            { name: 'Cable Kickbacks', youtubeId: 'KXvE5jK2-nM', targetSets: 3 },
            { name: 'Glute Bridges', youtubeId: '8bbE64NuDTU', targetSets: 3 },
            { name: 'Sumo Squats', youtubeId: '9ZuXKqRbT9k', targetSets: 3 },
          ]
        },
        {
          name: 'Hamstrings',
          targetExercises: 2,
          exerciseOptions: [
            { name: 'Leg Curls', youtubeId: '1Tq3QdYUuHs', targetSets: 3 },
            { name: 'Good Mornings', youtubeId: 'YA-h3n9L4YU', targetSets: 3 },
            { name: 'Nordic Curls', youtubeId: 'Cg4qPoGnTLo', targetSets: 3 },
            { name: 'Stiff Leg Deadlifts', youtubeId: 'CN_7cz3P-1U', targetSets: 3 },
          ]
        }
      ],
      warmups: [
        { name: 'Hip Circles', duration: 30 },
        { name: 'Glute Bridges', duration: 30 },
        { name: 'Leg Swings', duration: 30 },
      ]
    },
    {
      id: 'upper',
      name: 'Upper Body',
      muscleGroups: [
        {
          name: 'Back & Shoulders',
          targetExercises: 2,
          exerciseOptions: [
            { name: 'Lat Pulldowns', youtubeId: 'CAwf7n6Luuc', targetSets: 3 },
            { name: 'Seated Rows', youtubeId: 'GZbfZ033f74', targetSets: 3 },
            { name: 'Face Pulls', youtubeId: 'rep-qVOkqgk', targetSets: 3 },
            { name: 'Lateral Raises', youtubeId: '3VcKaXpzqRo', targetSets: 3 },
            { name: 'Reverse Flyes', youtubeId: 'EA7u4Q_8HQ0', targetSets: 3 },
          ]
        },
        {
          name: 'Arms & Chest',
          targetExercises: 2,
          exerciseOptions: [
            { name: 'Push-ups', youtubeId: 'IODxDxX7oi4', targetSets: 3 },
            { name: 'Tricep Dips', youtubeId: '0326dy_-CzM', targetSets: 3 },
            { name: 'Bicep Curls', youtubeId: 'ykJmrZ5v0Oo', targetSets: 3 },
            { name: 'Chest Press Machine', youtubeId: 'xUm0BiZCWlQ', targetSets: 3 },
          ]
        }
      ],
      warmups: [
        { name: 'Arm Circles', duration: 30 },
        { name: 'Shoulder Rolls', duration: 30 },
        { name: 'Cat-Cow', duration: 30 },
      ]
    },
    {
      id: 'lower-quads',
      name: 'Lower Body - Quad Focus',
      muscleGroups: [
        {
          name: 'Quads',
          targetExercises: 2,
          exerciseOptions: [
            { name: 'Goblet Squats', youtubeId: 'MeIiIdhvXT4', targetSets: 4 },
            { name: 'Leg Press', youtubeId: 'IZxyjW7MPJQ', targetSets: 4 },
            { name: 'Leg Extensions', youtubeId: 'YyvSfVjQeL0', targetSets: 3 },
            { name: 'Walking Lunges', youtubeId: 'L8fvypPrzzs', targetSets: 3 },
            { name: 'Step Ups', youtubeId: 'dQqApCGd5Ss', targetSets: 3 },
          ]
        },
        {
          name: 'Calves & Core',
          targetExercises: 2,
          exerciseOptions: [
            { name: 'Calf Raises', youtubeId: 'gwLzBJYoWlI', targetSets: 3 },
            { name: 'Planks', youtubeId: 'ASdvN_XEl_c', targetSets: 3 },
            { name: 'Russian Twists', youtubeId: 'wkD8rjkodUI', targetSets: 3 },
            { name: 'Dead Bug', youtubeId: 'I5xbsA71v1A', targetSets: 3 },
          ]
        }
      ],
      warmups: [
        { name: 'Bodyweight Squats', duration: 30 },
        { name: 'Hip Flexor Stretch', duration: 30 },
        { name: 'Ankle Circles', duration: 30 },
      ]
    }
  ]
};
```

---

## Nutrition Section (Phase 3)

### Pre-loaded Snack Ideas

```typescript
const defaultNutritionItems: NutritionItem[] = [
  {
    name: 'Almonds (1/4 cup)',
    category: 'snack',
    imageUrl: '/images/nutrition/almonds.jpg',
    calories: 207,
    protein: 8,
    carbs: 7,
    fat: 18,
    store: 'Any grocery store'
  },
  {
    name: 'Greek Yogurt',
    category: 'snack',
    imageUrl: '/images/nutrition/greek-yogurt.jpg',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0,
    notes: 'Add berries for extra flavor'
  },
  {
    name: 'Protein Bar (Quest)',
    category: 'snack',
    imageUrl: '/images/nutrition/quest-bar.jpg',
    calories: 190,
    protein: 21,
    carbs: 21,
    fat: 8,
    store: 'Costco, Amazon'
  },
  {
    name: 'Hard Boiled Eggs (2)',
    category: 'snack',
    imageUrl: '/images/nutrition/eggs.jpg',
    calories: 140,
    protein: 12,
    carbs: 1,
    fat: 10,
    notes: 'Prep on Sunday for the week'
  },
  {
    name: 'Cottage Cheese',
    category: 'snack',
    imageUrl: '/images/nutrition/cottage-cheese.jpg',
    calories: 110,
    protein: 14,
    carbs: 5,
    fat: 4,
  },
  {
    name: 'Prepared Salad (Aldi)',
    category: 'meal',
    imageUrl: '/images/nutrition/aldi-salad.jpg',
    calories: 250,
    protein: 8,
    carbs: 15,
    fat: 18,
    store: 'Aldi'
  },
  {
    name: 'Beef Jerky',
    category: 'snack',
    imageUrl: '/images/nutrition/jerky.jpg',
    calories: 116,
    protein: 9,
    carbs: 3,
    fat: 7,
    store: 'Costco'
  },
  {
    name: 'String Cheese',
    category: 'snack',
    imageUrl: '/images/nutrition/string-cheese.jpg',
    calories: 80,
    protein: 7,
    carbs: 1,
    fat: 6,
  },
  {
    name: 'Apple + Peanut Butter',
    category: 'snack',
    imageUrl: '/images/nutrition/apple-pb.jpg',
    calories: 267,
    protein: 7,
    carbs: 29,
    fat: 16,
  },
  {
    name: 'Protein Shake',
    category: 'drink',
    imageUrl: '/images/nutrition/protein-shake.jpg',
    calories: 120,
    protein: 25,
    carbs: 3,
    fat: 1,
    notes: 'Post-workout essential'
  },
  // Add more...
];
```

### Nutrition Page UI

```
┌─────────────────────────────────┐
│ Nutrition Ideas           [+]  │
├─────────────────────────────────┤
│ Filter: [All] [Snacks] [Meals] │
├─────────────────────────────────┤
│ ┌─────┬─────┬─────┐            │
│ │ 🥜  │ 🥛  │ 🍳  │            │ ← Grid of images
│ │Alm  │Yogu │Eggs │            │
│ │207  │100  │140  │            │ ← Calories
│ └─────┴─────┴─────┘            │
│ ┌─────┬─────┬─────┐            │
│ │ 🧀  │ 🥗  │ 🍎  │            │
│ │Cott │Salad│Apple│            │
│ │110  │250  │267  │            │
│ └─────┴─────┴─────┘            │
├─────────────────────────────────┤
│ Tap any item for full details  │
└─────────────────────────────────┘
```

---

## Timeline Events Feature (Phase 3)

### How It Works

Events are markers that overlay on your analytics charts, showing when you started/stopped supplements, changed diet, etc.

```
Weight Chart with Events:
                                      
  │                    ┊ Started    
  │              ●    ┊ Creatine   
185├────────●────────────┊──●────────
  │      ●              ┊    ●●
180├───●────────────────────────────
  │ ●
175├────────────────────────────────
  └─────────────────────────────────
   Jan    Feb    Mar    Apr    May
```

### Event Types

| Type | Icon | Example |
|------|------|---------|
| `supplement_start` | 💊 | Started Creatine |
| `supplement_stop` | ⏹️ | Stopped Pre-workout |
| `diet_change` | 🍽️ | Started cutting |
| `injury` | 🤕 | Shoulder strain |
| `milestone` | 🎯 | Hit 200lb bench |
| `other` | 📌 | Vacation week |

### Adding Events

```
┌─────────────────────────────────┐
│ Add Event                   [×] │
├─────────────────────────────────┤
│ Date: [Feb 1, 2025     📅]     │
│                                 │
│ Type: [Supplement Start  ▼]    │
│                                 │
│ Label: [Started Creatine    ]  │
│                                 │
│ Notes: [5g daily          ]    │
│                                 │
│ [Cancel]            [Save]     │
└─────────────────────────────────┘
```

### Implementation with Recharts

```tsx
import { LineChart, Line, ReferenceLine, XAxis, YAxis, Tooltip } from 'recharts';

// Render events as ReferenceLine components
{events.map(event => (
  <ReferenceLine
    key={event.id}
    x={event.date}
    stroke={event.color || '#8884d8'}
    strokeDasharray="3 3"
    label={{ value: event.label, position: 'top', fontSize: 10 }}
  />
))}
```

---

## Claude Code Agent Teams - Quick Lesson

### What Are Agent Teams?

Agent teams let you run **multiple Claude Code instances in parallel** that coordinate with each other. Instead of one agent working sequentially, you have:

- **Team Lead**: Coordinates work, spawns teammates, synthesizes results
- **Teammates**: Independent Claude instances working on specific tasks
- **Shared Task List**: With dependencies and auto-unblocking
- **Direct Messaging**: Teammates can communicate with each other

### When to Use Agent Teams

✅ **Good for:**
- Features spanning frontend, backend, and tests
- Parallel work on independent files
- Research from multiple angles

❌ **Not good for:**
- Small tasks (overhead not worth it)
- Same-file edits (merge conflicts)
- Sequential dependencies

### How to Enable

Add to your `settings.json`:
```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### Key Commands

| Command | What It Does |
|---------|--------------|
| `Shift+Tab` | Lock lead into delegation mode (stops it from coding) |
| `Shift+Up/Down` | Select a teammate to message |
| `Ctrl+T` | Toggle task list view |
| `Escape` | Interrupt current teammate |

### Best Practices

1. **Task sizing**: 5-6 tasks per teammate
2. **File ownership**: Each teammate owns different files
3. **Specific context**: Include file paths, constraints, "what done looks like"
4. **Delegate mode**: Use `Shift+Tab` to stop lead from coding

---

## Implementation Phases with Agent Team Prompts

### How to Use These Prompts

1. Enable agent teams: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
2. Copy the phase prompt into Claude Code
3. Claude will spawn teammates and coordinate
4. Use `Shift+Tab` to keep lead in delegation mode
5. Monitor progress with `Ctrl+T` (task list)

---

## PHASE 1: MVP for You (~1.5 hours)

### Phase 1 Prompt

```
Create a React PWA fitness app called "LiftMate" using agent teams for parallel development.

## TEAM STRUCTURE
Create an agent team with 4 teammates:
1. **setup-agent**: Project setup, Firebase config, auth
2. **data-agent**: TypeScript types, Firestore helpers, seed data
3. **ui-agent**: Reusable components, styling, navigation
4. **pages-agent**: Today page, basic workout flow

## SETUP AGENT TASKS

Task 1: Initialize project
- npm create vite@latest liftmate -- --template react-ts
- Install: react-router-dom, recharts, firebase, canvas-confetti
- Install dev: tailwindcss, postcss, autoprefixer
- Initialize Tailwind with custom config

Task 2: Tailwind theme (tailwind.config.js)
Colors:
- bg: '#0F172A'
- card: '#1E293B'  
- primary: '#3B82F6'
- success: '#10B981'
- text: '#F8FAFC'
- muted: '#94A3B8'
- border: '#334155'

Task 3: Firebase setup (src/lib/firebase.ts)
- Initialize Firebase from env vars
- Export auth and db
- Create .env.local template

Task 4: Auth hook (src/hooks/useAuth.ts)
- Track user state
- signInWithGoogle, signOut functions
- Return { user, loading, signIn, signOut }

## DATA AGENT TASKS

Task 5: TypeScript types (src/types/index.ts)
Define all interfaces:
- UserProfile, DayType, MuscleGroup, Exercise, Warmup
- WorkoutTemplate, WorkoutLog, ExerciseLog, SetLog
- DailyLog, ChecklistItem, Goal, Milestone, TimelineEvent

Task 6: Firestore hooks (src/hooks/useFirestore.ts)
- useDocument<T>(path)
- useCollection<T>(path)
- setDocument, updateDocument, deleteDocument, addDocument

Task 7: Default data (src/data/defaultRoutines.ts)
Create men's Push/Pull/Legs+Shoulders routine with:
- 3 day types (Push, Pull, Legs+Shoulders)
- Each has 2 muscle groups
- Each muscle group has 5 exercise options with YouTube IDs
- Include warmups for each day

Task 8: Seed data function
When user first signs in, create:
- Profile document
- Default checklist items
- Men's routine

## UI AGENT TASKS

Task 9: UI components (src/components/ui/)
Create with Tailwind:
- Button.tsx (primary, secondary, ghost variants)
- Card.tsx (dark container with border)
- Input.tsx (styled for dark theme)
- CircularTimer.tsx (SVG countdown)
- ProgressBar.tsx

Task 10: Navigation (src/components/Navigation.tsx)
Fixed bottom nav with 5 tabs:
- Today, Workout, Analytics, Goals, Settings
- SVG icons, active state shows primary blue

Task 11: PWA setup
- public/manifest.json
- Add meta tags to index.html
- Create simple SVG icon

## PAGES AGENT TASKS

Task 12: App shell (src/App.tsx)
- AuthProvider context
- Login page if not authenticated
- React Router with 5 routes
- Wrap with Navigation

Task 13: Login page (src/pages/Login.tsx)
- Centered design
- App name + icon
- "Sign in with Google" button

Task 14: Today page (src/pages/Today.tsx)
Components:
- GreetingHeader (time-based greeting, streak 🔥)
- WorkoutCard (suggests next day type)
- Checklist (toggleable items, saves to Firestore)
- QuickLog (weight input, sauna/cold plunge toggles)

Task 15: Basic workout flow shell (src/pages/Workout.tsx)
- Step indicator (1-6)
- DaySelector component (Push/Pull/Legs+Shoulders/Rest)
- Placeholder for other steps
- Cancel button with confirmation

## DESIGN REQUIREMENTS
- Mobile-first (max-width 430px)
- Touch-friendly (44px+ tap targets)
- Deep navy background
- Subtle animations on interactions

## COORDINATION
- setup-agent completes first (others depend on it)
- data-agent and ui-agent can work in parallel
- pages-agent starts after data and ui have types and components ready

When all tasks complete, the app should:
1. Allow Google sign-in
2. Show Today page with working checklist
3. Navigate between all pages
4. Have day selection working in Workout page
```

---

## PHASE 2: Add Girlfriend's Routine (~1 hour)

### Phase 2 Prompt

```
Extend LiftMate to support multiple users with different routines. Use agent teams.

## TEAM STRUCTURE
Create an agent team with 3 teammates:
1. **onboarding-agent**: Gender selection, profile setup
2. **routine-agent**: Women's routine, exercise videos
3. **workout-agent**: Complete workout flow with exercise selection

## ONBOARDING AGENT TASKS

Task 1: Update profile type
Add gender field: 'male' | 'female' | 'other'

Task 2: Onboarding flow (src/pages/Onboarding.tsx)
Show after first sign-in if no profile exists:
- Welcome screen
- Name input
- Gender selection (large buttons: Male, Female, Other)
- Save to profile, redirect to Today

Task 3: Update App.tsx routing
- Check if profile.gender exists
- If not, redirect to /onboarding
- Otherwise show normal app

## ROUTINE AGENT TASKS

Task 4: Women's routine (add to src/data/defaultRoutines.ts)
Full Body Split with 3 day types:
- Lower Body - Glute Focus (Glutes + Hamstrings)
- Upper Body (Back/Shoulders + Arms/Chest)
- Lower Body - Quad Focus (Quads + Calves/Core)

Each muscle group has 4-5 exercise options with real YouTube IDs.
Include warmups for each day.

Task 5: Routine loader
Create function that returns correct routine based on user gender:
- Male → Men's PPL routine
- Female → Women's Full Body routine
- Other → Let user choose

Task 6: YouTube embed component (src/components/ui/YouTubeThumb.tsx)
- Show YouTube thumbnail for exercise
- Tap to open modal with embedded video
- Use youtube-nocookie.com for privacy

## WORKOUT AGENT TASKS

Task 7: Exercise selector (src/components/workout/ExerciseSelector.tsx)
For each muscle group:
- Show header: "Choose 2 exercises for [Muscle]"
- Grid of exercise cards with:
  - YouTube thumbnail
  - Exercise name
  - Target sets
  - Checkmark when selected
- "Continue" button when enough selected

Task 8: Complete warmup carousel (src/components/workout/WarmupCarousel.tsx)
- One warmup at a time
- Name, description
- CircularTimer countdown
- Progress dots
- Skip / Skip All buttons

Task 9: Exercise tracker (src/components/workout/ExerciseTracker.tsx)
For each selected exercise:
- Exercise name + video button
- Set rows: reps input, weight input, confirm button
- Auto rest timer after confirming set
- Previous performance hint
- PR detection

Task 10: Cardio/Abs selector (src/components/workout/CardioAbsSelector.tsx)
- Three buttons: Cardio, Abs, Skip
- Cardio: activity dropdown + duration
- Abs: simplified exercise logging

Task 11: Workout summary (src/components/workout/WorkoutSummary.tsx)
- Stats: duration, exercises, sets, volume
- PR list with celebration
- Energy rating (1-5)
- Save button → Firestore

Task 12: Wire up complete flow in Workout.tsx
Steps 1-6 fully functional

## COORDINATION
- onboarding-agent works independently
- routine-agent creates data, workout-agent builds UI
- workout-agent needs routine-agent's data types
```

---

## PHASE 3: Universal + Extras (~1.5 hours)

### Phase 3 Prompt

```
Add universal customization, nutrition section, timeline events, and goals to LiftMate. Use agent teams.

## TEAM STRUCTURE
Create an agent team with 4 teammates:
1. **custom-agent**: Custom routine builder
2. **nutrition-agent**: Nutrition section with snack gallery
3. **analytics-agent**: Charts with timeline events
4. **goals-agent**: Goals page with milestones

## CUSTOM AGENT TASKS

Task 1: Routine builder page (src/pages/RoutineBuilder.tsx)
Allow creating custom routines:
- Routine name
- Add day types
- For each day type:
  - Name it
  - Add muscle groups
  - For each muscle group: add exercise options
- Save to Firestore under user's routines

Task 2: Routine selector
If user has custom routines, show picker on Workout page.

Task 3: Settings page updates (src/pages/Settings.tsx)
- Profile section (name, gender)
- Rest timer duration
- Checklist item management
- Routine management (view, delete custom)
- Export data as JSON
- Sign out

## NUTRITION AGENT TASKS

Task 4: Nutrition types
Add to types/index.ts:
- NutritionItem { name, category, imageUrl, calories, protein, carbs, fat, notes, store }

Task 5: Default nutrition data (src/data/defaultNutrition.ts)
Pre-load 15-20 snack/meal ideas:
- Almonds, Greek yogurt, protein bars, eggs, cottage cheese
- Beef jerky, string cheese, apple + PB
- Prepared salads, protein shakes
Include placeholder image URLs (use Unsplash or similar)

Task 6: Nutrition page (src/pages/Nutrition.tsx)
- Filter tabs: All, Snacks, Meals, Drinks
- Grid of items showing:
  - Image
  - Name
  - Calories badge
- Tap for detail modal:
  - Full macros
  - Notes
  - Where to buy

Task 7: Add Nutrition to navigation
6th tab or nested under Settings

## ANALYTICS AGENT TASKS

Task 8: Timeline events types and Firestore
- TimelineEvent type
- CRUD functions for events collection

Task 9: Add Event form (src/components/analytics/AddEventForm.tsx)
Modal with:
- Date picker
- Type dropdown (supplement_start, supplement_stop, diet_change, injury, milestone, other)
- Label text input
- Notes textarea
- Save button

Task 10: Events list (src/components/analytics/EventsList.tsx)
- Show recent events
- Edit/delete options
- "+ Add Event" button

Task 11: Exercise progression chart with events (src/components/analytics/ExerciseChart.tsx)
- Recharts LineChart for selected exercise
- Dropdown to pick exercise
- Time range filter (1M, 3M, 6M, All)
- Overlay TimelineEvents as ReferenceLine components
- Tooltip shows event label on hover

Task 12: Body weight chart with events (src/components/analytics/BodyWeightChart.tsx)
- Similar to exercise chart
- Green line
- Events overlaid
- Trend indicator

Task 13: Stats summary (src/components/analytics/StatsSummary.tsx)
- Total workouts
- Current streak
- Weekly volume
- PRs this month

Task 14: Workout calendar heatmap (src/components/analytics/WorkoutCalendar.tsx)
- 12 weeks grid
- Color by day type or intensity
- Tap shows date and workout

Task 15: Assemble Analytics page (src/pages/Analytics.tsx)
- StatsSummary
- ExerciseChart
- BodyWeightChart
- WorkoutCalendar
- EventsList

## GOALS AGENT TASKS

Task 16: Goals page (src/pages/Goals.tsx)
- List active goals
- Each goal shows:
  - Title
  - Progress bar (% milestones complete)
  - Target date
- Expandable to show milestones
- Completed goals section (collapsed)
- "+ Add Goal" FAB

Task 17: Goal form (src/components/goals/GoalForm.tsx)
Modal for create/edit:
- Title (required)
- Description
- Target date
- Milestones list:
  - Each: title + target date
  - Add/remove buttons
- Save/Cancel

Task 18: Milestone toggle
Tap milestone checkbox → update Firestore
Show completion date when done

Task 19: Goals preview on Today page
Update Today page to show top 2 active goals with progress

## FINAL POLISH

Task 20: Loading skeletons
Add to all pages

Task 21: Empty states
Friendly messages when no data

Task 22: Toast notifications
Simple toast system for feedback

Task 23: PR celebration
Use canvas-confetti on PR achievement

## COORDINATION
- custom-agent and nutrition-agent work independently
- analytics-agent builds charts and timeline
- goals-agent builds goals system
- All integrate into existing navigation
```

---

## File Structure (Final)

```
liftmate/
├── public/
│   ├── manifest.json
│   ├── icon.svg
│   └── images/nutrition/     # Snack images
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── CircularTimer.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── YouTubeThumb.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Confetti.tsx
│   │   ├── today/
│   │   │   ├── GreetingHeader.tsx
│   │   │   ├── WorkoutCard.tsx
│   │   │   ├── Checklist.tsx
│   │   │   ├── QuickLog.tsx
│   │   │   └── GoalsPreview.tsx
│   │   ├── workout/
│   │   │   ├── DaySelector.tsx
│   │   │   ├── WarmupCarousel.tsx
│   │   │   ├── ExerciseSelector.tsx
│   │   │   ├── ExerciseTracker.tsx
│   │   │   ├── RestTimer.tsx
│   │   │   ├── SetRow.tsx
│   │   │   ├── CardioAbsSelector.tsx
│   │   │   └── WorkoutSummary.tsx
│   │   ├── analytics/
│   │   │   ├── StatsSummary.tsx
│   │   │   ├── ExerciseChart.tsx
│   │   │   ├── BodyWeightChart.tsx
│   │   │   ├── WorkoutCalendar.tsx
│   │   │   ├── EventsList.tsx
│   │   │   └── AddEventForm.tsx
│   │   ├── goals/
│   │   │   ├── GoalCard.tsx
│   │   │   ├── GoalForm.tsx
│   │   │   └── MilestoneList.tsx
│   │   └── nutrition/
│   │       ├── NutritionGrid.tsx
│   │       └── NutritionDetail.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Onboarding.tsx
│   │   ├── Today.tsx
│   │   ├── Workout.tsx
│   │   ├── Analytics.tsx
│   │   ├── Goals.tsx
│   │   ├── Nutrition.tsx
│   │   ├── Settings.tsx
│   │   └── RoutineBuilder.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFirestore.ts
│   │   ├── useTimer.ts
│   │   └── useWorkoutFlow.ts
│   ├── lib/
│   │   ├── firebase.ts
│   │   └── analytics.ts
│   ├── data/
│   │   ├── defaultRoutines.ts
│   │   ├── defaultChecklist.ts
│   │   └── defaultNutrition.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.local
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## Quick Reference

### Firebase Setup (Do First!)
1. console.firebase.google.com → Create project
2. Authentication → Enable Google
3. Firestore → Create database (test mode)
4. Project Settings → Web app → Copy config

### Key Dependencies
```bash
npm install react-router-dom recharts firebase canvas-confetti
npm install -D tailwindcss postcss autoprefixer
```

### Deploy
```bash
npm run build
npx netlify deploy --prod
```

### Agent Teams Checklist
- [ ] Enable: `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`
- [ ] Use `Shift+Tab` to keep lead delegating
- [ ] Check `Ctrl+T` for task progress
- [ ] Each teammate owns different files
