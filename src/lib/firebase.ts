import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// IMPORTANT: Replace with your Firebase project's configuration.
// You can find this in your Firebase project console.
const firebaseConfig = {
  projectId: 'inkling-notes-n6xjj',
  appId: '1:335688789979:web:ea7bceaff42ae30d4f01fe',
  storageBucket: 'inkling-notes-n6xjj.firebasestorage.app',
  apiKey: 'AIzaSyD7aBE5kK6avu6PrWDPkB_0rWzzUGIcDGc',
  authDomain: 'inkling-notes-n6xjj.firebaseapp.com',
  messagingSenderId: '335688789979',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
