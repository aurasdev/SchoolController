import { AdminDashboardScreen } from '@/features/admin-dashboard';
import type { AuthenticatedUser } from '@/features/login/types';

type AuthenticatedExperienceProps = {
  onSignOut: () => void;
  user: AuthenticatedUser;
};

export function AuthenticatedExperience({ onSignOut, user }: AuthenticatedExperienceProps) {
  return <AdminDashboardScreen onSignOut={onSignOut} user={user} />;
}
