import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AddClassForm } from '@/features/admin-dashboard/components/AddClassForm';
import { ScheduleTabs } from '@/features/admin-dashboard/components/ScheduleTabs';
import { WeekNavigator } from '@/features/admin-dashboard/components/WeekNavigator';
import { WeeklyScheduleGrid } from '@/features/admin-dashboard/components/WeeklyScheduleGrid';
import { dashboardCopy } from '@/features/admin-dashboard/content';
import { dashboardColors } from '@/features/admin-dashboard/tokens';
import type { ScheduleViewMode } from '@/features/admin-dashboard/types';

export function AdminScheduleView() {
  const [activeTab, setActiveTab] = useState<ScheduleViewMode>('week');

  const handleTabChange = useCallback((tab: ScheduleViewMode) => {
    setActiveTab(tab);
  }, []);

  const handleAddClass = useCallback(() => {
    setActiveTab('addClass');
  }, []);

  const handleBackToWeek = useCallback(() => {
    setActiveTab('week');
  }, []);

  return (
    <>
      <View style={styles.headingRow}>
        <View>
          <Text style={styles.title}>{dashboardCopy.weeklyScheduleTitle}</Text>
          <Text style={styles.subtitle}>{dashboardCopy.weeklyScheduleSubtitle}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" focusable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>{dashboardCopy.export}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            focusable
            onPress={handleAddClass}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>{dashboardCopy.addClass}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <ScheduleTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <WeekNavigator />
      </View>

      {activeTab === 'week' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <WeeklyScheduleGrid />
        </ScrollView>
      ) : null}

      {activeTab === 'addClass' ? <AddClassForm onCancel={handleBackToWeek} /> : null}

      {activeTab === 'day' || activeTab === 'month' ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>View in progress</Text>
          <Text style={styles.emptyText}>This tab is ready for its next design pass.</Text>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10
  },
  controlsRow: {
    alignItems: 'flex-end',
    borderBottomColor: dashboardColors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 34,
    paddingBottom: 18
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 28,
    paddingHorizontal: 24,
    paddingVertical: 56
  },
  emptyText: {
    color: dashboardColors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 8
  },
  emptyTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0
  },
  headingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    color: dashboardColors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 8
  },
  title: {
    color: dashboardColors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0
  }
});
