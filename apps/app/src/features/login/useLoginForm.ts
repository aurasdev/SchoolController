import { useCallback, useReducer } from 'react';

import { demoAdminCredentials, demoAdminUser, loginCopy } from '@/features/login/content';
import type {
  AuthenticatedUser,
  LoginFormHandlers,
  LoginFormState,
  LoginRole
} from '@/features/login/types';

type LoginFormAction =
  | { type: 'emailChanged'; value: string }
  | { type: 'passwordChanged'; value: string }
  | { type: 'rememberSessionChanged'; value: boolean }
  | { type: 'roleChanged'; value: LoginRole }
  | { type: 'submitted'; value: LoginFormState['status'] };

type UseLoginFormOptions = {
  onAuthenticated: (user: AuthenticatedUser) => void;
};

const initialState: LoginFormState = {
  email: '',
  password: '',
  rememberSession: false,
  role: 'Alumno',
  status: 'idle'
};

function resetFeedback(state: LoginFormState): LoginFormState {
  if (state.status === 'idle') {
    return state;
  }

  return {
    ...state,
    status: 'idle'
  };
}

function loginFormReducer(state: LoginFormState, action: LoginFormAction): LoginFormState {
  switch (action.type) {
    case 'emailChanged':
      return resetFeedback({
        ...state,
        email: action.value
      });
    case 'passwordChanged':
      return resetFeedback({
        ...state,
        password: action.value
      });
    case 'rememberSessionChanged':
      return {
        ...state,
        rememberSession: action.value
      };
    case 'roleChanged':
      return resetFeedback({
        ...state,
        role: action.value
      });
    case 'submitted':
      return {
        ...state,
        status: action.value
      };
    default:
      return state;
  }
}

function hasRequiredCredentials({ email, password }: LoginFormState) {
  return email.trim().length > 0 && password.trim().length > 0;
}

function hasValidDemoCredentials({ email, password }: LoginFormState) {
  return (
    email.trim().toLowerCase() === demoAdminCredentials.email &&
    password === demoAdminCredentials.password
  );
}

function getFeedbackText({ role, status }: LoginFormState) {
  if (status === 'missingFields') {
    return loginCopy.feedback.missingFields;
  }

  if (status === 'invalidCredentials') {
    return loginCopy.feedback.invalidCredentials;
  }

  if (status === 'success') {
    return `${loginCopy.feedback.successPrefix} ${role}.`;
  }

  return loginCopy.feedback.idle;
}

export function useLoginForm({ onAuthenticated }: UseLoginFormOptions) {
  const [state, dispatch] = useReducer(loginFormReducer, initialState);

  const onEmailChange = useCallback((value: string) => {
    dispatch({ type: 'emailChanged', value });
  }, []);

  const onPasswordChange = useCallback((value: string) => {
    dispatch({ type: 'passwordChanged', value });
  }, []);

  const onRememberSessionChange = useCallback((value: boolean) => {
    dispatch({ type: 'rememberSessionChanged', value });
  }, []);

  const onRoleChange = useCallback((value: LoginRole) => {
    dispatch({ type: 'roleChanged', value });
  }, []);

  const onSubmit = useCallback(() => {
    if (!hasRequiredCredentials(state)) {
      dispatch({ type: 'submitted', value: 'missingFields' });
      return;
    }

    if (!hasValidDemoCredentials(state)) {
      dispatch({ type: 'submitted', value: 'invalidCredentials' });
      return;
    }

    dispatch({ type: 'submitted', value: 'success' });
    onAuthenticated(demoAdminUser);
  }, [onAuthenticated, state]);

  const handlers: LoginFormHandlers = {
    onEmailChange,
    onPasswordChange,
    onRememberSessionChange,
    onRoleChange,
    onSubmit
  };

  return {
    feedbackText: getFeedbackText(state),
    handlers,
    state
  };
}
