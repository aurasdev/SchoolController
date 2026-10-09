import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { createApp } from '../app.js';
import { createAuthRouter } from './auth-router.js';
import type { AuthService } from './auth-service.js';

const user = {
  email: 'admin@school.edu',
  firstName: 'Adam',
  id: 'user-id',
  lastName: 'Castillo',
  role: 'ADMIN' as const
};

function createAuthServiceMock(): AuthService {
  return {
    authenticate: vi.fn().mockResolvedValue({ sessionId: 'session-id', user }),
    login: vi.fn().mockResolvedValue({
      accessToken: 'raw-access-token',
      expiresAt: '2026-11-08T06:00:00.000Z',
      user
    }),
    logout: vi.fn().mockResolvedValue(undefined)
  };
}

function createTestApp(
  authService: AuthService,
  nodeEnv: 'development' | 'production' | 'test' = 'test'
) {
  return createApp({
    authRouter: createAuthRouter(authService, nodeEnv),
    database: { checkConnection: vi.fn().mockResolvedValue(undefined) }
  });
}

describe('authentication routes', () => {
  it('logs in without returning the password hash', async () => {
    const authService = createAuthServiceMock();
    const response = await request(createTestApp(authService)).post('/auth/login').send({
      email: ' ADMIN@SCHOOL.EDU ',
      password: 'Admin123',
      rememberSession: true
    });

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual(user);
    expect(response.body.user).not.toHaveProperty('passwordHash');
    expect(response.headers['set-cookie']?.[0]).toContain(
      'school_controller_session=raw-access-token'
    );
    expect(response.headers['set-cookie']?.[0]).toContain('HttpOnly');
    expect(response.headers['set-cookie']?.[0]).toContain('SameSite=Lax');
    expect(response.headers['set-cookie']?.[0]).toContain('Expires=');
    expect(authService.login).toHaveBeenCalledWith({
      email: 'admin@school.edu',
      password: 'Admin123',
      rememberSession: true
    });
  });

  it('marks the session cookie as secure in production', async () => {
    const response = await request(createTestApp(createAuthServiceMock(), 'production'))
      .post('/auth/login')
      .send({ email: 'admin@school.edu', password: 'Admin123' });

    expect(response.headers['set-cookie']?.[0]).toContain('Secure');
  });

  it('rejects malformed login input consistently', async () => {
    const response = await request(createTestApp(createAuthServiceMock()))
      .post('/auth/login')
      .send({ email: 'not-an-email', password: '' });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('protects the current-user endpoint', async () => {
    const response = await request(createTestApp(createAuthServiceMock())).get('/auth/me');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication is required.'
      }
    });
  });

  it('returns the authenticated user for a valid bearer session', async () => {
    const authService = createAuthServiceMock();
    const response = await request(createTestApp(authService))
      .get('/auth/me')
      .set('Authorization', 'Bearer raw-access-token');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ user });
    expect(authService.authenticate).toHaveBeenCalledWith('raw-access-token');
  });

  it('revokes the session during logout', async () => {
    const authService = createAuthServiceMock();
    const response = await request(createTestApp(authService))
      .post('/auth/logout')
      .set('Authorization', 'Bearer raw-access-token');

    expect(response.status).toBe(204);
    expect(authService.logout).toHaveBeenCalledWith('session-id');
  });
});
