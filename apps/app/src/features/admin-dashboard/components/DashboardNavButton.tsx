import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { dashboardColors } from '@/features/admin-dashboard/tokens';
import type { DashboardNavItem, DashboardSection } from '@/features/admin-dashboard/types';

type DashboardNavButtonProps = {
  isActive: boolean;
  isLight: boolean;
  item: DashboardNavItem;
  onNavigate: (section: DashboardSection) => void;
};

export function DashboardNavButton({
  isActive,
  isLight,
  item,
  onNavigate
}: DashboardNavButtonProps) {
  const handlePress = useCallback(() => {
    onNavigate(item.id);
  }, [item.id, onNavigate]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      focusable
      onPress={handlePress}
      style={[
        styles.navItem,
        isActive && styles.activeNavItem,
        isLight && isActive && styles.lightActiveNavItem
      ]}
    >
      <View
        style={[
          styles.navIcon,
          isLight && styles.lightNavIcon,
          isActive && styles.activeNavIcon,
          isLight && isActive && styles.lightActiveNavIcon
        ]}
      />
      <Text
        style={[
          styles.navLabel,
          isLight && styles.lightNavLabel,
          isActive && styles.activeNavLabel,
          isLight && isActive && styles.lightActiveNavLabel
        ]}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  activeNavIcon: {
    backgroundColor: dashboardColors.card
  },
  activeNavItem: {
    backgroundColor: dashboardColors.activeNav
  },
  activeNavLabel: {
    color: dashboardColors.card,
    fontWeight: '800'
  },
  lightActiveNavIcon: {
    backgroundColor: dashboardColors.primary
  },
  lightActiveNavItem: {
    backgroundColor: dashboardColors.primarySubtle
  },
  lightActiveNavLabel: {
    color: dashboardColors.primary,
    fontWeight: '900'
  },
  lightNavIcon: {
    backgroundColor: '#d3d4d9'
  },
  lightNavLabel: {
    color: dashboardColors.textSecondary
  },
  navIcon: {
    backgroundColor: '#6f69a8',
    borderRadius: 4,
    height: 20,
    width: 20
  },
  navItem: {
    alignItems: 'center',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 8,
    height: 40,
    paddingHorizontal: 12
  },
  navLabel: {
    color: '#d4d1ee',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0
  }
});
