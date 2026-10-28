import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AddClassFormField } from '@/features/admin-dashboard/components/AddClassFormField';
import { dashboardColors as colors } from '@/features/admin-dashboard/tokens';
import { SelectField } from '@/features/classrooms/components/SelectField';
import type { Student } from '@/features/students/content';

type Props = {
  student: Student;
  students: Student[];
  onClose: () => void;
  onSave: (student: Student) => void;
};

export function StudentEditor({ student, students, onClose, onSave }: Props) {
  const [input, setInput] = useState<
    Omit<Student, 'semester' | 'status'> & {
      semester: string;
      status: NonNullable<Student['status']> | '';
    }
  >({
    ...student,
    semester: String(student.semester),
    status: student.status ?? ''
  });
  const [error, setError] = useState('');
  const save = () => {
    if (
      !input.enrollment.trim() ||
      !input.name.trim() ||
      !input.degree.trim() ||
      !input.group.trim()
    ) {
      setError('Completa la matrícula, el nombre, la carrera y el grupo.');
      return;
    }
    if (
      !/^\d+$/.test(input.semester) ||
      Number(input.semester) < 1 ||
      Number(input.semester) > 12
    ) {
      setError('El semestre debe ser un número del 1 al 12.');
      return;
    }
    if (
      students.some(
        (item) =>
          item.id !== student.id &&
          item.enrollment.toLowerCase() === input.enrollment.trim().toLowerCase()
      )
    ) {
      setError('Esta matrícula ya pertenece a otro alumno.');
      return;
    }
    onSave({
      ...student,
      enrollment: input.enrollment.trim(),
      name: input.name.trim(),
      degree: input.degree.trim(),
      semester: Number(input.semester),
      group: input.group.trim(),
      status: input.status || null
    });
  };

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          accessibilityViewIsModal
          role="dialog"
          aria-modal
          accessibilityLabel="Editar alumno"
          style={styles.card}
        >
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <Text accessibilityRole="header" style={styles.title}>
              Editar alumno
            </Text>
            <Text style={styles.subtitle}>Actualiza los datos de {student.name}.</Text>
            <View style={styles.grid}>
              {(
                [
                  ['enrollment', 'Matrícula', 'A2024-001'],
                  ['name', 'Nombre', 'Nombre completo'],
                  ['degree', 'Carrera', 'Ing. Sistemas'],
                  ['semester', 'Semestre', '4'],
                  ['group', 'Grupo', 'ISC-4A']
                ] as const
              ).map(([key, label, placeholder]) => (
                <AddClassFormField
                  key={key}
                  label={label}
                  placeholder={placeholder}
                  value={input[key]}
                  keyboardType={key === 'semester' ? 'number-pad' : 'default'}
                  onChangeText={(value) => setInput((current) => ({ ...current, [key]: value }))}
                  onSubmit={save}
                />
              ))}
              <SelectField
                label="Estado"
                value={input.status}
                onChange={(status) => setInput((current) => ({ ...current, status }))}
                options={[
                  { label: 'Sin definir', value: '' },
                  { label: 'Activo', value: 'Activo' },
                  { label: 'Inactivo', value: 'Inactivo' }
                ]}
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
                <Text style={styles.primaryText}>Guardar cambios</Text>
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
