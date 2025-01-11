import { createAuthProvider } from '../auth-utils';
import { createSession } from '../session-utils';

const getSessionFn = createSession();

export const { AuthProvider, useSession } = createAuthProvider({
  getSessionFn,
});
