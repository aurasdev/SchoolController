import { useCallback, useEffect, useState } from 'react';

import { AuthenticatedExperience } from '@/features/app-session/AuthenticatedExperience';
import { SessionLoadingScreen } from '@/features/app-session/SessionLoadingScreen';
import { LoginScreen } from '@/features/login';
import { logout, restoreSession } from '@/features/login/auth-api';
import type { AuthenticatedUser } from '@/features/login/types';

export function SchoolControllerApp() {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    void restoreSession().then((restoredUser) => {
      if (isMounted) {
        setUser(restoredUser);
        setIsRestoringSession(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAuthenticated = useCallback((authenticatedUser: AuthenticatedUser) => {
    setUser(authenticatedUser);
  }, []);

  const handleSignOut = useCallback(() => {
    void logout().finally(() => {
      setUser(null);
    });
  }, []);

  if (isRestoringSession) {
    return <SessionLoadingScreen />;
  }

  if (user) {
    return <AuthenticatedExperience onSignOut={handleSignOut} user={user} />;
  }

  return <LoginScreen onAuthenticated={handleAuthenticated} />;
}
