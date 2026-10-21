import { StyleSheet, Text, View } from 'react-native';
import type { ClassroomStatus } from '@school-controller/shared';

import { classroomStatusLabels } from '@/features/classrooms/content';
import { classroomStatusColors } from '@/features/classrooms/tokens';

type ClassroomStatusBadgeProps = {
  status: ClassroomStatus;
};

export function ClassroomStatusBadge({ status }: ClassroomStatusBadgeProps) {
  const colors = classroomStatusColors[status];

  return (
    <View style={[styles.badge, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>{classroomStatusLabels[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 14
  }
});
