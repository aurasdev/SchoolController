import cors from 'cors';
import express, { type Express, type Request, type Response } from 'express';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_request: Request, response: Response) => {
    response.status(200).json({ status: 'ok' });
  });

  return app;
}
