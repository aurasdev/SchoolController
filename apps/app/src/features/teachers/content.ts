export type TeacherStatus = 'Activo' | 'Licencia' | 'Inactivo';
export type Teacher = {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  subjects: number;
  weeklyHours: number;
  status: TeacherStatus;
};
export type TeacherInput = Omit<Teacher, 'id'>;

export const teacherStatusOptions: { label: string; value: TeacherStatus }[] = [
  { label: 'Activo', value: 'Activo' },
  { label: 'Licencia', value: 'Licencia' },
  { label: 'Inactivo', value: 'Inactivo' }
];

const referenceTeachers: Teacher[] = [
  {
    id: 'teacher-1',
    employeeId: 'EMP-001',
    name: 'Dr. Ricardo Mendoza Torres',
    department: 'Ing. Sistemas',
    subjects: 3,
    weeklyHours: 18,
    status: 'Activo'
  },
  {
    id: 'teacher-2',
    employeeId: 'EMP-008',
    name: 'Mtra. Carmen Ruiz Delgado',
    department: 'Arquitectura',
    subjects: 2,
    weeklyHours: 12,
    status: 'Activo'
  },
  {
    id: 'teacher-3',
    employeeId: 'EMP-012',
    name: 'Ing. Fernando López Castillo',
    department: 'Ing. Industrial',
    subjects: 4,
    weeklyHours: 24,
    status: 'Activo'
  },
  {
    id: 'teacher-4',
    employeeId: 'EMP-019',
    name: 'Lic. Patricia Navarro Soto',
    department: 'Derecho',
    subjects: 2,
    weeklyHours: 10,
    status: 'Licencia'
  },
  {
    id: 'teacher-5',
    employeeId: 'EMP-025',
    name: 'Dr. Alejandro Vargas Mora',
    department: 'Medicina',
    subjects: 3,
    weeklyHours: 16,
    status: 'Activo'
  },
  {
    id: 'teacher-6',
    employeeId: 'EMP-031',
    name: 'Mtra. Gabriela Flores Ortiz',
    department: 'Ing. Sistemas',
    subjects: 2,
    weeklyHours: 12,
    status: 'Inactivo'
  }
];

const additionalNames = [
  'Mtra. Lucía Herrera Pérez',
  'Arq. Daniel Castro León',
  'Ing. Sofía Ramírez Díaz',
  'Lic. Miguel Rojas Vega',
  'Dra. Elena Cruz Medina',
  'Mtro. Andrés Salazar Gil',
  'Dr. Jorge Méndez Silva',
  'Arq. Valeria Ortega Ruiz',
  'Ing. Luis Aguilar Ramos',
  'Lic. Ana Beltrán Torres',
  'Dra. Isabel Fuentes Soto',
  'Mtro. Pablo Serrano Luna',
  'Dra. Mariana Reyes Flores',
  'Arq. Diego Molina Paz',
  'Ing. Laura Campos Vidal',
  'Lic. Raúl Delgado Peña',
  'Dr. Sergio Paredes Cruz',
  'Mtra. Natalia Romero León',
  'Dr. Emilio Suárez Lara',
  'Arq. Claudia Ríos Mora',
  'Ing. Hugo Carrillo Vera',
  'Lic. Teresa Lozano Solís',
  'Dra. Cecilia Núñez Alba',
  'Mtro. Óscar Bravo Cano',
  'Mtra. Adriana Montes Rivas',
  'Arq. Rafael Ibarra Nieto',
  'Ing. Beatriz Cordero Ayala',
  'Lic. Manuel Espinoza Sáenz',
  'Dra. Rosa Benítez Franco',
  'Mtro. Víctor Acosta Rubio',
  'Dra. Alicia Treviño Rosas',
  'Arq. Enrique Robles Marín'
];

// Local demonstration directory; no API writes are performed.
export const initialTeachers: Teacher[] = [
  ...referenceTeachers,
  ...additionalNames.map((name, index) => ({
    ...referenceTeachers[index % referenceTeachers.length],
    id: `demo-teacher-${index + 7}`,
    employeeId: `EMP-${String(index + 32).padStart(3, '0')}`,
    name
  }))
];
