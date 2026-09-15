import { StyleSheet, Text, TextInput, View } from 'react-native';

import { dashboardColors } from '@/features/admin-dashboard/tokens';

type AddClassFormFieldProps = {
  label: string;
  onChangeText: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  value: string;
};

export function AddClassFormField({
  label,
  onChangeText,
  onSubmit,
  placeholder,
  value
}: AddClassFormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={dashboardColors.textMuted}
        returnKeyType="next"
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flex: 1,
    minWidth: 240
  },
  input: {
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: dashboardColors.textPrimary,
    fontSize: 16,
    height: 48,
    letterSpacing: 0,
    marginTop: 8,
    paddingHorizontal: 14
  },
  label: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0
  }
});
