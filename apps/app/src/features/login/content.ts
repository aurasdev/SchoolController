import type { LoginRole } from '@/features/login/types';

export const loginRoles: LoginRole[] = ['Alumno', 'Docente', 'Coordinador', 'Administrador'];

export const demoAdminCredentials = {
  email: 'admin@escuela.edu',
  password: 'Admin123'
} as const;

export const demoAdminUser = {
  email: demoAdminCredentials.email,
  institution: 'IEST ANÁHUAC',
  initials: 'AD',
  name: 'Adán Castillo',
  role: 'Administrador'
} as const;

export const loginCopy = {
  brand: {
    institution: 'IEST Anáhuac',
    title: 'School Controller',
    subtitle: 'Sistema de Gestión Académica',
    description:
      'Accede a tu portal institucional para gestionar horarios, calificaciones, planeación docente y seguimiento de alumnos en tiempo real.',
    copyright: '© 2024 IEST Anáhuac - Todos los derechos reservados',
    version: 'v3.4.1'
  },
  form: {
    title: 'Iniciar Sesión',
    subtitle: 'Ingresa tus credenciales para acceder al sistema escolar',
    emailLabel: 'Correo Electrónico',
    emailPlaceholder: 'correo@escuela.edu',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: '••••••••',
    roleLabel: 'Selecciona tu rol',
    roleHelp: 'Determina tus permisos de acceso en la plataforma',
    rememberSession: 'Recordar sesión',
    forgotPassword: '¿Olvidaste tu contraseña?',
    submit: 'Iniciar Sesión',
    supportQuestion: '¿Necesitas ayuda?',
    supportLink: 'Soporte técnico',
    contactPrefix: 'Contacto de atención:',
    contactEmail: 'soporte@iest-anahuac.edu',
    mobileSubtitle: 'Gestión inteligente de horarios',
    mobileFooter: 'Powered by School Controller'
  },
  feedback: {
    idle: 'Usa tu cuenta institucional',
    invalidCredentials: 'Credenciales incorrectas. Usa la cuenta administrador de demostración.',
    missingFields: 'Ingresa tu correo institucional y contraseña para continuar.',
    successPrefix: 'Credenciales listas para iniciar como'
  }
} as const;
