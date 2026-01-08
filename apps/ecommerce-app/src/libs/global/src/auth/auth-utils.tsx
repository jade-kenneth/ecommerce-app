'use client';

import {
  createContext,
  PropsWithChildren,
  use,
  useContext,
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import { getMaintenance } from './portal/maintenance';
import { createSession } from './session-utils';
import { Maintenance, Session } from './type';
interface CreateAuthProviderConfig {
  getSessionFn: ReturnType<typeof createSession>;
  getMaintenanceFn: ReturnType<typeof getMaintenance>;
}
export interface Token {
  accessToken: string;
  refreshToken: string | null | undefined;
}
interface AuthState {
  session: Session;
  maintenance: Maintenance;
}

interface CreateSessionInput {
  user: {
    _id: string;
  };
}

const create_session = (input: CreateSessionInput) => {
  const response = axios.post('/sessions', input, {
    baseURL: 'http://localhost:4202',
  });

  return use(response).data;
};

export async function login(input: CreateSessionInput) {
  const { accessToken, refreshToken } = create_session(input);

  console.log(accessToken, refreshToken, 'token');
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
