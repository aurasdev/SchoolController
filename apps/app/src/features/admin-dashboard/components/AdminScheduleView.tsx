import type { AcademicData, ClassInput } from '@school-controller/shared';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { academicDays, dayLabels, schoolNow, weeklyBlocks } from '@/features/academic/presentation';
import { ScheduleTabs } from '@/features/admin-dashboard/components/ScheduleTabs';
import { WeekNavigator } from '@/features/admin-dashboard/components/WeekNavigator';
import { WeeklyScheduleGrid } from '@/features/admin-dashboard/components/WeeklyScheduleGrid';
import { dashboardColors as colors } from '@/features/admin-dashboard/tokens';
import type { ScheduleViewMode } from '@/features/admin-dashboard/types';
import { SelectField } from '@/features/classrooms/components/SelectField';
import { ClassEditor } from '@/features/classes/components/ClassEditor';

const dateObject = (value: string) => new Date(`${value}T12:00:00Z`);
const dateString = (value: Date) => value.toISOString().slice(0, 10);
function shiftDate(value: string, amount: number) {
  const next = dateObject(value);
  next.setUTCDate(next.getUTCDate() + amount);
  return dateString(next);
}
const weekday = (value: string) => (dateObject(value).getUTCDay() + 6) % 7;
const monday = (value: string) => shiftDate(value, -weekday(value));
const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-MX', { timeZone: 'UTC', day: 'numeric', month: 'short' }).format(
    dateObject(value)
  );

export function AdminScheduleView({
  data,
  onSave
}: {
  data: AcademicData;
  onSave: (input: ClassInput) => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState<ScheduleViewMode>('week');
  const [groupId, setGroupId] = useState(
    () =>
      data.groups.find((group) =>
        data.periods.some((period) => period.id === group.academicPeriodId && period.isActive)
      )?.id ??
      data.groups[0]?.id ??
      ''
  );
  const [selectedDate, setSelectedDate] = useState(schoolNow().date);
  const [creating, setCreating] = useState(false);
  const group = data.groups.find((item) => item.id === groupId);
  const period = data.periods.find((item) => item.id === group?.academicPeriodId);
  const minDate = period?.startsOn.slice(0, 10) ?? selectedDate;
  const maxDate = period?.endsOn.slice(0, 10) ?? selectedDate;
  const inPeriod = (value: string) => value >= minDate && value <= maxDate;
  const clamp = (value: string) => (value < minDate ? minDate : value > maxDate ? maxDate : value);
  const focusDate = clamp(selectedDate);
  const sessions = data.classes.filter(
    (item) => item.groupId === groupId && item.status === 'Active'
  );
  const weekStart = monday(focusDate);
  const weekClasses = sessions.filter((item) =>
    inPeriod(shiftDate(weekStart, academicDays.indexOf(item.dayOfWeek)))
  );
  const step = (direction: number) => {
    if (activeTab === 'month') {
      const next = dateObject(focusDate);
      next.setUTCDate(1);
      next.setUTCMonth(next.getUTCMonth() + direction);
      return dateString(next);
    }
    return shiftDate(focusDate, direction * (activeTab === 'day' ? 1 : 7));
  };
  const rangeStart =
    activeTab === 'week'
      ? weekStart
      : activeTab === 'month'
        ? `${focusDate.slice(0, 7)}-01`
        : focusDate;
  const monthEnd = dateObject(`${focusDate.slice(0, 7)}-01`);
  monthEnd.setUTCMonth(monthEnd.getUTCMonth() + 1);
  monthEnd.setUTCDate(0);
  const rangeEnd =
    activeTab === 'week'
      ? shiftDate(weekStart, 6)
      : activeTab === 'month'
        ? dateString(monthEnd)
        : focusDate;
  const label =
    activeTab === 'month'
      ? new Intl.DateTimeFormat('es-MX', {
          timeZone: 'UTC',
          month: 'long',
          year: 'numeric'
        }).format(dateObject(focusDate))
      : activeTab === 'day'
        ? formatDate(focusDate)
        : `${formatDate(rangeStart)} - ${formatDate(rangeEnd)}`;
  const occurrences = [];
  if (activeTab !== 'week') {
    for (let day = rangeStart; day <= rangeEnd; day = shiftDate(day, 1)) {
      if (!inPeriod(day)) continue;
      for (const item of sessions
        .filter((item) => item.dayOfWeek === academicDays[weekday(day)])
        .sort((a, b) => a.startTime.localeCompare(b.startTime)))
        occurrences.push({ date: day, item });
    }
  }
  return (
    <View>
      <View style={styles.heading}>
        <View>
          <Text accessibilityRole="header" style={styles.title}>
            Horario académico
          </Text>
          <Text style={styles.subtitle}>
            {period?.name ?? 'Selecciona un grupo'}
            {group ? ` · ${group.degree} · ${group.code}` : ''}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => setCreating(true)}
          style={styles.primary}
        >
          <Text style={styles.primaryText}>Agregar clase</Text>
        </Pressable>
      </View>
      <SelectField
        label="Grupo"
        value={groupId}
        onChange={setGroupId}
        options={data.groups.map((item) => ({
          label: `${item.code} · ${item.degree}`,
          value: item.id
        }))}
        style={styles.groupFilter}
      />
      <View style={styles.controls}>
        <ScheduleTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <WeekNavigator
          label={label}
          previousDisabled={rangeStart <= minDate}
          nextDisabled={rangeEnd >= maxDate}
          onPrevious={() => setSelectedDate(clamp(step(-1)))}
          onNext={() => setSelectedDate(clamp(step(1)))}
          onToday={() => setSelectedDate(clamp(schoolNow().date))}
        />
      </View>
      {activeTab === 'week' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <WeeklyScheduleGrid classes={weeklyBlocks(weekClasses)} />
        </ScrollView>
      ) : (
        <View style={styles.agenda}>
          {occurrences.length === 0 ? (
            <Text style={styles.subtitle}>No hay clases programadas para estas fechas.</Text>
          ) : (
            occurrences.map(({ date, item }) => (
              <View key={`${date}-${item.id}`} style={styles.agendaRow}>
                <View style={styles.dateColumn}>
                  <Text style={styles.date}>{formatDate(date)}</Text>
                  <Text style={styles.subtitle}>{dayLabels[item.dayOfWeek]}</Text>
                  <Text style={styles.subtitle}>
                    {item.startTime} - {item.endTime}
                  </Text>
                </View>
                <View style={styles.agendaCopy}>
                  <Text style={styles.subject}>{item.name}</Text>
                  <Text style={styles.subtitle}>{item.teacher}</Text>
                  <Text style={styles.subtitle}>
                    {item.room} · {item.group}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}
      {creating ? (
        <ClassEditor
          data={data}
          onClose={() => setCreating(false)}
          onSave={async (input) => {
            await onSave(input);
            setCreating(false);
          }}
        />
      ) : null}
    </View>
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
  title: { color: colors.textPrimary, fontSize: 24, lineHeight: 32, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 13, lineHeight: 20, marginTop: 4 },
  primary: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8
  },
  primaryText: { color: colors.card, fontSize: 14, fontWeight: '600' },
  groupFilter: { width: '100%', maxWidth: 360, marginTop: 24, zIndex: 3 },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 24,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  agenda: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 20,
    marginTop: 24,
    gap: 12
  },
  agendaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  dateColumn: { minWidth: 140 },
  agendaCopy: { flex: 1, minWidth: 200 },
  date: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  subject: { color: colors.textPrimary, fontSize: 16, fontWeight: '600' }
});
