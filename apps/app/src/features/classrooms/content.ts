import type { Classroom, ClassroomStatus, ClassroomType } from '@school-controller/shared';

import type { SelectOption } from '@/features/classrooms/types';

export const classroomsCopy = {
  allBuildings: 'Todos los edificios',
  allStatuses: 'Todos los estados',
  allTypes: 'Todos los tipos',
  building: 'Edificio',
  classrooms: 'aulas',
  clearFilters: 'Limpiar filtros',
  detail: {
    availability: 'Disponibilidad',
    availabilityHelp:
      'Si el aula no está disponible, no podrá usarse en nuevas asignaciones de horario.',
    available: 'Disponible',
    back: 'Volver a la lista',
    building: 'Edificio',
    capacity: 'Capacidad',
    editClassroom: 'Editar aula',
    equipment: 'Equipamiento',
    notAvailable: 'No disponible',
    occupancy: 'Ocupación semanal',
    type: 'Tipo de aula'
  },
  edit: 'Editar',
  emptyText: 'Prueba con otros filtros o crea una nueva aula.',
  emptyTitle: 'No se encontraron aulas',
  form: {
    cancel: 'Cancelar',
    capacity: 'Capacidad (alumnos)',
    capacityPlaceholder: '40',
    code: 'Clave del aula',
    codePlaceholder: 'A-201',
    createSubtitle: 'Registra un aula para usarla después en la asignación de horarios.',
    createTitle: 'Nueva Aula',
    editSubtitle: 'Actualiza los datos del aula.',
    editTitle: 'Editar aula',
    equipment: 'Equipamiento',
    equipmentPlaceholder: 'Proyector, Pizarrón',
    errors: {
      buildingRequired: 'Selecciona un edificio.',
      capacityInvalid: 'Ingresa una capacidad entera mayor a 0.',
      codeRequired: 'Ingresa la clave del aula.',
      codeTaken: 'Ya existe un aula con esa clave.'
    },
    save: 'Guardar aula',
    selectBuilding: 'Selecciona un edificio'
  },
  headers: {
    actions: 'Acciones',
    building: 'Edificio',
    capacity: 'Capacidad',
    code: 'Clave Aula',
    equipment: 'Equipamiento',
    occupancy: 'Ocupación Semanal',
    status: 'Estado',
    type: 'Tipo'
  },
  newClassroom: '+ Nueva Aula',
  next: 'Siguiente',
  noEquipment: 'Sin equipamiento',
  of: 'de',
  previous: 'Anterior',
  search: 'Buscar',
  searchPlaceholder: 'Clave o edificio',
  showing: 'Mostrando',
  status: 'Estado',
  students: 'alumnos',
  subtitle: 'Aulas y espacios del IEST Anáhuac',
  title: 'Gestión de Aulas',
  type: 'Tipo de aula',
  viewDetail: 'Ver detalle'
} as const;

export const classroomTypes: ClassroomType[] = ['standard', 'workshop', 'laboratory', 'auditorium'];

export const classroomStatuses: ClassroomStatus[] = ['available', 'occupied', 'maintenance'];

export const classroomTypeLabels: Record<ClassroomType, string> = {
  auditorium: 'Aula magna',
  laboratory: 'Laboratorio',
  standard: 'Aula estándar',
  workshop: 'Taller'
};

export const classroomStatusLabels: Record<ClassroomStatus, string> = {
  available: 'Disponible',
  maintenance: 'En mantenimiento',
  occupied: 'Ocupada'
};

// ponytail: fixed list for the mock, buildings become their own entity once the API exists.
export const classroomBuildings = [
  'Edificio A',
  'Edificio B',
  'Edificio C',
  'Edificio D',
  'Laboratorio'
];

export const classroomTypeOptions: SelectOption<ClassroomType>[] = classroomTypes.map((value) => ({
  label: classroomTypeLabels[value],
  value
}));

