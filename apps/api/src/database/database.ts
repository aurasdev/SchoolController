import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

export interface DatabaseConnection {
  readonly client: PrismaClient;
  checkConnection(): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

function getSchema(databaseUrl: string): string {
  return new URL(databaseUrl).searchParams.get('schema') ?? 'public';
}

export function createDatabaseConnection(databaseUrl: string): DatabaseConnection {
  const adapter = new PrismaPg(
    {
      connectionString: databaseUrl,
      connectionTimeoutMillis: 5_000
    },
    { schema: getSchema(databaseUrl) }
  );
  const client = new PrismaClient({ adapter });

  return {
    client,
    async checkConnection() {
      await client.$queryRaw`SELECT 1`;
    },
    async connect() {
      await client.$connect();
      await client.$queryRaw`SELECT 1`;
    },
    async disconnect() {
      await client.$disconnect();
    }
  };
}
