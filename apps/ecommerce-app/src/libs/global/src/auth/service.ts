import * as services from './service.core';
import { AuthenticateInput } from './service.core';
import { store } from './store';
import { Session } from './type';

export async function getSession(): Promise<Session> {
  const { accessToken, refreshToken } = await store.get();

  if (!accessToken) {
    if (!refreshToken) {
      return {
        status: 'unauthenticated',
      };
    }
    try {
      const session = await services.refreshSession({ refreshToken });

      await store.set({
        accessToken: session.accessToken,
      });

      return {
        status: 'authenticated',
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      };
    } catch (error) {
      console.log('Error refreshing session:', error);
      return {
        status: 'unauthenticated',
      };
    }
  }
  return {
    status: 'authenticated',
    accessToken,
    refreshToken,
  };
}
export async function create_session(input: services.CreateSessionInput) {
  const { accessToken, refreshToken } = await services.createSession(input);

  await store.set({
    accessToken,
    refreshToken,
  });
}

export async function authenticate(input: AuthenticateInput) {
  const { accessToken, refreshToken } = await services.authenticate(input);

  await store.set({
    accessToken,
    refreshToken,
  });
}
