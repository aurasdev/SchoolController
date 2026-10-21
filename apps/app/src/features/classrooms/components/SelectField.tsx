import { useCallback, useState } from 'react';
import { Pressable, type StyleProp, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { dashboardColors } from '@/features/admin-dashboard/tokens';
import { classroomColors } from '@/features/classrooms/tokens';
import type { SelectOption } from '@/features/classrooms/types';

type SelectFieldProps<T extends string> = {
  error?: string;
  label: string;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  value: T;
};

type SelectOptionItemProps<T extends string> = {
  isSelected: boolean;
  onSelect: (value: T) => void;
  option: SelectOption<T>;
};

function SelectOptionItem<T extends string>({
  isSelected,
  onSelect,
  option
}: SelectOptionItemProps<T>) {
  const handlePress = useCallback(() => {
    onSelect(option.value);
  }, [onSelect, option.value]);

  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityState={{ selected: isSelected }}
      focusable
      onPress={handlePress}
      style={[styles.menuItem, isSelected && styles.selectedMenuItem]}
    >
      <Text style={[styles.menuText, isSelected && styles.selectedMenuText]}>{option.label}</Text>
    </Pressable>
  );
}

export function SelectField<T extends string>({
  error,
  label,
  onChange,
  options,
  placeholder = '',
  style,
  value
}: SelectFieldProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  const handleToggle = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  const handleSelect = useCallback(
    (next: T) => {
      onChange(next);
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <View style={[styles.field, style, isOpen && styles.openField]}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        focusable
        onPress={handleToggle}
        style={[styles.select, error ? styles.selectError : null]}
      >
        <Text numberOfLines={1} style={[styles.value, !selected && styles.placeholder]}>
          {selected?.label ?? placeholder}
        </Text>
        <Text
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={styles.caret}
        >
          ▾
        </Text>
      </Pressable>
      {isOpen ? (
        <View accessibilityRole="menu" style={styles.menu}>
          {options.map((option) => (
            <SelectOptionItem
              isSelected={option.value === value}
              key={option.value}
              onSelect={handleSelect}
              option={option}
            />
          ))}
        </View>
      ) : null}
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  caret: {
    color: dashboardColors.textMuted,
    fontSize: 12,
    letterSpacing: 0
  },
  error: {
    color: classroomColors.danger,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 6
  },
  field: {
    zIndex: 1
  },
  label: {
    color: dashboardColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 16,
    marginBottom: 8
  },
  menu: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    shadowColor: '#12131a',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    top: 72,
    zIndex: 20
  },
  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 11
  },
  menuText: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0
  },
  openField: {
    zIndex: 10
  },
  placeholder: {
    color: dashboardColors.textMuted
  },
  select: {
    alignItems: 'center',
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    height: 44,
    justifyContent: 'space-between',
    paddingHorizontal: 14
  },
  selectError: {
    borderColor: classroomColors.danger
  },
  selectedMenuItem: {
    backgroundColor: dashboardColors.primarySubtle
  },
  selectedMenuText: {
    color: dashboardColors.primary,
    fontWeight: '700'
  },
  value: {
    color: dashboardColors.textSecondary,
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0
  }
});
