import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { loginCopy, loginRoles } from '@/features/login/content';
import { loginColors } from '@/features/login/tokens';
import type { LoginRole } from '@/features/login/types';

type RoleSelectProps = {
  onRoleChange: (role: LoginRole) => void;
  selectedRole: LoginRole;
};

type RoleOptionProps = {
  onSelect: (role: LoginRole) => void;
  role: LoginRole;
};

function RoleOption({ onSelect, role }: RoleOptionProps) {
  const handlePress = useCallback(() => {
    onSelect(role);
  }, [onSelect, role]);

  return (
    <Pressable accessibilityRole="menuitem" focusable onPress={handlePress} style={styles.menuItem}>
      <Text style={styles.menuText}>{role}</Text>
    </Pressable>
  );
}

export function RoleSelect({ onRoleChange, selectedRole }: RoleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const accessibilityState = { expanded: isOpen };

  const handleToggle = useCallback(() => {
    setIsOpen((current) => !current);
  }, []);

  const handleRoleSelect = useCallback(
    (role: LoginRole) => {
      onRoleChange(role);
      setIsOpen(false);
    },
    [onRoleChange]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{loginCopy.form.roleLabel}</Text>
      <Pressable
        accessibilityLabel={loginCopy.form.roleLabel}
        accessibilityRole="button"
        accessibilityState={accessibilityState}
        focusable
        onPress={handleToggle}
        style={styles.select}
      >
        <Text style={styles.value}>{selectedRole}</Text>
        <Text
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={styles.icon}
        >
          ⌄
        </Text>
      </Pressable>
      {isOpen ? (
        <View accessibilityRole="menu" style={styles.menu}>
          {loginRoles.map((role) => (
            <RoleOption key={role} onSelect={handleRoleSelect} role={role} />
          ))}
        </View>
      ) : null}
      <Text style={styles.help}>{loginCopy.form.roleHelp}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 2
  },
  help: {
    color: loginColors.textSecondary,
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 24,
    marginTop: 8
  },
  icon: {
    color: loginColors.textSecondary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0
  },
  label: {
    color: loginColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 8
  },
  menu: {
    backgroundColor: loginColors.surfaceCard,
    borderColor: loginColors.surfaceBorder,
    borderRadius: 8,
    borderWidth: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 84,
    zIndex: 5
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  menuText: {
    color: loginColors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0
  },
  select: {
    alignItems: 'center',
    borderColor: loginColors.surfaceBorder,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    height: 58,
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  value: {
    color: loginColors.textSecondary,
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 0
  }
});
