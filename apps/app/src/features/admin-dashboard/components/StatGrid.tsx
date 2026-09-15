import { StyleSheet, Text, View } from 'react-native';

import { dashboardStats } from '@/features/admin-dashboard/content';
import { dashboardColors } from '@/features/admin-dashboard/tokens';
import type { DashboardStat } from '@/features/admin-dashboard/types';

type StatGridProps = {
  isCompact: boolean;
};

type StatCardProps = {
  stat: DashboardStat;
};

function StatCard({ stat }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{stat.label}</Text>
      <Text style={styles.value}>{stat.value}</Text>
      <View style={styles.trendRow}>
        <View style={styles.trendDot} />
        <Text style={styles.trendText}>{stat.trend}</Text>
      </View>
    </View>
  );
}

export function StatGrid({ isCompact }: StatGridProps) {
  return (
    <View style={[styles.grid, isCompact && styles.compactGrid]}>
      {dashboardStats.map((stat) => (
        <View key={stat.id} style={isCompact ? styles.compactColumn : styles.column}>
          <StatCard stat={stat} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 150,
    padding: 20,
    shadowColor: '#12131a',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 8
  },
  column: {
    flex: 1
  },
  compactColumn: {
    width: '48%'
  },
  compactGrid: {
    flexWrap: 'wrap'
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 28
  },
  label: {
    color: dashboardColors.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0
  },
  trendDot: {
    backgroundColor: dashboardColors.primary,
    borderRadius: 4,
    height: 8,
    width: 8
  },
  trendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginTop: 8
  },
  trendText: {
    color: dashboardColors.textSecondary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0
  },
  value: {
    color: dashboardColors.textPrimary,
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 62,
    marginTop: 30
  }
});
