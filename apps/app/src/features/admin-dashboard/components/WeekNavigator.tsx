import { Pressable, StyleSheet, Text, View } from 'react-native';

import { dashboardColors } from '@/features/admin-dashboard/tokens';

type Props = {
  label: string;
  previousDisabled: boolean;
  nextDisabled: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};
export function WeekNavigator({
  label,
  previousDisabled,
  nextDisabled,
  onPrevious,
  onNext,
  onToday
}: Props) {
  return (
    <View style={styles.navigator}>
      <View style={styles.arrowGroup}>
        <Pressable
          accessibilityLabel="Previous week"
          accessibilityRole="button"
          focusable
          disabled={previousDisabled}
          onPress={onPrevious}
          style={styles.arrowButton}
        >
          <Text style={styles.arrowText}>‹</Text>
        </Pressable>
        <Pressable
          accessibilityLabel="Next week"
          accessibilityRole="button"
          focusable
          disabled={nextDisabled}
          onPress={onNext}
          style={styles.arrowButton}
        >
          <Text style={styles.arrowText}>›</Text>
        </Pressable>
      </View>
      <Text style={styles.rangeText}>{label}</Text>
      <Pressable accessibilityRole="button" focusable onPress={onToday} style={styles.todayButton}>
        <Text style={styles.todayButtonText}>Hoy</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  arrowButton: {
    alignItems: 'center',
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 6,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32
  },
  arrowGroup: {
    flexDirection: 'row',
    gap: 6
  },
  arrowText: {
    color: dashboardColors.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 25
  },
  navigator: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap'
  },
  rangeText: {
    color: dashboardColors.textPrimary,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0
  },
  todayButton: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  todayButtonText: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0
  }
});
