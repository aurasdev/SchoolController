import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View
} from 'react-native';

import { BrandPanel } from '@/features/login/components/BrandPanel';
import { LoginCard } from '@/features/login/components/LoginCard';
import { MobileLoginForm } from '@/features/login/components/MobileLoginForm';
import { loginBreakpoints, loginColors } from '@/features/login/tokens';
import type { AuthenticatedUser } from '@/features/login/types';
import { useLoginForm } from '@/features/login/useLoginForm';

type LoginScreenProps = {
  onAuthenticated: (user: AuthenticatedUser) => void;
};

export function LoginScreen({ onAuthenticated }: LoginScreenProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= loginBreakpoints.desktop;
  const loginForm = useLoginForm({ onAuthenticated });

  if (isDesktop) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.desktopShell}>
          <BrandPanel />
          <View style={styles.desktopFormSide}>
            <LoginCard
              feedbackText={loginForm.feedbackText}
              handlers={loginForm.handlers}
              state={loginForm.state}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.mobileKeyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.mobileContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <MobileLoginForm
            feedbackText={loginForm.feedbackText}
            handlers={loginForm.handlers}
            state={loginForm.state}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  desktopFormSide: {
    alignItems: 'center',
    flex: 0.92,
    justifyContent: 'center',
    padding: 48
  },
  desktopShell: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 720
  },
  mobileContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 14,
    paddingHorizontal: 28,
    paddingTop: 64
  },
  mobileKeyboardView: {
    flex: 1
  },
  screen: {
    backgroundColor: loginColors.surfaceBg,
    flex: 1
  }
});
