'use client';

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { getMaintenance } from './portal/maintenance';
import { createSession } from './session-utils';
import { Maintenance, Session } from './type';

interface CreateAuthProviderConfig {
  getSessionFn: ReturnType<typeof createSession>;
  getMaintenanceFn: ReturnType<typeof getMaintenance>;
}

interface AuthState {
  session: Session;
  maintenance: Maintenance;
}

export const createAuthProvider = ({
  getSessionFn,
  getMaintenanceFn,
}: CreateAuthProviderConfig) => {
  const AuthContext = createContext<AuthState>({} as any);

  const useSession = () => {
    const context = useContext(AuthContext);
    return context;
  };

  const AuthProvider = ({ children }: PropsWithChildren) => {
    const [session, setSession] = useState<Session>({
      status: 'unauthenticated',
    });
    const [maintenance, setMaintenance] = useState<Maintenance>({
      onMaintenance: false,
    });

    useEffect(() => {
      (async function invokeActions() {
        const maintenance = await getMaintenanceFn();
        setMaintenance(maintenance);

        if (!maintenance.onMaintenance) {
          const session = await getSessionFn();
          setSession(session);
        }
      })();
    }, []);

    return (
      <AuthContext.Provider value={{ session, maintenance }}>
        {children}
      </AuthContext.Provider>
    );
  };

  return {
    AuthProvider,
    useSession,
  };
};
