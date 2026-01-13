import axios from 'axios';
import { AccountType } from '../graphql/generated';

export interface Token {
  accessToken: string;
  refreshToken: string | null | undefined;
}

export interface RefreshSession {
  refreshToken: string;
}
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

export async function refreshSession(input: RefreshSession) {
  try {
    const response = await axios.post<Token>('/session/refresh', input, {
      baseURL: 'http://localhost:4202',
      headers: {
        Authorization: `Bearer ${input.refreshToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error refreshing session:', error);
    throw error;
  }
}

export async function createSession(input: CreateSessionInput) {
  try {
    const response = await axios.post<Token>('/sessions', input, {
      baseURL: 'http://localhost:4202',
    });
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

export async function authenticate(input: AuthenticateInput) {
  try {
    const response = await axios.post<Token>('/session/authenticate', input, {
      baseURL: 'http://localhost:4202',
      headers: {
        Role: input.role,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error authenticating session:', error);
    throw error;
  }
}
