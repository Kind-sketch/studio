'use client';

import { useEffect, useState } from 'react';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

export interface UserAuthHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const useUser = (): UserAuthHookResult => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    // If there is no auth instance, we can't determine the user.
    if (!auth) {
      setUser(null);
      setIsUserLoading(false);
      setUserError(new Error("Auth service is not available."));
      return;
    }
    
    // Reset state when auth instance changes, though this is rare.
    setIsUserLoading(true);
    setUser(null);
    setUserError(null);

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setIsUserLoading(false);
      },
      (error) => {
        console.error("useUser: onAuthStateChanged error:", error);
        setUserError(error);
        setIsUserLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return { user, isUserLoading, userError };
};
