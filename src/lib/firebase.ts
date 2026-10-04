import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let auth: Auth | null = null;
let db: Firestore | null = null;
let firebaseInitError: string | null = null;

// Lazy-load Firebase so the 337KB vendor chunk doesn't block initial render
const firebaseReady: Promise<void> = (async () => {
  try {
    const [{ initializeApp }, { getAuth }, firestore] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore'),
    ]);
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    // Keep data and pending writes on the device, so the app works with a bad
    // gym signal and nothing logged offline is lost if the app is closed.
    try {
      db = firestore.initializeFirestore(app, {
        localCache: firestore.persistentLocalCache({ tabManager: firestore.persistentMultipleTabManager() }),
      });
    } catch (error) {
      console.warn('Offline cache unavailable, using memory cache:', error);
      db = firestore.getFirestore(app);
    }
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    firebaseInitError = error instanceof Error ? error.message : 'Firebase failed to initialize';
  }
})();

export { auth, db, firebaseInitError, firebaseReady };
