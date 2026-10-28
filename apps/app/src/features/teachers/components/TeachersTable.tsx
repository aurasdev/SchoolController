import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { dashboardColors as colors } from '@/features/admin-dashboard/tokens';
import { classroomColors } from '@/features/classrooms/tokens';
import type { Teacher, TeacherStatus } from '@/features/teachers/content';

const statusColors: Record<TeacherStatus, { backgroundColor: string; color: string }> = {
  Activo: { backgroundColor: classroomColors.successSubtle, color: '#16743a' },
  Licencia: { backgroundColor: colors.warningSubtle, color: '#925000' },
  Inactivo: { backgroundColor: classroomColors.dangerSubtle, color: '#b42318' }
};
const columns = [
  { label: 'ID Empleado', flex: 1.1 },
  { label: 'Nombre', flex: 2.1 },
  { label: 'Carrera', flex: 1.4 },
  { label: 'Materias', flex: 1.2 },
  { label: 'Horas/Semana', flex: 1.1 },
  { label: 'Estado', flex: 1.1 },
  { label: 'Acciones', flex: 0.8 }
];

export function TeachersTable({
  teachers,
  onEdit
}: {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={styles.scroll}>
      <View role="table" accessibilityLabel="Directorio de docentes" style={styles.table}>
        <View role="row" style={[styles.row, styles.header]}>
          {columns.map((column, index) => (
            <Text
              role="columnheader"
              key={column.label}
              style={[styles.headerText, { flex: column.flex }, index === 6 && styles.right]}
            >
              {column.label}
            </Text>
          ))}
        </View>
        {teachers.map((teacher) => (
          <View role="row" key={teacher.id} style={styles.row}>
            <Text role="cell" style={[styles.text, styles.employeeId, { flex: columns[0].flex }]}>
              {teacher.employeeId}
            </Text>
            <Text role="cell" style={[styles.text, { flex: columns[1].flex }]}>
              {teacher.name}
            </Text>
            <Text role="cell" style={[styles.muted, { flex: columns[2].flex }]}>
              {teacher.department}
            </Text>
            <Text role="cell" style={[styles.muted, { flex: columns[3].flex }]}>
              {teacher.subjects} {teacher.subjects === 1 ? 'materia' : 'materias'}
            </Text>
            <Text role="cell" style={[styles.muted, { flex: columns[4].flex }]}>
              {teacher.weeklyHours}h
            </Text>
            <View role="cell" style={{ flex: columns[5].flex }}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: statusColors[teacher.status].backgroundColor }
                ]}
              >
                <Text style={[styles.badgeText, { color: statusColors[teacher.status].color }]}>
                  {teacher.status}
                </Text>
              </View>
            </View>
            <View role="cell" style={[styles.action, { flex: columns[6].flex }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Editar a ${teacher.name}`}
                onPress={() => onEdit(teacher)}
                style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
              >
                <Text style={styles.editText}>Editar</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  table: { flex: 1, minWidth: 980, backgroundColor: colors.card },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  header: { minHeight: 40, backgroundColor: colors.surface },
  headerText: { color: colors.textSecondary, fontSize: 11, fontWeight: '600', lineHeight: 16 },
  text: { color: colors.textPrimary, fontSize: 13, lineHeight: 20 },
  employeeId: { fontWeight: '500' },
  muted: { color: colors.textSecondary, fontSize: 13, lineHeight: 20 },
  right: { textAlign: 'right' },
  action: { alignItems: 'flex-end' },
  badge: { alignSelf: 'flex-start', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: '500', lineHeight: 14 },
  editButton: { minHeight: 44, minWidth: 44, alignItems: 'flex-end', justifyContent: 'center' },
  editText: { color: colors.primary, fontSize: 13, fontWeight: '500' },
  pressed: { opacity: 0.65 }
});
