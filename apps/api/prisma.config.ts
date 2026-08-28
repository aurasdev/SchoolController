import { config } from 'dotenv';

import { defineConfig } from 'prisma/config';

config({ path: '../../.env' });

const databaseUrl =
  process.env.DATABASE_URL ??
  'postgresql://school_controller:school_controller_dev@localhost:5432/school_controller?schema=public';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl
  }
});
