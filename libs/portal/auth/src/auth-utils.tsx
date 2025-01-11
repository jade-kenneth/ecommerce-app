'use client';

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { createSession } from './session-utils';
import { Session } from './type';

interface CreateAuthProviderConfig {
  getSessionFn: ReturnType<typeof createSession>;
}
export const createAuthProvider = ({
  getSessionFn,
}: CreateAuthProviderConfig) => {
  const AuthContext = createContext({});
  const useSession = () => {
    const context = useContext(AuthContext);

    return context;
  };

  const AuthProvider = ({ children }: PropsWithChildren) => {
    const [session, setSession] = useState<Session>({
      status: 'authenticated',
    });

    useEffect(() => {
      (async function invokeCreateSession() {
        const data = await getSessionFn();
        setSession(data);
      })();
    }, []);

    return (
      <AuthContext.Provider value={{ session }}>
        {children}
      </AuthContext.Provider>
    );
  };

  return {
    AuthProvider,
    useSession,
  };
};
