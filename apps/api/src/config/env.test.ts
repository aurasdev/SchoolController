import { describe, expect, it } from 'vitest';

import { getEnvironment } from './env.js';

const databaseUrl = 'postgresql://user:password@localhost:5432/school_controller?schema=public';

describe('getEnvironment', () => {
  it('loads valid values and applies development defaults', () => {
    expect(getEnvironment({ DATABASE_URL: databaseUrl })).toEqual({
      databaseUrl,
      nodeEnv: 'development',
      port: 4000
    });
  });

  it('rejects a missing database URL', () => {
    expect(() => getEnvironment({})).toThrow('DATABASE_URL is required');
  });

  it('rejects unsupported database protocols', () => {
    expect(() => getEnvironment({ DATABASE_URL: 'mysql://localhost/database' })).toThrow(
      'DATABASE_URL must use the postgres:// or postgresql:// protocol.'
    );
  });

  it('rejects invalid ports', () => {
    expect(() => getEnvironment({ DATABASE_URL: databaseUrl, PORT: 'not-a-port' })).toThrow(
      'PORT must be an integer between 1 and 65535.'
    );
  });
});
