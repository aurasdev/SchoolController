export type ClassStatus = 'active' | 'pending';

export type AcademicClass = {
  id: string;
  name: string;
  department: string;
  teacherId: string;
  schedule: string;
  students: number;
  status: ClassStatus;
};

export type ClassInput = Omit<AcademicClass, 'id'>;

export type TeacherOption = {
  id: string;
  name: string;
  initials: string;
};

export type ClassFilters = {
  search: string;
  department: string;
  teacherId: string;
  activeOnly: boolean;
  tab: 'all' | 'active' | 'pending';
};

export type ClassValidationErrors = Partial<Record<keyof ClassInput, string>>;
