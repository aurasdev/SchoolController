import { SafeAreaView, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useCallback, useState } from 'react';

import { AdminScheduleView } from '@/features/admin-dashboard/components/AdminScheduleView';
import { DashboardCompactNav } from '@/features/admin-dashboard/components/DashboardCompactNav';
import { DashboardHeader } from '@/features/admin-dashboard/components/DashboardHeader';
import { DashboardOverview } from '@/features/admin-dashboard/components/DashboardOverview';
import { DashboardSidebar } from '@/features/admin-dashboard/components/DashboardSidebar';
import { dashboardBreakpoints, dashboardColors } from '@/features/admin-dashboard/tokens';
import type { DashboardSection } from '@/features/admin-dashboard/types';
import { ClassroomsView, useClassrooms } from '@/features/classrooms';
import type { AuthenticatedUser } from '@/features/login/types';

type AdminDashboardScreenProps = {
  onSignOut: () => void;
  user: AuthenticatedUser;
};

export function AdminDashboardScreen({ onSignOut, user }: AdminDashboardScreenProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < dashboardBreakpoints.compact;
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard');
  const classrooms = useClassrooms();

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
          />
        )}
        <View style={styles.mainArea}>
          <DashboardHeader isCompact={isCompact} onSignOut={onSignOut} user={user} />
          {isCompact ? (
            <DashboardCompactNav activeSection={activeSection} onNavigate={handleNavigate} />
          ) : null}
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {activeSection === 'schedule' ? <AdminScheduleView /> : null}
            {activeSection === 'classrooms' ? <ClassroomsView store={classrooms} /> : null}
            {activeSection !== 'schedule' && activeSection !== 'classrooms' ? (
              <DashboardOverview
                isCompact={isCompact}
                onConfigureSchedule={handleConfigureSchedule}
              />
            ) : null}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignSelf: 'center',
    maxWidth: 1232,
    padding: 24,
    width: '100%'
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
