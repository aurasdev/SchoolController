import { StyleSheet, Text, View } from 'react-native';

import { dashboardCopy, upcomingClasses } from '@/features/admin-dashboard/content';
import { dashboardColors } from '@/features/admin-dashboard/tokens';
import type { UpcomingClass } from '@/features/admin-dashboard/types';

type ClassRowProps = {
  item: UpcomingClass;
};

function ClassRow({ item }: ClassRowProps) {
  const isPending = item.status === 'Pending';

  return (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.className}</Text>
      <Text style={styles.cell}>{item.teacher}</Text>
      <Text style={styles.cell}>{item.time}</Text>
      <View style={styles.cell}>
        <View style={[styles.statusBadge, isPending && styles.pendingBadge]}>
          <Text style={[styles.statusText, isPending && styles.pendingText]}>{item.status}</Text>
        </View>
      </View>
    </View>
  );
}

export function UpcomingClassesTable() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{dashboardCopy.sectionUpcoming}</Text>
      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={styles.headerCell}>{dashboardCopy.tableHeaders.className}</Text>
          <Text style={styles.headerCell}>{dashboardCopy.tableHeaders.teacher}</Text>
          <Text style={styles.headerCell}>{dashboardCopy.tableHeaders.time}</Text>
          <Text style={styles.headerCell}>{dashboardCopy.tableHeaders.status}</Text>
        </View>
        {upcomingClasses.map((item) => (
          <ClassRow item={item} key={item.id} />
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
    marginTop: 24,
    padding: 20,
    shadowColor: '#12131a',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 8
  },
  cell: {
    color: dashboardColors.textPrimary,
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0
  },
  headerCell: {
    color: dashboardColors.textMuted,
    flex: 1,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0
  },
  headerRow: {
    backgroundColor: dashboardColors.card,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  pendingBadge: {
    backgroundColor: dashboardColors.warningSubtle
  },
  pendingText: {
    color: dashboardColors.warning
  },
  row: {
    alignItems: 'center',
    borderBottomColor: dashboardColors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 46,
    paddingHorizontal: 16
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: dashboardColors.primarySubtle,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  statusText: {
    color: dashboardColors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0
  },
  table: {
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 34,
    overflow: 'hidden'
  },
  title: {
    color: dashboardColors.textPrimary,
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 0
  }
});
