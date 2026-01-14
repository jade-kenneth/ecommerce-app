import { createContext, useEffect, useState } from 'react';
import { useGlobalStore } from '../utils';
import { getSession } from './service';
import { LazySession } from './type';

export interface UseAuthReturn {
  session: LazySession;
}

export const AuthContext = createContext<UseAuthReturn | null>(null);

export const useAuth = (): UseAuthReturn => {
  const [session, setSession] = useState<LazySession>({
    status: 'loading',
  });
  const globalStore = useGlobalStore((state) => state.authenticate);
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session.status === 'unauthenticated')
        globalStore.setIsAuthenticated(false);
      else globalStore.setIsAuthenticated(true);
      setSession(session);
    };

    fetchSession();

    document.addEventListener('visibilitychange', fetchSession);

    return () => {
      document.removeEventListener('visibilitychange', fetchSession);
    };
  }, []);

  return { session };
};
