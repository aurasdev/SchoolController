import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { dashboardColors } from '@/features/admin-dashboard/tokens';
import { classroomsCopy } from '@/features/classrooms/content';

type PaginationProps = {
  from: number;
  onPageChange: (page: number) => void;
  page: number;
  pageCount: number;
  to: number;
  total: number;
};

type PageButtonProps = {
  disabled: boolean;
  label: string;
  onPress: () => void;
};

function PageButton({ disabled, label, onPress }: PageButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      focusable
      onPress={onPress}
      style={[styles.button, disabled && styles.disabledButton]}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>{label}</Text>
    </Pressable>
  );
}

export function Pagination({ from, onPageChange, page, pageCount, to, total }: PaginationProps) {
  const handlePrevious = useCallback(() => {
    onPageChange(page - 1);
  }, [onPageChange, page]);

  const handleNext = useCallback(() => {
    onPageChange(page + 1);
  }, [onPageChange, page]);

  return (
    <View style={styles.container}>
      <Text style={styles.summary}>
        {classroomsCopy.showing}{' '}
        <Text style={styles.strong}>
          {from}-{to}
        </Text>{' '}
        {classroomsCopy.of} <Text style={styles.strong}>{total}</Text> {classroomsCopy.classrooms}
      </Text>
      <View style={styles.buttons}>
        <PageButton disabled={page <= 1} label={classroomsCopy.previous} onPress={handlePrevious} />
        <PageButton disabled={page >= pageCount} label={classroomsCopy.next} onPress={handleNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  buttonText: {
    color: dashboardColors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0
  },
  buttons: {
    flexDirection: 'row',
    gap: 8
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between'
  },
  disabledButton: {
    opacity: 0.5
  },
  disabledText: {
    color: dashboardColors.textMuted
  },
  strong: {
    color: dashboardColors.textPrimary,
    fontWeight: '700'
  },
  summary: {
    color: dashboardColors.textSecondary,
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0
  }
});
