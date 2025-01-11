import { createAuthProvider } from '../auth-utils';
import { createSession } from '../session-utils';
import { getMaintenance } from './maintenance';

const getSessionFn = createSession();
const getMaintenanceFn = getMaintenance();

export const { AuthProvider, useSession } = createAuthProvider({
  getSessionFn,
  getMaintenanceFn,
});
