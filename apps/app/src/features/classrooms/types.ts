import type { ClassroomStatus, ClassroomType } from '@school-controller/shared';

export type ClassroomFilters = {
  building: string;
  search: string;
  status: ClassroomStatus | '';
  type: ClassroomType | '';
};

export type ClassroomsRoute =
  | { name: 'list' }
  | { name: 'create' }
  | { id: string; name: 'detail' }
  | { id: string; name: 'edit' };

export type SelectOption<T extends string> = {
  label: string;
  value: T;
};
