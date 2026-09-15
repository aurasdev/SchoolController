import { SafeAreaView, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useCallback, useState } from 'react';

import { AdminScheduleView } from '@/features/admin-dashboard/components/AdminScheduleView';
import { DashboardHeader } from '@/features/admin-dashboard/components/DashboardHeader';
import { DashboardOverview } from '@/features/admin-dashboard/components/DashboardOverview';
import { DashboardSidebar } from '@/features/admin-dashboard/components/DashboardSidebar';
import { dashboardBreakpoints, dashboardColors } from '@/features/admin-dashboard/tokens';
import type { DashboardSection } from '@/features/admin-dashboard/types';
import type { AuthenticatedUser } from '@/features/login/types';

type AdminDashboardScreenProps = {
  onSignOut: () => void;
  user: AuthenticatedUser;
};

export function AdminDashboardScreen({ onSignOut, user }: AdminDashboardScreenProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < dashboardBreakpoints.compact;
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard');

  const handleNavigate = useCallback((section: DashboardSection) => {
    setActiveSection(section);
  }, []);

  const handleConfigureSchedule = useCallback(() => {
    setActiveSection('schedule');
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.shell}>
        {isCompact ? null : (
          <DashboardSidebar
            activeSection={activeSection}
            onNavigate={handleNavigate}
            onSignOut={onSignOut}
            variant={activeSection === 'schedule' ? 'light' : 'dark'}
          />
        )}
        <View style={styles.mainArea}>
          <DashboardHeader isCompact={isCompact} onSignOut={onSignOut} user={user} />
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {activeSection === 'schedule' ? (
              <AdminScheduleView />
            ) : (
              <DashboardOverview
                isCompact={isCompact}
                onConfigureSchedule={handleConfigureSchedule}
              />
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24
  },
  mainArea: {
    flex: 1
  },
  screen: {
    backgroundColor: dashboardColors.surface,
    flex: 1
  },
  shell: {
    flex: 1,
    flexDirection: 'row'
  }
});
