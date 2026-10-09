import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AddClassFormField } from '@/features/admin-dashboard/components/AddClassFormField';
import { dashboardCopy } from '@/features/admin-dashboard/content';
import { dashboardColors } from '@/features/admin-dashboard/tokens';
import { useAddClassForm } from '@/features/admin-dashboard/useAddClassForm';

type AddClassFormProps = {
  onCancel: () => void;
};

export function AddClassForm({ onCancel }: AddClassFormProps) {
  const form = useAddClassForm();
  const feedbackText =
    form.state.status === 'saved'
      ? dashboardCopy.addClassForm.success
      : dashboardCopy.addClassForm.validation;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{dashboardCopy.addClassForm.title}</Text>
          <Text
            accessibilityLiveRegion="polite"
            style={[
              styles.feedback,
              form.state.status === 'missingFields' && styles.errorText,
              form.state.status === 'saved' && styles.successText
            ]}
          >
            {feedbackText}
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        <AddClassFormField
          label={dashboardCopy.addClassForm.className}
          onChangeText={form.handlers.onClassNameChange}
          onSubmit={form.handlers.onSubmit}
          placeholder={dashboardCopy.addClassForm.classNamePlaceholder}
          value={form.state.className}
        />
        <AddClassFormField
          label={dashboardCopy.addClassForm.teacher}
          onChangeText={form.handlers.onTeacherChange}
          onSubmit={form.handlers.onSubmit}
          placeholder={dashboardCopy.addClassForm.teacherPlaceholder}
          value={form.state.teacher}
        />
        <AddClassFormField
          label={dashboardCopy.addClassForm.day}
          onChangeText={form.handlers.onDayChange}
          onSubmit={form.handlers.onSubmit}
          placeholder={dashboardCopy.addClassForm.dayPlaceholder}
          value={form.state.day}
        />
        <AddClassFormField
          label={dashboardCopy.addClassForm.time}
          onChangeText={form.handlers.onTimeChange}
          onSubmit={form.handlers.onSubmit}
          placeholder={dashboardCopy.addClassForm.timePlaceholder}
          value={form.state.time}
        />
        <AddClassFormField
          label={dashboardCopy.addClassForm.room}
          onChangeText={form.handlers.onRoomChange}
          onSubmit={form.handlers.onSubmit}
          placeholder={dashboardCopy.addClassForm.roomPlaceholder}
          value={form.state.room}
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
          onPress={form.handlers.onSubmit}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>{dashboardCopy.addClassForm.save}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 26
  },
  card: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 28,
    padding: 24
  },
  errorText: {
    color: '#e2252a'
  },
  feedback: {
    color: dashboardColors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 8
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 28
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    fontWeight: '900',
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
    fontWeight: '800',
    letterSpacing: 0
  },
  successText: {
    color: '#1aa34a'
  },
  title: {
    color: dashboardColors.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0
  }
});
