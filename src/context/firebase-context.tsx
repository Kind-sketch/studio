'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '@/lib/firebase.config';

interface FirebaseContextType {
  app: any;
  auth: any;
  db: any;
  loading: boolean;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const [app, setApp] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);
  const [db, setDb] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Initialize Firebase app if not already initialized
      let firebaseApp;
      if (!getApps().length) {
        firebaseApp = initializeApp(firebaseConfig);
      } else {
        firebaseApp = getApp();
      }

      // Initialize Firebase services
      const firebaseAuth = getAuth(firebaseApp);
      const firestore = getFirestore(firebaseApp);

      // Set state
      setApp(firebaseApp);
      setAuth(firebaseAuth);
      setDb(firestore);
    } catch (error) {
      console.error('Firebase initialization error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <FirebaseContext.Provider value={{ app, auth, db, loading }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseClientProvider');
  }
  return context;
}