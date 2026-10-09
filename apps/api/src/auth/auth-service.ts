import { randomBytes } from 'node:crypto';

import { AppError } from '../errors/app-error.js';
import type { AuthRepository } from './auth-repository.js';
import { isUserRole, type AuthContext, type PublicUser, type StoredUser } from './auth-types.js';
import type { PasswordHasher } from './password-hasher.js';
import type { SessionTokenManager } from './session-token.js';

const STANDARD_SESSION_DURATION_MS = 8 * 60 * 60 * 1_000;
const REMEMBERED_SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1_000;

export type LoginInput = {
  email: string;
  password: string;
  rememberSession: boolean;
};

export type LoginResult = {
  accessToken: string;
  expiresAt: string;
  user: PublicUser;
};

export interface AuthService {
  authenticate(accessToken: string): Promise<AuthContext>;
  login(input: LoginInput): Promise<LoginResult>;
  logout(sessionId: string): Promise<void>;
}

function invalidCredentials(): AppError {
  return new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
}

function toPublicUser(user: StoredUser): PublicUser {
  if (!isUserRole(user.role.name)) {
    throw new AppError(
      403,
      'ROLE_NOT_ALLOWED',
      'The account role is not allowed to access the app.'
    );
  }

  return {
    email: user.email,
    firstName: user.firstName,
    id: user.id,
    lastName: user.lastName,
    role: user.role.name
  };
}

export function createAuthService(
  repository: AuthRepository,
  hasher: PasswordHasher,
  tokenManager: SessionTokenManager,
  now: () => Date = () => new Date()
): AuthService {
  const dummyHash = hasher.hash(randomBytes(32).toString('hex'));

  return {
    async authenticate(accessToken) {
      const currentTime = now();
      const session = await repository.findSession(tokenManager.hash(accessToken), currentTime);

      if (!session || !session.user.isActive) {
        throw new AppError(401, 'UNAUTHORIZED', 'Authentication is required.');
      }

      return {
        sessionId: session.id,
        user: toPublicUser(session.user)
      };
    },
    async login(input) {
      const email = input.email.trim().toLowerCase();
      const user = await repository.findUserByEmail(email);
      const passwordHash = user?.passwordHash ?? (await dummyHash);
      const passwordMatches = await hasher.verify(passwordHash, input.password);

      if (!user || !passwordMatches || !user.isActive) {
        throw invalidCredentials();
      }

      const currentTime = now();
      const sessionDuration = input.rememberSession
        ? REMEMBERED_SESSION_DURATION_MS
        : STANDARD_SESSION_DURATION_MS;
      const expiresAt = new Date(currentTime.getTime() + sessionDuration);
      const accessToken = tokenManager.issue();
      await repository.createSession({
        expiresAt,
        tokenHash: tokenManager.hash(accessToken),
        userId: user.id
      });

      return {
        accessToken,
        expiresAt: expiresAt.toISOString(),
        user: toPublicUser(user)
      };
    },
    logout(sessionId) {
      return repository.deleteSession(sessionId);
    }
  };
}
