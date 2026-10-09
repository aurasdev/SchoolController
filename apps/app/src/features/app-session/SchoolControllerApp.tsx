import { useCallback, useState } from 'react';

import { AuthenticatedExperience } from '@/features/app-session/AuthenticatedExperience';
import { LoginScreen } from '@/features/login';
import type { AuthenticatedUser } from '@/features/login/types';

export function SchoolControllerApp() {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  const handleAuthenticated = useCallback((authenticatedUser: AuthenticatedUser) => {
    setUser(authenticatedUser);
  }, []);

  const handleSignOut = useCallback(() => {
    setUser(null);
  }, []);

  if (user) {
    return <AuthenticatedExperience onSignOut={handleSignOut} user={user} />;
  }

  return <LoginScreen onAuthenticated={handleAuthenticated} />;
}
