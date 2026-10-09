export type DashboardSection =
  'dashboard' | 'schedule' | 'classes' | 'teachers' | 'students' | 'settings';

export type DashboardNavItem = {
  id: DashboardSection;
  label: string;
};

export type DashboardStat = {
  id: string;
  label: string;
  trend: string;
  value: string;
};

export type ScheduleItem = {
  accentColor: string;
  backgroundColor: string;
  id: string;
  room: string;
  subject: string;
  time: string;
};

export type ActivityItem = {
  id: string;
  time: string;
  title: string;
};

export type UpcomingClass = {
  className: string;
  id: string;
  status: 'Active' | 'Pending';
  teacher: string;
  time: string;
};

export type ScheduleViewMode = 'week' | 'day' | 'month' | 'addClass';

export type ScheduleTab = {
  id: ScheduleViewMode;
  label: string;
};

export type WeeklyScheduleClass = {
  accentColor: string;
  backgroundColor: string;
  day: string;
  endHour: number;
  id: string;
  location: string;
  startHour: number;
  subject: string;
  time: string;
};
