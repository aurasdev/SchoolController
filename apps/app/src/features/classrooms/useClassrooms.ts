import type { Classroom, ClassroomInput } from '@school-controller/shared';
import { useCallback, useReducer } from 'react';

import { initialClassrooms } from '@/features/classrooms/content';

type ClassroomsAction =
  | { classroom: Classroom; type: 'created' }
  | { id: string; input: ClassroomInput; type: 'updated' }
  | { id: string; type: 'availabilityToggled' };

function classroomsReducer(state: Classroom[], action: ClassroomsAction): Classroom[] {
  switch (action.type) {
    case 'created':
      return [action.classroom, ...state];
    case 'updated':
      return state.map((classroom) =>
        classroom.id === action.id ? { ...classroom, ...action.input } : classroom
      );
    case 'availabilityToggled':
      return state.map((classroom): Classroom =>
        classroom.id === action.id
          ? { ...classroom, status: classroom.status === 'available' ? 'maintenance' : 'available' }
          : classroom
      );
    default:
      return state;
  }
}

// In-memory store. Swap the reducer for API calls when the backend is connected.
export function useClassrooms() {
  const [classrooms, dispatch] = useReducer(classroomsReducer, initialClassrooms);

  const create = useCallback((input: ClassroomInput) => {
    const classroom: Classroom = {
      ...input,
      id: `room-${Date.now().toString(36)}`,
      weeklyOccupancy: 0
    };

    dispatch({ classroom, type: 'created' });

    return classroom.id;
  }, []);

  const update = useCallback((id: string, input: ClassroomInput) => {
    dispatch({ id, input, type: 'updated' });
  }, []);

  const toggleAvailability = useCallback((id: string) => {
    dispatch({ id, type: 'availabilityToggled' });
  }, []);

  return { classrooms, create, toggleAvailability, update };
}

export type ClassroomsStore = ReturnType<typeof useClassrooms>;
