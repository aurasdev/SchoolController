export class AppError extends Error {
  readonly code: string;
  readonly details?: Record<string, unknown>;
  readonly statusCode: number;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    options?: { cause?: unknown; details?: Record<string, unknown> }
  ) {
    super(message, { cause: options?.cause });
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = options?.details;
  }
}
