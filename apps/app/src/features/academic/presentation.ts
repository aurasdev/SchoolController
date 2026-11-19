import type { AcademicClass, AcademicData, AcademicDay } from '@school-controller/shared';
import type {
  ActivityItem,
  DashboardStat,
  ScheduleItem,
  UpcomingClass,
  WeeklyScheduleClass
} from '@/features/admin-dashboard/types';

export const academicDays: AcademicDay[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY'
];
export const dayLabels: Record<AcademicDay, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo'
};
const palette = [
  { accentColor: '#2f67e8', backgroundColor: '#d9e7ff' },
  { accentColor: '#16743a', backgroundColor: '#e6f6ec' },
  { accentColor: '#925000', backgroundColor: '#fff2c7' },
  { accentColor: '#44399b', backgroundColor: '#ede9fe' }
];

export function schoolNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date);
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  const dateString = `${value('year')}-${value('month')}-${value('day')}`;
  const weekday = (new Date(`${dateString}T12:00:00Z`).getUTCDay() + 6) % 7;
  return { date: dateString, time: `${value('hour')}:${value('minute')}`, weekday };
}

export function currentClasses(data: AcademicData, date = new Date()) {
  const today = schoolNow(date).date;
  const periods = new Set(
    data.periods
      .filter(
        (period) =>
          period.isActive &&
          period.startsOn.slice(0, 10) <= today &&
          period.endsOn.slice(0, 10) >= today
      )
      .map((period) => period.id)
  );
  return data.classes.filter((item) => periods.has(item.academicPeriodId));
}

export function dashboardPresentation(data: AcademicData, date = new Date()) {
  const now = schoolNow(date);
  const classes = currentClasses(data, date);
  const active = classes.filter((item) => item.status === 'Active');
  const stats: DashboardStat[] = [
    {
      id: 'students',
      label: 'Alumnos inscritos',
      value: String(data.students.filter((item) => item.status === 'Activo').length),
      trend: `${data.groups.length} grupos registrados`
    },
    {
      id: 'classes',
      label: 'Sesiones activas',
      value: String(active.length),
      trend: `${new Set(active.map((item) => item.subjectId)).size} materias con horario`
    },
    {
      id: 'teachers',
      label: 'Docentes',
      value: String(data.teachers.length),
      trend: `${data.teachers.filter((item) => item.status === 'Licencia').length} en licencia`
    },
    {
      id: 'rooms',
      label: 'Aulas',
      value: String(data.classrooms.length),
      trend: `${data.classrooms.filter((item) => item.status === 'available').length} disponibles`
    }
  ];
  const todaySchedule: ScheduleItem[] = active
    .filter((item) => item.dayOfWeek === academicDays[now.weekday])
    .sort((a, b) => a.startTime.localeCompare(b.startTime) || a.group.localeCompare(b.group))
    .slice(0, 5)
    .map((item, index) => ({
      ...palette[index % palette.length],
      id: item.id,
      subject: `${item.name} · ${item.group}`,
      time: `${item.startTime} - ${item.endTime}`,
      room: `${item.room} · ${item.teacher}`
    }));
  const upcoming: UpcomingClass[] = active
    .map((item) => {
      let dayOffset = (academicDays.indexOf(item.dayOfWeek) - now.weekday + 7) % 7;
      if (dayOffset === 0 && item.startTime < now.time) dayOffset = 7;
      const next = new Date(`${now.date}T12:00:00Z`);
      next.setUTCDate(next.getUTCDate() + dayOffset);
      const occursOn = next.toISOString().slice(0, 10);
      const period = data.periods.find((period) => period.id === item.academicPeriodId);
      return { item, dayOffset, valid: !!period && occursOn <= period.endsOn.slice(0, 10) };
    })
    .filter((entry) => entry.valid)
    .sort((a, b) => a.dayOffset - b.dayOffset || a.item.startTime.localeCompare(b.item.startTime))
    .slice(0, 5)
    .map(({ item }) => ({
      id: item.id,
      className: `${item.name} · ${item.group}`,
      teacher: item.teacher,
      time: `${dayLabels[item.dayOfWeek]} ${item.startTime}`,
      status: item.status
    }));
  const activities: ActivityItem[] = data.activities.slice(0, 5).map((item) => ({
    id: item.id,
    title: item.title,
    time: new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Mexico_City',
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(item.createdAt))
  }));
  return { stats, todaySchedule, upcoming, activities };
}

export function weeklyBlocks(classes: AcademicClass[]): WeeklyScheduleClass[] {
  const hour = (value: string) => Number(value.slice(0, 2)) + Number(value.slice(3, 5)) / 60;
  return classes
    .filter((item) => item.status === 'Active')
    .map((item, index) => ({
      ...palette[index % palette.length],
      id: item.id,
      day: dayLabels[item.dayOfWeek],
      startHour: hour(item.startTime),
      endHour: hour(item.endTime),
      subject: item.name,
      location: `${item.room} · ${item.teacher}`,
      time: `${item.startTime} - ${item.endTime}`
    }));
}
