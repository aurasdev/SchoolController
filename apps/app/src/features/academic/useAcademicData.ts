import type {
  AcademicData,
  ClassInput,
  ClassroomInput,
  StudentInput,
  TeacherInput
} from '@school-controller/shared';
import { useCallback, useEffect, useRef, useState } from 'react';
import { academicRequest, fetchAcademicData } from '@/features/academic/academic-api';

export function useAcademicData() {
  const [data, setData] = useState<AcademicData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const requestVersion = useRef(0);
  const refresh = useCallback(async (signal?: AbortSignal) => {
    const version = ++requestVersion.current;
    setLoading(true);
    try {
      const next = await fetchAcademicData(signal);
      if (version === requestVersion.current) {
        setData(next);
        setError('');
      }
    } catch (cause) {
      if (cause instanceof Error && cause.name === 'AbortError') return;
      if (version === requestVersion.current)
        setError(cause instanceof Error ? cause.message : 'No se pudieron cargar los datos.');
      throw cause;
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal).catch(() => {});
    return () => {
      controller.abort();
      requestVersion.current++;
    };
  }, [refresh]);
  const commit = useCallback(
    async (path: string, input: unknown, method: string) => {
      const result = await academicRequest<{ id: string }>(path, input, method);
      try {
        await refresh();
      } catch {
        setError(
          'Los cambios se guardaron. Pulsa Actualizar para cargar la información más reciente.'
        );
      }
      return result.id;
    },
    [refresh]
  );
  const saveTeacher = useCallback(
    async (input: TeacherInput, id?: string) => {
      await commit(`/teachers${id ? `/${id}` : ''}`, input, id ? 'PATCH' : 'POST');
    },
    [commit]
  );
  const saveStudent = useCallback(
    async (input: StudentInput, id: string) => {
      await commit(`/students/${id}`, input, 'PATCH');
    },
    [commit]
  );
  const saveClass = useCallback(
    async (input: ClassInput, id?: string) => {
      await commit(`/classes${id ? `/${id}` : ''}`, input, id ? 'PATCH' : 'POST');
    },
    [commit]
  );
  const importClasses = useCallback(
    async (items: ClassInput[]) => {
      await commit('/classes/import', { items }, 'POST');
    },
    [commit]
  );
  const createClassroom = useCallback(
    (input: ClassroomInput) => commit('/classrooms', input, 'POST'),
    [commit]
  );
  const updateClassroom = useCallback(
    async (id: string, input: ClassroomInput) => {
      await commit(`/classrooms/${id}`, input, 'PATCH');
    },
    [commit]
  );
  const toggleClassroom = useCallback(
    async (id: string) => {
      const classroom = data?.classrooms.find((item) => item.id === id);
      if (!classroom) throw new Error('No se encontró el aula.');
      await updateClassroom(id, {
        building: classroom.building,
        capacity: classroom.capacity,
        code: classroom.code,
        equipment: classroom.equipment,
        type: classroom.type,
        status: classroom.status === 'available' ? 'maintenance' : 'available'
      });
    },
    [data, updateClassroom]
  );
  return {
    data,
    loading,
    error,
    refresh,
    saveTeacher,
    saveStudent,
    saveClass,
    importClasses,
    createClassroom,
    updateClassroom,
    toggleClassroom
  };
}
