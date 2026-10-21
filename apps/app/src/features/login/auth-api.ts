import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { apiUrl } from '@/config/env';
import type { AuthenticatedUser, UserRole } from '@/features/login/types';

const ACCESS_TOKEN_KEY = 'school-controller-access-token';
const institution = 'IEST ANÁHUAC';
let inMemoryAccessToken: string | null = null;

type ApiUser = {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  role: UserRole;
};

type LoginResponse = {
  accessToken: string;
  expiresAt: string;
  user: ApiUser;
};

type ErrorResponse = {
  error?: {
    code?: string;
    message?: string;
  };
};

export class AuthApiError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = 'AuthApiError';
    this.code = code;
  }
}

function toAuthenticatedUser(user: ApiUser): AuthenticatedUser {
  return {
    ...user,
    initials: `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase(),
    institution,
    name: `${user.firstName} ${user.lastName}`
  };
}

function getAuthorizationHeader(): Record<string, string> {
  return inMemoryAccessToken ? { Authorization: `Bearer ${inMemoryAccessToken}` } : {};
}

async function readError(response: Response): Promise<AuthApiError> {
  const body = (await response.json().catch(() => ({}))) as ErrorResponse;
  return new AuthApiError(
    body.error?.code ?? 'REQUEST_FAILED',
    body.error?.message ?? 'The authentication request failed.'
  );
}

async function clearStoredToken(): Promise<void> {
  inMemoryAccessToken = null;

  if (Platform.OS !== 'web') {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  }
}

export async function login(input: {
  email: string;
  password: string;
  rememberSession: boolean;
}): Promise<AuthenticatedUser> {
  const response = await fetch(`${apiUrl}/auth/login`, {
    body: JSON.stringify(input),
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST'
  });

  if (!response.ok) {
    throw await readError(response);
  }

  const body = (await response.json()) as LoginResponse;

  if (Platform.OS !== 'web') {
    inMemoryAccessToken = body.accessToken;

    if (input.rememberSession) {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, body.accessToken);
    } else {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    }
  }

  return toAuthenticatedUser(body.user);
}

export async function restoreSession(): Promise<AuthenticatedUser | null> {
  if (Platform.OS !== 'web') {
    inMemoryAccessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

    if (!inMemoryAccessToken) {
      return null;
    }
  }

  try {
    const response = await fetch(`${apiUrl}/auth/me`, {
      credentials: 'include',
      headers: getAuthorizationHeader()
    });

    if (response.status === 401) {
      await clearStoredToken();
      return null;
    }

    if (!response.ok) {
      throw await readError(response);
    }

    const body = (await response.json()) as { user: ApiUser };
    return toAuthenticatedUser(body.user);
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${apiUrl}/auth/logout`, {
      credentials: 'include',
      headers: getAuthorizationHeader(),
      method: 'POST'
    });
  } finally {
    await clearStoredToken();
  }
}
