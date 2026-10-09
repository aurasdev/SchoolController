export type UserRole = 'STUDENT' | 'TEACHER' | 'COORDINATOR' | 'ADMIN';

export type LoginStatus =
  'idle' | 'invalidCredentials' | 'missingFields' | 'networkError' | 'submitting' | 'success';

export type LoginFormState = {
  email: string;
  password: string;
  rememberSession: boolean;
  status: LoginStatus;
};

export type LoginFormHandlers = {
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRememberSessionChange: (value: boolean) => void;
  onSubmit: () => void;
};

export type AuthenticatedUser = {
  email: string;
  firstName: string;
  id: string;
  institution: string;
  initials: string;
  lastName: string;
  name: string;
  role: UserRole;
};
