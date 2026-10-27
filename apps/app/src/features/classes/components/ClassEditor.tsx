import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AddClassFormField } from '@/features/admin-dashboard/components/AddClassFormField';
import { dashboardColors as colors } from '@/features/admin-dashboard/tokens';
import { SelectField } from '@/features/classrooms/components/SelectField';
import type { AcademicClass, ClassInput } from '@/features/classes/content';

type Props = { item?: AcademicClass; onClose: () => void; onSave: (input: ClassInput) => void };

export function ClassEditor({ item, onClose, onSave }: Props) {
  const [input, setInput] = useState({
    name: item?.name ?? '',
    department: item?.department ?? '',
    teacher: item?.teacher ?? '',
    schedule: item?.schedule ?? '',
    students: item ? String(item.students) : '0',
    status: item?.status ?? 'Active'
  });
  const [error, setError] = useState('');
  const save = () => {
    if (
      !input.name.trim() ||
      !input.department.trim() ||
      !input.teacher.trim() ||
      !input.schedule.trim() ||
      !/^\d+$/.test(input.students) ||
      !Number.isSafeInteger(Number(input.students))
    ) {
      setError('Complete all fields and enter a valid, non-negative student count.');
      return;
    }
    onSave({
      name: input.name.trim(),
      department: input.department.trim(),
      teacher: input.teacher.trim(),
      schedule: input.schedule.trim(),
      status: input.status,
      students: Number(input.students)
    });
  };

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View
          accessibilityViewIsModal
          role="dialog"
          aria-modal
          accessibilityLabel={item ? 'Edit class' : 'Add new class'}
          style={styles.card}
        >
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <Text accessibilityRole="header" style={styles.title}>
              {item ? 'Edit Class' : 'Add New Class'}
            </Text>
            <Text style={styles.subtitle}>Assign the class details and academic resources.</Text>
            <View style={styles.grid}>
              {(
                [
                  ['name', 'Class name', 'Mathematics 101'],
                  ['department', 'Department', 'Science & Math'],
                  ['teacher', 'Teacher', 'Mr. Johnson'],
                  ['schedule', 'Schedule', 'Mon/Wed/Fri 08:00'],
                  ['students', 'Students', '32']
                ] as const
              ).map(([key, label, placeholder]) => (
                <AddClassFormField
                  key={key}
                  label={label}
                  placeholder={placeholder}
                  value={input[key]}
                  onChangeText={(value) => setInput((current) => ({ ...current, [key]: value }))}
                  onSubmit={save}
                  keyboardType={key === 'students' ? 'number-pad' : 'default'}
                />
              ))}
              <SelectField
                label="Status"
                value={input.status}
                onChange={(status) => setInput((current) => ({ ...current, status }))}
                options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Pending', value: 'Pending' }
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
              <Pressable accessibilityRole="button" onPress={onClose} style={styles.button}>
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={save}
                style={[styles.button, styles.primary]}
              >
                <Text style={styles.primaryText}>Save Class</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 29, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  card: {
    width: '100%',
    maxWidth: 660,
    maxHeight: '90%',
    borderRadius: 12,
    backgroundColor: colors.card
  },
  content: { padding: 24 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 6, lineHeight: 21 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 24, zIndex: 1 },
  status: { flex: 1, minWidth: 240 },
  error: { color: '#b42318', marginTop: 16, fontSize: 13 },
  actions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end', marginTop: 24 },
  button: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 40,
    justifyContent: 'center'
  },
  buttonText: { color: colors.textPrimary, fontSize: 13, fontWeight: '500' },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  primaryText: { color: colors.card, fontSize: 13, fontWeight: '500' }
});
