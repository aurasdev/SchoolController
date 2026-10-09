import cors from 'cors';
import express, { type Express } from 'express';

import type { DatabaseConnection } from './database/database.js';
import { createErrorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';
import { createHealthRouter } from './routes/health.js';

type AppOptions = {
  database: Pick<DatabaseConnection, 'checkConnection'>;
  logger?: Pick<Console, 'error'>;
};

export function createApp({ database, logger }: AppOptions): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors());
  app.use(express.json());

  app.use('/health', createHealthRouter(database));
  app.use(notFoundHandler);
  app.use(createErrorHandler(logger));

  return app;
}
