import { createContext, useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchSession = async () => {
      console.log('Fetching session...');
      const session = await getSession();
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
