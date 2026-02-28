import axios from 'axios';
import { AccountType } from 'libs/graphql/src/generated';

export interface Token {
  accessToken: string;
  refreshToken: string | null | undefined;
}

export interface RefreshSession {
  refreshToken: string;
}
export interface ValidateSessionInput {
  accessToken: string;
}
export type ValidateSessionResult = {
  ok: boolean;
  status: 200 | 403;
};
export interface CreateSessionInput {
  user: {
    _id: string;
    role: AccountType;
  };
}
export interface AuthenticateInput {
  emailAddress: string;
  password: string;
  role: AccountType;
}

export async function refreshSession(
  input: RefreshSession,
): Promise<Token | null> {
  try {
    const response = await axios.post<Token>('/session/refresh', input, {
      baseURL: process.env.NEXT_PUBLIC_BASE_URL_PORTAL_API,
      headers: {
        Authorization: `Bearer ${input.refreshToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        return null;
      }
    }

    console.error('Error refreshing session:', error);
    return null;
  }
}

export async function validateSession(
  input: ValidateSessionInput,
): Promise<ValidateSessionResult> {
  try {
    const response = await axios.post<ValidateSessionResult>(
      '/session/validate',
      {},
      {
        baseURL: process.env.NEXT_PUBLIC_BASE_URL_PORTAL_API,
        headers: {
          Authorization: `Bearer ${input.accessToken}`,
        },
      },
    );
    return {
      ok: response.data.ok,
      status: response.data.status,
    };
  } catch {
    return {
      ok: false,
      status: 403,
    };
  }
}

export async function logoutSession(input: RefreshSession) {
  try {
    await axios.post(
      '/session/logout',
      {},
      {
        baseURL: process.env.NEXT_PUBLIC_BASE_URL_PORTAL_API,
        headers: {
          Authorization: `Bearer ${input.refreshToken}`,
        },
      },
    );
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

export async function createSession(input: CreateSessionInput) {
  try {
    const response = await axios.post<Token & { role: AccountType }>(
      '/sessions',
      input,
      {
        baseURL: process.env.NEXT_PUBLIC_BASE_URL_PORTAL_API,
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

export async function __authenticate(input: AuthenticateInput) {
  try {
    const response = await axios.post<Token & { role: AccountType }>(
      '/session/authenticate',
      input,
      {
        baseURL: process.env.NEXT_PUBLIC_BASE_URL_PORTAL_API,
        headers: {
          Role: input.role,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error authenticating session:', error);
    throw error;
  }
}
