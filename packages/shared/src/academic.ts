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
  /** Teachers allowed to teach it. Empty: any teacher of the career. One: only that teacher. */
  teacherIds: string[];
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
  studyPlanId: string | null;
};
export type StudyPlan = {
  id: string;
  departmentId: string;
  year: number;
  name: string;
  groups: number;
  subjects: { subjectId: string; semester: number }[];
};
export type StudyPlanImportInput = {
  departmentId: string;
  year: number;
  name: string;
  subjects: { code: string; name: string; semester: number }[];
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
  settings: ShiftSettings;
  studyPlans: StudyPlan[];
};

/** Global rule: which semesters should have classes in the morning or in the afternoon. */
export type ShiftSettings = {
  enabled: boolean;
  morningSemesters: number[];
  afternoonSemesters: number[];
  /** HH:mm. Morning runs from morningStart to afternoonStart, afternoon from afternoonStart to dayEnd. */
  morningStart: string;
  afternoonStart: string;
  dayEnd: string;
};
