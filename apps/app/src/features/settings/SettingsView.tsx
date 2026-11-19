import type { AcademicData, ShiftSettings, StudyPlanImportInput } from '@school-controller/shared';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { dashboardColors } from '@/features/admin-dashboard/tokens';
import { StudyPlansPanel } from '@/features/study-plans/StudyPlansPanel';
import { SubjectTeachersPanel } from '@/features/subjects/SubjectTeachersPanel';

type SettingsViewProps = {
  data: AcademicData;
  onAssignPlan: (groupId: string, studyPlanId: string | null) => Promise<void>;
  onImportPlan: (input: StudyPlanImportInput) => Promise<void>;
  onSave: (settings: ShiftSettings) => Promise<void>;
  onSaveSubjectTeachers: (subjectId: string, teacherIds: string[]) => Promise<void>;
};

type Shift = 'morning' | 'afternoon';
type Message = { kind: 'error' | 'success'; text: string };
type TimeKey = 'morningStart' | 'afternoonStart' | 'dayEnd';

const timeFields: { key: TimeKey; label: string }[] = [
  { key: 'morningStart', label: 'Inicio de mañana' },
  { key: 'afternoonStart', label: 'Inicio de tarde' },
  { key: 'dayEnd', label: 'Fin del día' }
];

type SemesterChipProps = { label: string; onPress: () => void; selected: boolean };

