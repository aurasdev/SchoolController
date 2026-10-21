import { ScrollView, StyleSheet } from 'react-native';

import { DashboardNavButton } from '@/features/admin-dashboard/components/DashboardNavButton';
import { dashboardNavItems } from '@/features/admin-dashboard/content';
import { dashboardColors } from '@/features/admin-dashboard/tokens';
import type { DashboardSection } from '@/features/admin-dashboard/types';

type DashboardCompactNavProps = {
  activeSection: DashboardSection;
  onNavigate: (section: DashboardSection) => void;
};

export function DashboardCompactNav({ activeSection, onNavigate }: DashboardCompactNavProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.bar}
    >
      {dashboardNavItems.map((item) => (
        <DashboardNavButton
          isActive={item.id === activeSection}
          isLight
          item={item}
          key={item.id}
          onNavigate={onNavigate}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: dashboardColors.card,
    borderBottomColor: dashboardColors.border,
    borderBottomWidth: 1,
    flexGrow: 0,
    flexShrink: 0
  },
  content: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8
  }
});
