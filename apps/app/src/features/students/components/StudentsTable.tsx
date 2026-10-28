import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { dashboardColors as colors } from '@/features/admin-dashboard/tokens';
import type { Student } from '@/features/students/content';

type Props = { students: Student[]; onEdit: (student: Student) => void };

const columns = [
  { label: 'Matrícula', flex: 1.2 },
  { label: 'Nombre', flex: 2.5 },
  { label: 'Carrera', flex: 1.8 },
  { label: 'Semestre', flex: 1 },
  { label: 'Grupo', flex: 1 },
  { label: 'Estado', flex: 1.3 },
  { label: 'Acciones', flex: 1 }
];

export function StudentsTable({ students, onEdit }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={styles.scroll}>
      <View role="table" accessibilityLabel="Directorio de alumnos" style={styles.table}>
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
        {students.map((student) => (
          <View role="row" key={student.id} style={styles.row}>
            <Text role="cell" style={[styles.text, { flex: columns[0].flex }]}>
              {student.enrollment}
            </Text>
            <Text role="cell" style={[styles.text, { flex: columns[1].flex }]}>
              {student.name}
            </Text>
            <Text role="cell" style={[styles.muted, { flex: columns[2].flex }]}>
              {student.degree}
            </Text>
            <Text role="cell" style={[styles.muted, { flex: columns[3].flex }]}>
              {student.semester}°
            </Text>
            <Text role="cell" style={[styles.muted, { flex: columns[4].flex }]}>
              {student.group}
            </Text>
            <Text
              role="cell"
              accessibilityLabel={student.status ?? 'Sin definir'}
              style={[styles.muted, { flex: columns[5].flex }]}
            >
              {student.status ?? ''}
            </Text>
            <View role="cell" style={[styles.action, { flex: columns[6].flex }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Editar a ${student.name}`}
                onPress={() => onEdit(student)}
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
  table: { flex: 1, minWidth: 900, backgroundColor: colors.card },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 112,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  header: { minHeight: 38, backgroundColor: colors.surface },
  headerText: { color: colors.textSecondary, fontSize: 11, lineHeight: 16, fontWeight: '600' },
  text: { color: colors.textPrimary, fontSize: 13, lineHeight: 20 },
  muted: { color: colors.textSecondary, fontSize: 13, lineHeight: 20 },
  right: { textAlign: 'right' },
  action: { alignItems: 'flex-end' },
  editButton: { minHeight: 44, minWidth: 44, alignItems: 'flex-end', justifyContent: 'center' },
  editText: { color: colors.primary, fontSize: 13, fontWeight: '500' },
  pressed: { opacity: 0.65 }
});
