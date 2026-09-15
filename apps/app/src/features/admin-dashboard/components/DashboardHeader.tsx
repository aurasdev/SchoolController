import { Pressable, StyleSheet, Text, View } from 'react-native';

import { dashboardCopy } from '@/features/admin-dashboard/content';
import { dashboardColors } from '@/features/admin-dashboard/tokens';
import type { AuthenticatedUser } from '@/features/login/types';

import { DashboardLogo } from '@/features/admin-dashboard/components/DashboardLogo';

type DashboardHeaderProps = {
  isCompact: boolean;
  onSignOut: () => void;
  user: AuthenticatedUser;
};

export function DashboardHeader({ isCompact, onSignOut, user }: DashboardHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <DashboardLogo />
        <Text style={styles.brandTitle}>{dashboardCopy.appName}</Text>
      </View>

      <View style={styles.userRow}>
        <View style={styles.schoolBadge}>
          <Text style={styles.schoolBadgeText}>{user.institution}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.initials}</Text>
        </View>
        {isCompact ? (
          <Pressable
            accessibilityRole="button"
            focusable
            onPress={onSignOut}
            style={styles.signOutButton}
          >
            <Text style={styles.signOutText}>Salir</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: dashboardColors.primarySubtle,
    borderRadius: 12,
    height: 30,
    justifyContent: 'center',
    width: 30
  },
  avatarText: {
    color: dashboardColors.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10
  },
  brandTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0
  },
  header: {
    alignItems: 'center',
    backgroundColor: dashboardColors.card,
    borderBottomColor: dashboardColors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 58,
    paddingHorizontal: 24
  },
  schoolBadge: {
    backgroundColor: '#eef4ff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  schoolBadgeText: {
    color: dashboardColors.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0
  },
  signOutButton: {
    borderColor: dashboardColors.border,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  signOutText: {
    color: dashboardColors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10
  }
});
