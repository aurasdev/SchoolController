import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getClassPageNumbers } from '@/features/classes/classFilters';
import { classColors } from '@/features/classes/tokens';

type ClassPaginationProps = {
  from: number;
  to: number;
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

type PageButtonProps = {
  label: string;
  accessibilityLabel?: string;
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

function PageButton({ label, accessibilityLabel, selected, disabled, onPress }: PageButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      focusable
      onPress={onPress}
      style={[styles.button, selected && styles.selectedButton, disabled && styles.disabledButton]}
    >
      <Text style={[styles.buttonText, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
}

export function ClassPagination({
  from,
  to,
  total,
  page,
  pageCount,
  onPageChange
}: ClassPaginationProps) {
  return (
    <View style={styles.footer}>
      <Text accessibilityLiveRegion="polite" style={styles.summary}>
        Showing {from}-{to} of {total} classes
      </Text>
      <View accessibilityLabel="Class pages" style={styles.buttons}>
        <PageButton disabled={page === 1} label="Prev" onPress={() => onPageChange(page - 1)} />
        {getClassPageNumbers(page, pageCount).map((number, index) =>
          number === 'ellipsis' ? (
            <Text key={`ellipsis-${index}`} style={styles.ellipsis}>
              …
            </Text>
          ) : (
            <PageButton
              accessibilityLabel={`Page ${number}`}
              key={number}
              label={String(number)}
              onPress={() => onPageChange(number)}
              selected={number === page}
            />
          )
        )}
        <PageButton
          disabled={page === pageCount}
          label="Next"
          onPress={() => onPageChange(page + 1)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderColor: classColors.border,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 32,
    minWidth: 32,
    paddingHorizontal: 9
  },
  buttonText: { color: classColors.textPrimary, fontSize: 13 },
  buttons: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  disabledButton: { opacity: 0.45 },
  ellipsis: { color: classColors.textMuted, paddingHorizontal: 3 },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
    marginTop: 24
  },
  selectedButton: { backgroundColor: classColors.primary, borderColor: classColors.primary },
  selectedText: { color: classColors.card },
  summary: { color: classColors.textSecondary, fontSize: 13 }
});
