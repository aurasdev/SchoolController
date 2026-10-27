export type AcademicClass = {
  id: string;
  name: string;
  department: string;
  teacher: string;
  initials: string;
  schedule: string;
  students: number;
  status: 'Active' | 'Pending';
};

export type ClassInput = Omit<AcademicClass, 'id' | 'initials'>;

export function teacherInitials(teacher: string) {
  return teacher
    .replace(/^(Mr\.?|Mrs\.?|Ms\.?|Dr\.?|Coach)\s+/i, '')
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const referenceClasses: AcademicClass[] = [
  {
    id: 'math-101',
    name: 'Mathematics 101',
    department: 'Science & Math',
    teacher: 'Mr. Johnson',
    initials: 'JO',
    schedule: 'Mon/Wed/Fri 08:00',
    students: 32,
    status: 'Active'
  },
  {
    id: 'physics-201',
    name: 'Physics 201',
    department: 'Science & Math',
    teacher: 'Dr. Smith',
    initials: 'SM',
    schedule: 'Tue/Thu 09:45',
    students: 28,
    status: 'Active'
  },
  {
    id: 'english-101',
    name: 'English 101',
    department: 'Humanities',
    teacher: 'Ms. Davis',
    initials: 'DA',
    schedule: 'Mon/Wed 11:30',
    students: 35,
    status: 'Active'
  },
  {
    id: 'art-studio',
    name: 'Art Studio',
    department: 'Arts',
    teacher: 'Mrs. Chen',
    initials: 'CH',
    schedule: 'Mon/Thu 14:00',
    students: 18,
    status: 'Active'
  },
  {
    id: 'biology-201',
    name: 'Biology 201',
    department: 'Science & Math',
    teacher: 'Dr. Patel',
    initials: 'PA',
    schedule: 'Wed/Fri 10:00',
    students: 24,
    status: 'Pending'
  },
  {
    id: 'music-theory',
    name: 'Music Theory',
    department: 'Arts',
    teacher: 'Mr. Kim',
    initials: 'KI',
    schedule: 'Tue/Thu 13:00',
    students: 15,
    status: 'Active'
  },
  {
    id: 'chemistry-lab',
    name: 'Chemistry Lab',
    department: 'Science & Math',
    teacher: 'Ms. Rodriguez',
    initials: 'RO',
    schedule: 'Mon/Wed 15:45',
    students: 22,
    status: 'Active'
  },
  {
    id: 'pe-health',
    name: 'PE & Health',
    department: 'Athletics',
    teacher: 'Coach Brown',
    initials: 'BR',
    schedule: 'Daily 14:00',
    students: 40,
    status: 'Pending'
  }
];

// Local demonstration catalog, until the classes endpoint is available.
const additionalNames = [
  'Algebra 201',
  'Geometry 101',
  'Calculus 301',
  'Statistics 201',
  'World History',
  'Creative Writing',
  'Literature 201',
  'Philosophy 101',
  'Painting 101',
  'Digital Arts',
  'Photography',
  'Drama Workshop',
  'Biology Lab',
  'Environmental Science',
  'Astronomy 101',
  'Computer Science',
  'Spanish 101',
  'French 101',
  'Social Studies',
  'Public Speaking',
  'Choir',
  'Orchestra',
  'Sculpture',
  'Art History',
  'Physical Education',
  'Team Sports',
  'Nutrition',
  'Athletics Training',
  'Advanced Physics',
  'Organic Chemistry',
  'Applied Mathematics',
  'Robotics',
  'Economics 101',
  'Civics'
];

export const initialClasses: AcademicClass[] = [
  ...referenceClasses,
  ...additionalNames.map((name, index) => {
    const templateIndex = [0, 2, 3, 4, 2, 5, 7, 1, 2][Math.floor(index / 4)];
    const template = referenceClasses[templateIndex];
    return { ...template, id: `demo-class-${index + 9}`, name, students: 18 + (index % 23) };
  })
];
