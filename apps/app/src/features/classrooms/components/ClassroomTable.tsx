import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Classroom } from '@school-controller/shared';

import { dashboardColors } from '@/features/admin-dashboard/tokens';
import { ClassroomStatusBadge } from '@/features/classrooms/components/ClassroomStatusBadge';
import { classroomsCopy, classroomTypeLabels } from '@/features/classrooms/content';

type ClassroomTableProps = {
  classrooms: Classroom[];
  onEdit: (id: string) => void;
  onOpen: (id: string) => void;
};

type ClassroomRowProps = {
  classroom: Classroom;
  onEdit: (id: string) => void;
  onOpen: (id: string) => void;
};

function ClassroomRow({ classroom, onEdit, onOpen }: ClassroomRowProps) {
  const handleEdit = useCallback(() => {
    onEdit(classroom.id);
  }, [classroom.id, onEdit]);

  const handleOpen = useCallback(() => {
    onOpen(classroom.id);
  }, [classroom.id, onOpen]);

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityLabel={`${classroomsCopy.viewDetail} ${classroom.code}`}
        accessibilityRole="button"
        focusable
        onPress={handleOpen}
        style={styles.codeColumn}
      >
        <Text style={styles.codeText}>{classroom.code}</Text>
      </Pressable>
      <Text style={[styles.cell, styles.buildingColumn]}>{classroom.building}</Text>
      <Text style={[styles.cell, styles.typeColumn]}>{classroomTypeLabels[classroom.type]}</Text>
      <Text style={[styles.cell, styles.capacityColumn]}>
        {classroom.capacity} {classroomsCopy.students}
      </Text>
      <Text style={[styles.cell, styles.equipmentColumn]}>
        {classroom.equipment.length > 0 ? classroom.equipment.join(' + ') : '—'}
      </Text>
      <Text style={[styles.occupancyText, styles.occupancyColumn]}>
        {classroom.weeklyOccupancy}%
      </Text>
      <View style={styles.statusColumn}>
        <ClassroomStatusBadge status={classroom.status} />
      </View>
      <View style={styles.actionsColumn}>
        <Pressable
          accessibilityLabel={`${classroomsCopy.edit} ${classroom.code}`}
          accessibilityRole="button"
          focusable
          onPress={handleEdit}
        >
          <Text style={styles.actionText}>{classroomsCopy.edit}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function ClassroomTable({ classrooms, onEdit, onOpen }: ClassroomTableProps) {
  return (
    <View>
      <View style={[styles.row, styles.headerRow]}>
        <Text style={[styles.headerCell, styles.codeColumn]}>{classroomsCopy.headers.code}</Text>
        <Text style={[styles.headerCell, styles.buildingColumn]}>
          {classroomsCopy.headers.building}
        </Text>
        <Text style={[styles.headerCell, styles.typeColumn]}>{classroomsCopy.headers.type}</Text>
        <Text style={[styles.headerCell, styles.capacityColumn]}>
          {classroomsCopy.headers.capacity}
        </Text>
        <Text style={[styles.headerCell, styles.equipmentColumn]}>
          {classroomsCopy.headers.equipment}
        </Text>
        <Text style={[styles.headerCell, styles.occupancyColumn]}>
          {classroomsCopy.headers.occupancy}
        </Text>
        <Text style={[styles.headerCell, styles.statusColumn]}>
          {classroomsCopy.headers.status}
        </Text>
        <Text style={[styles.headerCell, styles.actionsColumn, styles.actionsHeader]}>
          {classroomsCopy.headers.actions}
        </Text>
      </View>
      {classrooms.map((classroom) => (
        <ClassroomRow classroom={classroom} key={classroom.id} onEdit={onEdit} onOpen={onOpen} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  actionText: {
    color: dashboardColors.primary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0
  },
  actionsColumn: {
    alignItems: 'flex-end',
    flex: 0.8
  },
  actionsHeader: {
    textAlign: 'right'
  },
  buildingColumn: {
    flex: 1.1
  },
  capacityColumn: {
    flex: 1
  },
  cell: {
    color: dashboardColors.textSecondary,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 20
  },
  codeColumn: {
    flex: 1
  },
  codeText: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0
  },
  equipmentColumn: {
    flex: 1.6
  },
  headerCell: {
    color: dashboardColors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 16
  },
  headerRow: {
    minHeight: 52
  },
  occupancyColumn: {
    flex: 1.2
  },
  occupancyText: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0
  },
  row: {
    alignItems: 'center',
    borderBottomColor: dashboardColors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 60,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  statusColumn: {
    alignItems: 'flex-start',
    flex: 1.3
  },
  typeColumn: {
    flex: 1.2
  }
});
