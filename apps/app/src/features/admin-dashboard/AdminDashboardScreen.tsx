import { SafeAreaView, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useCallback, useState } from 'react';

import { AdminScheduleView } from '@/features/admin-dashboard/components/AdminScheduleView';
import { DashboardCompactNav } from '@/features/admin-dashboard/components/DashboardCompactNav';
import { DashboardHeader } from '@/features/admin-dashboard/components/DashboardHeader';
import { DashboardOverview } from '@/features/admin-dashboard/components/DashboardOverview';
import { DashboardSidebar } from '@/features/admin-dashboard/components/DashboardSidebar';
import { dashboardBreakpoints, dashboardColors } from '@/features/admin-dashboard/tokens';
import type { DashboardSection } from '@/features/admin-dashboard/types';
import { ClassesView } from '@/features/classes/ClassesView';
import { initialClasses } from '@/features/classes/content';
import { ClassroomsView, useClassrooms } from '@/features/classrooms';
import type { AuthenticatedUser } from '@/features/login/types';
import { StudentsView } from '@/features/students/StudentsView';
import { initialStudents } from '@/features/students/content';
import { TeachersView } from '@/features/teachers/TeachersView';
import { initialTeachers } from '@/features/teachers/content';

type AdminDashboardScreenProps = {
  onSignOut: () => void;
  user: AuthenticatedUser;
};

export function AdminDashboardScreen({ onSignOut, user }: AdminDashboardScreenProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < dashboardBreakpoints.compact;
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard');
  const classrooms = useClassrooms();
  const [classes, setClasses] = useState(initialClasses);
  const [students, setStudents] = useState(initialStudents);
  const [teachers, setTeachers] = useState(initialTeachers);

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
            {activeSection === 'classes' ? (
              <ClassesView classes={classes} onChange={setClasses} />
            ) : null}
            {activeSection === 'students' ? (
              <StudentsView students={students} onChange={setStudents} />
            ) : null}
            {activeSection === 'teachers' ? (
              <TeachersView teachers={teachers} onChange={setTeachers} />
            ) : null}
            {activeSection !== 'schedule' &&
            activeSection !== 'classrooms' &&
            activeSection !== 'classes' &&
            activeSection !== 'students' &&
            activeSection !== 'teachers' ? (
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
