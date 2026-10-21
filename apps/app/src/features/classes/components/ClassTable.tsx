import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { teachers } from '@/features/classes/content';
import { classColors, classTableMinWidth } from '@/features/classes/tokens';
import type { AcademicClass } from '@/features/classes/types';

type ClassTableProps = {
  classes: AcademicClass[];
  onEdit: (id: string) => void;
};

export function ClassStatusBadge({ status }: { status: AcademicClass['status'] }) {
  const pending = status === 'pending';
  return (
    <View style={[styles.badge, pending && styles.pendingBadge]}>
      <Text style={[styles.badgeText, pending && styles.pendingText]}>
        {pending ? 'Pending' : 'Active'}
      </Text>
    </View>
  );
}

function Teacher({ teacherId }: { teacherId: string }) {
  const teacher = teachers.find((item) => item.id === teacherId);
  return (
    <View style={styles.teacher}>
      <View accessibilityElementsHidden style={styles.avatar}>
        <Text style={styles.initials}>{teacher?.initials ?? '?'}</Text>
      </View>
      <Text numberOfLines={1} style={[styles.cell, styles.teacherName]}>
        {teacher?.name ?? 'Unassigned'}
      </Text>
    </View>
  );
}

function ClassRow({ item, onEdit }: { item: AcademicClass; onEdit: (id: string) => void }) {
  return (
    <View role="row" style={styles.row}>
      <Text role="cell" style={[styles.cell, styles.nameColumn]}>
        {item.name}
      </Text>
      <Text role="cell" style={[styles.secondaryCell, styles.departmentColumn]}>
        {item.department}
      </Text>
      <View role="cell" style={styles.teacherColumn}>
        <Teacher teacherId={item.teacherId} />
      </View>
      <Text role="cell" style={[styles.secondaryCell, styles.scheduleColumn]}>
        {item.schedule}
      </Text>
      <Text role="cell" style={[styles.cell, styles.studentsColumn]}>
        {item.students} students
      </Text>
      <View role="cell" style={styles.statusColumn}>
        <ClassStatusBadge status={item.status} />
      </View>
      <View role="cell" style={styles.actionsColumn}>
        <Pressable
          accessibilityLabel={`Edit ${item.name}`}
          accessibilityRole="button"
          focusable
          hitSlop={8}
          onPress={() => onEdit(item.id)}
          style={styles.editButton}
        >
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function ClassTable({ classes, onEdit }: ClassTableProps) {
  return (
    <View style={styles.card}>
      <ScrollView horizontal contentContainerStyle={styles.scrollContent}>
        <View accessibilityLabel="Classes" role="table" style={styles.table}>
          <View role="row" style={[styles.row, styles.headerRow]}>
            <Text role="columnheader" style={[styles.headerCell, styles.nameColumn]}>
              CLASS NAME
            </Text>
            <Text role="columnheader" style={[styles.headerCell, styles.departmentColumn]}>
              DEPARTMENT
            </Text>
            <Text role="columnheader" style={[styles.headerCell, styles.teacherColumn]}>
              TEACHER
            </Text>
            <Text role="columnheader" style={[styles.headerCell, styles.scheduleColumn]}>
              SCHEDULE
            </Text>
            <Text role="columnheader" style={[styles.headerCell, styles.studentsColumn]}>
              STUDENTS
            </Text>
            <Text role="columnheader" style={[styles.headerCell, styles.statusColumn]}>
              STATUS
            </Text>
            <Text
              role="columnheader"
              style={[styles.headerCell, styles.actionsColumn, styles.actionsHeader]}
            >
              ACTIONS
            </Text>
          </View>
          {classes.map((item) => (
            <ClassRow item={item} key={item.id} onEdit={onEdit} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export function ClassCards({ classes, onEdit }: ClassTableProps) {
  return (
    <View style={styles.cards}>
      {classes.map((item) => (
        <View key={item.id} style={styles.mobileCard}>
          <View style={styles.cardHeading}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <ClassStatusBadge status={item.status} />
          </View>
          <Text style={styles.secondaryCell}>{item.department}</Text>
          <Teacher teacherId={item.teacherId} />
          <View style={styles.cardHeading}>
            <View style={styles.cardSchedule}>
              <Text style={styles.secondaryCell}>{item.schedule}</Text>
              <Text style={styles.cell}>{item.students} students</Text>
            </View>
            <Pressable
              accessibilityLabel={`Edit ${item.name}`}
              accessibilityRole="button"
              focusable
              onPress={() => onEdit(item.id)}
              style={styles.editButton}
            >
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  actionsColumn: { flex: 0.65 },
  actionsHeader: { textAlign: 'right' },
  avatar: {
    alignItems: 'center',
    backgroundColor: classColors.avatarBackground,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: classColors.activeBackground,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3
  },
  badgeText: { color: classColors.active, fontSize: 11, lineHeight: 14 },
  card: {
    backgroundColor: classColors.card,
    borderColor: classColors.border,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden'
  },
  cardHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between'
  },
  cards: { gap: 12 },
  cardSchedule: { flex: 1, gap: 4 },
  cardTitle: { color: classColors.textPrimary, flex: 1, fontSize: 16, fontWeight: '600' },
  cell: { color: classColors.textPrimary, fontSize: 14, lineHeight: 20 },
  departmentColumn: { flex: 1.85 },
  editButton: {
    alignSelf: 'flex-end',
    minHeight: 32,
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  editText: { color: classColors.primary, fontSize: 13, lineHeight: 20 },
  headerCell: {
    color: classColors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6
  },
  headerRow: { backgroundColor: '#fafafa', minHeight: 42 },
  initials: { color: classColors.primary, fontSize: 11 },
  mobileCard: {
    backgroundColor: classColors.card,
    borderColor: classColors.border,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
    padding: 16
  },
  nameColumn: { flex: 2.2 },
  pendingBadge: { backgroundColor: classColors.pendingBackground },
  pendingText: { color: classColors.pending },
  row: {
    alignItems: 'center',
    borderBottomColor: classColors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    minHeight: 64,
    paddingHorizontal: 22,
    paddingVertical: 10
  },
  scheduleColumn: { flex: 1.85 },
  scrollContent: { flexGrow: 1 },
  secondaryCell: { color: classColors.textSecondary, fontSize: 14, lineHeight: 20 },
  statusColumn: { flex: 1.1 },
  studentsColumn: { flex: 1 },
  table: { flex: 1, minWidth: classTableMinWidth },
  teacher: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  teacherName: { flexShrink: 1 },
  teacherColumn: { flex: 1.55 }
});
