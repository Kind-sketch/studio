'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase.config';

// Initialize Firebase client-side
let firebaseApp;
if (typeof window !== 'undefined' && !getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else if (typeof window !== 'undefined') {
  firebaseApp = getApp();
} else {
  // Server-side rendering - return null or mock app
  firebaseApp = null;
}

// Initialize Firebase services
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;

export { firebaseApp };