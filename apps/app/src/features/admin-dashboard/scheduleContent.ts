import type { ScheduleTab, WeeklyScheduleClass } from '@/features/admin-dashboard/types';

export const scheduleTabs: ScheduleTab[] = [
  { id: 'week', label: 'Week View' },
  { id: 'day', label: 'Day View' },
  { id: 'month', label: 'Month View' }
];

export const scheduleDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

export const scheduleHours = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00'
] as const;

export const weeklyScheduleClasses: WeeklyScheduleClass[] = [
  {
    accentColor: '#2f67e8',
    backgroundColor: '#d9e7ff',
    day: 'Monday',
    endHour: 9.5,
    id: 'monday-math',
    location: 'Room 201',
    startHour: 8,
    subject: 'Mathematics',
    time: '08:00 - 09:30'
  },
  {
    accentColor: '#e57d00',
    backgroundColor: '#fff2c7',
    day: 'Monday',
    endHour: 11.5,
    id: 'monday-english',
    location: 'Room 104',
    startHour: 10,
    subject: 'English',
    time: '10:00 - 11:30'
  },
  {
    accentColor: '#e2252a',
    backgroundColor: '#fde0e2',
    day: 'Monday',
    endHour: 15.5,
    id: 'monday-art',
    location: 'Studio B',
    startHour: 14,
    subject: 'Art',
    time: '14:00 - 15:30'
  },
  {
    accentColor: '#1aa34a',
    backgroundColor: '#d8f7e2',
    day: 'Tuesday',
    endHour: 9.5,
    id: 'tuesday-physics',
    location: 'Lab 3',
    startHour: 8,
    subject: 'Physics',
    time: '08:00 - 09:30'
  },
  {
    accentColor: '#2f67e8',
    backgroundColor: '#d9e7ff',
    day: 'Tuesday',
    endHour: 11.5,
    id: 'tuesday-chemistry',
    location: 'Lab 1',
    startHour: 10,
    subject: 'Chemistry',
    time: '10:00 - 11:30'
  },
  {
    accentColor: '#e57d00',
    backgroundColor: '#fff2c7',
    day: 'Tuesday',
    endHour: 15,
    id: 'tuesday-pe',
    location: 'Gymnasium',
    startHour: 14,
    subject: 'PE',
    time: '14:00 - 15:00'
  },
  {
    accentColor: '#2f67e8',
    backgroundColor: '#d9e7ff',
    day: 'Wednesday',
    endHour: 9.5,
    id: 'wednesday-math',
    location: 'Room 201',
    startHour: 8,
    subject: 'Mathematics',
    time: '08:00 - 09:30'
  },
  {
    accentColor: '#1aa34a',
    backgroundColor: '#d8f7e2',
    day: 'Wednesday',
    endHour: 11.5,
    id: 'wednesday-biology',
    location: 'Lab 2',
    startHour: 10,
    subject: 'Biology',
    time: '10:00 - 11:30'
  },
  {
    accentColor: '#e2252a',
    backgroundColor: '#fde0e2',
    day: 'Wednesday',
    endHour: 14.5,
    id: 'wednesday-music',
    location: 'Hall A',
    startHour: 13,
    subject: 'Music',
    time: '13:00 - 14:30'
  },
  {
    accentColor: '#e57d00',
    backgroundColor: '#fff2c7',
    day: 'Thursday',
    endHour: 9.5,
    id: 'thursday-english',
    location: 'Room 104',
    startHour: 8,
    subject: 'English',
    time: '08:00 - 09:30'
  },
  {
    accentColor: '#1aa34a',
    backgroundColor: '#d8f7e2',
    day: 'Thursday',
    endHour: 11.5,
    id: 'thursday-physics',
    location: 'Lab 3',
    startHour: 10,
    subject: 'Physics',
    time: '10:00 - 11:30'
  },
  {
    accentColor: '#e2252a',
    backgroundColor: '#fde0e2',
    day: 'Thursday',
    endHour: 15.5,
    id: 'thursday-art',
    location: 'Studio B',
    startHour: 14,
    subject: 'Art',
    time: '14:00 - 15:30'
  },
  {
    accentColor: '#2f67e8',
    backgroundColor: '#d9e7ff',
    day: 'Friday',
    endHour: 9.5,
    id: 'friday-chemistry',
    location: 'Lab 1',
    startHour: 8,
    subject: 'Chemistry',
    time: '08:00 - 09:30'
  },
  {
    accentColor: '#2f67e8',
    backgroundColor: '#d9e7ff',
    day: 'Friday',
    endHour: 11.5,
    id: 'friday-math',
    location: 'Room 201',
    startHour: 10,
    subject: 'Mathematics',
    time: '10:00 - 11:30'
  },
  {
    accentColor: '#e57d00',
    backgroundColor: '#fff2c7',
    day: 'Friday',
    endHour: 15,
    id: 'friday-pe',
    location: 'Gymnasium',
    startHour: 14,
    subject: 'PE',
    time: '14:00 - 15:00'
  }
];