export const classroomStatusOptions: SelectOption<ClassroomStatus>[] = classroomStatuses.map(
  (value) => ({ label: classroomStatusLabels[value], value })
);

export const classroomBuildingOptions: SelectOption<string>[] = classroomBuildings.map((value) => ({
  label: value,
  value
}));

export const buildingFilterOptions: SelectOption<string>[] = [
  { label: classroomsCopy.allBuildings, value: '' },
  ...classroomBuildingOptions
];

export const typeFilterOptions: SelectOption<ClassroomType | ''>[] = [
  { label: classroomsCopy.allTypes, value: '' },
  ...classroomTypeOptions
];

export const statusFilterOptions: SelectOption<ClassroomStatus | ''>[] = [
  { label: classroomsCopy.allStatuses, value: '' },
  ...classroomStatusOptions
];

function room(
  code: string,
  building: string,
  type: ClassroomType,
  capacity: number,
  equipment: string[],
  weeklyOccupancy: number,
  status: ClassroomStatus = 'available'
): Classroom {
  return {
    building,
    capacity,
    code,
    equipment,
    id: `room-${code.toLowerCase()}`,
    status,
    type,
    weeklyOccupancy
  };
}

export const initialClassrooms: Classroom[] = [
  room('A-201', 'Edificio A', 'standard', 40, ['Proyector', 'Pizarrón'], 85),
  room('B-105', 'Edificio B', 'workshop', 30, ['Mesas de dibujo'], 70),
  room('C-302', 'Edificio C', 'standard', 35, ['Proyector'], 90),
  room('Lab-3', 'Laboratorio', 'laboratory', 25, ['Computadoras', 'Proyector'], 95, 'occupied'),
  room('D-401', 'Edificio D', 'auditorium', 120, ['Audio', 'Proyector', 'Streaming'], 40),
  room('A-305', 'Edificio A', 'standard', 35, ['Proyector', 'Pizarrón'], 60, 'maintenance'),
  room('A-101', 'Edificio A', 'standard', 45, ['Proyector', 'Pizarrón'], 55),
  room('A-102', 'Edificio A', 'standard', 40, ['Proyector'], 62),
  room('A-202', 'Edificio A', 'standard', 38, ['Proyector', 'Pizarrón'], 78),
  room('A-301', 'Edificio A', 'standard', 42, ['Proyector'], 48),
  room('B-101', 'Edificio B', 'standard', 36, ['Pizarrón'], 66),
  room('B-102', 'Edificio B', 'standard', 30, ['Proyector'], 52),
  room('B-106', 'Edificio B', 'workshop', 28, ['Mesas de dibujo', 'Proyector'], 58),
  room('B-201', 'Edificio B', 'standard', 40, ['Proyector', 'Pizarrón'], 73),
  room('B-202', 'Edificio B', 'standard', 34, ['Proyector'], 81, 'occupied'),
  room('C-101', 'Edificio C', 'standard', 32, ['Pizarrón'], 44),
  room('C-201', 'Edificio C', 'standard', 36, ['Proyector', 'Pizarrón'], 69),
  room('C-301', 'Edificio C', 'standard', 40, ['Proyector'], 57),
  room(
    'C-303',
    'Edificio C',
    'workshop',
    24,
    ['Herramientas', 'Mesas de trabajo'],
    35,
    'maintenance'
  ),
  room('D-101', 'Edificio D', 'standard', 50, ['Proyector', 'Audio'], 63),
  room('D-201', 'Edificio D', 'standard', 45, ['Proyector'], 71),
  room('Lab-1', 'Laboratorio', 'laboratory', 28, ['Computadoras', 'Proyector'], 88),
  room(
    'Lab-2',
    'Laboratorio',
    'laboratory',
    24,
    ['Equipo de química', 'Campana de extracción'],
    76
  ),
  room('Lab-4', 'Laboratorio', 'laboratory', 20, ['Equipo de física'], 42, 'maintenance')
];
