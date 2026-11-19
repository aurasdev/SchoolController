import type { AcademicData, AcademicSubject } from '@school-controller/shared';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { dashboardColors } from '@/features/admin-dashboard/tokens';
import { SelectField } from '@/features/classrooms/components/SelectField';
import type { SelectOption } from '@/features/classrooms/types';

type SubjectTeachersPanelProps = {
  data: AcademicData;
  onSave: (subjectId: string, teacherIds: string[]) => Promise<void>;
};

const GENERAL = 'general';

export function SubjectTeachersPanel({ data, onSave }: SubjectTeachersPanelProps) {
  const [filter, setFilter] = useState(data.departments[0]?.id ?? GENERAL);
  const [editingId, setEditingId] = useState<string>();
  const [draft, setDraft] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const options = useMemo<SelectOption<string>[]>(
    () => [
      ...data.departments.map((department) => ({ label: department.name, value: department.id })),
      { label: 'Formación general', value: GENERAL }
    ],
    [data.departments]
  );
  const teacherNames = useMemo(
    () => new Map(data.teachers.map((teacher) => [teacher.id, teacher.name])),
    [data.teachers]
  );
  const subjects = useMemo(
    () =>
      data.subjects.filter((subject) =>
        filter === GENERAL ? subject.departmentId === null : subject.departmentId === filter
      ),
    [data.subjects, filter]
  );

  const summary = (subject: AcademicSubject) => {
    const [first] = subject.teacherIds;
    if (!first) return 'Cualquier docente de la carrera';
    if (subject.teacherIds.length === 1) return `Solo ${teacherNames.get(first) ?? 'un docente'}`;
    return `${subject.teacherIds.length} docentes habilitados`;
  };

  const candidates = (subject: AcademicSubject) =>
    data.teachers.filter(
      (teacher) =>
        (teacher.status === 'Activo' || subject.teacherIds.includes(teacher.id)) &&
        (!subject.departmentId || teacher.departmentId === subject.departmentId)
    );

  const edit = (subject: AcademicSubject) => {
    setError('');
    setEditingId(editingId === subject.id ? undefined : subject.id);
    setDraft(subject.teacherIds);
  };

  const toggle = (teacherId: string) =>
    setDraft((current) =>
      current.includes(teacherId)
        ? current.filter((value) => value !== teacherId)
        : [...current, teacherId]
    );

  const save = async (subjectId: string, teacherIds: string[]) => {
    setBusy(true);
    setError('');
    try {
      await onSave(subjectId, teacherIds);
      setEditingId(undefined);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudieron guardar los docentes.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.cardTitle}>Docentes por materia</Text>
        <Text style={styles.help}>
          Define quién puede impartir cada materia. Sin lista, cualquier docente de la carrera
          puede; con un solo docente, solo él; con varios, cualquiera de ellos, útil cuando la
          materia tiene grupos en paralelo.
        </Text>
      </View>
      <SelectField
        label="Carrera"
        onChange={(value) => {
          setEditingId(undefined);
          setFilter(value);
        }}
        options={options}
        style={styles.filter}
        value={filter}
      />
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.errorText}>
          {error}
        </Text>
      ) : null}
      {subjects.length === 0 ? (
        <Text style={styles.help}>No hay materias en esta carrera.</Text>
      ) : null}
      {subjects.map((subject) => {
        const open = editingId === subject.id;
        return (
          <View key={subject.id} style={styles.row}>
            <View style={styles.rowHeader}>
              <View style={styles.rowCopy}>
                <Text style={styles.subjectName}>
                  {subject.name} <Text style={styles.code}>{subject.code}</Text>
                </Text>
                <Text style={styles.help}>{summary(subject)}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: open }}
                focusable
                onPress={() => edit(subject)}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>{open ? 'Cerrar' : 'Editar'}</Text>
              </Pressable>
            </View>
            {open ? (
              <View style={styles.editor}>
                <View style={styles.chips}>
                  {candidates(subject).map((teacher) => {
                    const selected = draft.includes(teacher.id);
                    return (
                      <Pressable
                        key={teacher.id}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: selected }}
                        focusable
                        onPress={() => toggle(teacher.id)}
                        style={[styles.chip, selected && styles.chipSelected]}
                      >
                        <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                          {teacher.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    disabled={busy}
                    focusable
                    onPress={() => {
                      void save(subject.id, draft);
                    }}
                    style={[styles.primaryButton, busy && styles.disabled]}
                  >
                    <Text style={styles.primaryButtonText}>{busy ? 'Guardando…' : 'Guardar'}</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    disabled={busy}
                    focusable
                    onPress={() => setDraft([])}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>Abrir a cualquier docente</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: 20,
    padding: 24
  },
  cardTitle: { color: dashboardColors.textPrimary, fontSize: 18, fontWeight: '700' },
  chip: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  chipSelected: {
    backgroundColor: dashboardColors.primarySubtle,
    borderColor: dashboardColors.primary
  },
  chipText: { color: dashboardColors.textSecondary, fontSize: 14, fontWeight: '600' },
  chipTextSelected: { color: dashboardColors.primary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  code: { color: dashboardColors.textMuted, fontWeight: '400' },
  disabled: { opacity: 0.5 },
  editor: { gap: 16 },
  errorText: { color: '#e2252a', fontSize: 14, fontWeight: '600' },
  filter: { maxWidth: 360, zIndex: 2 },
  help: { color: dashboardColors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 2 },
  primaryButton: {
    backgroundColor: dashboardColors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  primaryButtonText: { color: dashboardColors.card, fontSize: 14, fontWeight: '700' },
  row: {
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 16
  },
  rowCopy: { flexShrink: 1 },
  rowHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between'
  },
  secondaryButton: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  secondaryButtonText: { color: dashboardColors.textPrimary, fontSize: 13, fontWeight: '600' },
  subjectName: { color: dashboardColors.textPrimary, fontSize: 15, fontWeight: '600' }
});
