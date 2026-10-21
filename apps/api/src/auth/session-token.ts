import { createHash, randomBytes } from 'node:crypto';

export interface SessionTokenManager {
  hash(token: string): string;
  issue(): string;
}

export const sessionTokenManager: SessionTokenManager = {
  hash(token) {
    return createHash('sha256').update(token).digest('hex');
  },
  issue() {
    return randomBytes(32).toString('base64url');
  }
};
