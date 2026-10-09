import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { createApp } from './app.js';

function createDatabaseMock(checkConnection = vi.fn().mockResolvedValue(undefined)) {
  return { checkConnection };
}

describe('School Controller API', () => {
  it('reports that the API and database are healthy', async () => {
    const database = createDatabaseMock();
    const response = await request(createApp({ database })).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      services: { database: 'up' },
      status: 'ok'
    });
    expect(response.body.timestamp).toEqual(expect.any(String));
    expect(response.headers).not.toHaveProperty('x-powered-by');
    expect(database.checkConnection).toHaveBeenCalledOnce();
  });

  it('returns a consistent error when the database is unavailable', async () => {
    const database = createDatabaseMock(vi.fn().mockRejectedValue(new Error('connection failed')));
    const response = await request(createApp({ database })).get('/health');

    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      error: {
        code: 'DATABASE_UNAVAILABLE',
        message: 'The database service is unavailable.'
      }
    });
  });

  it('returns a consistent error for unknown routes', async () => {
    const response = await request(createApp({ database: createDatabaseMock() })).get('/missing');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'Route GET /missing was not found.'
      }
    });
  });

  it('returns a consistent error for malformed JSON', async () => {
    const response = await request(createApp({ database: createDatabaseMock() }))
      .post('/missing')
      .set('Content-Type', 'application/json')
      .send('{');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: 'INVALID_JSON',
        message: 'The request body contains invalid JSON.'
      }
    });
  });
});
