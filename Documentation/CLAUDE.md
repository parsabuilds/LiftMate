# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LiftMate (internally "LiftMate") is a mobile-first Progressive Web App for fitness tracking. It supports multiple users with different workout routines (men's Push/Pull/Legs, women's Full Body Split), daily habit tracking, analytics with timeline events, nutrition ideas, and goal tracking with milestones.

The project is built in three phases:
- **Phase 1**: MVP with men's PPL routine, Google auth, daily dashboard, basic workout logging
- **Phase 2**: Onboarding (name + gender), women's routine, YouTube exercise demos, full workout flow with rest timer and PR detection
- **Phase 3**: Custom routine builder, nutrition section, timeline events on analytics charts, goals with milestones, data export

## Tech Stack

- **Framework**: React + TypeScript
- **Build Tool**: Vite (`react-ts` template)
- **Styling**: Tailwind CSS (dark theme only)
- **Backend**: Firebase (Firestore + Google Authentication)
- **Charts**: Recharts
- **Deployment**: Netlify

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npx netlify deploy --prod  # Deploy to Netlify
```

## Dependencies

```bash
# Runtime
npm install react-router-dom recharts firebase canvas-confetti

# Dev
npm install -D tailwindcss postcss autoprefixer
```

## Architecture

### Workout System (Core Concept)

The key abstraction: workouts are not fixed routines. Each day type targets muscle groups, and users **choose which exercises** to perform from a curated list per muscle group.

```
DayType → MuscleGroup[] → Exercise[] (user picks N) → SetLog[] (reps/weight per set)
```

Workout flow is a 6-step process: Day Selection → Exercise Selection → Warmups → Set Logging → Cardio/Abs → Summary & Save.

### Firestore Data Model

All user data lives under `users/{userId}/`:
- `profile` — name, gender, restTimer settings
- `checklist/{itemId}` — daily habit items
- `routines/{routineId}` — pre-loaded + custom workout routines containing DayType/MuscleGroup/Exercise hierarchy
- `workoutLogs/{logId}` — completed workout records with ExerciseLog/SetLog arrays
- `dailyLogs/{YYYY-MM-DD}` — weight, checklist completion, sauna/cold plunge
- `goals/{goalId}` — goals with milestones array
- `events/{eventId}` — timeline events (supplement starts, diet changes, injuries) overlaid on analytics charts
- `nutrition/favorites` — saved snack/meal items with macros

### Key Source Layout

```
src/
├── lib/firebase.ts              # Firebase init from VITE_ env vars
├── hooks/
│   ├── useAuth.ts               # Google auth state + signIn/signOut
│   ├── useFirestore.ts          # Generic useDocument<T>, useCollection<T>, CRUD helpers
│   ├── useTimer.ts              # Countdown timer for rest periods
│   └── useWorkoutFlow.ts        # Multi-step workout state machine
├── types/index.ts               # All TypeScript interfaces
├── data/
│   ├── defaultRoutines.ts       # Men's PPL + Women's Full Body with YouTube IDs
│   ├── defaultChecklist.ts      # Initial daily checklist items
│   └── defaultNutrition.ts      # Pre-loaded snack/meal ideas with macros
├── components/
│   ├── ui/                      # Reusable: Button, Card, Input, CircularTimer, ProgressBar, YouTubeThumb, Toast, Confetti
│   ├── today/                   # GreetingHeader, WorkoutCard, Checklist, QuickLog, GoalsPreview
│   ├── workout/                 # DaySelector, ExerciseSelector, WarmupCarousel, ExerciseTracker, RestTimer, SetRow, CardioAbsSelector, WorkoutSummary
│   ├── analytics/               # StatsSummary, ExerciseChart, BodyWeightChart, WorkoutCalendar, EventsList, AddEventForm
│   ├── goals/                   # GoalCard, GoalForm, MilestoneList
│   └── nutrition/               # NutritionGrid, NutritionDetail
├── pages/                       # Login, Onboarding, Today, Workout, Analytics, Goals, Nutrition, Settings, RoutineBuilder
├── App.tsx                      # AuthProvider, routing (redirect to /onboarding if no profile)
└── main.tsx                     # Entry point
```

### Routing Logic

- Unauthenticated → Login page (Google sign-in)
- Authenticated, no profile → Onboarding (name + gender)
- Authenticated with profile → Main app with bottom navigation (Today, Workout, Analytics, Goals, Settings; Nutrition as 6th tab or nested)

### Design System

Dark theme only. Tailwind custom colors:
- `bg: #0F172A` (deep navy background)
- `card: #1E293B` (card containers)
- `primary: #3B82F6` (electric blue accents)
- `success: #10B981` (PRs and positive indicators)
- `text: #F8FAFC`, `muted: #94A3B8`, `border: #334155`

Mobile-first layout: max-width 430px, 44px+ touch targets, optimized for iPhone 15 Pro (393x852).

### Firebase Environment Variables

Stored in `.env.local` using `VITE_` prefix:
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### Notable Features

- **PR Detection**: Automatically detect personal records when logging sets; celebrate with canvas-confetti
- **Timeline Events**: ReferenceLine components in Recharts overlaid on weight/exercise progression charts, showing supplement starts, diet changes, injuries
- **Gender-based Routing**: Pre-loaded routine is selected based on user gender (male → PPL, female → Full Body Split, other → user chooses)
- **Seed Data**: On first sign-in, create profile doc + default checklist + gender-appropriate routine in Firestore
