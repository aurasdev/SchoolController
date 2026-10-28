import type { Classroom, ClassroomInput } from '@school-controller/shared';

export type ClassroomsStore = {
  classrooms: Classroom[];
  create: (input: ClassroomInput) => Promise<string>;
  update: (id: string, input: ClassroomInput) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
};
