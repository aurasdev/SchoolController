import { dashboardColors } from '@/features/admin-dashboard/tokens';

export const classColors = {
  ...dashboardColors,
  active: '#16803d',
  activeBackground: '#dcfce7',
  avatarBackground: '#dbe8ff',
  pending: '#a45505',
  pendingBackground: '#fef3c7'
} as const;

export const classTableMinWidth = 1040;
