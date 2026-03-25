# LiftMate v2 - Quick Build Reference

## 🎯 Phase Overview

| Phase | Time | Result |
|-------|------|--------|
| 1 | ~1.5 hr | Working app for you (men's PPL routine) |
| 2 | ~1 hr | Add girlfriend's routine + onboarding |
| 3 | ~1.5 hr | Universal: custom routines, nutrition, timeline |

---

## 🤖 Agent Teams Setup

### Enable Agent Teams
```json
// settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### Key Commands
| Command | Action |
|---------|--------|
| `Shift+Tab` | Lock lead into delegation mode |
| `Shift+Up/Down` | Select teammate to message |
| `Ctrl+T` | Toggle task list |
| `Escape` | Interrupt current teammate |

### Best Practices
- ✅ Each teammate owns different files
- ✅ Give specific file paths in spawn prompts
- ✅ 5-6 tasks per teammate
- ❌ Don't have two teammates edit same file

---

## 🔥 Firebase Setup (Do First!)

1. console.firebase.google.com → Create project
2. **Authentication** → Enable Google provider
3. **Firestore** → Create database (test mode)
4. Project Settings → Web app → Copy config

### .env.local
```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

---

## 🎨 Design Tokens

```javascript
// tailwind.config.js
colors: {
  bg: '#0F172A',
  card: '#1E293B',
  primary: '#3B82F6',
  success: '#10B981',
  text: '#F8FAFC',
  muted: '#94A3B8',
  border: '#334155',
}
```

---

## 🗂️ Firestore Structure

```
users/{userId}/
├── profile          (name, gender, restTimer)
├── checklist/       (daily items)
├── routines/        (pre-loaded + custom)
├── workoutLogs/     (completed workouts)
├── dailyLogs/       (daily: weight, checklist)
├── goals/           (with milestones)
├── events/          (timeline: supplements, etc)
└── nutrition/       (saved snack favorites)
```

---

## 🏋️ Workout System

```
Day Type (Push)
  └── Muscle Groups (Chest, Triceps)
       └── Exercise Options (3-5 each)
            └── User picks which ones
                 └── Log sets/reps/weight
```

### Flow
```
1. Pick Day → 2. Warmups → 3. Pick Exercises → 4. Log Sets → 5. Cardio/Abs → 6. Save
```

---

## 📦 Dependencies

```bash
npm install react-router-dom recharts firebase canvas-confetti
npm install -D tailwindcss postcss autoprefixer
```

---

## ✅ Phase Checklists

### Phase 1 (Your MVP)
- [ ] Firebase project created
- [ ] Google auth works
- [ ] Men's routine loaded
- [ ] Today page with checklist
- [ ] Day selection works
- [ ] Basic workout logging
- [ ] Data saves to Firestore

### Phase 2 (Add Girlfriend)
- [ ] Onboarding flow (name + gender)
- [ ] Women's routine added
- [ ] Routes to correct routine
- [ ] Exercise selection with videos
- [ ] Full workout flow complete
- [ ] Rest timer works
- [ ] PR detection + celebration

### Phase 3 (Universal)
- [ ] Custom routine builder
- [ ] Nutrition section
- [ ] Timeline events on charts
- [ ] Goals with milestones
- [ ] Settings complete
- [ ] Export data
- [ ] Deployed and shareable

---

## 🚀 Deploy

```bash
npm run build
npx netlify deploy --prod
```

---

## 📁 Key Files by Phase

### Phase 1
```
src/
├── lib/firebase.ts
├── hooks/useAuth.ts, useFirestore.ts
├── types/index.ts
├── data/defaultRoutines.ts (men's only)
├── components/ui/* (Button, Card, etc)
├── pages/Login.tsx, Today.tsx, Workout.tsx
```

### Phase 2 Adds
```
src/
├── pages/Onboarding.tsx
├── data/defaultRoutines.ts (+ women's)
├── components/workout/* (full flow)
├── components/ui/YouTubeThumb.tsx
```

### Phase 3 Adds
```
src/
├── pages/Nutrition.tsx, RoutineBuilder.tsx
├── components/analytics/* (charts + events)
├── components/goals/*
├── components/nutrition/*
├── data/defaultNutrition.ts
```
