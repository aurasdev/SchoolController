import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ActivityPanel } from '@/features/admin-dashboard/components/ActivityPanel';
import { SchedulePanel } from '@/features/admin-dashboard/components/SchedulePanel';
import { StatGrid } from '@/features/admin-dashboard/components/StatGrid';
import { UpcomingClassesTable } from '@/features/admin-dashboard/components/UpcomingClassesTable';
import { dashboardCopy } from '@/features/admin-dashboard/content';
import { dashboardColors } from '@/features/admin-dashboard/tokens';

type DashboardOverviewProps = {
  isCompact: boolean;
  onConfigureSchedule: () => void;
};

export function DashboardOverview({ isCompact, onConfigureSchedule }: DashboardOverviewProps) {
  return (
    <>
      <View style={[styles.headingRow, isCompact && styles.compactHeadingRow]}>
        <View style={styles.headingCopy}>
          <Text style={styles.title}>{dashboardCopy.title}</Text>
          <Text style={styles.subtitle}>{dashboardCopy.subtitle}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" focusable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>{dashboardCopy.exportPdf}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            focusable
            onPress={onConfigureSchedule}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>{dashboardCopy.configureSchedule}</Text>
          </Pressable>
        </View>
      </View>

      <StatGrid isCompact={isCompact} />

      <View style={[styles.panelsRow, isCompact && styles.compactPanelsRow]}>
        <SchedulePanel />
        <ActivityPanel />
      </View>

      <UpcomingClassesTable />
    </>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10
  },
  compactHeadingRow: {
    alignItems: 'flex-start',
    flexDirection: 'column'
  },
  compactPanelsRow: {
    flexDirection: 'column'
  },
  headingCopy: {
    flex: 1
  },
  headingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between'
  },
  panelsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24
  },
  primaryButton: {
    backgroundColor: dashboardColors.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  primaryButtonText: {
    color: dashboardColors.card,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0
  },
  secondaryButton: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  secondaryButtonText: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0
  },
  subtitle: {
    color: dashboardColors.textMuted,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 21,
    marginTop: 6
  },
  title: {
    color: dashboardColors.textPrimary,
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 0
  }
});
