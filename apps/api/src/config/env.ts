import { config } from 'dotenv';
import { resolve } from 'node:path';

config({
  path: [resolve(process.cwd(), '.env'), resolve(process.cwd(), '../../.env')],
  quiet: true
});

const DEFAULT_PORT = 4000;

export type AppEnvironment = {
  corsOrigins: string[];
  databaseUrl: string;
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
};

function readPort(value: string | undefined): number {
  if (value === undefined) {
    return DEFAULT_PORT;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  return port;
}

function readDatabaseUrl(value: string | undefined): string {
  const databaseUrl = value?.trim();

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required. Copy .env.example to .env before starting the API.');
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(databaseUrl);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL.');
  }

  if (!['postgres:', 'postgresql:'].includes(parsedUrl.protocol)) {
    throw new Error('DATABASE_URL must use the postgres:// or postgresql:// protocol.');
  }

  return databaseUrl;
}

function readNodeEnvironment(value: string | undefined): AppEnvironment['nodeEnv'] {
  if (value === undefined || value === 'development') {
    return 'development';
  }

  if (value === 'production' || value === 'test') {
    return value;
  }

  throw new Error('NODE_ENV must be development, production, or test.');
}

export function getEnvironment(source: NodeJS.ProcessEnv = process.env): AppEnvironment {
  return {
    corsOrigins: (source.CORS_ORIGINS ?? 'http://localhost:8081')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    databaseUrl: readDatabaseUrl(source.DATABASE_URL),
    nodeEnv: readNodeEnvironment(source.NODE_ENV),
    port: readPort(source.PORT)
  };
}
