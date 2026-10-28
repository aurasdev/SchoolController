import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { dashboardColors as colors } from '@/features/admin-dashboard/tokens';
import { classroomColors } from '@/features/classrooms/tokens';
import type { AcademicClass } from '@/features/classes/content';

type Props = { classes: AcademicClass[]; onEdit: (item: AcademicClass) => void };

const columns = [
  { label: 'CLASS NAME', flex: 2.1 },
  { label: 'DEPARTMENT', flex: 1.75 },
  { label: 'TEACHER', flex: 1.5 },
  { label: 'SCHEDULE', flex: 1.75 },
  { label: 'STUDENTS', flex: 0.85 },
  { label: 'STATUS', flex: 0.95 },
  { label: 'ACTIONS', flex: 0.8 }
];

export function ClassesTable({ classes, onEdit }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={styles.scroll}>
        <View role="table" accessibilityLabel="Classes" style={styles.table}>
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
          {classes.map((item, index) => (
            <View
              role="row"
              key={item.id}
              style={[styles.row, index < classes.length - 1 && styles.divider]}
            >
              <View role="cell" style={{ flex: columns[0].flex }}>
                <Text style={styles.text}>{item.name}</Text>
                <Text style={styles.secondary}>{item.group}</Text>
              </View>
              <Text role="cell" style={[styles.muted, { flex: columns[1].flex }]}>
                {item.department}
              </Text>
              <View role="cell" style={[styles.teacher, { flex: columns[2].flex }]}>
                <View style={styles.avatar}>
                  <Text style={styles.initials}>{item.initials}</Text>
                </View>
                <Text style={[styles.text, styles.teacherName]}>{item.teacher}</Text>
              </View>
              <View role="cell" style={{ flex: columns[3].flex }}>
                <Text style={styles.muted}>{item.schedule}</Text>
                <Text style={styles.secondary}>Aula {item.room}</Text>
              </View>
              <Text role="cell" style={[styles.text, { flex: columns[4].flex }]}>
                {item.students} students
              </Text>
              <View role="cell" style={{ flex: columns[5].flex }}>
                <View style={[styles.badge, item.status === 'Pending' && styles.pending]}>
                  <Text style={[styles.badgeText, item.status === 'Pending' && styles.pendingText]}>
                    {item.status}
                  </Text>
                </View>
              </View>
              <View role="cell" style={[styles.action, { flex: columns[6].flex }]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${item.name}`}
                  onPress={() => onEdit(item)}
                  style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
                >
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: colors.card
  },
  scroll: { flexGrow: 1 },
  table: { flex: 1, minWidth: 960 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    paddingHorizontal: 20,
    gap: 12
  },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  header: {
    minHeight: 40,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  headerText: { color: colors.textSecondary, fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  text: { color: colors.textPrimary, fontSize: 13, lineHeight: 20 },
  muted: { color: colors.textSecondary, fontSize: 13, lineHeight: 20 },
  secondary: { color: colors.textSecondary, fontSize: 11, lineHeight: 17 },
  teacher: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  teacherName: { flexShrink: 1 },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySubtle
  },
  initials: { color: colors.primary, fontSize: 10 },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: classroomColors.successSubtle
  },
  badgeText: { color: '#16743a', fontSize: 10, fontWeight: '500' },
  pending: { backgroundColor: colors.warningSubtle },
  pendingText: { color: '#925000' },
  action: { alignItems: 'flex-end' },
  editButton: { minHeight: 40, minWidth: 40, alignItems: 'flex-end', justifyContent: 'center' },
  editText: { color: colors.primary, fontSize: 13, fontWeight: '500' },
  right: { textAlign: 'right' },
  pressed: { opacity: 0.65 }
});
