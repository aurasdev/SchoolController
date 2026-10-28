import { createHash } from 'node:crypto';

export type SeedDay = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';
export type SeedDepartment = { code: string; name: string; subjects: string[] };
export type SeedTeacher = {
  employeeNumber: string;
  departmentCode: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  employmentStatus: 'Activo' | 'Licencia' | 'Inactivo';
};
export type SeedGroup = { code: string; name: string; departmentCode: string; semester: number };
export type SeedStudent = {
  enrollmentNumber: string;
  groupCode: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
};
export type SeedSubject = {
  code: string;
  name: string;
  departmentCode: string;
  description: string;
  roomType: string;
};
export type SeedRoom = {
  code: string;
  name: string;
  capacity: number;
  location: string;
  building: string;
  type: string;
  equipment: string[];
  status: string;
};
export type SeedMeeting = {
  id: string;
  groupCode: string;
  subjectCode: string;
  employeeNumber: string;
  classroomCode: string;
  dayOfWeek: SeedDay;
  startTime: Date;
  endTime: Date;
  status: 'Active' | 'Pending';
};

export const ACADEMIC_PERIOD_NAME = 'Agosto - Diciembre 2026';
export const ACADEMIC_SCHEDULE_NAME = 'Horario escolar agosto - diciembre 2026';

export const DEPARTMENTS: SeedDepartment[] = [
  {
    code: 'ISC',
    name: 'Ingeniería en Sistemas Computacionales',
    subjects: [
      'Fundamentos de programación',
      'Matemáticas discretas',
      'Cálculo diferencial',
      'Programación orientada a objetos',
      'Bases de datos',
      'Redes de computadoras',
      'Ingeniería de software',
      'Sistemas operativos',
      'Desarrollo de aplicaciones web',
      'Seguridad informática'
    ]
  },
  {
    code: 'IIN',
    name: 'Ingeniería Industrial',
    subjects: [
      'Introducción a la ingeniería industrial',
      'Dibujo industrial',
      'Estadística aplicada',
      'Procesos de manufactura',
      'Investigación de operaciones',
      'Ingeniería de métodos',
      'Gestión de la calidad',
      'Planeación de la producción',
      'Logística y cadena de suministro',
      'Evaluación de proyectos industriales'
    ]
  },
  {
    code: 'ARQ',
    name: 'Arquitectura',
    subjects: [
      'Fundamentos del diseño',
      'Geometría descriptiva',
      'Historia de la arquitectura',
      'Expresión arquitectónica',
      'Materiales y sistemas constructivos',
      'Diseño arquitectónico',
      'Estructuras arquitectónicas',
      'Urbanismo',
      'Instalaciones en edificios',
      'Proyecto arquitectónico integral'
    ]
  },
  {
    code: 'DER',
    name: 'Derecho',
    subjects: [
      'Introducción al estudio del derecho',
      'Teoría del Estado',
      'Derecho constitucional',
      'Derecho civil',
      'Derecho penal',
      'Derecho administrativo',
      'Derecho laboral',
      'Derecho mercantil',
      'Derecho procesal',
      'Argumentación jurídica'
    ]
  },
  {
    code: 'MED',
    name: 'Medicina',
    subjects: [
      'Anatomía humana',
      'Biología celular',
      'Bioquímica médica',
      'Fisiología humana',
      'Microbiología médica',
      'Farmacología',
      'Patología general',
      'Propedéutica clínica',
      'Medicina interna',
      'Salud pública'
    ]
  },
  {
    code: 'LAE',
    name: 'Administración de Empresas',
    subjects: [
      'Fundamentos de administración',
      'Contabilidad financiera',
      'Matemáticas financieras',
      'Comportamiento organizacional',
      'Economía empresarial',
      'Mercadotecnia',
      'Gestión del talento humano',
      'Finanzas corporativas',
      'Dirección estratégica',
      'Desarrollo de negocios'
    ]
  }
];

