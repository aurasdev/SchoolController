import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';
import { useCallback, useState } from 'react';

import { AdminScheduleView } from '@/features/admin-dashboard/components/AdminScheduleView';
import { DashboardCompactNav } from '@/features/admin-dashboard/components/DashboardCompactNav';
import { DashboardHeader } from '@/features/admin-dashboard/components/DashboardHeader';
import { DashboardOverview } from '@/features/admin-dashboard/components/DashboardOverview';
import { DashboardSidebar } from '@/features/admin-dashboard/components/DashboardSidebar';
import { dashboardBreakpoints, dashboardColors } from '@/features/admin-dashboard/tokens';
import type { DashboardSection } from '@/features/admin-dashboard/types';
import { ClassesView } from '@/features/classes/ClassesView';
import { ClassroomsView } from '@/features/classrooms';
import type { AuthenticatedUser } from '@/features/login/types';
import { StudentsView } from '@/features/students/StudentsView';
import { TeachersView } from '@/features/teachers/TeachersView';
import { useAcademicData } from '@/features/academic/useAcademicData';

type AdminDashboardScreenProps = {
  onSignOut: () => void;
  user: AuthenticatedUser;
};

export function AdminDashboardScreen({ onSignOut, user }: AdminDashboardScreenProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < dashboardBreakpoints.compact;
  const [activeSection, setActiveSection] = useState<DashboardSection>('dashboard');
  const academic = useAcademicData();
  const { data } = academic;

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
            periodName={data?.periods.find((period) => period.isActive)?.name}
          />
        )}
        <View style={styles.mainArea}>
          <DashboardHeader isCompact={isCompact} onSignOut={onSignOut} user={user} />
          {isCompact ? (
            <DashboardCompactNav activeSection={activeSection} onNavigate={handleNavigate} />
          ) : null}
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {academic.error ? (
              <View style={styles.errorBox}>
                <Text accessibilityRole="alert" style={styles.errorText}>
                  {academic.error}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  disabled={academic.loading}
                  onPress={() => {
                    void academic.refresh().catch(() => {});
                  }}
                  style={styles.retry}
                >
                  <Text style={styles.retryText}>Actualizar</Text>
                </Pressable>
              </View>
            ) : null}
            {!data && academic.loading ? (
              <View style={styles.loading}>
                <ActivityIndicator color={dashboardColors.primary} />
                <Text style={styles.loadingText}>Cargando información académica…</Text>
              </View>
            ) : null}
            {data && activeSection === 'schedule' ? (
              <AdminScheduleView data={data} onSave={academic.saveClass} />
            ) : null}
            {data && activeSection === 'classrooms' ? (
              <ClassroomsView
                store={{
                  classrooms: data.classrooms,
                  create: academic.createClassroom,
                  update: academic.updateClassroom,
                  toggleAvailability: academic.toggleClassroom
                }}
              />
            ) : null}
            {data && activeSection === 'classes' ? (
              <ClassesView
                data={data}
                onSave={academic.saveClass}
                onImport={academic.importClasses}
              />
            ) : null}
            {data && activeSection === 'students' ? (
              <StudentsView
                students={data.students}
                groups={data.groups}
                onSave={academic.saveStudent}
              />
            ) : null}
            {data && activeSection === 'teachers' ? (
              <TeachersView
                teachers={data.teachers}
                departments={data.departments}
                onSave={academic.saveTeacher}
              />
            ) : null}
            {data && activeSection === 'dashboard' ? (
              <DashboardOverview
                data={data}
                isCompact={isCompact}
                onConfigureSchedule={handleConfigureSchedule}
              />
            ) : null}
            {data && activeSection === 'settings' ? (
              <View style={styles.settings}>
                <Text accessibilityRole="header" style={styles.settingsTitle}>
                  Configuración académica
                </Text>
                <Text style={styles.loadingText}>Periodos registrados</Text>
                {data.periods.map((period) => (
                  <View key={period.id} style={styles.period}>
                    <Text style={styles.retryText}>
                      {period.name}
                      {period.isActive ? ' · Activo' : ''}
                    </Text>
                    <Text style={styles.loadingText}>
                      {period.startsOn.slice(0, 10)} — {period.endsOn.slice(0, 10)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorBox: { backgroundColor: '#fff2c7', borderRadius: 8, padding: 16, marginBottom: 20, gap: 12 },
  errorText: { color: '#925000', fontSize: 14 },
  retry: {
    alignSelf: 'flex-start',
    padding: 10,
    borderWidth: 1,
    borderColor: dashboardColors.border,
    borderRadius: 6,
    backgroundColor: dashboardColors.card
  },
  retryText: { color: dashboardColors.primary, fontSize: 14, fontWeight: '600' },
  loading: { alignItems: 'center', padding: 48, gap: 16 },
  loadingText: { color: dashboardColors.textSecondary, fontSize: 14 },
  settings: { gap: 16 },
  settingsTitle: { color: dashboardColors.textPrimary, fontSize: 24, fontWeight: '700' },
  period: {
    backgroundColor: dashboardColors.card,
    padding: 20,
    borderWidth: 1,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    gap: 10
  },
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
