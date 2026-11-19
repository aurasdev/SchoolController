import type { TeacherStatus } from '@school-controller/shared';

export type { Teacher, TeacherInput, TeacherStatus } from '@school-controller/shared';

export const teacherStatusOptions: { label: string; value: TeacherStatus }[] = [
  { label: 'Activo', value: 'Activo' },
  { label: 'Licencia', value: 'Licencia' },
  { label: 'Inactivo', value: 'Inactivo' }
];
