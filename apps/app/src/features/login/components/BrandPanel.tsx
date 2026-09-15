import { StyleSheet, Text, View } from 'react-native';

import { loginCopy } from '@/features/login/content';
import { loginColors } from '@/features/login/tokens';

import { LogoMark } from '@/features/login/components/LogoMark';

export function BrandPanel() {
  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <LogoMark />
        <Text style={styles.institution}>{loginCopy.brand.institution}</Text>
      </View>

      <View style={styles.copy}>
        <Text style={styles.title}>{loginCopy.brand.title}</Text>
        <Text style={styles.subtitle}>{loginCopy.brand.subtitle}</Text>
        <Text style={styles.description}>{loginCopy.brand.description}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{loginCopy.brand.copyright}</Text>
        <Text style={styles.footerText}>{loginCopy.brand.version}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    maxWidth: 760
  },
  description: {
    color: '#d7e3ff',
    fontSize: 21,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 30,
    maxWidth: 800
  },
  footer: {
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.22)',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 28
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.58)',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16
  },
  institution: {
    color: loginColors.surfaceCard,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0
  },
  panel: {
    backgroundColor: loginColors.primary,
    flex: 1.12,
    justifyContent: 'space-between',
    paddingBottom: 74,
    paddingHorizontal: 84,
    paddingTop: 96
  },
  subtitle: {
    color: '#bdd2ff',
    fontSize: 28,
    fontWeight: '500',
    letterSpacing: 0,
    marginBottom: 32
  },
  title: {
    color: loginColors.surfaceCard,
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 64,
    marginBottom: 24
  }
});
