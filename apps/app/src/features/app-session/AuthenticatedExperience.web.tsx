import { AdminDashboardScreen } from '@/features/admin-dashboard';
import { UnderDevelopmentScreen } from '@/features/app-session/UnderDevelopmentScreen';
import type { AuthenticatedUser } from '@/features/login/types';

type AuthenticatedExperienceProps = {
  onSignOut: () => void;
  user: AuthenticatedUser;
};

export function AuthenticatedExperience({ onSignOut, user }: AuthenticatedExperienceProps) {
  if (user.role !== 'ADMIN') {
    return <UnderDevelopmentScreen onSignOut={onSignOut} />;
  }

  return <AdminDashboardScreen onSignOut={onSignOut} user={user} />;
}
