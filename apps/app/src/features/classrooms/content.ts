import type { ClassroomStatus, ClassroomType } from '@school-controller/shared';

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

export const classroomBuildings = [
  'Edificio A',
  'Edificio B',
  'Edificio C',
  'Edificio D',
  'Edificio E',
  'Edificio F'
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

export const typeFilterOptions: SelectOption<ClassroomType | ''>[] = [
  { label: classroomsCopy.allTypes, value: '' },
  ...classroomTypeOptions
];

export const statusFilterOptions: SelectOption<ClassroomStatus | ''>[] = [
  { label: classroomsCopy.allStatuses, value: '' },
  ...classroomStatusOptions
];
