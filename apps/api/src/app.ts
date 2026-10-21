import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';
import type { Router } from 'express';

import type { DatabaseConnection } from './database/database.js';
import { createErrorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';
import { createHealthRouter } from './routes/health.js';

type AppOptions = {
  authRouter?: Router;
  corsOrigins?: string[];
  database: Pick<DatabaseConnection, 'checkConnection'>;
  logger?: Pick<Console, 'error'>;
};

export function createApp({ authRouter, corsOrigins, database, logger }: AppOptions): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(
    cors({
      credentials: true,
      origin: corsOrigins
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  app.use('/health', createHealthRouter(database));
  if (authRouter) {
    app.use('/auth', authRouter);
  }
  app.use(notFoundHandler);
  app.use(createErrorHandler(logger));

  return app;
}
