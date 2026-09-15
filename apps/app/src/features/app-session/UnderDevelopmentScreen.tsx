import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { loginColors } from '@/features/login/tokens';

export function UnderDevelopmentScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>En desarrollo...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  screen: {
    backgroundColor: loginColors.surfaceBg,
    flex: 1
  },
  title: {
    color: loginColors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0
  }
});
