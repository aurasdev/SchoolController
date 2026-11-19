import { type ReactNode, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import type { Classroom } from '@school-controller/shared';

import { dashboardColors } from '@/features/admin-dashboard/tokens';
import { ClassroomCard } from '@/features/classrooms/components/ClassroomCard';
import { ClassroomFiltersBar } from '@/features/classrooms/components/ClassroomFiltersBar';
import { ClassroomTable } from '@/features/classrooms/components/ClassroomTable';
import { Pagination } from '@/features/classrooms/components/Pagination';
import {
  emptyClassroomFilters,
  filterClassrooms,
  hasActiveFilters,
  paginate
} from '@/features/classrooms/classroomFilters';
import { classroomsCopy } from '@/features/classrooms/content';
import { classroomTableMinWidth } from '@/features/classrooms/tokens';
import type { ClassroomFilters } from '@/features/classrooms/types';

type ClassroomListViewProps = {
  classrooms: Classroom[];
  filters: ClassroomFilters;
  onCreate: () => void;
  onEdit: (id: string) => void;
  onFiltersChange: (filters: ClassroomFilters) => void;
  onOpen: (id: string) => void;
  onPageChange: (page: number) => void;
  page: number;
};

export function ClassroomListView({
  classrooms,
  filters,
  onCreate,
  onEdit,
  onFiltersChange,
  onOpen,
  onPageChange,
  page
}: ClassroomListViewProps) {
  const { width } = useWindowDimensions();
  const showCards = width < classroomTableMinWidth;
  const filtered = useMemo(() => filterClassrooms(classrooms, filters), [classrooms, filters]);
  const pagination = paginate(filtered, page);

  const handleClearFilters = useCallback(() => {
    onFiltersChange(emptyClassroomFilters);
  }, [onFiltersChange]);

  const paginationFooter = (
    <Pagination
      from={pagination.from}
      onPageChange={onPageChange}
      page={pagination.page}
      pageCount={pagination.pageCount}
      to={pagination.to}
      total={pagination.total}
    />
  );

  let body: ReactNode;

  if (filtered.length === 0) {
    body = (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>{classroomsCopy.emptyTitle}</Text>
        <Text style={styles.emptyText}>{classroomsCopy.emptyText}</Text>
        {hasActiveFilters(filters) ? (
          <Pressable
            accessibilityRole="button"
            focusable
            onPress={handleClearFilters}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>{classroomsCopy.clearFilters}</Text>
          </Pressable>
        ) : null}
      </View>
    );
  } else if (showCards) {
    body = (
      <>
        <View style={styles.cards}>
          {pagination.items.map((classroom) => (
            <ClassroomCard
              classroom={classroom}
              key={classroom.id}
              onEdit={onEdit}
              onOpen={onOpen}
            />
          ))}
        </View>
        <View style={styles.cardsFooter}>{paginationFooter}</View>
      </>
    );
  } else {
    body = (
      <View style={styles.tableCard}>
        <ClassroomTable classrooms={pagination.items} onEdit={onEdit} onOpen={onOpen} />
        <View style={styles.tableFooter}>{paginationFooter}</View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          <Text accessibilityRole="header" style={styles.title}>
            {classroomsCopy.title}
          </Text>
          <Text style={styles.subtitle}>{classroomsCopy.subtitle}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          focusable
          onPress={onCreate}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>{classroomsCopy.newClassroom}</Text>
        </Pressable>
      </View>

      <ClassroomFiltersBar
        buildings={Array.from(new Set(classrooms.map((item) => item.building))).sort()}
        filters={filters}
        onChange={onFiltersChange}
      />

      <Text style={styles.count}>
        {classroomsCopy.showing} <Text style={styles.strong}>{filtered.length}</Text>{' '}
        {classroomsCopy.classrooms}
      </Text>

      {body}
    </>
  );
}

const styles = StyleSheet.create({
  cards: {
    gap: 12
  },
  cardsFooter: {
    marginTop: 16
  },
  count: {
    color: dashboardColors.textSecondary,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    marginBottom: 12,
    marginTop: 24
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 48
  },
  emptyText: {
    color: dashboardColors.textSecondary,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    textAlign: 'center'
  },
  emptyTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0
  },
  headingCopy: {
    flexShrink: 1
  },
  headingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between'
  },
  primaryButton: {
    backgroundColor: dashboardColors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  primaryButtonText: {
    color: dashboardColors.card,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0
  },
  secondaryButton: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  secondaryButtonText: {
    color: dashboardColors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0
  },
  strong: {
    color: dashboardColors.textPrimary,
    fontWeight: '700'
  },
  subtitle: {
    color: dashboardColors.textMuted,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 20,
    marginTop: 4
  },
  tableCard: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden'
  },
  tableFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  title: {
    color: dashboardColors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 32
  }
});
