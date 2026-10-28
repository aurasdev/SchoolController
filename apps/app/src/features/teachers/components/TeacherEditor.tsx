import type { Department, Teacher, TeacherInput } from '@school-controller/shared';
import { useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AddClassFormField } from '@/features/admin-dashboard/components/AddClassFormField';
import { dashboardColors as colors } from '@/features/admin-dashboard/tokens';
import { SelectField } from '@/features/classrooms/components/SelectField';
import { teacherStatusOptions } from '@/features/teachers/content';

type Props = {
  teacher?: Teacher;
  teachers: Teacher[];
  departments: Department[];
  onClose: () => void;
  onSave: (input: TeacherInput) => Promise<void>;
};

export function TeacherEditor({ teacher, teachers, departments, onClose, onSave }: Props) {
  const [input, setInput] = useState<TeacherInput>({
    employeeId: teacher?.employeeId ?? '',
    name: teacher?.name ?? '',
    departmentId: teacher?.departmentId ?? '',
    status: teacher?.status ?? 'Activo'
  });
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);
  const setField = <K extends keyof TeacherInput>(key: K, value: TeacherInput[K]) => {
    if (!submitting.current) setInput((current) => ({ ...current, [key]: value }));
  };
  const close = () => {
    if (!submitting.current) onClose();
  };
  const save = async () => {
    if (submitting.current) return;
    if (!input.employeeId.trim() || !input.name.trim() || !input.departmentId) {
      setError('Completa el ID de empleado, el nombre y la carrera o departamento.');
      return;
    }
    if (
      teachers.some(
        (item) =>
          item.id !== teacher?.id &&
          item.employeeId.toLowerCase() === input.employeeId.trim().toLowerCase()
      )
    ) {
      setError('Este ID de empleado ya pertenece a otro docente.');
      return;
    }
    submitting.current = true;
    setPending(true);
    setError('');
    try {
      await onSave({ ...input, employeeId: input.employeeId.trim(), name: input.name.trim() });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible guardar el docente.');
    } finally {
      submitting.current = false;
      setPending(false);
    }
  };
  return (
    <Modal transparent animationType="fade" onRequestClose={close}>
      <View style={styles.backdrop}>
        <View
          accessibilityViewIsModal
          role="dialog"
          aria-modal
          accessibilityLabel={teacher ? 'Editar docente' : 'Nuevo docente'}
          style={styles.card}
        >
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <Text accessibilityRole="header" style={styles.title}>
              {teacher ? 'Editar docente' : 'Nuevo docente'}
            </Text>
            <Text style={styles.subtitle}>Completa los datos del docente y su departamento.</Text>
            <View style={styles.grid}>
              <AddClassFormField
                label="ID Empleado"
                placeholder="EMP-064"
                value={input.employeeId}
                onChangeText={(value) => setField('employeeId', value)}
                onSubmit={save}
              />
              <AddClassFormField
                label="Nombre"
                placeholder="Nombre completo"
                value={input.name}
                onChangeText={(value) => setField('name', value)}
                onSubmit={save}
              />
              <SelectField
                label="Carrera / Depto"
                value={input.departmentId}
                placeholder="Selecciona un departamento"
                onChange={(value) => setField('departmentId', value)}
                options={departments.map((value) => ({ label: value.name, value: value.id }))}
                style={styles.status}
              />
              <SelectField
                label="Estado laboral"
                value={input.status}
                onChange={(value) => setField('status', value)}
                options={teacherStatusOptions}
                style={styles.status}
              />
            </View>
            <Text style={styles.subtitle}>
              Las materias y horas semanales se calculan a partir de las clases asignadas.
            </Text>
            {teacher ? (
              <Text style={styles.subtitle}>
                {teacher.subjects} materias · {teacher.weeklyHours} horas por semana
              </Text>
            ) : null}
            {error ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            ) : null}
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                disabled={pending}
                onPress={close}
                style={({ pressed }) => [
                  styles.button,
                  pending && styles.disabled,
                  pressed && styles.pressed
                ]}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ busy: pending, disabled: pending }}
                disabled={pending}
                onPress={save}
                style={({ pressed }) => [
                  styles.button,
                  styles.primary,
                  pending && styles.disabled,
                  pressed && styles.pressed
                ]}
              >
                <Text style={styles.primaryText}>{pending ? 'Guardando…' : 'Guardar docente'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 29, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  card: {
    width: '100%',
    maxWidth: 660,
    maxHeight: '90%',
    backgroundColor: colors.card,
    borderRadius: 12
  },
  content: { padding: 24 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 24, zIndex: 1 },
  status: { flex: 1, minWidth: 240 },
  error: { color: '#b42318', fontSize: 13, marginTop: 16 },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 24
  },
  button: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  buttonText: { color: colors.textPrimary, fontSize: 13, fontWeight: '500' },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  primaryText: { color: colors.card, fontSize: 13, fontWeight: '500' },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.7 }
});
