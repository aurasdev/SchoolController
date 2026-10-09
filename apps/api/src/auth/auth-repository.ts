import type { PrismaClient } from '@prisma/client';

import type { StoredSession, StoredUser } from './auth-types.js';

export interface AuthRepository {
  createSession(input: {
    expiresAt: Date;
    tokenHash: string;
    userId: string;
  }): Promise<{ id: string }>;
  deleteSession(sessionId: string): Promise<void>;
  findSession(tokenHash: string, now: Date): Promise<StoredSession | null>;
  findUserByEmail(email: string): Promise<StoredUser | null>;
}

export function createAuthRepository(client: PrismaClient): AuthRepository {
  return {
    async createSession(input) {
      return client.session.create({
        data: input,
        select: { id: true }
      });
    },
    async deleteSession(sessionId) {
      await client.session.deleteMany({ where: { id: sessionId } });
    },
    findSession(tokenHash, now) {
      return client.session.findFirst({
        include: {
          user: {
            include: { role: true }
          }
        },
        where: {
          expiresAt: { gt: now },
          tokenHash
        }
      });
    },
    findUserByEmail(email) {
      return client.user.findUnique({
        include: { role: true },
        where: { email }
      });
    }
  };
}
