import { useState, useCallback } from 'react';
import { Layout } from '../components/ui/Layout';
import { useAuthContext } from '../contexts/AuthContext';
import { useCollection, addDocument, setDocument, deleteDocument } from '../hooks/useFirestore';
import { StatsSummary } from '../components/analytics/StatsSummary';
import { ExerciseChart } from '../components/analytics/ExerciseChart';
import { BodyWeightChart } from '../components/analytics/BodyWeightChart';
import { WorkoutCalendar } from '../components/analytics/WorkoutCalendar';
import { EventsList } from '../components/analytics/EventsList';
import { AddEventForm } from '../components/analytics/AddEventForm';
import type { WorkoutLog, DailyLog, TimelineEvent } from '../types';

export function Analytics() {
  const { user, profile } = useAuthContext();

  const { data: workoutLogs, loading: workoutsLoading } = useCollection<WorkoutLog>(
    user ? `users/${user.uid}/workoutLogs` : null
  );
  const { data: dailyLogs, loading: dailyLoading } = useCollection<DailyLog>(
    user ? `users/${user.uid}/dailyLogs` : null
  );
  const { data: events, loading: eventsLoading } = useCollection<TimelineEvent>(
    user ? `users/${user.uid}/events` : null
  );

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  const handleAddEvent = useCallback(() => {
    setEditingEvent(null);
    setEventModalOpen(true);
  }, []);

  const handleEditEvent = useCallback((event: TimelineEvent) => {
    setEditingEvent(event);
    setEventModalOpen(true);
  }, []);

  const handleDeleteEvent = useCallback(async (id: string) => {
    if (!user) return;
    await deleteDocument(`users/${user.uid}/events/${id}`);
  }, [user]);

  const handleSaveEvent = useCallback(async (eventData: Omit<TimelineEvent, 'id'>) => {
    if (!user) return;
    if (editingEvent) {
      await setDocument(`users/${user.uid}/events/${editingEvent.id}`, eventData);
    } else {
      await addDocument(`users/${user.uid}/events`, eventData);
    }
  }, [user, editingEvent]);

  const loading = workoutsLoading || dailyLoading || eventsLoading;

  return (
    <Layout>
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-primary/[0.07] rounded-full blur-[120px]" />
        <div className="absolute top-[60%] -left-32 w-[300px] h-[300px] bg-primary/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Page header */}
        <div className="mb-5">
          <h1 className="text-3xl font-black text-text tracking-tight">Analytics</h1>
          <p className="text-muted text-sm mt-1">Track your progress over time</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 animate-pulse">
                  <div className="h-3 bg-border/50 rounded w-2/3 mb-2" />
                  <div className="h-6 bg-border/50 rounded w-1/2" />
                </div>
              ))}
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-border/50 rounded w-1/3 mb-3" />
                <div className="h-32 bg-border/50 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <StatsSummary workoutLogs={workoutLogs} profile={profile} />

            <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <h3 className="text-text font-bold text-base">Exercise Progression</h3>
              </div>
              <ExerciseChart workoutLogs={workoutLogs} events={events} />
            </div>

            <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="text-text font-bold text-base">Body Weight</h3>
              </div>
              <BodyWeightChart dailyLogs={dailyLogs} events={events} />
            </div>

            <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h3 className="text-text font-bold text-base">Workout Calendar</h3>
              </div>
              <WorkoutCalendar workoutLogs={workoutLogs} />
            </div>

            <div className="bg-card/60 border border-white/[0.06] rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className="text-text font-bold text-base">Timeline Events</h3>
              </div>
              <EventsList
                events={events}
                onAdd={handleAddEvent}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            </div>

            <AddEventForm
              isOpen={eventModalOpen}
              onClose={() => setEventModalOpen(false)}
              onSave={handleSaveEvent}
              editingEvent={editingEvent}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
