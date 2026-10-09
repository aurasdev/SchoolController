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
    gap: 8
  },
  compactHeadingRow: {
    alignItems: 'flex-start',
    flexDirection: 'column'
  },
  compactPanelsRow: {
    alignItems: 'stretch',
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
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 16,
    marginTop: 24
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: dashboardColors.primary,
    borderRadius: 10,
    height: 24,
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  primaryButtonText: {
    color: dashboardColors.card,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 16
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 10,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  secondaryButtonText: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 16
  },
  subtitle: {
    color: dashboardColors.textMuted,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 20,
    marginTop: 4
  },
  title: {
    color: dashboardColors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 32
  }
});
