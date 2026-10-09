import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';

import { createErrorHandler } from './error-handler.js';

describe('createErrorHandler', () => {
  it('hides unexpected error details behind a consistent response', () => {
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const response = { status } as unknown as Response;
    const logger = { error: vi.fn() };
    const error = new Error('sensitive implementation detail');

    createErrorHandler(logger)(error, {} as Request, response, vi.fn() as unknown as NextFunction);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred.'
      }
    });
    expect(logger.error).toHaveBeenCalledWith('Unhandled API error', error);
  });
});
