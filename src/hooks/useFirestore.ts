import { useState, useEffect } from 'react';
import type { DocumentData, QueryConstraint } from 'firebase/firestore';
import { db, firebaseReady } from '../lib/firebase';

export function useDocument<T>(path: string | null) {
  // Snapshots are tagged with their path so a path change (e.g. a new day's
  // dailyLog) never shows, or gets written back from, the previous document.
  const [snapshot, setSnapshot] = useState<{ path: string; data: T | null } | null>(null);
  const [error, setError] = useState<{ path: string; error: Error } | null>(null);

  useEffect(() => {
    if (!path) return;

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    firebaseReady.then(async () => {
      if (cancelled) return;
      if (!db) {
        setSnapshot({ path, data: null });
        return;
      }
      const { doc, onSnapshot } = await import('firebase/firestore');
      if (cancelled) return;
      const docRef = doc(db, path);
      unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          setSnapshot({ path, data: snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null });
        },
        (err) => {
          setError({ path, error: err });
        }
      );
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [path]);

  const current = path !== null && snapshot?.path === path;
  const failed = path !== null && error?.path === path;
  return {
    data: current ? snapshot.data : null,
    loading: path !== null && !current && !failed,
    error: failed ? error.error : null,
  };
}

const NO_DOCS: never[] = [];

export function useCollection<T>(path: string | null, ...queryConstraints: QueryConstraint[]) {
  // Tagged with their path, like useDocument, so a path change (e.g. another
  // user signing in) never shows the previous path's documents.
  const [snapshot, setSnapshot] = useState<{ path: string; data: T[] } | null>(null);
  const [error, setError] = useState<{ path: string; error: Error } | null>(null);

  useEffect(() => {
    if (!path) return;

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    firebaseReady.then(async () => {
      if (cancelled) return;
      if (!db) {
        setSnapshot({ path, data: [] });
        return;
      }
      const { collection, onSnapshot, query } = await import('firebase/firestore');
      if (cancelled) return;
      const collectionRef = collection(db, path);
      const q = queryConstraints.length > 0
        ? query(collectionRef, ...queryConstraints)
        : collectionRef;

      unsubscribe = onSnapshot(
        q,
        (snap) => {
          const docs = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as T[];
          setSnapshot({ path, data: docs });
        },
        (err) => {
          setError({ path, error: err });
        }
      );
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [path]);

  const current = path !== null && snapshot?.path === path;
  const failed = path !== null && error?.path === path;
  return {
    data: current ? snapshot.data : (NO_DOCS as T[]),
    loading: path !== null && !current && !failed,
    error: failed ? error.error : null,
  };
}

export async function setDocument(path: string, data: DocumentData) {
  await firebaseReady;
  if (!db) return;
  const { doc, setDoc } = await import('firebase/firestore');
  const docRef = doc(db, path);
  await setDoc(docRef, data, { merge: true });
}

// Firestore write promises only settle once the server confirms, which never
// happens offline (the write is queued on the device and syncs later). Wait
// briefly so errors raised right away still surface, without blocking the UI
// on the network.
export async function untilQueued(write: Promise<unknown>, ms = 2000): Promise<void> {
  write.catch((err) => console.error('Firestore write failed:', err));
  await Promise.race([write, new Promise((resolve) => setTimeout(resolve, ms))]);
}

// Overwrites the whole document, so fields left out of `data` are removed.
export async function replaceDocument(path: string, data: DocumentData) {
  await firebaseReady;
  if (!db) return;
  const { doc, setDoc } = await import('firebase/firestore');
  await setDoc(doc(db, path), data);
}

export async function updateDocument(path: string, data: DocumentData) {
  await firebaseReady;
  if (!db) return;
  const { doc, updateDoc } = await import('firebase/firestore');
  const docRef = doc(db, path);
  await updateDoc(docRef, data);
}

export async function deleteDocument(path: string) {
  await firebaseReady;
  if (!db) return;
  const { doc, deleteDoc } = await import('firebase/firestore');
  const docRef = doc(db, path);
  await deleteDoc(docRef);
}

export async function addDocument(path: string, data: DocumentData) {
  await firebaseReady;
  if (!db) throw new Error('Firestore not available');
  const { collection, addDoc } = await import('firebase/firestore');
  const collectionRef = collection(db, path);
  return await addDoc(collectionRef, data);
}
