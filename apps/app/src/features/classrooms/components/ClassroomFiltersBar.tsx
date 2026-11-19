import { useCallback } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { ClassroomStatus, ClassroomType } from '@school-controller/shared';

import { dashboardColors } from '@/features/admin-dashboard/tokens';
import { SelectField } from '@/features/classrooms/components/SelectField';
import {
  classroomsCopy,
  statusFilterOptions,
  typeFilterOptions
} from '@/features/classrooms/content';
import type { ClassroomFilters } from '@/features/classrooms/types';

type ClassroomFiltersBarProps = {
  buildings: string[];
  filters: ClassroomFilters;
  onChange: (filters: ClassroomFilters) => void;
};

export function ClassroomFiltersBar({ buildings, filters, onChange }: ClassroomFiltersBarProps) {
  const handleSearchChange = useCallback(
    (search: string) => {
      onChange({ ...filters, search });
    },
    [filters, onChange]
  );

  const handleBuildingChange = useCallback(
    (building: string) => {
      onChange({ ...filters, building });
    },
    [filters, onChange]
  );

  const handleTypeChange = useCallback(
    (type: ClassroomType | '') => {
      onChange({ ...filters, type });
    },
    [filters, onChange]
  );

  const handleStatusChange = useCallback(
    (status: ClassroomStatus | '') => {
      onChange({ ...filters, status });
    },
    [filters, onChange]
  );

  return (
    <View style={styles.card}>
      <View style={styles.field}>
        <Text style={styles.label}>{classroomsCopy.search}</Text>
        <TextInput
          accessibilityLabel={classroomsCopy.search}
          onChangeText={handleSearchChange}
          placeholder={classroomsCopy.searchPlaceholder}
          placeholderTextColor={dashboardColors.textMuted}
          style={styles.input}
          value={filters.search}
        />
      </View>
      <SelectField
        label={classroomsCopy.building}
        onChange={handleBuildingChange}
        options={[
          { label: classroomsCopy.allBuildings, value: '' },
          ...buildings.map((value) => ({ label: value, value }))
        ]}
        style={styles.field}
        value={filters.building}
      />
      <SelectField
        label={classroomsCopy.type}
        onChange={handleTypeChange}
        options={typeFilterOptions}
        style={styles.field}
        value={filters.type}
      />
      <SelectField
        label={classroomsCopy.status}
        onChange={handleStatusChange}
        options={statusFilterOptions}
        style={styles.field}
        value={filters.status}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 24,
    padding: 16,
    position: 'relative',
    zIndex: 2
  },
  field: {
    flexBasis: 200,
    flexGrow: 1,
    maxWidth: 300
  },
  input: {
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: dashboardColors.textPrimary,
    fontSize: 15,
    height: 44,
    letterSpacing: 0,
    paddingHorizontal: 14
  },
  label: {
    color: dashboardColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 16,
    marginBottom: 8
  }
});
