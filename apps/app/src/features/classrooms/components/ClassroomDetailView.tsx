import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import type { Classroom } from '@school-controller/shared';

import { dashboardColors } from '@/features/admin-dashboard/tokens';
import { ClassroomStatusBadge } from '@/features/classrooms/components/ClassroomStatusBadge';
import { OccupancyBar } from '@/features/classrooms/components/OccupancyBar';
import { classroomsCopy, classroomTypeLabels } from '@/features/classrooms/content';

type ClassroomDetailViewProps = {
  classroom: Classroom;
  onBack: () => void;
  onEdit: () => void;
  onToggleAvailability: () => void;
};

type InfoItemProps = {
  label: string;
  value: string;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export function ClassroomDetailView({
  classroom,
  onBack,
  onEdit,
  onToggleAvailability
}: ClassroomDetailViewProps) {
  const isAvailable = classroom.status === 'available';

  return (
    <>
      <Pressable accessibilityRole="button" focusable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← {classroomsCopy.detail.back}</Text>
      </Pressable>

      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          <Text accessibilityRole="header" style={styles.title}>
            {classroom.code}
          </Text>
          <Text style={styles.subtitle}>
            {classroom.building} · {classroomTypeLabels[classroom.type]}
          </Text>
        </View>
        <View style={styles.headingActions}>
          <ClassroomStatusBadge status={classroom.status} />
          <Pressable
            accessibilityRole="button"
            focusable
            onPress={onEdit}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>{classroomsCopy.detail.editClassroom}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.grid}>
          <InfoItem label={classroomsCopy.detail.building} value={classroom.building} />
          <InfoItem
            label={classroomsCopy.detail.type}
            value={classroomTypeLabels[classroom.type]}
          />
          <InfoItem
            label={classroomsCopy.detail.capacity}
            value={`${classroom.capacity} ${classroomsCopy.students}`}
          />
          <InfoItem
            label={classroomsCopy.detail.equipment}
            value={
              classroom.equipment.length > 0
                ? classroom.equipment.join(' + ')
                : classroomsCopy.noEquipment
            }
          />
        </View>
        <View style={styles.occupancy}>
          <Text style={styles.infoLabel}>{classroomsCopy.detail.occupancy}</Text>
          <OccupancyBar value={classroom.weeklyOccupancy} />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.availabilityRow}>
          <View style={styles.availabilityCopy}>
            <Text style={styles.sectionTitle}>{classroomsCopy.detail.availability}</Text>
            <Text style={styles.help}>{classroomsCopy.detail.availabilityHelp}</Text>
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {isAvailable ? classroomsCopy.detail.available : classroomsCopy.detail.notAvailable}
            </Text>
            <Switch
              accessibilityLabel={classroomsCopy.detail.availability}
              onValueChange={onToggleAvailability}
              trackColor={{ false: '#d3d4d9', true: dashboardColors.primary }}
              value={isAvailable}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  availabilityCopy: {
    flexShrink: 1,
    maxWidth: 520
  },
  availabilityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between'
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16
  },
  backText: {
    color: dashboardColors.primary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0
  },
  card: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
    padding: 24
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24
  },
  headingActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12
  },
  headingCopy: {
    flexShrink: 1
  },
  headingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between'
  },
  help: {
    color: dashboardColors.textSecondary,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 20,
    marginTop: 4
  },
  infoItem: {
    flexBasis: 180,
    flexGrow: 1
  },
  infoLabel: {
    color: dashboardColors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 16
  },
  infoValue: {
    color: dashboardColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 22,
    marginTop: 4
  },
  occupancy: {
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
  sectionTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0
  },
  subtitle: {
    color: dashboardColors.textMuted,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 20,
    marginTop: 4
  },
  switchLabel: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12
  },
  title: {
    color: dashboardColors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 32
  }
});
