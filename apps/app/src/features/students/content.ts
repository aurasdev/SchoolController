export type Student = {
  id: string;
  enrollment: string;
  name: string;
  degree: string;
  semester: number;
  group: string;
  status: 'Activo' | 'Inactivo' | null;
};

// Example directory shown until a students API is connected.
export const initialStudents: Student[] = [
  {
    id: 'student-1',
    enrollment: 'A2024-001',
    name: 'María González Pérez',
    degree: 'Ing. Sistemas',
    semester: 4,
    group: 'ISC-4A',
    status: null
  },
  {
    id: 'student-2',
    enrollment: 'A2024-015',
    name: 'Carlos Hernández López',
    degree: 'Ing. Industrial',
    semester: 6,
    group: 'IIN-6B',
    status: null
  },
  {
    id: 'student-3',
    enrollment: 'A2023-042',
    name: 'Ana Martínez Ruiz',
    degree: 'Arquitectura',
    semester: 3,
    group: 'ARQ-3A',
    status: null
  },
  {
    id: 'student-4',
    enrollment: 'A2024-089',
    name: 'Roberto Díaz Sánchez',
    degree: 'Derecho',
    semester: 2,
    group: 'DER-2A',
    status: null
  },
  {
    id: 'student-5',
    enrollment: 'A2023-156',
    name: 'Laura Torres Vega',
    degree: 'Medicina',
    semester: 5,
    group: 'MED-5A',
    status: null
  },
  {
    id: 'student-6',
    enrollment: 'A2022-201',
    name: 'Pedro Ramírez Luna',
    degree: 'Ing. Sistemas',
    semester: 8,
    group: 'ISC-8A',
    status: null
  }
];
