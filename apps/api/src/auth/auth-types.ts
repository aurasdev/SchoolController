export const USER_ROLES = ['STUDENT', 'TEACHER', 'COORDINATOR', 'ADMIN'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type PublicUser = {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  role: UserRole;
};

export type StoredUser = {
  email: string;
  firstName: string;
  id: string;
  isActive: boolean;
  lastName: string;
  passwordHash: string;
  role: { name: string };
};

export type StoredSession = {
  expiresAt: Date;
  id: string;
  user: StoredUser;
};

export type AuthContext = {
  sessionId: string;
  user: PublicUser;
};

export function isUserRole(value: string): value is UserRole {
  return USER_ROLES.includes(value as UserRole);
}
