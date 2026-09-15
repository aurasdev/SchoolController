export type LoginRole = 'Alumno' | 'Docente' | 'Coordinador' | 'Administrador';

export type LoginStatus = 'idle' | 'missingFields' | 'invalidCredentials' | 'success';

export type LoginFormState = {
  email: string;
  password: string;
  rememberSession: boolean;
  role: LoginRole;
  status: LoginStatus;
};

export type LoginFormHandlers = {
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRememberSessionChange: (value: boolean) => void;
  onRoleChange: (role: LoginRole) => void;
  onSubmit: () => void;
};

export type AuthenticatedUser = {
  email: string;
  institution: string;
  initials: string;
  name: string;
  role: LoginRole;
};
