import { useState, useCallback } from 'react';
import { signIn, createUser, getCurrentUser, deleteCurrentSession } from '../services/user';

export function useUser() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInUser = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      await fetchCurrentUser();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await createUser(email, password);
      await fetchCurrentUser();
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteCurrentSession();
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, error, fetchCurrentUser, signInUser, registerUser, signOut };
}
