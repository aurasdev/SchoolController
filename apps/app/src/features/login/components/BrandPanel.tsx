import { Platform, StyleSheet, Text, View } from 'react-native';

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
    marginTop: 94,
    maxWidth: 620
  },
  description: {
    color: '#d7e3ff',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0,
    lineHeight: 20,
    maxWidth: 610
  },
  footer: {
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.22)',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
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
    gap: 12
  },
  institution: {
    color: loginColors.surfaceCard,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0
  },
  panel: {
    backgroundColor: loginColors.primary,
    flex: 1.12,
    paddingBottom: 74,
    paddingHorizontal: 64,
    paddingTop: 80,
    ...(Platform.OS === 'web'
      ? ({
          backgroundImage: 'linear-gradient(135deg, #1E3A8A 41%, #131E38 100%)'
        } as Record<string, unknown>)
      : {})
  },
  subtitle: {
    color: '#bdd2ff',
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: 0,
    marginBottom: 22
  },
  title: {
    color: loginColors.surfaceCard,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 44,
    marginBottom: 8
  }
});
