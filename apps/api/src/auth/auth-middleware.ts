import type { Request, RequestHandler } from 'express';

import { AppError } from '../errors/app-error.js';
import type { AuthService } from './auth-service.js';
import type { AuthContext, UserRole } from './auth-types.js';

export const SESSION_COOKIE_NAME = 'school_controller_session';

function getAccessToken(request: Request): string | undefined {
  const authorization = request.header('authorization');

  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice('Bearer '.length).trim() || undefined;
  }

  const cookies = request.cookies as Record<string, unknown> | undefined;
  const cookieToken = cookies?.[SESSION_COOKIE_NAME];
  return typeof cookieToken === 'string' ? cookieToken : undefined;
}

export function getAuthContext(responseLocals: Record<string, unknown>): AuthContext {
  const context = responseLocals.auth;

  if (!context) {
    throw new AppError(401, 'UNAUTHORIZED', 'Authentication is required.');
  }

  return context as AuthContext;
}

export function requireAuthentication(authService: AuthService): RequestHandler {
  return async (request, response, next) => {
    const accessToken = getAccessToken(request);

    if (!accessToken) {
      next(new AppError(401, 'UNAUTHORIZED', 'Authentication is required.'));
      return;
    }

    try {
      response.locals.auth = await authService.authenticate(accessToken);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireRoles(...allowedRoles: UserRole[]): RequestHandler {
  return (_request, response, next) => {
    try {
      const context = getAuthContext(response.locals as Record<string, unknown>);

      if (!allowedRoles.includes(context.user.role)) {
        throw new AppError(403, 'FORBIDDEN', 'You do not have permission to access this resource.');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
