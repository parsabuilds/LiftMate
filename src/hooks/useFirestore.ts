import { useState, useEffect } from 'react';
import type { DocumentData, QueryConstraint } from 'firebase/firestore';
import { db, firebaseReady } from '../lib/firebase';

export function useDocument<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setData(null);
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    firebaseReady.then(async () => {
      if (cancelled || !db) {
        if (!cancelled) setLoading(false);
        return;
      }
      const { doc, onSnapshot } = await import('firebase/firestore');
      if (cancelled) return;
      const docRef = doc(db, path);
      unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setData({ id: snapshot.id, ...snapshot.data() } as T);
          } else {
            setData(null);
          }
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        }
      );
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [path]);

  return { data, loading, error };
}

export function useCollection<T>(path: string | null, ...queryConstraints: QueryConstraint[]) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setData([]);
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    firebaseReady.then(async () => {
      if (cancelled || !db) {
        if (!cancelled) setLoading(false);
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
        (snapshot) => {
          const docs = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as T[];
          setData(docs);
          setLoading(false);
        },
        (err) => {
          setError(err);
          setLoading(false);
        }
      );
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [path]);

  return { data, loading, error };
}

export async function setDocument(path: string, data: DocumentData) {
  await firebaseReady;
  if (!db) return;
  const { doc, setDoc } = await import('firebase/firestore');
  const docRef = doc(db, path);
  await setDoc(docRef, data, { merge: true });
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
