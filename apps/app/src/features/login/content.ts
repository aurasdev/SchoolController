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
    rememberSession: 'Recordar sesión',
    forgotPassword: '¿Olvidaste tu contraseña?',
    submit: 'Iniciar Sesión',
    submitting: 'Iniciando sesión...',
    supportQuestion: '¿Necesitas ayuda?',
    supportLink: 'Soporte técnico',
    contactPrefix: 'Contacto de atención:',
    contactEmail: 'soporte@iest-anahuac.edu',
    mobileSubtitle: 'Gestión inteligente de horarios',
    mobileFooter: 'Powered by School Controller'
  },
  feedback: {
    idle: 'Usa tu cuenta institucional',
    invalidCredentials: 'El correo o la contraseña son incorrectos.',
    missingFields: 'Ingresa tu correo institucional y contraseña para continuar.',
    networkError: 'No fue posible conectar con el servidor. Intenta nuevamente.',
    submitting: 'Verificando tus credenciales...',
    success: 'Sesión iniciada correctamente.'
  }
} as const;
