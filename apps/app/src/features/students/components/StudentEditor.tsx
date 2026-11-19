import type { AcademicGroup, Student, StudentInput } from '@school-controller/shared';
import { useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AddClassFormField } from '@/features/admin-dashboard/components/AddClassFormField';
import { dashboardColors as colors } from '@/features/admin-dashboard/tokens';
import { SelectField } from '@/features/classrooms/components/SelectField';

type Props = {
  student: Student;
  students: Student[];
  groups: AcademicGroup[];
  onClose: () => void;
  onSave: (input: StudentInput) => Promise<void>;
};

export function StudentEditor({ student, students, groups, onClose, onSave }: Props) {
  const [input, setInput] = useState<StudentInput>({
    enrollment: student.enrollment,
    name: student.name,
    groupId: student.groupId,
    status: student.status
  });
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);
  const group = groups.find((value) => value.id === input.groupId);
  const setField = <K extends keyof StudentInput>(key: K, value: StudentInput[K]) => {
    if (!submitting.current) setInput((current) => ({ ...current, [key]: value }));
  };
  const close = () => {
    if (!submitting.current) onClose();
  };
  const save = async () => {
    if (submitting.current) return;
    if (!input.enrollment.trim() || !input.name.trim() || !input.groupId) {
      setError('Completa la matrícula, el nombre y el grupo.');
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
    submitting.current = true;
    setPending(true);
    setError('');
    try {
      await onSave({ ...input, enrollment: input.enrollment.trim(), name: input.name.trim() });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible guardar el alumno.');
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
          accessibilityLabel="Editar alumno"
          style={styles.card}
        >
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <Text accessibilityRole="header" style={styles.title}>
              Editar alumno
            </Text>
            <Text style={styles.subtitle}>Actualiza los datos de {student.name}.</Text>
            <View style={styles.grid}>
              <AddClassFormField
                label="Matrícula"
                placeholder="A2024-001"
                value={input.enrollment}
                onChangeText={(value) => setField('enrollment', value)}
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
                label="Grupo"
                value={input.groupId}
                placeholder="Selecciona un grupo"
                onChange={(value) => setField('groupId', value)}
                options={groups.map((value) => ({
                  label: `${value.code} · ${value.degree}`,
                  value: value.id
                }))}
                style={styles.status}
              />
              <SelectField
                label="Estado"
                value={input.status}
                onChange={(value) => setField('status', value)}
                options={[
                  { label: 'Activo', value: 'Activo' },
                  { label: 'Inactivo', value: 'Inactivo' }
                ]}
                style={styles.status}
              />
            </View>
            {group ? (
              <Text style={styles.subtitle}>
                {group.degree} · Semestre {group.semester} · Grupo {group.code}
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
                accessibilityState={{ disabled: pending, busy: pending }}
                disabled={pending}
                onPress={save}
                style={({ pressed }) => [
                  styles.button,
                  styles.primary,
                  pending && styles.disabled,
                  pressed && styles.pressed
                ]}
              >
                <Text style={styles.primaryText}>{pending ? 'Guardando…' : 'Guardar cambios'}</Text>
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
