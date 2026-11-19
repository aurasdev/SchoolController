import type { DashboardNavItem } from '@/features/admin-dashboard/types';

export const dashboardCopy = {
  appName: 'School Controller',
  adminLabel: 'SAAS ADMINISTRATOR',
  title: 'Resumen académico',
  subtitle: 'Consulta los recursos, las clases y la actividad académica del periodo.',
  configureSchedule: 'Configurar horario',
  portalTitle: 'IEST ANÁHUAC Portal',
  portalDescription: 'Administra los grupos, los docentes y las aulas del periodo académico.',
  schoolName: 'IEST ANÁHUAC',
  sectionSchedule: 'Horario de hoy',
  sectionActivity: 'Actividad reciente',
  sectionUpcoming: 'Próximas clases',
  tableHeaders: {
    className: 'CLASE',
    status: 'ESTADO',
    teacher: 'DOCENTE',
    time: 'HORARIO'
  }
} as const;

export const dashboardNavItems: DashboardNavItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'schedule', label: 'Horario' },
  { id: 'classes', label: 'Clases' },
  { id: 'teachers', label: 'Maestros' },
  { id: 'students', label: 'Alumnos' },
  { id: 'classrooms', label: 'Aulas' },
  { id: 'settings', label: 'Configuración' }
];
