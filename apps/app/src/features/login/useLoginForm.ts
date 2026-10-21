import { useCallback, useReducer } from 'react';

import { AuthApiError, login } from '@/features/login/auth-api';
import { loginCopy } from '@/features/login/content';
import type { AuthenticatedUser, LoginFormHandlers, LoginFormState } from '@/features/login/types';

type LoginFormAction =
  | { type: 'emailChanged'; value: string }
  | { type: 'passwordChanged'; value: string }
  | { type: 'rememberSessionChanged'; value: boolean }
  | { type: 'submitted'; value: LoginFormState['status'] };

type UseLoginFormOptions = {
  onAuthenticated: (user: AuthenticatedUser) => void;
};

const initialState: LoginFormState = {
  email: '',
  password: '',
  rememberSession: false,
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

function getFeedbackText({ status }: LoginFormState) {
  if (status === 'missingFields') {
    return loginCopy.feedback.missingFields;
  }

  if (status === 'invalidCredentials') {
    return loginCopy.feedback.invalidCredentials;
  }

  if (status === 'networkError') {
    return loginCopy.feedback.networkError;
  }

  if (status === 'submitting') {
    return loginCopy.feedback.submitting;
  }

  if (status === 'success') {
    return loginCopy.feedback.success;
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

  const onSubmit = useCallback(() => {
    if (state.status === 'submitting') {
      return;
    }

    if (!hasRequiredCredentials(state)) {
      dispatch({ type: 'submitted', value: 'missingFields' });
      return;
    }

    dispatch({ type: 'submitted', value: 'submitting' });

    void login({
      email: state.email.trim().toLowerCase(),
      password: state.password,
      rememberSession: state.rememberSession
    })
      .then((user) => {
        dispatch({ type: 'submitted', value: 'success' });
        onAuthenticated(user);
      })
      .catch((error: unknown) => {
        dispatch({
          type: 'submitted',
          value:
            error instanceof AuthApiError && error.code === 'INVALID_CREDENTIALS'
              ? 'invalidCredentials'
              : 'networkError'
        });
      });
  }, [onAuthenticated, state]);

  const handlers: LoginFormHandlers = {
    onEmailChange,
    onPasswordChange,
    onRememberSessionChange,
    onSubmit
  };

  return {
    feedbackText: getFeedbackText(state),
    handlers,
    state
  };
}