function SemesterChip({ label, onPress, selected }: SemesterChipProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      focusable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function SettingsView({
  data,
  onAssignPlan,
  onImportPlan,
  onSave,
  onSaveSubjectTeachers
}: SettingsViewProps) {
  const [draft, setDraft] = useState(data.settings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<Message>();

  useEffect(() => {
    setDraft(data.settings);
  }, [data.settings]);

  const semesters = useMemo(() => {
    const highest = Math.max(10, ...data.groups.map((group) => group.semester));
    return Array.from({ length: highest }, (_, index) => index + 1);
  }, [data.groups]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(data.settings);

  const toggleSemester = (shift: Shift, semester: number) => {
    setMessage(undefined);
    setDraft((current) => {
      const own = shift === 'morning' ? current.morningSemesters : current.afternoonSemesters;
      const other = shift === 'morning' ? current.afternoonSemesters : current.morningSemesters;
      const nextOwn = own.includes(semester)
        ? own.filter((value) => value !== semester)
        : [...own, semester].sort((a, b) => a - b);
      const nextOther = other.filter((value) => value !== semester);
      return shift === 'morning'
        ? { ...current, morningSemesters: nextOwn, afternoonSemesters: nextOther }
        : { ...current, afternoonSemesters: nextOwn, morningSemesters: nextOther };
    });
  };

  const changeTime = (key: TimeKey, value: string) => {
    setMessage(undefined);
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    setMessage(undefined);
    try {
      await onSave(draft);
      setMessage({ kind: 'success', text: 'Configuración guardada.' });
    } catch (cause) {
      setMessage({
        kind: 'error',
        text: cause instanceof Error ? cause.message : 'No se pudo guardar la configuración.'
      });
    } finally {
      setSaving(false);
    }
  };

  const shifts: { shift: Shift; title: string; range: string; selected: number[] }[] = [
    {
      shift: 'morning',
      title: 'Prioridad de mañana',
      range: `${draft.morningStart} – ${draft.afternoonStart}`,
      selected: draft.morningSemesters
    },
    {
      shift: 'afternoon',
      title: 'Prioridad de tarde',
      range: `${draft.afternoonStart} – ${draft.dayEnd}`,
      selected: draft.afternoonSemesters
    }
  ];

  return (
    <View style={styles.page}>
      <View>
        <Text accessibilityRole="header" style={styles.title}>
          Configuración
        </Text>
        <Text style={styles.subtitle}>Reglas globales para armar los horarios del plantel</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.switchRow}>
          <View style={styles.switchCopy}>
            <Text style={styles.cardTitle}>Prioridad de turno por semestre</Text>
            <Text style={styles.help}>
              Cuando está activa, la app avisa si una clase queda fuera del turno de su semestre. Es
              una prioridad: el aviso no impide guardar la clase.
            </Text>
          </View>
          <View style={styles.switchControl}>
            <Text style={styles.switchLabel}>{draft.enabled ? 'Activa' : 'Inactiva'}</Text>
            <Switch
              accessibilityLabel="Activar prioridad de turno por semestre"
              onValueChange={(enabled) => {
                setMessage(undefined);
                setDraft((current) => ({ ...current, enabled }));
              }}
              trackColor={{ false: '#d3d4d9', true: dashboardColors.primary }}
              value={draft.enabled}
            />
          </View>
        </View>

        <View style={[styles.section, !draft.enabled && styles.dimmed]}>
          <Text style={styles.sectionTitle}>Horarios de los turnos</Text>
          <View style={styles.timeRow}>
            {timeFields.map(({ key, label }) => (
              <View key={key} style={styles.timeField}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  accessibilityLabel={label}
                  maxLength={5}
                  onChangeText={(value) => changeTime(key, value)}
                  placeholder="HH:mm"
                  placeholderTextColor={dashboardColors.textMuted}
                  style={styles.input}
                  value={draft[key]}
                />
              </View>
            ))}
          </View>
        </View>

        {shifts.map(({ shift, title, range, selected }) => (
          <View key={shift} style={[styles.section, !draft.enabled && styles.dimmed]}>
            <Text style={styles.sectionTitle}>
              {title} <Text style={styles.range}>({range})</Text>
            </Text>
            <View style={styles.chips}>
              {semesters.map((semester) => (
                <SemesterChip
                  key={semester}
                  label={`${semester}.º`}
                  onPress={() => toggleSemester(shift, semester)}
                  selected={selected.includes(semester)}
                />
              ))}
            </View>
          </View>
        ))}

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !dirty || saving }}
            disabled={!dirty || saving}
            focusable
            onPress={() => {
              void save();
            }}
            style={[styles.primaryButton, (!dirty || saving) && styles.disabledButton]}
          >
            <Text style={styles.primaryButtonText}>
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </Text>
          </Pressable>
          {message ? (
            <Text
              accessibilityLiveRegion="polite"
              style={message.kind === 'error' ? styles.errorText : styles.successText}
            >
              {message.text}
            </Text>
          ) : null}
        </View>
      </View>

      <StudyPlansPanel data={data} onAssign={onAssignPlan} onImport={onImportPlan} />

      <SubjectTeachersPanel data={data} onSave={onSaveSubjectTeachers} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Periodos académicos</Text>
        {data.periods.map((period) => (
          <View key={period.id} style={styles.period}>
            <Text style={styles.periodName}>
              {period.name}
              {period.isActive ? ' · Activo' : ''}
            </Text>
            <Text style={styles.help}>
              {period.startsOn.slice(0, 10)} — {period.endsOn.slice(0, 10)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  card: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: 24,
    padding: 24
  },
  cardTitle: { color: dashboardColors.textPrimary, fontSize: 18, fontWeight: '700' },
  chip: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 52,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  chipSelected: {
    backgroundColor: dashboardColors.primarySubtle,
    borderColor: dashboardColors.primary
  },
  chipText: {
    color: dashboardColors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  chipTextSelected: { color: dashboardColors.primary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dimmed: { opacity: 0.5 },
  disabledButton: { opacity: 0.5 },
  errorText: { color: '#e2252a', flexShrink: 1, fontSize: 14, fontWeight: '600' },
  help: { color: dashboardColors.textSecondary, fontSize: 14, lineHeight: 20 },
  input: {
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: dashboardColors.textPrimary,
    fontSize: 15,
    height: 44,
    paddingHorizontal: 14
  },
  label: { color: dashboardColors.textPrimary, fontSize: 13, fontWeight: '700', marginBottom: 8 },
  page: { gap: 20 },
  period: { gap: 4 },
  periodName: { color: dashboardColors.textPrimary, fontSize: 15, fontWeight: '600' },
  primaryButton: {
    backgroundColor: dashboardColors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  primaryButtonText: { color: dashboardColors.card, fontSize: 14, fontWeight: '700' },
  range: { color: dashboardColors.textMuted, fontWeight: '400' },
  section: { gap: 12 },
  sectionTitle: { color: dashboardColors.textPrimary, fontSize: 15, fontWeight: '700' },
  subtitle: {
    color: dashboardColors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4
  },
  successText: { color: '#1aa34a', fontSize: 14, fontWeight: '600' },
  switchControl: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  switchCopy: { flexShrink: 1, maxWidth: 560 },
  switchLabel: { color: dashboardColors.textPrimary, fontSize: 14, fontWeight: '600' },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between'
  },
  timeField: { flexBasis: 160, flexGrow: 1, maxWidth: 220 },
  timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  title: { color: dashboardColors.textPrimary, fontSize: 24, fontWeight: '700', lineHeight: 32 }
});
