import type { AcademicData } from '@school-controller/shared';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useWindowDimensions,
  View
} from 'react-native';

import { dashboardColors as colors } from '@/features/admin-dashboard/tokens';
import { SelectField } from '@/features/classrooms/components/SelectField';
import { ClassEditor } from '@/features/classes/components/ClassEditor';
import { ClassesTable } from '@/features/classes/components/ClassesTable';
import { CsvImport } from '@/features/classes/components/CsvImport';
import type { AcademicClass, ClassInput } from '@/features/classes/content';

type Props = {
  data: AcademicData;
  onSave: (input: ClassInput, id?: string) => Promise<void>;
  onImport: (items: ClassInput[]) => Promise<void>;
};
type Tab = 'All Classes' | 'Active' | 'Pending';
type Editor = { kind: 'create' } | { kind: 'edit'; item: AcademicClass } | { kind: 'import' };
const pageSize = 8;
const tabs: Tab[] = ['All Classes', 'Active', 'Pending'];

export function ClassesView({ data, onSave, onImport }: Props) {
  const { classes } = data;
  const { width } = useWindowDimensions();
  const compact = width < 1100;
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [teacher, setTeacher] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [tab, setTab] = useState<Tab>('All Classes');
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState<Editor>();
  const [feedback, setFeedback] = useState('');

  const filtered = classes.filter(
    (item) =>
      item.name.toLowerCase().includes(query.trim().toLowerCase()) &&
      (!department ||
        data.subjects.find((subject) => subject.id === item.subjectId)?.departmentId ===
          department) &&
      (!teacher || item.teacherId === teacher) &&
      (!activeOnly || item.status === 'Active') &&
      (tab === 'All Classes' || item.status === tab)
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const visibleClasses = filtered.slice(start, start + pageSize);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (value) =>
      value === 1 ||
      value === pageCount ||
      Math.abs(value - currentPage) <= 1 ||
      (currentPage === 1 && value === 3)
  );
  const resetFilters = () => {
    setQuery('');
    setDepartment('');
    setTeacher('');
    setActiveOnly(false);
    setTab('All Classes');
    setPage(1);
  };
  const save = async (input: ClassInput) => {
    await onSave(input, editor?.kind === 'edit' ? editor.item.id : undefined);
    if (editor?.kind === 'edit') {
      setFeedback('Class updated.');
    } else {
      resetFilters();
      setFeedback('Class added.');
    }
    setEditor(undefined);
  };
  const importClasses = async (items: ClassInput[]) => {
    await onImport(items);
    resetFilters();
    setFeedback(`${items.length} classes imported.`);
    setEditor(undefined);
  };

  return (
    <View>
      <View style={[styles.heading, compact && styles.compactHeading]}>
        <View style={styles.headingCopy}>
          <Text accessibilityRole="header" style={styles.title}>
            Class Management
          </Text>
          <Text style={styles.subtitle}>
            Manage all classes across departments and assign academic resources
          </Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setEditor({ kind: 'import' })}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.buttonText}>Import CSV</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setEditor({ kind: 'create' })}
            style={({ pressed }) => [
              styles.button,
              styles.primaryButton,
              pressed && styles.pressed
            ]}
          >
            <Text style={styles.primaryText}>Add New Class</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.filters}>
        <View style={[styles.searchField, compact && styles.compactSearch]}>
          <Text style={styles.label}>Search</Text>
          <TextInput
            accessibilityLabel="Search classes"
            value={query}
            onChangeText={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="Search classes..."
            placeholderTextColor={colors.textSecondary}
            style={styles.searchInput}
          />
        </View>
        <SelectField
          label="Department"
          value={department}
          onChange={(value) => {
            setDepartment(value);
            setPage(1);
          }}
          options={[
            { label: 'All Departments', value: '' },
            ...data.departments.map((item) => ({ label: item.name, value: item.id }))
          ]}
          style={styles.select}
        />
        <SelectField
          label="Teacher"
          value={teacher}
          onChange={(value) => {
            setTeacher(value);
            setPage(1);
          }}
          options={[
            { label: 'All Teachers', value: '' },
            ...data.teachers.map((item) => ({ label: item.name, value: item.id }))
          ]}
          style={styles.select}
        />
        <View style={styles.switchField}>
          <Text style={styles.label}>Active only</Text>
          <Switch
            accessibilityLabel="Active only"
            value={activeOnly}
            onValueChange={(value) => {
              setActiveOnly(value);
              if (value && tab === 'Pending') setTab('All Classes');
              setPage(1);
            }}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
      </View>

      <View role="tablist" accessibilityLabel="Class status" style={styles.tabs}>
        {tabs.map((value) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === value }}
            key={value}
            onPress={() => {
              setTab(value);
              if (value === 'Pending') setActiveOnly(false);
              setPage(1);
            }}
            style={[styles.tab, tab === value && styles.selectedTab]}
          >
            <Text style={[styles.tabText, tab === value && styles.selectedText]}>{value}</Text>
            {value === 'All Classes' ? (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{classes.length}</Text>
              </View>
            ) : null}
          </Pressable>
        ))}
      </View>

      {feedback ? (
        <Text accessibilityLiveRegion="polite" style={styles.feedback}>
          {feedback}
        </Text>
      ) : null}
      {filtered.length ? (
        <ClassesTable
          classes={visibleClasses}
          onEdit={(item) => setEditor({ kind: 'edit', item })}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No classes found</Text>
          <Text style={styles.subtitle}>Try another search or adjust your filters.</Text>
          <Pressable accessibilityRole="button" onPress={resetFilters} style={styles.button}>
            <Text style={styles.buttonText}>Clear filters</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.footer}>
        <Text accessibilityLiveRegion="polite" style={styles.summary}>
          Showing {filtered.length ? start + 1 : 0}-{Math.min(start + pageSize, filtered.length)} of{' '}
          {filtered.length} classes
        </Text>
        <View accessibilityLabel="Class pages" style={styles.pages}>
          <PageButton
            label="Prev"
            disabled={currentPage === 1}
            onPress={() => setPage(currentPage - 1)}
          />
          {pages.map((value, index) => (
            <View key={value} style={styles.pages}>
              {index > 0 && value - pages[index - 1] > 1 ? (
                <Text style={styles.summary}>…</Text>
              ) : null}
              <PageButton
                label={String(value)}
                selected={value === currentPage}
                onPress={() => setPage(value)}
              />
            </View>
          ))}
          <PageButton
            label="Next"
            disabled={currentPage === pageCount}
            onPress={() => setPage(currentPage + 1)}
          />
        </View>
      </View>
      {editor?.kind === 'create' || editor?.kind === 'edit' ? (
        <ClassEditor
          data={data}
          item={editor.kind === 'edit' ? editor.item : undefined}
          onClose={() => setEditor(undefined)}
          onSave={save}
        />
      ) : null}
      {editor?.kind === 'import' ? (
        <CsvImport data={data} onClose={() => setEditor(undefined)} onImport={importClasses} />
      ) : null}
    </View>
  );
}

