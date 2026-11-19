import type { Department } from '@school-controller/shared';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { dashboardColors as colors } from '@/features/admin-dashboard/tokens';
import { SelectField } from '@/features/classrooms/components/SelectField';
import { TeacherEditor } from '@/features/teachers/components/TeacherEditor';
import { TeachersTable } from '@/features/teachers/components/TeachersTable';
import {
  type Teacher,
  type TeacherInput,
  type TeacherStatus,
  teacherStatusOptions
} from '@/features/teachers/content';

type Props = {
  teachers: Teacher[];
  departments: Department[];
  onSave: (input: TeacherInput, id?: string) => Promise<void>;
};
const pageSize = 6;

export function TeachersView({ teachers, departments, onSave }: Props) {
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState<TeacherStatus | ''>('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState<{ teacher?: Teacher }>();
  const [feedback, setFeedback] = useState('');
  const filtered = teachers.filter(
    (teacher) =>
      (!department || teacher.departmentId === department) &&
      (!status || teacher.status === status) &&
      (!activeOnly || teacher.status === 'Activo')
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const resetFilters = () => {
    setDepartment('');
    setStatus('');
    setActiveOnly(false);
    setPage(1);
  };
  const save = async (input: TeacherInput) => {
    await onSave(input, editor?.teacher?.id);
    if (editor?.teacher) {
      setFeedback('Los datos del docente se actualizaron.');
    } else {
      resetFilters();
      setFeedback('Docente registrado.');
    }
    setEditor(undefined);
  };
  return (
    <View>
      <View style={styles.heading}>
        <View style={styles.headingCopy}>
          <Text accessibilityRole="header" style={styles.title}>
            Gestión de Docentes
          </Text>
          <Text style={styles.subtitle}>Directorio de docentes del IEST Anáhuac</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => setEditor({})}
          style={({ pressed }) => [styles.newButton, pressed && styles.pressed]}
        >
          <Text style={styles.newText}>+ Nuevo Docente</Text>
        </Pressable>
      </View>

      <View style={styles.filters}>
        <SelectField
          label="Carrera / Depto"
          value={department}
          onChange={(value) => {
            setDepartment(value);
            setPage(1);
          }}
          options={[
            { label: 'Todas las carreras', value: '' },
            ...departments.map((item) => ({ label: item.name, value: item.id }))
          ]}
          style={styles.select}
        />
        <SelectField
          label="Estado laboral"
          value={status}
          onChange={(value) => {
            setStatus(value);
            if (value && value !== 'Activo') setActiveOnly(false);
            setPage(1);
          }}
          options={[{ label: 'Todos los estados', value: '' }, ...teacherStatusOptions]}
          style={styles.select}
        />
        <View style={styles.toggle}>
          <Switch
            accessibilityLabel="Ver solo activos"
            value={activeOnly}
            onValueChange={(value) => {
              setActiveOnly(value);
              if (value) setStatus('');
              setPage(1);
            }}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
          <Text style={styles.toggleLabel}>Ver solo activos</Text>
        </View>
      </View>

      <Text accessibilityLiveRegion="polite" style={styles.count}>
        Mostrando <Text style={styles.strong}>{filtered.length}</Text> docentes
      </Text>
      {feedback ? (
        <Text accessibilityLiveRegion="polite" style={styles.feedback}>
          {feedback}
        </Text>
      ) : null}
      <View style={styles.tableCard}>
        <TeachersTable
          teachers={filtered.slice(start, start + pageSize)}
          onEdit={(teacher) => setEditor({ teacher })}
        />
        {!filtered.length ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No se encontraron docentes</Text>
            <Text style={styles.subtitle}>Ajusta los filtros para ver otros resultados.</Text>
            <Pressable accessibilityRole="button" onPress={resetFilters} style={styles.pageButton}>
              <Text style={styles.pageText}>Limpiar filtros</Text>
            </Pressable>
          </View>
        ) : null}
        <View style={styles.footer}>
          <Text accessibilityLiveRegion="polite" style={styles.summary}>
            Mostrando{' '}
            <Text style={styles.strong}>
              {filtered.length ? start + 1 : 0}-{Math.min(start + pageSize, filtered.length)}
            </Text>{' '}
            de <Text style={styles.strong}>{filtered.length}</Text> docentes
          </Text>
          <View style={styles.pages}>
            <PageButton
              label="Anterior"
              disabled={currentPage <= 1}
              onPress={() => setPage(currentPage - 1)}
            />
            <PageButton
              label="Siguiente"
              disabled={currentPage >= pageCount}
              onPress={() => setPage(currentPage + 1)}
            />
          </View>
        </View>
      </View>
      {editor ? (
        <TeacherEditor
          teacher={editor.teacher}
          teachers={teachers}
          departments={departments}
          onClose={() => setEditor(undefined)}
          onSave={save}
        />
      ) : null}
    </View>
  );
}

function PageButton({
  label,
  disabled,
  onPress
}: {
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pageButton,
        disabled && styles.disabled,
        pressed && styles.pressed
      ]}
    >
      <Text style={styles.pageText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16
  },
  headingCopy: { flexGrow: 1 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '700', lineHeight: 32 },
  subtitle: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 4 },
  newButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    minHeight: 34,
    paddingHorizontal: 14,
    justifyContent: 'center'
  },
  newText: { color: colors.card, fontSize: 13, fontWeight: '500' },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
    marginTop: 24,
    zIndex: 2
  },
  select: { width: 210, flexShrink: 1, minWidth: 160 },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 },
  toggleLabel: { color: colors.textPrimary, fontSize: 12 },
  count: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginVertical: 22 },
  strong: { color: colors.textPrimary, fontWeight: '500' },
  tableCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden'
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface
  },
  summary: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
  pages: { flexDirection: 'row', gap: 8 },
  pageButton: {
    minHeight: 30,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: colors.card
  },
  pageText: { color: colors.textPrimary, fontSize: 12 },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.7 },
  feedback: { color: colors.textSecondary, fontSize: 13, marginBottom: 14 },
  empty: { alignItems: 'center', gap: 12, padding: 32 },
  emptyTitle: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' }
});
