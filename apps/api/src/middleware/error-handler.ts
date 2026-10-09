import type { ErrorRequestHandler } from 'express';

import { AppError } from '../errors/app-error.js';

type ErrorLogger = Pick<Console, 'error'>;

function isInvalidJsonError(error: unknown): error is SyntaxError & { status: number } {
  return error instanceof SyntaxError && 'status' in error && error.status === 400;
}

export function createErrorHandler(logger: ErrorLogger = console): ErrorRequestHandler {
  return (error: unknown, _request, response, _next) => {
    if (error instanceof AppError) {
      response.status(error.statusCode).json({
        error: {
          code: error.code,
          ...(error.details ? { details: error.details } : {}),
          message: error.message
        }
      });
      return;
    }

    if (isInvalidJsonError(error)) {
      response.status(400).json({
        error: {
          code: 'INVALID_JSON',
          message: 'The request body contains invalid JSON.'
        }
      });
      return;
    }

    logger.error('Unhandled API error', error);
    response.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred.'
      }
    });
  };
}
