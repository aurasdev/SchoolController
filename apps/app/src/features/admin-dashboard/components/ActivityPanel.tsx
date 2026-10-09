import { StyleSheet, Text, View } from 'react-native';

import { activityItems, dashboardCopy } from '@/features/admin-dashboard/content';
import { dashboardColors } from '@/features/admin-dashboard/tokens';
import type { ActivityItem } from '@/features/admin-dashboard/types';

type ActivityRowProps = {
  item: ActivityItem;
};

function ActivityRow({ item }: ActivityRowProps) {
  return (
    <View style={styles.activityRow}>
      <View style={styles.activityDot} />
      <View style={styles.activityCopy}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
    </View>
  );
}

export function ActivityPanel() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{dashboardCopy.sectionActivity}</Text>
      <View style={styles.list}>
        {activityItems.map((item) => (
          <ActivityRow item={item} key={item.id} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activityCopy: {
    flex: 1
  },
  activityDot: {
    backgroundColor: dashboardColors.primary,
    borderRadius: 4,
    height: 6,
    marginTop: 7,
    width: 6
  },
  activityRow: {
    flexDirection: 'row',
    gap: 10
  },
  activityTime: {
    color: dashboardColors.textMuted,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 16
  },
  activityTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 20
  },
  card: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 20,
    shadowColor: '#12131a',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 8
  },
  list: {
    gap: 8,
    marginTop: 24
  },
  title: {
    color: dashboardColors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 28
  }
});
