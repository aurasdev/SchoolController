import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AddClassFormField } from '@/features/admin-dashboard/components/AddClassFormField';
import { dashboardColors } from '@/features/admin-dashboard/tokens';
import { validateClassInput } from '@/features/classes/classCsv';
import { departments, teachers } from '@/features/classes/content';
import type { AcademicClass, ClassInput } from '@/features/classes/types';
import { SelectField } from '@/features/classrooms/components/SelectField';
import type { SelectOption } from '@/features/classrooms/types';

type ClassFormProps = {
  classItem?: AcademicClass;
  onCancel: () => void;
  onSubmit: (input: ClassInput) => void;
};

type ClassFormValues = Omit<ClassInput, 'students'> & { students: string };
type ClassFormErrors = Partial<Record<keyof ClassFormValues, string>>;

const departmentOptions = departments.map((department) => ({
  label: department,
  value: department
}));
const teacherOptions = teachers.map((teacher) => ({ label: teacher.name, value: teacher.id }));
const statusOptions: SelectOption<AcademicClass['status']>[] = [
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' }
];

export function ClassForm({ classItem, onCancel, onSubmit }: ClassFormProps) {
  const [values, setValues] = useState<ClassFormValues>(() => ({
    department: classItem?.department ?? '',
    name: classItem?.name ?? '',
    schedule: classItem?.schedule ?? '',
    status: classItem?.status ?? 'active',
    students: String(classItem?.students ?? 0),
    teacherId: classItem?.teacherId ?? ''
  }));
  const [errors, setErrors] = useState<ClassFormErrors>({});

  function updateValue<K extends keyof ClassFormValues>(field: K, value: ClassFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit() {
    const input: ClassInput = {
      department: values.department.trim(),
      name: values.name.trim(),
      schedule: values.schedule.trim(),
      status: values.status,
      students: Number(values.students.trim()),
      teacherId: values.teacherId.trim()
    };
    const nextErrors: ClassFormErrors = validateClassInput(input);

    if (!/^\d+$/.test(values.students.trim())) {
      nextErrors.students = 'Enter a whole number from 0 to 10,000.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit(input);
    }
  }

  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.title}>
        {classItem ? 'Edit Class' : 'Add New Class'}
      </Text>
      <Text style={styles.subtitle}>
        {classItem
          ? 'Update the class details, teacher, and schedule.'
          : 'Set up a class and assign its department, teacher, and schedule.'}
      </Text>

      <View style={styles.grid}>
        <AddClassFormField
          error={errors.name}
          label="Class Name"
          onChangeText={(value) => updateValue('name', value)}
          onSubmit={handleSubmit}
          placeholder="e.g. Mathematics 101"
          style={styles.field}
          value={values.name}
        />
        <SelectField
          error={errors.department}
          label="Department"
          onChange={(value) => updateValue('department', value)}
          options={departmentOptions}
          placeholder="Select a department"
          style={styles.field}
          value={values.department}
        />
        <SelectField
          error={errors.teacherId}
          label="Teacher"
          onChange={(value) => updateValue('teacherId', value)}
          options={teacherOptions}
          placeholder="Select a teacher"
          style={styles.field}
          value={values.teacherId}
        />
        <AddClassFormField
          error={errors.schedule}
          label="Schedule"
          onChangeText={(value) => updateValue('schedule', value)}
          onSubmit={handleSubmit}
          placeholder="e.g. Mon/Wed/Fri 08:00"
          style={styles.field}
          value={values.schedule}
        />
        <AddClassFormField
          error={errors.students}
          keyboardType="numeric"
          label="Students"
          onChangeText={(value) => updateValue('students', value)}
          onSubmit={handleSubmit}
          placeholder="Number of students"
          style={styles.field}
          value={values.students}
        />
        <SelectField
          label="Status"
          onChange={(value) => updateValue('status', value)}
          options={statusOptions}
          style={styles.field}
          value={values.status}
        />
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          focusable
          onPress={onCancel}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          focusable
          onPress={handleSubmit}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Save Class</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 26
  },
  card: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 0,
    padding: 20
  },
  field: {
    flexBasis: 260,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0
  },
  grid: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 24,
    minWidth: 0
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: dashboardColors.primary,
    borderRadius: 7,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  primaryButtonText: {
    color: dashboardColors.card,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 7,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  secondaryButtonText: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0
  },
  subtitle: {
    color: dashboardColors.textMuted,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 20,
    marginTop: 5
  },
  title: {
    color: dashboardColors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 32
  }
});
