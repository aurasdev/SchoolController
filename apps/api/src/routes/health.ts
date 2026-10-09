import { Router } from 'express';

import type { DatabaseConnection } from '../database/database.js';
import { AppError } from '../errors/app-error.js';

export function createHealthRouter(database: Pick<DatabaseConnection, 'checkConnection'>): Router {
  const router = Router();

  router.get('/', async (_request, response) => {
    try {
      await database.checkConnection();
    } catch (error) {
      throw new AppError(503, 'DATABASE_UNAVAILABLE', 'The database service is unavailable.', {
        cause: error
      });
    }

    response.status(200).json({
      services: {
        database: 'up'
      },
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  });

  return router;
}
