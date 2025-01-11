import { Session } from './type';

export const createSession = () => {
  return async function getSession(): Promise<Session> {
    return {
      status: 'loading',
    };
  };
};
