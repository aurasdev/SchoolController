import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Classroom } from '@school-controller/shared';

import { dashboardColors } from '@/features/admin-dashboard/tokens';
import { ClassroomStatusBadge } from '@/features/classrooms/components/ClassroomStatusBadge';
import { OccupancyBar } from '@/features/classrooms/components/OccupancyBar';
import { classroomsCopy, classroomTypeLabels } from '@/features/classrooms/content';

type ClassroomCardProps = {
  classroom: Classroom;
  onEdit: (id: string) => void;
  onOpen: (id: string) => void;
};

type CardDetailProps = {
  label: string;
  value: string;
};

function CardDetail({ label, value }: CardDetailProps) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export function ClassroomCard({ classroom, onEdit, onOpen }: ClassroomCardProps) {
  const handleEdit = useCallback(() => {
    onEdit(classroom.id);
  }, [classroom.id, onEdit]);

  const handleOpen = useCallback(() => {
    onOpen(classroom.id);
  }, [classroom.id, onOpen]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel={`${classroomsCopy.viewDetail} ${classroom.code}`}
          accessibilityRole="button"
          focusable
          onPress={handleOpen}
        >
          <Text style={styles.code}>{classroom.code}</Text>
        </Pressable>
        <ClassroomStatusBadge status={classroom.status} />
      </View>
      <Text style={styles.meta}>
        {classroom.building} · {classroomTypeLabels[classroom.type]}
      </Text>

      <View style={styles.details}>
        <CardDetail
          label={classroomsCopy.headers.capacity}
          value={`${classroom.capacity} ${classroomsCopy.students}`}
        />
        <CardDetail
          label={classroomsCopy.headers.equipment}
          value={
            classroom.equipment.length > 0
              ? classroom.equipment.join(' + ')
              : classroomsCopy.noEquipment
          }
        />
      </View>

      <View style={styles.occupancy}>
        <Text style={styles.detailLabel}>{classroomsCopy.headers.occupancy}</Text>
        <OccupancyBar value={classroom.weeklyOccupancy} />
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityLabel={`${classroomsCopy.viewDetail} ${classroom.code}`}
          accessibilityRole="button"
          focusable
          onPress={handleOpen}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>{classroomsCopy.viewDetail}</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={`${classroomsCopy.edit} ${classroom.code}`}
          accessibilityRole="button"
          focusable
          onPress={handleEdit}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>{classroomsCopy.edit}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16
  },
  card: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#12131a',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 8
  },
  code: {
    color: dashboardColors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0
  },
  detail: {
    flex: 1,
    minWidth: 120
  },
  detailLabel: {
    color: dashboardColors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 16
  },
  detailValue: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 20,
    marginTop: 2
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  meta: {
    color: dashboardColors.textSecondary,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    marginTop: 4
  },
  occupancy: {
    marginTop: 14
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: dashboardColors.primary,
    borderRadius: 8,
    flex: 1,
    paddingVertical: 10
  },
  primaryButtonText: {
    color: dashboardColors.card,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 10
  },
  secondaryButtonText: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0
  }
});
