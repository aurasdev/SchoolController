import type { AcademicGroup, StudentInput } from '@school-controller/shared';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { dashboardColors as colors } from '@/features/admin-dashboard/tokens';
import { StudentEditor } from '@/features/students/components/StudentEditor';
import { StudentsTable } from '@/features/students/components/StudentsTable';
import type { Student } from '@/features/students/content';

type Props = {
  students: Student[];
  groups: AcademicGroup[];
  onSave: (input: StudentInput, id: string) => Promise<void>;
};
const pageSize = 25;

export function StudentsView({ students, groups, onSave }: Props) {
  const [editing, setEditing] = useState<Student>();
  const [feedback, setFeedback] = useState('');
  const [page, setPage] = useState(1);
  const total = students.length.toLocaleString('es-MX');
  const pageCount = Math.max(1, Math.ceil(students.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;

  const save = async (input: StudentInput) => {
    if (!editing) return;
    await onSave(input, editing.id);
    setEditing(undefined);
    setFeedback(`Los datos de ${input.name} se actualizaron.`);
  };

  return (
    <View style={styles.screen}>
      <Text accessibilityRole="header" style={styles.title}>
        Gestión de Alumnos
      </Text>
      <Text style={styles.subtitle}>Administra el directorio de alumnos del IEST Anáhuac</Text>

      <View style={styles.countRow}>
        <Text style={styles.count}>
          Mostrando <Text style={styles.strong}>{total}</Text> alumnos
        </Text>
      </View>
      {feedback ? (
        <Text accessibilityLiveRegion="polite" style={styles.feedback}>
          {feedback}
        </Text>
      ) : null}

      <View style={styles.tableCard}>
        <StudentsTable students={students.slice(start, start + pageSize)} onEdit={setEditing} />
        {students.length === 0 ? (
          <Text style={styles.empty}>No hay alumnos registrados.</Text>
        ) : null}
        <View style={styles.footer}>
          <Text style={styles.count}>
            Mostrando{' '}
            <Text style={styles.strong}>
              {students.length ? start + 1 : 0}-{Math.min(start + pageSize, students.length)}
            </Text>{' '}
            de <Text style={styles.strong}>{total}</Text> alumnos
          </Text>
          <View style={styles.pages}>
            <Pressable
              accessibilityRole="button"
              disabled={currentPage === 1}
              onPress={() => setPage(currentPage - 1)}
              style={[styles.pageButton, currentPage === 1 && styles.disabled]}
            >
              <Text style={styles.pageText}>Anterior</Text>
            </Pressable>
            <Text style={styles.count}>
              {currentPage} / {pageCount}
            </Text>
            <Pressable
              accessibilityRole="button"
              disabled={currentPage === pageCount}
              onPress={() => setPage(currentPage + 1)}
              style={[styles.pageButton, currentPage === pageCount && styles.disabled]}
            >
              <Text style={styles.pageText}>Siguiente</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {editing ? (
        <StudentEditor
          key={editing.id}
          student={editing}
          students={students}
          groups={groups}
          onClose={() => setEditing(undefined)}
          onSave={save}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 16, paddingBottom: 24 },
  title: { color: colors.textPrimary, fontSize: 24, lineHeight: 32, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 4 },
  countRow: { alignItems: 'flex-end', marginTop: 72, marginBottom: 56 },
  count: { color: colors.textSecondary, fontSize: 12, lineHeight: 20 },
  strong: { color: colors.textPrimary, fontWeight: '500' },
  tableCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.card
  },
  footer: {
    minHeight: 112,
    paddingHorizontal: 14,
    paddingVertical: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: colors.surface
  },
  pages: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pageButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 34,
    justifyContent: 'center'
  },
  pageText: { color: colors.textPrimary, fontSize: 12 },
  disabled: { opacity: 0.45 },
  feedback: { color: colors.textSecondary, fontSize: 13, marginBottom: 16 },
  empty: { padding: 32, textAlign: 'center', color: colors.textSecondary, fontSize: 14 }
});
