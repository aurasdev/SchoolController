import type { ClassroomInput } from '@school-controller/shared';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ClassroomDetailView } from '@/features/classrooms/components/ClassroomDetailView';
import { ClassroomForm } from '@/features/classrooms/components/ClassroomForm';
import { ClassroomListView } from '@/features/classrooms/components/ClassroomListView';
import { emptyClassroomFilters } from '@/features/classrooms/classroomFilters';
import type { ClassroomFilters, ClassroomsRoute } from '@/features/classrooms/types';
import type { ClassroomsStore } from '@/features/classrooms/useClassrooms';

type ClassroomsViewProps = {
  store: ClassroomsStore;
};

export function ClassroomsView({ store }: ClassroomsViewProps) {
  const { classrooms, create, toggleAvailability, update } = store;
  const [route, setRoute] = useState<ClassroomsRoute>({ name: 'list' });
  const [filters, setFilters] = useState<ClassroomFilters>(emptyClassroomFilters);
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const toggling = useRef(false);

  const handleFiltersChange = useCallback((next: ClassroomFilters) => {
    setFilters(next);
    setPage(1);
  }, []);

  const handleBackToList = useCallback(() => {
    setRoute({ name: 'list' });
  }, []);

  const handleCreate = useCallback(() => {
    setRoute({ name: 'create' });
  }, []);

  const handleOpen = useCallback((id: string) => {
    setRoute({ id, name: 'detail' });
  }, []);

  const handleEdit = useCallback((id: string) => {
    setRoute({ id, name: 'edit' });
  }, []);

  const handleCreateSubmit = useCallback(
    async (input: ClassroomInput) => {
      const id = await create(input);

      setRoute({ id, name: 'detail' });
    },
    [create]
  );

  const handleEditSubmit = useCallback(
    async (input: ClassroomInput) => {
      if (route.name !== 'edit') {
        return;
      }

      await update(route.id, input);
      setRoute({ id: route.id, name: 'detail' });
    },
    [route, update]
  );

  const handleEditCancel = useCallback(() => {
    setRoute((current) =>
      current.name === 'edit' ? { id: current.id, name: 'detail' } : { name: 'list' }
    );
  }, []);

  const handleEditSelected = useCallback(() => {
    setRoute((current) => (current.name === 'detail' ? { id: current.id, name: 'edit' } : current));
  }, []);

  const handleToggleSelected = useCallback(async () => {
    if (route.name !== 'detail' || toggling.current) return;
    toggling.current = true;
    setPending(true);
    setError('');
    try {
      await toggleAvailability(route.id);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'No fue posible actualizar la disponibilidad.'
      );
    } finally {
      toggling.current = false;
      setPending(false);
    }
  }, [route, toggleAvailability]);

  if (route.name === 'create') {
    return (
      <ClassroomForm
        classrooms={classrooms}
        onCancel={handleBackToList}
        onSubmit={handleCreateSubmit}
      />
    );
  }

  if (route.name === 'detail' || route.name === 'edit') {
    const classroom = classrooms.find((item) => item.id === route.id);

    if (classroom && route.name === 'edit') {
      return (
        <ClassroomForm
          classroom={classroom}
          classrooms={classrooms}
          key={classroom.id}
          onCancel={handleEditCancel}
          onSubmit={handleEditSubmit}
        />
      );
    }

    if (classroom) {
      return (
        <View>
          {error ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          ) : null}
          {pending ? (
            <Text accessibilityLiveRegion="polite" style={styles.pending}>
              Guardando disponibilidad…
            </Text>
          ) : null}
          <ClassroomDetailView
            classroom={classroom}
            onBack={handleBackToList}
            onEdit={handleEditSelected}
            onToggleAvailability={handleToggleSelected}
            pending={pending}
          />
        </View>
      );
    }
  }

  return (
    <ClassroomListView
      classrooms={classrooms}
      filters={filters}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onFiltersChange={handleFiltersChange}
      onOpen={handleOpen}
      onPageChange={setPage}
      page={page}
    />
  );
}

const styles = StyleSheet.create({
  error: { color: '#b42318', fontSize: 13, marginBottom: 16 },
  pending: { color: '#666673', fontSize: 13, marginBottom: 16 }
});
