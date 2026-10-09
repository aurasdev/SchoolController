import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';

import { loginColors } from '@/features/login/tokens';

export function SessionLoadingScreen() {
  return (
    <SafeAreaView accessibilityLabel="Restoring session" style={styles.screen}>
      <ActivityIndicator color={loginColors.primary} size="large" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: loginColors.surfaceBg,
    flex: 1,
    justifyContent: 'center'
  }
});
