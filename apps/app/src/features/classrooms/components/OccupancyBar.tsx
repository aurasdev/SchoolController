import { StyleSheet, Text, View } from 'react-native';

import { dashboardColors } from '@/features/admin-dashboard/tokens';

type OccupancyBarProps = {
  value: number;
};

export function OccupancyBar({ value }: OccupancyBarProps) {
  return (
    <View style={styles.row}>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ max: 100, min: 0, now: value }}
        style={styles.track}
      >
        <View style={[styles.fill, { width: `${value}%` }]} />
      </View>
      <Text style={styles.value}>{value}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    backgroundColor: dashboardColors.primary,
    borderRadius: 4,
    height: '100%'
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 6
  },
  track: {
    backgroundColor: dashboardColors.border,
    borderRadius: 4,
    flex: 1,
    height: 8,
    overflow: 'hidden'
  },
  value: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    minWidth: 40,
    textAlign: 'right'
  }
});
