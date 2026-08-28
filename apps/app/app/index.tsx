import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { apiUrl } from '@/config/env';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>School Controller</Text>
        <Text style={styles.title}>Base project ready</Text>
        <Text style={styles.description}>
          Expo, React Native, Expo Router and TypeScript are configured for Android, iOS and Web.
        </Text>
        <View style={styles.status}>
          <Text style={styles.statusLabel}>API</Text>
          <Text style={styles.statusValue}>{apiUrl}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  eyebrow: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 12,
    textTransform: 'uppercase'
  },
  title: {
    color: '#0f172a',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 42,
    marginBottom: 16
  },
  description: {
    color: '#475569',
    fontSize: 17,
    lineHeight: 25,
    maxWidth: 560
  },
  status: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderColor: '#dbe3ef',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 28,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  statusLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 4,
    textTransform: 'uppercase'
  },
  statusValue: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '600'
  }
});
