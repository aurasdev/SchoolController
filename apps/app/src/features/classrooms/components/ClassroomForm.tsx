import { useCallback, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Classroom, ClassroomInput } from '@school-controller/shared';

import { AddClassFormField } from '@/features/admin-dashboard/components/AddClassFormField';
import { dashboardColors } from '@/features/admin-dashboard/tokens';
import { SelectField } from '@/features/classrooms/components/SelectField';
import {
  classroomBuildingOptions,
  classroomsCopy,
  classroomStatusOptions,
  classroomTypeOptions
} from '@/features/classrooms/content';
import { useClassroomForm } from '@/features/classrooms/useClassroomForm';

type ClassroomFormProps = {
  classroom?: Classroom;
  classrooms: Classroom[];
  onCancel: () => void;
  onSubmit: (input: ClassroomInput) => Promise<void>;
};

export function ClassroomForm({ classroom, classrooms, onCancel, onSubmit }: ClassroomFormProps) {
  const { errors, handlers, submit, values } = useClassroomForm(classrooms, classroom);
  const isEditing = classroom !== undefined;
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);

  const handleSubmit = useCallback(async () => {
    if (submitting.current) return;
    const input = submit();

    if (input) {
      submitting.current = true;
      setPending(true);
      setError('');
      try {
        await onSubmit(input);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'No fue posible guardar el aula.');
      } finally {
        submitting.current = false;
        setPending(false);
      }
    }
  }, [onSubmit, submit]);

  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.title}>
        {isEditing
          ? `${classroomsCopy.form.editTitle} ${classroom.code}`
          : classroomsCopy.form.createTitle}
      </Text>
      <Text style={styles.subtitle}>
        {isEditing ? classroomsCopy.form.editSubtitle : classroomsCopy.form.createSubtitle}
      </Text>

      <View style={styles.grid}>
        <AddClassFormField
          error={errors.code}
          label={classroomsCopy.form.code}
          onChangeText={handlers.onCodeChange}
          onSubmit={handleSubmit}
          placeholder={classroomsCopy.form.codePlaceholder}
          value={values.code}
        />
        <SelectField
          error={errors.building}
          label={classroomsCopy.building}
          onChange={handlers.onBuildingChange}
          options={Array.from(
            new Set([
              ...classroomBuildingOptions.map((item) => item.value),
              ...classrooms.map((item) => item.building)
            ])
          )
            .sort()
            .map((value) => ({ label: value, value }))}
          placeholder={classroomsCopy.form.selectBuilding}
          style={styles.select}
          value={values.building}
        />
        <SelectField
          label={classroomsCopy.type}
          onChange={handlers.onTypeChange}
          options={classroomTypeOptions}
          style={styles.select}
          value={values.type}
        />
        <AddClassFormField
          error={errors.capacity}
          keyboardType="numeric"
          label={classroomsCopy.form.capacity}
          onChangeText={handlers.onCapacityChange}
          onSubmit={handleSubmit}
          placeholder={classroomsCopy.form.capacityPlaceholder}
          value={values.capacity}
        />
        <AddClassFormField
          label={classroomsCopy.form.equipment}
          onChangeText={handlers.onEquipmentChange}
          onSubmit={handleSubmit}
          placeholder={classroomsCopy.form.equipmentPlaceholder}
          value={values.equipment}
        />
        <SelectField
          label={classroomsCopy.status}
          onChange={handlers.onStatusChange}
          options={classroomStatusOptions}
          style={styles.select}
          value={values.status}
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
          focusable
          disabled={pending}
          onPress={onCancel}
          style={[styles.secondaryButton, pending && styles.disabled]}
        >
          <Text style={styles.secondaryButtonText}>{classroomsCopy.form.cancel}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          focusable
          disabled={pending}
          accessibilityState={{ busy: pending, disabled: pending }}
          onPress={handleSubmit}
          style={[styles.primaryButton, pending && styles.disabled]}
        >
          <Text style={styles.primaryButtonText}>
            {pending ? 'Guardando…' : classroomsCopy.form.save}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  error: { color: '#b42318', fontSize: 13, marginTop: 16 },
  disabled: { opacity: 0.5 },
  actions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 26
  },
  card: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: 24
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 24
  },
  primaryButton: {
    backgroundColor: dashboardColors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  primaryButtonText: {
    color: dashboardColors.card,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0
  },
  secondaryButton: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  secondaryButtonText: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0
  },
  select: {
    flex: 1,
    minWidth: 240
  },
  subtitle: {
    color: dashboardColors.textMuted,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 20,
    marginTop: 4
  },
  title: {
    color: dashboardColors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 32
  }
});
