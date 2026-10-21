import type { AcademicClass, TeacherOption } from './types';

export const departments = ['Science & Math', 'Humanities', 'Arts', 'Athletics'];

export const teachers: TeacherOption[] = [
  { id: 'johnson', name: 'Mr. Johnson', initials: 'JO' },
  { id: 'smith', name: 'Dr. Smith', initials: 'SM' },
  { id: 'davis', name: 'Ms. Davis', initials: 'DA' },
  { id: 'chen', name: 'Mrs. Chen', initials: 'CH' },
  { id: 'patel', name: 'Dr. Patel', initials: 'PA' },
  { id: 'kim', name: 'Mr. Kim', initials: 'KI' },
  { id: 'rodriguez', name: 'Ms. Rodriguez', initials: 'RO' },
  { id: 'brown', name: 'Coach Brown', initials: 'BR' }
];

// Local demonstration data until class management is connected to the API.
export const initialClasses: AcademicClass[] = [
  {
    id: 'class-mathematics-101',
    name: 'Mathematics 101',
    department: 'Science & Math',
    teacherId: 'johnson',
    schedule: 'Mon/Wed/Fri 08:00',
    students: 32,
    status: 'active'
  },
  {
    id: 'class-physics-201',
    name: 'Physics 201',
    department: 'Science & Math',
    teacherId: 'smith',
    schedule: 'Tue/Thu 09:45',
    students: 28,
    status: 'active'
  },
  {
    id: 'class-english-101',
    name: 'English 101',
    department: 'Humanities',
    teacherId: 'davis',
    schedule: 'Mon/Wed 11:30',
    students: 35,
    status: 'active'
  },
  {
    id: 'class-art-studio',
    name: 'Art Studio',
    department: 'Arts',
    teacherId: 'chen',
    schedule: 'Mon/Thu 14:00',
    students: 18,
    status: 'active'
  },
  {
    id: 'class-biology-201',
    name: 'Biology 201',
    department: 'Science & Math',
    teacherId: 'patel',
    schedule: 'Wed/Fri 10:00',
    students: 24,
    status: 'pending'
  },
  {
    id: 'class-music-theory',
    name: 'Music Theory',
    department: 'Arts',
    teacherId: 'kim',
    schedule: 'Tue/Thu 13:00',
    students: 15,
    status: 'active'
  },
  {
    id: 'class-chemistry-lab',
    name: 'Chemistry Lab',
    department: 'Science & Math',
    teacherId: 'rodriguez',
    schedule: 'Mon/Wed 15:45',
    students: 22,
    status: 'active'
  },
  {
    id: 'class-pe-health',
    name: 'PE & Health',
    department: 'Athletics',
    teacherId: 'brown',
    schedule: 'Daily 14:00',
    students: 40,
    status: 'pending'
  }
];
