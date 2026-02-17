import { store } from '~/store';
import * as services from './service.core';
import { AuthenticateInput } from './service.core';

import { Session } from './type';

export async function getSession(): Promise<Session> {
  const { accessToken, refreshToken, role } = await store.get();
  if (!role) {
    await store.clearSession();
    return { status: 'unauthenticated' };
  }
  if (!accessToken) {
    if (!refreshToken) {
      await store.clearSession();
      return {
        status: 'unauthenticated',
      };
    }
    try {
      const session = await services.refreshSession({ refreshToken });

      if (!session) {
        await store.clearSession();
        return {
          status: 'unauthenticated',
        };
      }
      await store.set({
        accessToken: session.accessToken,
      });
      return {
        status: 'authenticated',
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        role,
      };
    } catch {
      await store.clearSession();
      return {
        status: 'unauthenticated',
      };
    }
  }

  try {
    const validation = await services.validateSession({ accessToken });
    if (!validation.ok) {
      await store.clearSession();

      return {
        status: 'unauthenticated',
      };
    }

    return {
      status: 'authenticated',
      accessToken,
      refreshToken,
      role,
    };
  } catch {
    await store.clearSession();
    return {
      status: 'unauthenticated',
    };
  }
}
export async function create_session(input: services.CreateSessionInput) {
  const { accessToken, refreshToken, role } =
    await services.createSession(input);

  await store.set({
    accessToken,
    refreshToken,
    role,
  });
}

export async function authenticate(input: AuthenticateInput) {
  const { accessToken, refreshToken, role } =
    await services.__authenticate(input);

  await store.set({
    accessToken,
    refreshToken,
    role,
  });
}

export async function logout() {
  try {
    const { refreshToken } = await store.get();
    if (refreshToken) {
      await services.logoutSession({ refreshToken });
    }
  } catch {
    /* empty */
  } finally {
    await store.clearSession();
  }
}
