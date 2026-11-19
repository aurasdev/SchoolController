import type {
  AcademicData,
  ClassInput,
  ClassroomInput,
  ShiftSettings,
  StudentInput,
  StudyPlanImportInput,
  TeacherInput
} from '@school-controller/shared';
import { useCallback, useEffect, useRef, useState } from 'react';
import { academicRequest, fetchAcademicData } from '@/features/academic/academic-api';

export function useAcademicData() {
  const [data, setData] = useState<AcademicData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
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
      const result = await academicRequest<{ id?: string; warnings?: string[] }>(
        path,
        input,
        method
      );
      const warnings = result.warnings ?? [];
      setNotice(
        warnings.length > 3
          ? `${warnings.slice(0, 3).join(' ')} Y ${warnings.length - 3} avisos más.`
          : warnings.join(' ')
      );
      try {
        await refresh();
      } catch {
        setError(
          'Los cambios se guardaron. Pulsa Actualizar para cargar la información más reciente.'
        );
      }
      return result.id ?? '';
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
  const saveSettings = useCallback(
    async (input: ShiftSettings) => {
      await commit('/settings', input, 'PUT');
    },
    [commit]
  );
  const importStudyPlan = useCallback(
    async (input: StudyPlanImportInput) => {
      await commit('/study-plans/import', input, 'POST');
    },
    [commit]
  );
  const assignGroupPlan = useCallback(
    async (groupId: string, studyPlanId: string | null) => {
      await commit(`/groups/${groupId}/plan`, { studyPlanId }, 'PATCH');
    },
    [commit]
  );
  const saveSubjectTeachers = useCallback(
    async (subjectId: string, teacherIds: string[]) => {
      await commit(`/subjects/${subjectId}/teachers`, { teacherIds }, 'PUT');
    },
    [commit]
  );
  const dismissNotice = useCallback(() => setNotice(''), []);
  return {
    data,
    loading,
    error,
    notice,
    dismissNotice,
    saveSettings,
    importStudyPlan,
    assignGroupPlan,
    saveSubjectTeachers,
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
