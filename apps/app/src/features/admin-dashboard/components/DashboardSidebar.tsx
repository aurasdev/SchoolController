import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DashboardLogo } from '@/features/admin-dashboard/components/DashboardLogo';
import { DashboardNavButton } from '@/features/admin-dashboard/components/DashboardNavButton';
import { dashboardCopy, dashboardNavItems } from '@/features/admin-dashboard/content';
import { dashboardColors } from '@/features/admin-dashboard/tokens';
import type { DashboardSection } from '@/features/admin-dashboard/types';

type DashboardSidebarProps = {
  activeSection: DashboardSection;
  onNavigate: (section: DashboardSection) => void;
  onSignOut: () => void;
  variant?: 'dark' | 'light';
};

export function DashboardSidebar({
  activeSection,
  onNavigate,
  onSignOut,
  variant = 'dark'
}: DashboardSidebarProps) {
  const isLight = variant === 'light';

  return (
    <View style={[styles.sidebar, isLight && styles.lightSidebar]}>
      <View>
        <View style={styles.brandRow}>
          <DashboardLogo inverted={!isLight} />
          <View>
            <Text style={[styles.brandTitle, isLight && styles.lightBrandTitle]}>
              {dashboardCopy.appName}
            </Text>
            {isLight ? null : <Text style={styles.brandSubtitle}>{dashboardCopy.adminLabel}</Text>}
          </View>
        </View>

        <View style={styles.navList}>
          {dashboardNavItems.map((item) => (
            <DashboardNavButton
              isActive={item.id === activeSection}
              isLight={isLight}
              item={item}
              key={item.id}
              onNavigate={onNavigate}
            />
          ))}
        </View>
      </View>

      {isLight ? null : (
        <View>
          <View style={styles.portalCard}>
            <Text style={styles.portalTitle}>{dashboardCopy.portalTitle}</Text>
            <Text style={styles.portalDescription}>{dashboardCopy.portalDescription}</Text>
            <View style={styles.portalBadge}>
              <Text style={styles.portalBadgeText}>{dashboardCopy.portalBadge}</Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            focusable
            onPress={onSignOut}
            style={styles.signOutButton}
          >
            <Text style={styles.signOutText}>Cerrar sesión</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 34
  },
  brandSubtitle: {
    color: '#b8b5dc',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0
  },
  brandTitle: {
    color: dashboardColors.card,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0
  },
  lightBrandTitle: {
    color: dashboardColors.textPrimary
  },
  lightSidebar: {
    backgroundColor: dashboardColors.card,
    borderRightColor: dashboardColors.border,
    borderRightWidth: 1
  },
  navList: {
    gap: 8
  },
  portalBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#5b4de3',
    borderRadius: 5,
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  portalBadgeText: {
    color: dashboardColors.card,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0
  },
  portalCard: {
    backgroundColor: dashboardColors.mutedPanel,
    borderRadius: 8,
    padding: 16
  },
  portalDescription: {
    color: '#c9c6ec',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 17,
    marginTop: 14
  },
  portalTitle: {
    color: dashboardColors.card,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0
  },
  sidebar: {
    backgroundColor: dashboardColors.darkPanel,
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 26,
    width: 260
  },
  signOutButton: {
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 6,
    borderWidth: 1,
    marginTop: 16,
    paddingVertical: 10
  },
  signOutText: {
    color: dashboardColors.card,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    textAlign: 'center'
  }
});
