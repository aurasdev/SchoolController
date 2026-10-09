import { Router, type CookieOptions } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';

import { AppError } from '../errors/app-error.js';
import { getAuthContext, requireAuthentication, SESSION_COOKIE_NAME } from './auth-middleware.js';
import type { AuthService } from './auth-service.js';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(1).max(256),
  rememberSession: z.boolean().optional().default(false)
});

function getCookieOptions(nodeEnv: 'development' | 'production' | 'test'): CookieOptions {
  return {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: nodeEnv === 'production'
  };
}

export function createAuthRouter(
  authService: AuthService,
  nodeEnv: 'development' | 'production' | 'test'
): Router {
  const router = Router();
  const requireAuth = requireAuthentication(authService);
  const loginLimiter = rateLimit({
    handler: (_request, response) => {
      response.status(429).json({
        error: {
          code: 'TOO_MANY_LOGIN_ATTEMPTS',
          message: 'Too many login attempts. Please try again later.'
        }
      });
    },
    legacyHeaders: false,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    windowMs: 15 * 60 * 1_000
  });

  router.post('/login', loginLimiter, async (request, response) => {
    const parsedBody = loginSchema.safeParse(request.body);

    if (!parsedBody.success) {
      throw new AppError(400, 'VALIDATION_ERROR', 'The login request is invalid.', {
        details: { fields: z.flattenError(parsedBody.error).fieldErrors }
      });
    }

    const result = await authService.login(parsedBody.data);
    const cookieOptions = getCookieOptions(nodeEnv);

    response.cookie(SESSION_COOKIE_NAME, result.accessToken, {
      ...cookieOptions,
      ...(parsedBody.data.rememberSession ? { expires: new Date(result.expiresAt) } : {})
    });
    response.status(200).json(result);
  });

  router.get('/me', requireAuth, (_request, response) => {
    response.status(200).json({
      user: getAuthContext(response.locals as Record<string, unknown>).user
    });
  });

  router.post('/logout', requireAuth, async (_request, response) => {
    const context = getAuthContext(response.locals as Record<string, unknown>);
    await authService.logout(context.sessionId);
    response.clearCookie(SESSION_COOKIE_NAME, getCookieOptions(nodeEnv));
    response.status(204).send();
  });

  return router;
}
