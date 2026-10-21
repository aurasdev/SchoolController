import type { Classroom } from '@school-controller/shared';

import type { ClassroomFilters } from '@/features/classrooms/types';

export const CLASSROOMS_PAGE_SIZE = 6;

export const emptyClassroomFilters: ClassroomFilters = {
  building: '',
  search: '',
  status: '',
  type: ''
};

export function hasActiveFilters(filters: ClassroomFilters) {
  return Object.values(filters).some((value) => value.trim().length > 0);
}

export function filterClassrooms(classrooms: Classroom[], filters: ClassroomFilters) {
  const search = filters.search.trim().toLowerCase();

  return classrooms.filter(
    (classroom) =>
      (!search ||
        classroom.code.toLowerCase().includes(search) ||
        classroom.building.toLowerCase().includes(search)) &&
      (!filters.building || classroom.building === filters.building) &&
      (!filters.type || classroom.type === filters.type) &&
      (!filters.status || classroom.status === filters.status)
  );
}

export function paginate<T>(items: T[], page: number, pageSize = CLASSROOMS_PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(page, 1), pageCount);
  const start = (current - 1) * pageSize;

  return {
    from: items.length === 0 ? 0 : start + 1,
    items: items.slice(start, start + pageSize),
    page: current,
    pageCount,
    to: Math.min(start + pageSize, items.length),
    total: items.length
  };
}
