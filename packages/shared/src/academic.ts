import type { Classroom } from './classroom.js';

export type AcademicDay =
  'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
export type TeacherStatus = 'Activo' | 'Licencia' | 'Inactivo';
export type TeacherInput = {
  employeeId: string;
  name: string;
  departmentId: string;
  status: TeacherStatus;
};
export type Teacher = TeacherInput & {
  id: string;
  department: string;
  subjects: number;
  weeklyHours: number;
};
export type StudentInput = {
  enrollment: string;
  name: string;
  groupId: string;
  status: 'Activo' | 'Inactivo';
};
export type Student = StudentInput & {
  id: string;
  degree: string;
  semester: number;
  group: string;
};
export type ClassInput = {
  subjectId: string;
  teacherId: string;
  groupId: string;
  classroomId: string;
  scheduleId: string;
  dayOfWeek: AcademicDay;
  startTime: string;
  endTime: string;
  status: 'Active' | 'Pending';
};
export type AcademicClass = ClassInput & {
  id: string;
  name: string;
  department: string;
  teacher: string;
  initials: string;
  schedule: string;
  students: number;
  room: string;
  group: string;
  academicPeriodId: string;
};
export type Department = { id: string; code: string; name: string };
export type AcademicSubject = {
  id: string;
  code: string;
  name: string;
  departmentId: string | null;
};
export type AcademicGroup = {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  degree: string;
  semester: number;
  students: number;
  academicPeriodId: string;
};
export type AcademicPeriod = {
  id: string;
  name: string;
  startsOn: string;
  endsOn: string;
  isActive: boolean;
};
export type AcademicSchedule = { id: string; name: string; academicPeriodId: string };
export type AcademicActivity = { id: string; title: string; createdAt: string };
export type AcademicData = {
  departments: Department[];
  subjects: AcademicSubject[];
  groups: AcademicGroup[];
  periods: AcademicPeriod[];
  schedules: AcademicSchedule[];
  classes: AcademicClass[];
  classrooms: Classroom[];
  teachers: Teacher[];
  students: Student[];
  activities: AcademicActivity[];
};
