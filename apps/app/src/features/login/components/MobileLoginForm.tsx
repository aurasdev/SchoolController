import { Pressable, StyleSheet, Text, View } from 'react-native';

import { loginCopy } from '@/features/login/content';
import { loginColors } from '@/features/login/tokens';
import type { LoginFormHandlers, LoginFormState } from '@/features/login/types';

import { CredentialFields } from '@/features/login/components/CredentialFields';
import { LogoMark } from '@/features/login/components/LogoMark';

type MobileLoginFormProps = {
  feedbackText: string;
  handlers: LoginFormHandlers;
  state: LoginFormState;
};

export function MobileLoginForm({ feedbackText, handlers, state }: MobileLoginFormProps) {
  return (
    <>
      <View style={styles.main}>
        <LogoMark size="large" />
        <Text style={styles.title}>{loginCopy.brand.title}</Text>
        <Text style={styles.subtitle}>{loginCopy.form.mobileSubtitle}</Text>

        <View style={styles.form}>
          <CredentialFields
            email={state.email}
            feedbackText={feedbackText}
            onEmailChange={handlers.onEmailChange}
            onPasswordChange={handlers.onPasswordChange}
            onSubmit={handlers.onSubmit}
            password={state.password}
            status={state.status}
            variant="mobile"
          />

          <Pressable accessibilityRole="link" focusable style={styles.forgotButton}>
            <Text style={styles.linkText}>{loginCopy.form.forgotPassword}</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            focusable
            onPress={handlers.onSubmit}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>{loginCopy.form.submit}</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.footer}>{loginCopy.form.mobileFooter}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  footer: {
    color: loginColors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 42,
    textAlign: 'center'
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 22
  },
  form: {
    marginTop: 38,
    width: '100%'
  },
  linkText: {
    color: loginColors.primary,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0
  },
  main: {
    alignItems: 'center'
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: loginColors.primary,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    marginTop: 42,
    width: '100%'
  },
  primaryButtonText: {
    color: loginColors.surfaceCard,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0
  },
  subtitle: {
    color: loginColors.textSecondary,
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 24,
    marginTop: 6,
    textAlign: 'center'
  },
  title: {
    color: loginColors.textPrimary,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 38,
    marginTop: 26,
    textAlign: 'center'
  }
});
