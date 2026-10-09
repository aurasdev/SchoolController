import { StyleSheet, Text, View } from 'react-native';

import { loginColors } from '@/features/login/tokens';

type LogoMarkProps = {
  size?: 'small' | 'large';
};

export function LogoMark({ size = 'small' }: LogoMarkProps) {
  const isLarge = size === 'large';

  return (
    <View
      accessibilityLabel="School Controller"
      style={[styles.logo, isLarge ? styles.logoLarge : styles.logoSmall]}
    >
      <Text style={[styles.logoText, isLarge ? styles.logoTextLarge : styles.logoTextSmall]}>
        S
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoLarge: {
    backgroundColor: loginColors.primary,
    borderRadius: 18,
    height: 78,
    width: 78
  },
  logoSmall: {
    backgroundColor: loginColors.surfaceCard,
    borderRadius: 6,
    height: 32,
    width: 32
  },
  logoText: {
    fontWeight: '900',
    letterSpacing: 0
  },
  logoTextLarge: {
    color: loginColors.surfaceCard,
    fontSize: 42
  },
  logoTextSmall: {
    color: loginColors.primary,
    fontSize: 19
  }
});