function PageButton({
  label,
  selected = false,
  disabled = false,
  onPress
}: {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={/^\d+$/.test(label) ? `Page ${label}` : label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pageButton,
        selected && styles.primaryButton,
        disabled && styles.disabled,
        pressed && styles.pressed
      ]}
    >
      <Text style={[styles.pageText, selected && styles.primaryText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 20 },
  headingCopy: { flex: 1 },
  compactHeading: { flexDirection: 'column', alignItems: 'flex-start' },
  title: { color: colors.textPrimary, fontSize: 24, lineHeight: 32, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  button: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: { color: colors.textPrimary, fontSize: 13, fontWeight: '500' },
  primaryButton: { backgroundColor: colors.primary, borderColor: colors.primary },
  primaryText: { color: colors.card, fontSize: 13, fontWeight: '500' },
  filters: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    gap: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    marginTop: 24,
    zIndex: 2
  },
  searchField: { flex: 1, minWidth: 200 },
  compactSearch: { flexBasis: '100%' },
  label: { color: colors.textPrimary, fontSize: 13, lineHeight: 16, marginBottom: 8 },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: colors.textPrimary,
    fontSize: 15
  },
  select: { flexGrow: 1, flexBasis: 165 },
  switchField: { minHeight: 68, justifyContent: 'center', alignItems: 'flex-start' },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 24,
    marginTop: 22,
    marginBottom: 22
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 46,
    paddingHorizontal: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent'
  },
  selectedTab: { borderBottomColor: colors.primary },
  tabText: { color: colors.textSecondary, fontSize: 14 },
  selectedText: { color: colors.primary, fontWeight: '600' },
  countBadge: { backgroundColor: colors.primarySubtle, paddingHorizontal: 5, borderRadius: 5 },
  countText: { color: colors.primary, fontSize: 11, fontWeight: '600' },
  footer: {
    marginTop: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16
  },
  summary: { color: colors.textSecondary, fontSize: 13 },
  pages: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pageButton: {
    minHeight: 30,
    minWidth: 30,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pageText: { color: colors.textPrimary, fontSize: 12 },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.7 },
  feedback: { color: colors.textSecondary, fontSize: 13, marginBottom: 14 },
  empty: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 36,
    alignItems: 'center',
    gap: 12
  },
  emptyTitle: { color: colors.textPrimary, fontSize: 18, fontWeight: '600' }
});
