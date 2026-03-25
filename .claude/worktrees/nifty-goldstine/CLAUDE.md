# Project Instructions

## Overview
LiftMate — A mobile-first PWA fitness tracker for logging workouts, tracking progress, and managing nutrition goals.

## Tech Stack
- Frontend: React 19 + TypeScript 5.9 + Vite 7 + Tailwind CSS 3
- Backend: Firebase 12 (Auth, Firestore)
- Database: Cloud Firestore
- Hosting: Netlify (PWA with service worker via vite-plugin-pwa)

## Git Workflow
- Push directly to `main` branch (single developer, fast iteration)
- Always commit with clear, descriptive messages
- After EVERY change, run: git add -A && git commit -m "description" && git push origin main
- Do NOT create branches — push directly to main

## Project Structure
- /src — source code
- /src/components — React components (Navigation, ui/, workout/, analytics/, goals/, nutrition/, today/)
- /src/pages — page routes (Today, Workout, Analytics, Goals, Nutrition, Settings, Onboarding, etc.)
- /src/hooks — custom hooks (useAuth, useFirestore, useTimer)
- /src/contexts — React contexts (AuthContext, WorkoutContext)
- /src/data — static data (defaultRoutines, exerciseCatalog, seedData, defaultChecklist, defaultNutrition)
- /src/lib — Firebase init
- /src/types — TypeScript interfaces
- /public — static assets (manifest.json, icon.svg, images/)

## Common Commands
- npm install — install dependencies
- npm run dev — start dev server
- npm run build — build for production (runs tsc -b && vite build)
- npm run lint — run ESLint
- npm run preview — preview production build

## Key Rules
- Keep changes focused — one logical change per commit
- If something breaks, fix it in the next commit rather than reverting
- Always test that the build succeeds before pushing (run npm run build)
- Dark theme only (bg: #0F172A, card: #1E293B, primary: #3B82F6)
- Use `import type` for type-only imports (verbatimModuleSyntax is enabled)
- Tailwind v3 config style — do NOT use v4 patterns
