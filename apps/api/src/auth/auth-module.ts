import type { PrismaClient } from '@prisma/client';

import { createAuthRepository } from './auth-repository.js';
import { createAuthRouter } from './auth-router.js';
import { createAuthService } from './auth-service.js';
import { passwordHasher } from './password-hasher.js';
import { sessionTokenManager } from './session-token.js';

export function createAuthModule(
  client: PrismaClient,
  nodeEnv: 'development' | 'production' | 'test'
) {
  const repository = createAuthRepository(client);
  const service = createAuthService(repository, passwordHasher, sessionTokenManager);

  return {
    router: createAuthRouter(service, nodeEnv),
    service
  };
}
