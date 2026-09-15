import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { loginCopy } from '@/features/login/content';
import { loginColors, rememberSwitchTrackColor } from '@/features/login/tokens';
import type { LoginFormHandlers, LoginFormState } from '@/features/login/types';

import { CredentialFields } from '@/features/login/components/CredentialFields';
import { RoleSelect } from '@/features/login/components/RoleSelect';

type LoginCardProps = {
  feedbackText: string;
  handlers: LoginFormHandlers;
  state: LoginFormState;
};

export function LoginCard({ feedbackText, handlers, state }: LoginCardProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Text style={styles.title}>{loginCopy.form.title}</Text>
        <Text style={styles.subtitle}>{loginCopy.form.subtitle}</Text>

        <RoleSelect onRoleChange={handlers.onRoleChange} selectedRole={state.role} />

        <CredentialFields
          email={state.email}
          feedbackText={feedbackText}
          onEmailChange={handlers.onEmailChange}
          onPasswordChange={handlers.onPasswordChange}
          onSubmit={handlers.onSubmit}
          password={state.password}
          status={state.status}
          variant="desktop"
        />

        <View style={styles.actions}>
          <View style={styles.rememberRow}>
            <Switch
              accessibilityLabel={loginCopy.form.rememberSession}
              onValueChange={handlers.onRememberSessionChange}
              thumbColor={loginColors.surfaceCard}
              trackColor={rememberSwitchTrackColor}
              value={state.rememberSession}
            />
            <Text style={styles.rememberText}>{loginCopy.form.rememberSession}</Text>
          </View>
          <Pressable accessibilityRole="link" focusable>
            <Text style={styles.linkText}>{loginCopy.form.forgotPassword}</Text>
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          focusable
          onPress={handlers.onSubmit}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>{loginCopy.form.submit}</Text>
        </Pressable>

        <View style={styles.supportRow}>
          <Text style={styles.supportMuted}>{loginCopy.form.supportQuestion}</Text>
          <Pressable accessibilityRole="link" focusable>
            <Text style={styles.linkText}> {loginCopy.form.supportLink}</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.contactText}>
        {loginCopy.form.contactPrefix}{' '}
        <Text style={styles.contactStrong}>{loginCopy.form.contactEmail}</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 26
  },
  card: {
    backgroundColor: loginColors.surfaceCard,
    borderColor: loginColors.surfaceBorder,
    borderRadius: 8,
    borderWidth: 1,
    maxWidth: 500,
    paddingHorizontal: 48,
    paddingVertical: 44,
    shadowColor: '#101114',
    shadowOffset: { height: 18, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    width: '100%'
  },
  contactStrong: {
    color: loginColors.textPrimary,
    fontWeight: '800'
  },
  contactText: {
    color: loginColors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 34
  },
  linkText: {
    color: loginColors.primary,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: loginColors.primary,
    borderRadius: 8,
    height: 52,
    justifyContent: 'center',
    marginTop: 28
  },
  primaryButtonText: {
    color: loginColors.surfaceCard,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: 0
  },
  rememberRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8
  },
  rememberText: {
    color: loginColors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0
  },
  subtitle: {
    color: loginColors.textSecondary,
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 25,
    marginBottom: 36
  },
  supportMuted: {
    color: loginColors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0
  },
  supportRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28
  },
  title: {
    color: loginColors.textPrimary,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 38,
    marginBottom: 12
  },
  wrap: {
    alignItems: 'center',
    width: '100%'
  }
});
