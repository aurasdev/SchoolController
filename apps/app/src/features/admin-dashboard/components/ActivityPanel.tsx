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
    height: 8,
    marginTop: 6,
    width: 8
  },
  activityRow: {
    flexDirection: 'row',
    gap: 10
  },
  activityTime: {
    color: dashboardColors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 2
  },
  activityTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
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
    gap: 14,
    marginTop: 34
  },
  title: {
    color: dashboardColors.textPrimary,
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 0
  }
});
