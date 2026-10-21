export type ClassroomType = 'standard' | 'workshop' | 'laboratory' | 'auditorium';

export type ClassroomStatus = 'available' | 'occupied' | 'maintenance';

export type Classroom = {
  building: string;
  capacity: number;
  code: string;
  equipment: string[];
  id: string;
  status: ClassroomStatus;
  type: ClassroomType;
  weeklyOccupancy: number;
};

export type ClassroomInput = Omit<Classroom, 'id' | 'weeklyOccupancy'>;
