import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AddClassFormField } from '@/features/admin-dashboard/components/AddClassFormField';
import { dashboardColors as colors } from '@/features/admin-dashboard/tokens';
import { SelectField } from '@/features/classrooms/components/SelectField';
import {
  type Teacher,
  type TeacherInput,
  type TeacherStatus,
  teacherStatusOptions
} from '@/features/teachers/content';

type Props = {
  teacher?: Teacher;
  teachers: Teacher[];
  onClose: () => void;
  onSave: (input: TeacherInput) => void;
};

export function TeacherEditor({ teacher, teachers, onClose, onSave }: Props) {
  const [input, setInput] = useState({
    employeeId: teacher?.employeeId ?? '',
    name: teacher?.name ?? '',
    department: teacher?.department ?? '',
    subjects: String(teacher?.subjects ?? 0),
    weeklyHours: String(teacher?.weeklyHours ?? 0),
    status: teacher?.status ?? ('Activo' as TeacherStatus)
  });
  const [error, setError] = useState('');
  const save = () => {
    if (!input.employeeId.trim() || !input.name.trim() || !input.department.trim()) {
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
    if (
      ![input.subjects, input.weeklyHours].every(
        (value) => /^\d+$/.test(value) && Number.isSafeInteger(Number(value))
      ) ||
      Number(input.weeklyHours) > 168
    ) {
      setError(
        'Introduce números enteros no negativos. Las horas semanales no pueden superar 168.'
      );
      return;
    }
    onSave({
      employeeId: input.employeeId.trim(),
      name: input.name.trim(),
      department: input.department.trim(),
      subjects: Number(input.subjects),
      weeklyHours: Number(input.weeklyHours),
      status: input.status
    });
  };
  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
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
            <Text style={styles.subtitle}>
              Completa los datos del docente y su carga académica.
            </Text>
            <View style={styles.grid}>
              {(
                [
                  ['employeeId', 'ID Empleado', 'EMP-064'],
                  ['name', 'Nombre', 'Nombre completo'],
                  ['department', 'Carrera / Depto', 'Ing. Sistemas'],
                  ['subjects', 'Materias', '3'],
                  ['weeklyHours', 'Horas/Semana', '18']
                ] as const
              ).map(([key, label, placeholder]) => (
                <AddClassFormField
                  key={key}
                  label={label}
                  placeholder={placeholder}
                  value={input[key]}
                  onChangeText={(value) => setInput((current) => ({ ...current, [key]: value }))}
                  onSubmit={save}
                  keyboardType={
                    key === 'subjects' || key === 'weeklyHours' ? 'number-pad' : 'default'
                  }
                />
              ))}
              <SelectField
                label="Estado laboral"
                value={input.status}
                onChange={(status) => setInput((current) => ({ ...current, status }))}
                options={teacherStatusOptions}
                style={styles.status}
              />
            </View>
            {error ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            ) : null}
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                onPress={onClose}
                style={({ pressed }) => [styles.button, pressed && styles.pressed]}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={save}
                style={({ pressed }) => [styles.button, styles.primary, pressed && styles.pressed]}
              >
                <Text style={styles.primaryText}>Guardar docente</Text>
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
  pressed: { opacity: 0.7 }
});
