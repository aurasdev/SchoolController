import { StyleSheet, Text, View } from 'react-native';

import { dashboardColors } from '@/features/admin-dashboard/tokens';

type DashboardLogoProps = {
  inverted?: boolean;
};

export function DashboardLogo({ inverted = false }: DashboardLogoProps) {
  return (
    <View style={[styles.logo, inverted ? styles.logoInverted : styles.logoDefault]}>
      <Text style={[styles.logoText, inverted ? styles.textInverted : styles.textDefault]}>S</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    borderRadius: 6,
    height: 30,
    justifyContent: 'center',
    width: 30
  },
  logoDefault: {
    backgroundColor: dashboardColors.primary
  },
  logoInverted: {
    backgroundColor: dashboardColors.primary
  },
  logoText: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0
  },
  textDefault: {
    color: dashboardColors.card
  },
  textInverted: {
    color: dashboardColors.card
  }
});
