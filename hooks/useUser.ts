import { useState } from 'react';
import { signIn, createUser, getCurrentUser, deleteCurrentSession } from '../services/user';
import { useGlobalContext } from '../context/GlobalProvider';

export function useUser() {
  // Use global context as single source of truth for user state
  const { user, isLoggedIn, setUser, setIsLoggedIn } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInUser = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoggedIn(true);
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
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoggedIn(true);
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
      setIsLoggedIn(false);
    } catch (err: any) {
      setError(err.message || 'Failed to sign out');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoggedIn, isLoading, error, signInUser, registerUser, signOut };
}
