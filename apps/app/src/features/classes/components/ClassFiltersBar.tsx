import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { SelectField } from '@/features/classrooms/components/SelectField';
import { departments, teachers } from '@/features/classes/content';
import { classColors } from '@/features/classes/tokens';
import type { ClassFilters } from '@/features/classes/types';

const departmentOptions = [
  { label: 'All Departments', value: '' },
  ...departments.map((department) => ({ label: department, value: department }))
];
const teacherOptions = [
  { label: 'All Teachers', value: '' },
  ...teachers.map((teacher) => ({ label: teacher.name, value: teacher.id }))
];

type ClassFiltersBarProps = {
  filters: ClassFilters;
  onChange: (filters: ClassFilters) => void;
};

export function ClassFiltersBar({ filters, onChange }: ClassFiltersBarProps) {
  return (
    <View style={styles.card}>
      <View style={styles.searchField}>
        <Text style={styles.label}>Search</Text>
        <TextInput
          accessibilityLabel="Search classes"
          autoCapitalize="none"
          onChangeText={(search) => onChange({ ...filters, search })}
          placeholder="Search classes..."
          placeholderTextColor={classColors.textMuted}
          returnKeyType="search"
          style={styles.input}
          value={filters.search}
        />
      </View>
      <SelectField
        label="Department"
        onChange={(department) => onChange({ ...filters, department })}
        options={departmentOptions}
        style={styles.selectField}
        value={filters.department}
      />
      <SelectField
        label="Teacher"
        onChange={(teacherId) => onChange({ ...filters, teacherId })}
        options={teacherOptions}
        style={styles.selectField}
        value={filters.teacherId}
      />
      <View style={styles.toggleField}>
        <Text style={styles.label}>Active only</Text>
        <Switch
          accessibilityLabel="Show active classes only"
          onValueChange={(activeOnly) =>
            onChange({
              ...filters,
              activeOnly,
              tab: activeOnly && filters.tab === 'pending' ? 'all' : filters.tab
            })
          }
          thumbColor={classColors.card}
          trackColor={{ false: classColors.border, true: classColors.primary }}
          value={filters.activeOnly}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-end',
    backgroundColor: classColors.card,
    borderColor: classColors.border,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 24,
    padding: 16,
    zIndex: 2
  },
  input: {
    borderColor: classColors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: classColors.textPrimary,
    fontSize: 15,
    height: 44,
    paddingHorizontal: 12
  },
  label: {
    color: classColors.textPrimary,
    fontSize: 13,
    lineHeight: 16,
    marginBottom: 8
  },
  searchField: { flexBasis: 300, flexGrow: 3, flexShrink: 1, minWidth: 0 },
  selectField: { flexBasis: 180, flexGrow: 1, flexShrink: 1, minWidth: 0 },
  toggleField: { alignSelf: 'center', gap: 2, minWidth: 64 }
});
