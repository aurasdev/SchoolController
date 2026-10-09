import { hash, verify, type Options } from '@node-rs/argon2';

export interface PasswordHasher {
  hash(password: string): Promise<string>;
  verify(passwordHash: string, password: string): Promise<boolean>;
}

const passwordHashOptions = {
  algorithm: 2,
  memoryCost: 19_456,
  outputLen: 32,
  parallelism: 1,
  timeCost: 2
} satisfies Options;

export const passwordHasher: PasswordHasher = {
  hash(password) {
    return hash(password, passwordHashOptions);
  },
  verify(passwordHash, password) {
    return verify(passwordHash, password);
  }
};
