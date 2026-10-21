import type { ClassroomStatus } from '@school-controller/shared';

import { dashboardColors } from '@/features/admin-dashboard/tokens';

export const classroomColors = {
  danger: '#e2252a',
  dangerSubtle: '#fde8e8',
  success: '#1aa34a',
  successSubtle: '#e6f6ec'
} as const;

export const classroomStatusColors: Record<ClassroomStatus, { background: string; text: string }> =
  {
    available: { background: classroomColors.successSubtle, text: classroomColors.success },
    maintenance: { background: dashboardColors.warningSubtle, text: dashboardColors.warning },
    occupied: { background: classroomColors.dangerSubtle, text: classroomColors.danger }
  };

// Window width from which the table fits all columns next to the 260px sidebar.
export const classroomTableMinWidth = 1180;