const TEACHER_NAMES = [
  ['Ricardo', 'Mendoza Torres', 'Dr.'],
  ['Gabriela', 'Flores Ortiz', 'Mtra.'],
  ['Andrés', 'Salazar Méndez', 'Mtro.'],
  ['Lucía', 'Vázquez Ríos', 'Dra.'],
  ['Daniel', 'Herrera Castillo', 'Ing.'],
  ['Mariana', 'Cortés Aguilar', 'Mtra.'],
  ['Fernando', 'López Castillo', 'Ing.'],
  ['Sofía', 'Ramírez Medina', 'Mtra.'],
  ['Jorge', 'Navarro Treviño', 'Dr.'],
  ['Paola', 'Gutiérrez Valdés', 'Ing.'],
  ['Eduardo', 'Santos Villalobos', 'Mtro.'],
  ['Verónica', 'Reyes Acosta', 'Dra.'],
  ['Carmen', 'Ruiz Delgado', 'Mtra.'],
  ['Luis', 'Domínguez Peña', 'Arq.'],
  ['Alejandra', 'Fuentes Vargas', 'Arq.'],
  ['Héctor', 'Morales Cruz', 'Mtro.'],
  ['Claudia', 'Paredes Luna', 'Arq.'],
  ['Raúl', 'Benítez Rosales', 'Dr.'],
  ['Patricia', 'Navarro Soto', 'Lic.'],
  ['Miguel', 'Álvarez Cabrera', 'Dr.'],
  ['Teresa', 'Ponce Márquez', 'Mtra.'],
  ['Rodrigo', 'Silva Ochoa', 'Lic.'],
  ['Diana', 'Cervantes Molina', 'Dra.'],
  ['Francisco', 'Ortega Salinas', 'Lic.'],
  ['Alejandro', 'Vargas Mora', 'Dr.'],
  ['Isabel', 'Estrada Campos', 'Dra.'],
  ['Sergio', 'Castañeda Rangel', 'Dr.'],
  ['Beatriz', 'Padilla Solís', 'Dra.'],
  ['Arturo', 'Espinosa León', 'Dr.'],
  ['Rocío', 'Lara Zamora', 'Dra.'],
  ['Mónica', 'Robles Serrano', 'Mtra.'],
  ['Carlos', 'Valdez Ibarra', 'Mtro.'],
  ['Adriana', 'Montes Rivas', 'Dra.'],
  ['Óscar', 'Carrillo Vega', 'Mtro.'],
  ['Natalia', 'Delgado Palacios', 'Mtra.'],
  ['Enrique', 'Mejía Rosas', 'Dr.'],
  ['Elena', 'Aguilar Cárdenas', 'Mtra.'],
  ['Diego', 'Núñez Escobar', 'Ing.']
] as const;

