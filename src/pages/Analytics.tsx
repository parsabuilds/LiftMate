import { useState, useCallback } from 'react';
import { Layout } from '../components/ui/Layout';
import { Card } from '../components/ui/Card';
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

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-slate-700 rounded w-1/3" />
      <div className="h-32 bg-slate-700 rounded" />
    </div>
  );

  return (
    <Layout title="Analytics">
      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}><LoadingSkeleton /></Card>
            ))}
          </div>
          <Card><LoadingSkeleton /></Card>
          <Card><LoadingSkeleton /></Card>
        </div>
      ) : (
        <>
          <StatsSummary workoutLogs={workoutLogs} profile={profile} />

          <Card title="Exercise Progression" className="mb-4">
            <ExerciseChart workoutLogs={workoutLogs} events={events} />
          </Card>

          <Card title="Body Weight" className="mb-4">
            <BodyWeightChart dailyLogs={dailyLogs} events={events} />
          </Card>

          <Card title="Workout Calendar" className="mb-4">
            <WorkoutCalendar workoutLogs={workoutLogs} />
          </Card>

          <Card title="Timeline Events" className="mb-4">
            <EventsList
              events={events}
              onAdd={handleAddEvent}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          </Card>

          <AddEventForm
            isOpen={eventModalOpen}
            onClose={() => setEventModalOpen(false)}
            onSave={handleSaveEvent}
            editingEvent={editingEvent}
          />
        </>
      )}
    </Layout>
  );
}
