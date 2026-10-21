import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { loginColors } from '@/features/login/tokens';

type UnderDevelopmentScreenProps = {
  onSignOut: () => void;
};

export function UnderDevelopmentScreen({ onSignOut }: UnderDevelopmentScreenProps) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>En desarrollo...</Text>
        <Pressable accessibilityRole="button" onPress={onSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </Pressable>
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
  signOutButton: {
    backgroundColor: loginColors.primary,
    borderRadius: 8,
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  signOutText: {
    color: loginColors.surfaceCard,
    fontSize: 16,
    fontWeight: '800'
  },
  title: {
    color: loginColors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0
  }
});
