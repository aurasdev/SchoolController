import { teachers } from './content';
import type { AcademicClass, ClassFilters } from './types';

export const CLASSES_PAGE_SIZE = 8;

export const emptyClassFilters: ClassFilters = {
  search: '',
  department: '',
  teacherId: '',
  activeOnly: false,
  tab: 'all'
};

export function filterClasses(classes: AcademicClass[], filters: ClassFilters) {
  const search = filters.search.trim().toLowerCase();

  return classes.filter((academicClass) => {
    const teacher = teachers.find((option) => option.id === academicClass.teacherId);
    const matchesSearch =
      !search ||
      [
        academicClass.name,
        academicClass.department,
        academicClass.schedule,
        teacher?.name ?? ''
      ].some((value) => value.toLowerCase().includes(search));

    return (
      matchesSearch &&
      (!filters.department || academicClass.department === filters.department) &&
      (!filters.teacherId || academicClass.teacherId === filters.teacherId) &&
      (!filters.activeOnly || academicClass.status === 'active') &&
      (filters.tab === 'all' || academicClass.status === filters.tab)
    );
  });
}

export function paginateClasses<T>(items: T[], page: number, pageSize = CLASSES_PAGE_SIZE) {
  const size = Number.isSafeInteger(pageSize) && pageSize > 0 ? pageSize : CLASSES_PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const requestedPage = Number.isFinite(page) ? Math.trunc(page) : 1;
  const current = Math.min(Math.max(requestedPage, 1), pageCount);
  const start = (current - 1) * size;

  return {
    from: items.length === 0 ? 0 : start + 1,
    items: items.slice(start, start + size),
    page: current,
    pageCount,
    to: Math.min(start + size, items.length),
    total: items.length
  };
}

export function getClassPageNumbers(page: number, pageCount: number): (number | 'ellipsis')[] {
  const total = Number.isFinite(pageCount) ? Math.max(1, Math.trunc(pageCount)) : 1;
  const current = Math.min(Math.max(Number.isFinite(page) ? Math.trunc(page) : 1, 1), total);

  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const visible = new Set([1, total]);

  for (let candidate = current - 1; candidate <= current + 1; candidate += 1) {
    if (candidate > 1 && candidate < total) visible.add(candidate);
  }

  if (current <= 3) {
    visible.add(2);
    visible.add(3);
    visible.add(4);
  }

  if (current >= total - 2) {
    visible.add(total - 1);
    visible.add(total - 2);
    visible.add(total - 3);
  }

  const pages = [...visible].sort((first, second) => first - second);
  const result: (number | 'ellipsis')[] = [];

  pages.forEach((value, index) => {
    const previous = pages[index - 1];

    if (previous !== undefined && value - previous === 2) result.push(previous + 1);
    if (previous !== undefined && value - previous > 2) result.push('ellipsis');
    result.push(value);
  });

  return result;
}
