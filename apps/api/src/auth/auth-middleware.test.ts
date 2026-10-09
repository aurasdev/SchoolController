import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createErrorHandler } from '../middleware/error-handler.js';
import { requireRoles } from './auth-middleware.js';
import type { UserRole } from './auth-types.js';

function createRoleProtectedApp(role: UserRole) {
  const app = express();

  app.get(
    '/admin-only',
    (_request, response, next) => {
      response.locals.auth = {
        sessionId: 'session-id',
        user: {
          email: 'user@school.edu',
          firstName: 'School',
          id: 'user-id',
          lastName: 'User',
          role
        }
      };
      next();
    },
    requireRoles('ADMIN'),
    (_request, response) => response.status(200).json({ ok: true })
  );

  app.use(createErrorHandler());
  return app;
}

describe('role authorization middleware', () => {
  it('allows an authenticated user with an accepted role', async () => {
    const response = await request(createRoleProtectedApp('ADMIN')).get('/admin-only');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });

  it('rejects an authenticated user without an accepted role', async () => {
    const response = await request(createRoleProtectedApp('STUDENT')).get('/admin-only');

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: {
        code: 'FORBIDDEN',
        message: 'You do not have permission to access this resource.'
      }
    });
  });
});
