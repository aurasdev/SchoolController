import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { emptyClassFilters, filterClasses, paginateClasses } from '@/features/classes/classFilters';
import { ClassFiltersBar } from '@/features/classes/components/ClassFiltersBar';
import { ClassForm } from '@/features/classes/components/ClassForm';
import { ClassImport } from '@/features/classes/components/ClassImport';
import { ClassPagination } from '@/features/classes/components/ClassPagination';
import { ClassCards, ClassTable } from '@/features/classes/components/ClassTable';
import { classColors } from '@/features/classes/tokens';
import type { ClassFilters, ClassInput } from '@/features/classes/types';
import type { ClassesStore } from '@/features/classes/useClasses';

type ClassesRoute = { name: 'list' | 'create' | 'import' } | { name: 'edit'; id: string };
const tabs: { id: ClassFilters['tab']; label: string }[] = [
  { id: 'all', label: 'All Classes' },
  { id: 'active', label: 'Active' },
  { id: 'pending', label: 'Pending' }
];

type ClassesViewProps = {
  onViewChange: () => void;
  store: ClassesStore;
};

export function ClassesView({ onViewChange, store }: ClassesViewProps) {
  const { classes, create, update, importClasses } = store;
  const { width } = useWindowDimensions();
  const [route, setRoute] = useState<ClassesRoute>({ name: 'list' });
  const [filters, setFilters] = useState<ClassFilters>(emptyClassFilters);
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState('');
  const filtered = useMemo(() => filterClasses(classes, filters), [classes, filters]);
  const pagination = paginateClasses(filtered, page);

  function navigate(next: ClassesRoute) {
    setRoute(next);
    onViewChange();
  }

  function handleFiltersChange(next: ClassFilters) {
    setFilters(next);
    setPage(1);
  }

  function handleEdit(id: string) {
    setNotice('');
    navigate({ name: 'edit', id });
  }

  function handleSave(input: ClassInput) {
    if (route.name === 'edit') {
      update(route.id, input);
      setNotice(`${input.name} updated.`);
    } else {
      create(input);
      setNotice(`${input.name} added.`);
      handleFiltersChange(emptyClassFilters);
    }
    navigate({ name: 'list' });
  }

  function handleImport(inputs: ClassInput[]) {
    const count = importClasses(inputs);
    setNotice(`${count} ${count === 1 ? 'class' : 'classes'} imported.`);
    handleFiltersChange(emptyClassFilters);
    navigate({ name: 'list' });
  }

  if (route.name === 'import') {
    return <ClassImport onCancel={() => navigate({ name: 'list' })} onImport={handleImport} />;
  }
  if (route.name === 'create' || route.name === 'edit') {
    const classItem =
      route.name === 'edit' ? classes.find((item) => item.id === route.id) : undefined;
    return (
      <ClassForm
        classItem={classItem}
        key={classItem?.id ?? 'create'}
        onCancel={() => navigate({ name: 'list' })}
        onSubmit={handleSave}
      />
    );
  }

  return (
    <View>
      <View style={styles.heading}>
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
            focusable
            onPress={() => {
              setNotice('');
              navigate({ name: 'import' });
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Import CSV</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            focusable
            onPress={() => {
              setNotice('');
              navigate({ name: 'create' });
            }}
            style={[styles.button, styles.primaryButton]}
          >
            <Text style={styles.primaryButtonText}>Add New Class</Text>
          </Pressable>
        </View>
      </View>

      {notice ? (
        <Text accessibilityLiveRegion="polite" style={styles.notice}>
          {notice}
        </Text>
      ) : null}
      <ClassFiltersBar filters={filters} onChange={handleFiltersChange} />

      <View accessibilityLabel="Class status" accessibilityRole="tablist" style={styles.tabs}>
        {tabs.map((tab) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: filters.tab === tab.id }}
            focusable
            key={tab.id}
            onPress={() =>
              handleFiltersChange({
                ...filters,
                tab: tab.id,
                activeOnly: tab.id === 'pending' ? false : filters.activeOnly
              })
            }
            style={[styles.tab, filters.tab === tab.id && styles.selectedTab]}
          >
            <Text style={[styles.tabText, filters.tab === tab.id && styles.selectedTabText]}>
              {tab.label}
            </Text>
            {tab.id === 'all' ? (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{classes.length}</Text>
              </View>
            ) : null}
          </Pressable>
        ))}
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No classes found</Text>
          <Text style={styles.subtitle}>Try another search or adjust your filters.</Text>
          <Pressable
            accessibilityRole="button"
            focusable
            onPress={() => handleFiltersChange(emptyClassFilters)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Clear filters</Text>
          </Pressable>
        </View>
      ) : width < 720 ? (
        <ClassCards classes={pagination.items} onEdit={handleEdit} />
      ) : (
        <ClassTable classes={pagination.items} onEdit={handleEdit} />
      )}
      <ClassPagination
        from={pagination.from}
        onPageChange={setPage}
        page={pagination.page}
        pageCount={pagination.pageCount}
        to={pagination.to}
        total={pagination.total}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  button: {
    backgroundColor: classColors.card,
    borderColor: classColors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  buttonText: { color: classColors.textPrimary, fontSize: 14, lineHeight: 20 },
  countBadge: {
    backgroundColor: classColors.primarySubtle,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1
  },
  countText: { color: classColors.primary, fontSize: 11, fontWeight: '600' },
  empty: {
    alignItems: 'center',
    backgroundColor: classColors.card,
    borderColor: classColors.border,
    borderRadius: 10,
    borderWidth: 1,
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 48
  },
  emptyTitle: { color: classColors.textPrimary, fontSize: 18, fontWeight: '600' },
  heading: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between'
  },
  headingCopy: { flexGrow: 1, flexShrink: 1 },
  notice: {
    backgroundColor: classColors.activeBackground,
    borderRadius: 8,
    color: classColors.active,
    fontSize: 14,
    marginTop: 16,
    padding: 12
  },
  primaryButton: { backgroundColor: classColors.primary, borderColor: classColors.primary },
  primaryButtonText: { color: classColors.card, fontSize: 14, lineHeight: 20 },
  selectedTab: { borderBottomColor: classColors.primary },
  selectedTabText: { color: classColors.primary, fontWeight: '500' },
  subtitle: { color: classColors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 4 },
  tab: {
    alignItems: 'center',
    borderBottomColor: 'transparent',
    borderBottomWidth: 2,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  tabs: {
    borderBottomColor: classColors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    marginBottom: 24,
    marginTop: 24
  },
  tabText: { color: classColors.textSecondary, fontSize: 14 },
  title: { color: classColors.textPrimary, fontSize: 24, fontWeight: '700', lineHeight: 32 }
});
