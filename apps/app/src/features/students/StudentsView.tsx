import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { dashboardColors as colors } from '@/features/admin-dashboard/tokens';
import { StudentEditor } from '@/features/students/components/StudentEditor';
import { StudentsTable } from '@/features/students/components/StudentsTable';
import type { Student } from '@/features/students/content';

type Props = { students: Student[]; onChange: (students: Student[]) => void };

export function StudentsView({ students, onChange }: Props) {
  const [editing, setEditing] = useState<Student>();
  const [feedback, setFeedback] = useState('');
  const total = students.length.toLocaleString('es-MX');

  const save = (updated: Student) => {
    onChange(students.map((student) => (student.id === updated.id ? updated : student)));
    setEditing(undefined);
    setFeedback(`Los datos de ${updated.name} se actualizaron.`);
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
        <StudentsTable students={students} onEdit={setEditing} />
        {students.length === 0 ? (
          <Text style={styles.empty}>No hay alumnos registrados.</Text>
        ) : null}
        <View style={styles.footer}>
          <Text style={styles.count}>
            Mostrando{' '}
            <Text style={styles.strong}>
              {students.length ? '1' : '0'}-{total}
            </Text>{' '}
            de <Text style={styles.strong}>{total}</Text> alumnos
          </Text>
        </View>
      </View>

      {editing ? (
        <StudentEditor
          key={editing.id}
          student={editing}
          students={students}
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
    justifyContent: 'center',
    backgroundColor: colors.surface
  },
  feedback: { color: colors.textSecondary, fontSize: 13, marginBottom: 16 },
  empty: { padding: 32, textAlign: 'center', color: colors.textSecondary, fontSize: 14 }
});
