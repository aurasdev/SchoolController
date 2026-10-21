import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthRepository } from './auth-repository.js';
import { createAuthService } from './auth-service.js';
import type { StoredUser } from './auth-types.js';
import type { PasswordHasher } from './password-hasher.js';
import type { SessionTokenManager } from './session-token.js';

const now = new Date('2026-10-09T06:00:00.000Z');
const activeUser: StoredUser = {
  email: 'admin@school.edu',
  firstName: 'Adam',
  id: 'user-id',
  isActive: true,
  lastName: 'Castillo',
  passwordHash: 'stored-password-hash',
  role: { name: 'ADMIN' }
};

function createDependencies() {
  const repository: AuthRepository = {
    createSession: vi.fn().mockResolvedValue({ id: 'session-id' }),
    deleteSession: vi.fn().mockResolvedValue(undefined),
    findSession: vi.fn().mockResolvedValue(null),
    findUserByEmail: vi.fn().mockResolvedValue(activeUser)
  };
  const hasher: PasswordHasher = {
    hash: vi.fn().mockResolvedValue('dummy-password-hash'),
    verify: vi.fn().mockResolvedValue(true)
  };
  const tokenManager: SessionTokenManager = {
    hash: vi.fn().mockReturnValue('hashed-access-token'),
    issue: vi.fn().mockReturnValue('raw-access-token')
  };

  return { hasher, repository, tokenManager };
}

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('normalizes the email and creates a session for valid credentials', async () => {
    const dependencies = createDependencies();
    const service = createAuthService(
      dependencies.repository,
      dependencies.hasher,
      dependencies.tokenManager,
      () => now
    );

    const result = await service.login({
      email: '  ADMIN@School.EDU ',
      password: 'Admin123',
      rememberSession: false
    });

    expect(dependencies.repository.findUserByEmail).toHaveBeenCalledWith('admin@school.edu');
    expect(dependencies.hasher.verify).toHaveBeenCalledWith('stored-password-hash', 'Admin123');
    expect(dependencies.repository.createSession).toHaveBeenCalledWith({
      expiresAt: new Date('2026-10-09T14:00:00.000Z'),
      tokenHash: 'hashed-access-token',
      userId: 'user-id'
    });
    expect(result).toEqual({
      accessToken: 'raw-access-token',
      expiresAt: '2026-10-09T14:00:00.000Z',
      user: {
        email: activeUser.email,
        firstName: activeUser.firstName,
        id: activeUser.id,
        lastName: activeUser.lastName,
        role: 'ADMIN'
      }
    });
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it.each([
    ['incorrect password', activeUser, false],
    ['nonexistent user', null, false],
    ['inactive user', { ...activeUser, isActive: false }, true]
  ])('returns the same generic error for an %s', async (_scenario, user, passwordMatches) => {
    const dependencies = createDependencies();
    vi.mocked(dependencies.repository.findUserByEmail).mockResolvedValue(user);
    vi.mocked(dependencies.hasher.verify).mockResolvedValue(passwordMatches);
    const service = createAuthService(
      dependencies.repository,
      dependencies.hasher,
      dependencies.tokenManager,
      () => now
    );

    await expect(
      service.login({
        email: 'user@school.edu',
        password: 'wrong-password',
        rememberSession: false
      })
    ).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password.',
      statusCode: 401
    });
    expect(dependencies.repository.createSession).not.toHaveBeenCalled();
  });

  it('restores an active unexpired session from its token hash', async () => {
    const dependencies = createDependencies();
    vi.mocked(dependencies.repository.findSession).mockResolvedValue({
      expiresAt: new Date('2026-10-10T06:00:00.000Z'),
      id: 'session-id',
      user: activeUser
    });
    const service = createAuthService(
      dependencies.repository,
      dependencies.hasher,
      dependencies.tokenManager,
      () => now
    );

    await expect(service.authenticate('raw-access-token')).resolves.toMatchObject({
      sessionId: 'session-id',
      user: { id: 'user-id', role: 'ADMIN' }
    });
    expect(dependencies.repository.findSession).toHaveBeenCalledWith('hashed-access-token', now);
  });

  it('deletes the server session during logout', async () => {
    const dependencies = createDependencies();
    const service = createAuthService(
      dependencies.repository,
      dependencies.hasher,
      dependencies.tokenManager
    );

    await service.logout('session-id');

    expect(dependencies.repository.deleteSession).toHaveBeenCalledWith('session-id');
  });
});
