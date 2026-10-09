import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useCallback } from 'react';

import { scheduleTabs } from '@/features/admin-dashboard/scheduleContent';
import { dashboardColors } from '@/features/admin-dashboard/tokens';
import type { ScheduleViewMode } from '@/features/admin-dashboard/types';

type ScheduleTabsProps = {
  activeTab: ScheduleViewMode;
  onTabChange: (tab: ScheduleViewMode) => void;
};

type ScheduleTabButtonProps = {
  isActive: boolean;
  onTabChange: (tab: ScheduleViewMode) => void;
  tab: {
    id: ScheduleViewMode;
    label: string;
  };
};

function ScheduleTabButton({ isActive, onTabChange, tab }: ScheduleTabButtonProps) {
  const handlePress = useCallback(() => {
    onTabChange(tab.id);
  }, [onTabChange, tab.id]);

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      focusable
      onPress={handlePress}
      style={styles.tabButton}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
      {isActive ? <View style={styles.activeIndicator} /> : null}
    </Pressable>
  );
}

export function ScheduleTabs({ activeTab, onTabChange }: ScheduleTabsProps) {
  return (
    <View accessibilityRole="tablist" style={styles.tabs}>
      {scheduleTabs.map((tab) => (
        <ScheduleTabButton
          isActive={tab.id === activeTab}
          key={tab.id}
          onTabChange={onTabChange}
          tab={tab}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  activeIndicator: {
    backgroundColor: dashboardColors.primary,
    borderRadius: 1,
    height: 2,
    marginTop: 12,
    width: '100%'
  },
  activeTabText: {
    color: dashboardColors.primary,
    fontWeight: '900'
  },
  tabButton: {
    minWidth: 88
  },
  tabText: {
    color: dashboardColors.textSecondary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0
  },
  tabs: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 34
  }
});
