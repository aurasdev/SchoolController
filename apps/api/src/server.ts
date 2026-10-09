import type { Server } from 'node:http';

import { createApp } from './app.js';
import { getEnvironment } from './config/env.js';
import { createDatabaseConnection, type DatabaseConnection } from './database/database.js';

function listen(app: ReturnType<typeof createApp>, port: number): Promise<Server> {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve(server));
    server.once('error', reject);
  });
}

async function closeServer(server: Server): Promise<void> {
  if (!server.listening) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function registerShutdownHandlers(server: Server, database: DatabaseConnection): void {
  let shuttingDown = false;

  const shutdown = async (signal: NodeJS.Signals) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    console.log(`Received ${signal}. Closing API server.`);

    try {
      await closeServer(server);
      await database.disconnect();
    } catch (error) {
      console.error('The API could not shut down cleanly.', error);
      process.exitCode = 1;
    }
  };

  process.once('SIGINT', () => void shutdown('SIGINT'));
  process.once('SIGTERM', () => void shutdown('SIGTERM'));
}

export async function startServer(): Promise<void> {
  const environment = getEnvironment();
  const database = createDatabaseConnection(environment.databaseUrl);

  try {
    await database.connect();
    const app = createApp({ database });
    const server = await listen(app, environment.port);

    registerShutdownHandlers(server, database);
    console.log(`School Controller API listening on port ${environment.port}`);
  } catch (error) {
    await database.disconnect().catch(() => undefined);
    throw error;
  }
}

startServer().catch((error: unknown) => {
  console.error('School Controller API failed to start.', error);
  process.exitCode = 1;
});
