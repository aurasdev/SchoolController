import { USER_ROLES } from '../src/auth/auth-types.js';
import { passwordHasher } from '../src/auth/password-hasher.js';
import { getEnvironment } from '../src/config/env.js';
import { createDatabaseConnection } from '../src/database/database.js';

function getSeedCredentials() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase() ?? 'admin@school.edu';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123';

  if (process.env.NODE_ENV === 'production' && !process.env.SEED_ADMIN_PASSWORD) {
    throw new Error('SEED_ADMIN_PASSWORD is required when seeding a production environment.');
  }

  return { email, password };
}

async function main() {
  const environment = getEnvironment();
  const database = createDatabaseConnection(environment.databaseUrl);
  const credentials = getSeedCredentials();

  try {
    await database.connect();

    for (const roleName of USER_ROLES) {
      await database.client.role.upsert({
        create: { name: roleName },
        update: {},
        where: { name: roleName }
      });
    }

    const adminRole = await database.client.role.findUniqueOrThrow({ where: { name: 'ADMIN' } });
    const passwordHash = await passwordHasher.hash(credentials.password);
    const admin = await database.client.user.upsert({
      create: {
        email: credentials.email,
        firstName: 'Adam',
        isActive: true,
        lastName: 'Castillo',
        passwordHash,
        roleId: adminRole.id
      },
      update: {
        isActive: true,
        passwordHash,
        roleId: adminRole.id
      },
      where: { email: credentials.email }
    });

    console.log(`Seeded roles and administrator ${admin.email}.`);
  } finally {
    await database.disconnect();
  }
}

main().catch((error: unknown) => {
  console.error('Database seed failed.', error);
  process.exitCode = 1;
});