const STUDENT_FIRST_NAMES = [
  'María',
  'Carlos',
  'Ana',
  'Roberto',
  'Laura',
  'Pedro',
  'Valeria',
  'Diego',
  'Camila',
  'José Luis',
  'Sofía',
  'Daniel',
  'Fernanda',
  'Alejandro',
  'Daniela',
  'Luis Ángel',
  'Regina',
  'Emiliano',
  'Renata',
  'Javier',
  'Ximena',
  'Andrés',
  'Mariana',
  'Santiago',
  'Paola',
  'Sebastián',
  'Lucía',
  'Miguel Ángel',
  'Natalia',
  'Rodrigo'
];
const STUDENT_SURNAMES = [
  'González',
  'Hernández',
  'Martínez',
  'Díaz',
  'Torres',
  'Ramírez',
  'López',
  'Pérez',
  'García',
  'Flores',
  'Sánchez',
  'Vargas',
  'Castillo',
  'Romero',
  'Morales',
  'Reyes',
  'Ortega',
  'Jiménez',
  'Medina',
  'Castro',
  'Ramos',
  'Mendoza',
  'Ruiz',
  'Aguilar',
  'Navarro',
  'Vega',
  'Silva',
  'Cruz',
  'Rojas',
  'Cabrera',
  'Campos'
];
const DAYS: SeedDay[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const COURSE_DAYS: [number, number][] = [
  [0, 2],
  [1, 3],
  [2, 4],
  [0, 3],
  [1, 4]
];
const PERIOD_SUBJECTS = [
  [0, 1, 2, 3, 4],
  [2, 3, 4, 5, 6],
  [4, 5, 6, 7, 8],
  [5, 6, 7, 8, 9]
];

function item<T>(items: readonly T[], index: number): T {
  const value = items[index];
  if (value === undefined) throw new Error(`Academic seed item ${index} does not exist.`);
  return value;
}

export function academicSeedId(key: string): string {
  const bytes = createHash('sha256').update(`school-controller:academic:2026:${key}`).digest();
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x50;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  const hex = bytes.toString('hex').slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function rooms(): SeedRoom[] {
  const result: SeedRoom[] = [];
  for (let index = 0; index < 16; index += 1) {
    const building = index < 8 ? 'Edificio A' : 'Edificio B';
    const code = `${index < 8 ? 'A' : 'B'}-${index % 8 < 4 ? '1' : '2'}0${(index % 4) + 1}`;
    result.push({
      code,
      name: `Aula ${code}`,
      building,
      capacity: [30, 32, 35, 40][index % 4] ?? 30,
      location: `${building}, ${index % 8 < 4 ? 'primer' : 'segundo'} piso`,
      type: 'standard',
      equipment: ['Proyector', 'Pizarrón', 'Aire acondicionado'],
      status: index === 15 ? 'maintenance' : 'available'
    });
  }
  result.push(
    {
      code: 'LC-01',
      name: 'Laboratorio de cómputo 1',
      capacity: 30,
      location: 'Edificio C, planta baja',
      building: 'Edificio C',
      type: 'laboratory',
      equipment: ['30 computadoras', 'Proyector', 'Red de datos', 'Aire acondicionado'],
      status: 'available'
    },
    {
      code: 'LC-02',
      name: 'Laboratorio de cómputo 2',
      capacity: 28,
      location: 'Edificio C, primer piso',
      building: 'Edificio C',
      type: 'laboratory',
      equipment: ['28 computadoras', 'Pantalla interactiva', 'Red de datos'],
      status: 'available'
    },
    {
      code: 'LM-01',
      name: 'Laboratorio de ciencias médicas',
      capacity: 30,
      location: 'Edificio D, planta baja',
      building: 'Edificio D',
      type: 'laboratory',
      equipment: ['Microscopios', 'Mesas de trabajo', 'Lavamanos', 'Proyector'],
      status: 'available'
    },
    {
      code: 'LM-02',
      name: 'Laboratorio de habilidades clínicas',
      capacity: 28,
      location: 'Edificio D, primer piso',
      building: 'Edificio D',
      type: 'laboratory',
      equipment: ['Modelos anatómicos', 'Camillas', 'Equipo de exploración'],
      status: 'available'
    },
    {
      code: 'TA-01',
      name: 'Taller de arquitectura',
      capacity: 32,
      location: 'Edificio E, planta baja',
      building: 'Edificio E',
      type: 'workshop',
      equipment: ['Restiradores', 'Mesas de corte', 'Proyector'],
      status: 'available'
    },
    {
      code: 'TI-01',
      name: 'Taller de procesos industriales',
      capacity: 30,
      location: 'Edificio E, anexo',
      building: 'Edificio E',
      type: 'workshop',
      equipment: ['Bancos de trabajo', 'Herramientas', 'Equipo de metrología'],
      status: 'maintenance'
    },
    {
      code: 'AU-01',
      name: 'Auditorio principal',
      capacity: 150,
      location: 'Edificio F, acceso principal',
      building: 'Edificio F',
      type: 'auditorium',
      equipment: ['Sistema de sonido', 'Proyector', 'Micrófonos', 'Escenario'],
      status: 'available'
    },
    {
      code: 'SM-01',
      name: 'Sala de usos múltiples',
      capacity: 60,
      location: 'Edificio F, primer piso',
      building: 'Edificio F',
      type: 'auditorium',
      equipment: ['Pantalla', 'Sistema de sonido', 'Mobiliario modular'],
      status: 'available'
    }
  );
  return result;
}

function roomType(departmentCode: string, subjectIndex: number): string {
  if (departmentCode === 'ISC' && [0, 3, 4, 5, 7, 8, 9].includes(subjectIndex)) return 'laboratory';
  if (departmentCode === 'MED' && [0, 1, 2, 4, 7].includes(subjectIndex)) return 'laboratory';
  if (departmentCode === 'ARQ' && [0, 1, 3, 5, 9].includes(subjectIndex)) return 'workshop';
  return 'standard';
}

export function buildAcademicSeedData() {
  const classrooms = rooms();
  const teachers: SeedTeacher[] = TEACHER_NAMES.map(([firstName, lastName, title], index) => {
    const department = item(DEPARTMENTS, index < 36 ? Math.floor(index / 6) : index - 36);
    const employmentStatus =
      index < 36 && index % 6 === 5
        ? Math.floor(index / 6) % 2 === 0
          ? 'Licencia'
          : 'Inactivo'
        : 'Activo';
    return {
      employeeNumber: `EMP-${String(index + 1).padStart(3, '0')}`,
      departmentCode: department.code,
      firstName,
      lastName,
      displayName: `${title} ${firstName} ${lastName}`,
      email: `docente.${String(index + 1).padStart(3, '0')}@iest.example`,
      employmentStatus
    };
  });
  const groups: SeedGroup[] = [];
  const students: SeedStudent[] = [];
  const subjects: SeedSubject[] = [];

  for (const department of DEPARTMENTS) {
    department.subjects.forEach((name, index) =>
      subjects.push({
        code: `${department.code}-${String(index + 1).padStart(3, '0')}`,
        name,
        departmentCode: department.code,
        description: `Asignatura del plan de estudios de ${department.name}.`,
        roomType: roomType(department.code, index)
      })
    );
    [1, 3, 5, 7].forEach((semester) => {
      const groupCode = `${department.code}-${semester}A`;
      groups.push({
        code: groupCode,
        name: `${department.name} · ${semester}.º A`,
        departmentCode: department.code,
        semester
      });
      for (let ordinal = 0; ordinal < 25; ordinal += 1) {
        const studentIndex = students.length;
        const year = 2026 - Math.floor((semester - 1) / 2);
        const enrollmentNumber = `A${year}-${String(studentIndex + 1).padStart(3, '0')}`;
        const firstName = item(STUDENT_FIRST_NAMES, studentIndex % STUDENT_FIRST_NAMES.length);
        const lastName = `${item(STUDENT_SURNAMES, Math.floor(studentIndex / STUDENT_FIRST_NAMES.length) % STUDENT_SURNAMES.length)} ${item(STUDENT_SURNAMES, (studentIndex * 7 + 7) % STUDENT_SURNAMES.length)}`;
        students.push({
          enrollmentNumber,
          groupCode,
          firstName,
          lastName,
          email: `${enrollmentNumber.toLowerCase().replace('-', '.')}@alumnos.iest.example`,
          isActive: !(semester === 7 && ordinal === 24)
        });
      }
    });
  }

  const meetings: SeedMeeting[] = [];
  const occupied = new Set<string>();
  const available = (resource: string, day: SeedDay, slot: number) =>
    !occupied.has(`${resource}:${day}:${slot}`);
  groups.forEach((group, groupIndex) => {
    const groupTeachers = teachers.filter(
      (teacher) =>
        teacher.departmentCode === group.departmentCode && teacher.employmentStatus === 'Activo'
    );
    const departmentSubjects = subjects.filter(
      (subject) => subject.departmentCode === group.departmentCode
    );
    const semesterIndex = Math.floor((group.semester - 1) / 2);
    item(PERIOD_SUBJECTS, semesterIndex).forEach((subjectIndex, courseIndex) => {
      const subject = item(departmentSubjects, subjectIndex);
      const teacher = item(groupTeachers, (semesterIndex + courseIndex) % groupTeachers.length);
      item(COURSE_DAYS, courseIndex).forEach((dayIndex, meetingIndex) => {
        const dayOfWeek = item(DAYS, dayIndex);
        const candidates = classrooms.filter(
          (classroom) =>
            classroom.status === 'available' &&
            classroom.capacity >= 25 &&
            classroom.type === subject.roomType &&
            (subject.roomType !== 'laboratory' ||
              classroom.code.startsWith(group.departmentCode === 'MED' ? 'LM' : 'LC'))
        );
        let placed = false;
        for (let offset = 0; offset < 6 && !placed; offset += 1) {
          const slot = (groupIndex + courseIndex + offset) % 6;
          if (
            !available(`teacher-${teacher.employeeNumber}`, dayOfWeek, slot) ||
            !available(`group-${group.code}`, dayOfWeek, slot)
          )
            continue;
          const classroom = candidates.find((room) =>
            available(`room-${room.code}`, dayOfWeek, slot)
          );
          if (!classroom) continue;
          const startMinutes = 8 * 60 + slot * 90;
          const startTime = new Date(
            Date.UTC(1970, 0, 1, Math.floor(startMinutes / 60), startMinutes % 60)
          );
          const endTime = new Date(startTime.getTime() + 90 * 60_000);
          meetings.push({
            id: academicSeedId(`meeting:${group.code}:${subject.code}:${meetingIndex}`),
            groupCode: group.code,
            subjectCode: subject.code,
            employeeNumber: teacher.employeeNumber,
            classroomCode: classroom.code,
            dayOfWeek,
            startTime,
            endTime,
            status: 'Active'
          });
          [
            `teacher-${teacher.employeeNumber}`,
            `group-${group.code}`,
            `room-${classroom.code}`
          ].forEach((resource) => occupied.add(`${resource}:${dayOfWeek}:${slot}`));
          placed = true;
        }
        if (!placed)
          throw new Error(
            `No classroom/time available for ${group.code}, ${subject.code}, ${dayOfWeek}.`
          );
      });
    });
  });

  return { departments: DEPARTMENTS, teachers, groups, students, subjects, classrooms, meetings };
}
