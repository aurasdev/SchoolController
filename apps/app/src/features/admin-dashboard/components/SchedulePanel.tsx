import { StyleSheet, Text, View } from 'react-native';

import { dashboardCopy, scheduleItems } from '@/features/admin-dashboard/content';
import { dashboardColors } from '@/features/admin-dashboard/tokens';
import type { ScheduleItem } from '@/features/admin-dashboard/types';

type ScheduleRowProps = {
  item: ScheduleItem;
};

function ScheduleRow({ item }: ScheduleRowProps) {
  return (
    <View style={[styles.scheduleRow, { backgroundColor: item.backgroundColor }]}>
      <View style={[styles.scheduleAccent, { backgroundColor: item.accentColor }]} />
      <View>
        <Text style={[styles.scheduleSubject, { color: item.accentColor }]}>{item.subject}</Text>
        <Text style={[styles.scheduleTime, { color: item.accentColor }]}>{item.time}</Text>
        <Text style={[styles.scheduleRoom, { color: item.accentColor }]}>{item.room}</Text>
      </View>
    </View>
  );
}

export function SchedulePanel() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{dashboardCopy.sectionSchedule}</Text>
      <View style={styles.list}>
        {scheduleItems.map((item) => (
          <ScheduleRow item={item} key={item.id} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1.62,
    padding: 20,
    shadowColor: '#12131a',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 8
  },
  list: {
    gap: 10,
    marginTop: 34
  },
  scheduleAccent: {
    alignSelf: 'stretch',
    borderBottomLeftRadius: 6,
    borderTopLeftRadius: 6,
    width: 4
  },
  scheduleRoom: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 7,
    opacity: 0.7
  },
  scheduleRow: {
    borderRadius: 6,
    flexDirection: 'row',
    gap: 10,
    minHeight: 84,
    overflow: 'hidden',
    paddingVertical: 12
  },
  scheduleSubject: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0
  },
  scheduleTime: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 7,
    opacity: 0.72
  },
  title: {
    color: dashboardColors.textPrimary,
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 0
  }
});
