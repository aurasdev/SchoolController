import type {
  ActivityItem,
  DashboardNavItem,
  DashboardStat,
  ScheduleItem,
  UpcomingClass
} from '@/features/admin-dashboard/types';

export const dashboardCopy = {
  appName: 'School Controller',
  adminLabel: 'SAAS ADMINISTRATOR',
  title: 'Dashboard Overview',
  subtitle: 'Monitor, configure, and resolve real-time academic schedule mappings.',
  exportPdf: 'Export PDF',
  configureSchedule: 'Configure Schedule',
  portalTitle: 'IEST ANÁHUAC Portal',
  portalDescription: 'You are managing schedule conflicts for Term 2.',
  portalBadge: 'Active Term 2',
  schoolName: 'IEST ANÁHUAC',
  sectionSchedule: "Today's Schedule",
  sectionActivity: 'Recent Activity',
  sectionUpcoming: 'Upcoming Classes',
  weeklyScheduleTitle: 'Weekly Schedule',
  weeklyScheduleSubtitle: 'IEST ANÁHUAC - Term 2, Week 12',
  weekRange: 'Mon 25 Nov - Fri 29 Nov 2024',
  today: 'Today',
  addClass: 'Add Class',
  addClassForm: {
    className: 'Class Name',
    classNamePlaceholder: 'Biology 301',
    day: 'Day',
    dayPlaceholder: 'Monday',
    room: 'Room',
    roomPlaceholder: 'Room 204',
    save: 'Save Class',
    success: 'Class ready to add when backend is connected.',
    teacher: 'Teacher',
    teacherPlaceholder: 'Ms. Rodriguez',
    time: 'Time',
    timePlaceholder: '08:00 - 09:30',
    title: 'Add Class',
    validation: 'Complete the class name, teacher, day, time, and room.'
  },
  export: 'Export',
  tableHeaders: {
    className: 'CLASS',
    status: 'STATUS',
    teacher: 'TEACHER',
    time: 'TIME'
  }
} as const;

export const dashboardNavItems: DashboardNavItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'classes', label: 'Classes' },
  { id: 'teachers', label: 'Teachers' },
  { id: 'students', label: 'Students' },
  { id: 'settings', label: 'Settings' }
];

export const dashboardStats: DashboardStat[] = [
  { id: 'students', label: 'Total Students', trend: '+12 this month', value: '1,247' },
  { id: 'classes', label: 'Active Classes', trend: '+3 this term', value: '42' },
  { id: 'teachers', label: 'Teachers', trend: '2 on leave', value: '38' },
  { id: 'rooms', label: 'Rooms', trend: '22 available', value: '24' }
];

export const scheduleItems: ScheduleItem[] = [
  {
    accentColor: '#2f67e8',
    backgroundColor: '#d9e7ff',
    id: 'mathematics',
    room: 'Room 201',
    subject: 'Mathematics',
    time: '08:00 - 09:30'
  },
  {
    accentColor: '#1aa34a',
    backgroundColor: '#d8f7e2',
    id: 'physics',
    room: 'Room 103',
    subject: 'Physics',
    time: '09:45 - 11:15'
  },
  {
    accentColor: '#e57d00',
    backgroundColor: '#fff2c7',
    id: 'english',
    room: 'Room 205',
    subject: 'English',
    time: '11:30 - 13:00'
  },
  {
    accentColor: '#e2252a',
    backgroundColor: '#fde0e2',
    id: 'art',
    room: 'Room 108',
    subject: 'Art',
    time: '14:00 - 15:30'
  },
  {
    accentColor: '#2f67e8',
    backgroundColor: '#d9e7ff',
    id: 'chemistry',
    room: 'Room 301',
    subject: 'Chemistry',
    time: '15:45 - 17:15'
  }
];

export const activityItems: ActivityItem[] = [
  { id: 'biology', time: '2 hours ago', title: 'New class added: Biology 201' },
  { id: 'teacher', time: '3 hours ago', title: 'Teacher assigned: Ms. Rodriguez -> Physics' },
  { id: 'room', time: '5 hours ago', title: 'Room 305 marked unavailable' },
  { id: 'conflict', time: 'yesterday', title: 'Schedule conflict resolved: Math vs Chemistry' },
  { id: 'enrollment', time: 'yesterday', title: 'Student enrollment: +15 freshmen' }
];

export const upcomingClasses: UpcomingClass[] = [
  {
    className: 'Mathematics 101',
    id: 'math-101',
    status: 'Active',
    teacher: 'Mr. Johnson',
    time: 'Mon 08:00'
  },
  {
    className: 'Physics 201',
    id: 'physics-201',
    status: 'Active',
    teacher: 'Dr. Smith',
    time: 'Mon 09:45'
  },
  {
    className: 'English 101',
    id: 'english-101',
    status: 'Active',
    teacher: 'Ms. Davis',
    time: 'Mon 11:30'
  },
  {
    className: 'Art Studio',
    id: 'art-studio',
    status: 'Pending',
    teacher: 'Mrs. Chen',
    time: 'Mon 14:00'
  }
];
