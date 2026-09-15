import { StyleSheet, Text, TextInput, View } from 'react-native';

import { loginCopy } from '@/features/login/content';
import { loginColors } from '@/features/login/tokens';

type CredentialFieldsProps = {
  email: string;
  feedbackText: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  password: string;
  status: 'idle' | 'missingFields' | 'invalidCredentials' | 'success';
  variant: 'desktop' | 'mobile';
};

export function CredentialFields({
  email,
  feedbackText,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  password,
  status,
  variant
}: CredentialFieldsProps) {
  const isMobile = variant === 'mobile';
  const feedbackStyles = [
    isMobile ? styles.mobileFeedback : styles.desktopFeedback,
    (status === 'missingFields' || status === 'invalidCredentials') && styles.errorText,
    status === 'success' && styles.successText
  ];

  return (
    <View style={isMobile ? styles.mobileContainer : styles.desktopContainer}>
      <Text style={isMobile ? styles.mobileLabel : styles.desktopLabel}>
        {loginCopy.form.emailLabel}
      </Text>
      <TextInput
        accessibilityLabel={loginCopy.form.emailLabel}
        autoCapitalize="none"
        autoComplete="email"
        inputMode="email"
        onChangeText={onEmailChange}
        onSubmitEditing={onSubmit}
        placeholder={loginCopy.form.emailPlaceholder}
        placeholderTextColor={loginColors.textDisabled}
        returnKeyType="next"
        style={isMobile ? styles.mobileInput : styles.desktopInput}
        value={email}
      />
      <Text accessibilityLiveRegion="polite" style={feedbackStyles}>
        {feedbackText}
      </Text>

      <Text
        style={[
          isMobile ? styles.mobileLabel : styles.desktopLabel,
          isMobile ? styles.mobilePasswordLabel : styles.desktopPasswordLabel
        ]}
      >
        {loginCopy.form.passwordLabel}
      </Text>
      <TextInput
        accessibilityLabel={loginCopy.form.passwordLabel}
        autoCapitalize="none"
        onChangeText={onPasswordChange}
        onSubmitEditing={onSubmit}
        placeholder={loginCopy.form.passwordPlaceholder}
        placeholderTextColor={loginColors.textDisabled}
        returnKeyType="done"
        secureTextEntry
        style={isMobile ? styles.mobileInput : styles.desktopInput}
        value={password}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  desktopContainer: {
    marginTop: 24
  },
  desktopFeedback: {
    color: loginColors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 8
  },
  desktopInput: {
    borderColor: loginColors.surfaceBorder,
    borderRadius: 8,
    borderWidth: 1,
    color: loginColors.textPrimary,
    fontSize: 17,
    height: 52,
    letterSpacing: 0,
    paddingHorizontal: 14
  },
  desktopLabel: {
    color: loginColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 8
  },
  desktopPasswordLabel: {
    marginTop: 16
  },
  errorText: {
    color: loginColors.danger
  },
  mobileContainer: {
    width: '100%'
  },
  mobileFeedback: {
    color: loginColors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 22,
    marginTop: 8
  },
  mobileInput: {
    borderColor: loginColors.surfaceBorder,
    borderRadius: 8,
    borderWidth: 1,
    color: loginColors.textPrimary,
    fontSize: 18,
    height: 56,
    letterSpacing: 0,
    paddingHorizontal: 16,
    width: '100%'
  },
  mobileLabel: {
    color: loginColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 8
  },
  mobilePasswordLabel: {
    marginTop: 22
  },
  successText: {
    color: loginColors.success
  }
});
