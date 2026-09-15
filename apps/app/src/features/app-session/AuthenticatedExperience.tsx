import { UnderDevelopmentScreen } from '@/features/app-session/UnderDevelopmentScreen';
import type { AuthenticatedUser } from '@/features/login/types';

type AuthenticatedExperienceProps = {
  onSignOut: () => void;
  user: AuthenticatedUser;
};

export function AuthenticatedExperience(_props: AuthenticatedExperienceProps) {
  return <UnderDevelopmentScreen />;
}
