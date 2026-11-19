import type {
  AcademicData,
  ElectiveFit,
  StudyPlan,
  StudyPlanImportInput
} from '@school-controller/shared';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { dashboardColors } from '@/features/admin-dashboard/tokens';
import { SelectField } from '@/features/classrooms/components/SelectField';
import type { SelectOption } from '@/features/classrooms/types';
import { parsePlanCsv, planCsvHeader } from '@/features/study-plans/csv';

type StudyPlansPanelProps = {
  data: AcademicData;
  onAssign: (groupId: string, studyPlanId: string | null) => Promise<void>;
  onImport: (input: StudyPlanImportInput) => Promise<void>;
};

type Message = { kind: 'error' | 'success'; text: string };

const fitLabels: Record<ElectiveFit, (conflicts: number) => string> = {
  fits: () => 'Cabe en el horario',
  shift: () => 'Fuera del turno del semestre',
  conflict: (conflicts) => `Choca con ${conflicts} ${conflicts === 1 ? 'clase' : 'clases'}`,
  unscheduled: () => 'Sin horario asignado'
};

const errorText = (cause: unknown, fallback: string) =>
  cause instanceof Error ? cause.message : fallback;

function Feedback({ message }: { message: Message | undefined }) {
  if (!message) return null;
  return (
    <Text
      accessibilityLiveRegion="polite"
      style={message.kind === 'error' ? styles.errorText : styles.successText}
    >
      {message.text}
    </Text>
  );
}

export function StudyPlansPanel({ data, onAssign, onImport }: StudyPlansPanelProps) {
  const [openPlanId, setOpenPlanId] = useState<string>();
  const [departmentId, setDepartmentId] = useState('');
  const [year, setYear] = useState('');
  const [name, setName] = useState('');
  const [csv, setCsv] = useState('');
  const [busy, setBusy] = useState(false);
  const [importMessage, setImportMessage] = useState<Message>();
  const [assignMessage, setAssignMessage] = useState<Message>();

  const departmentNames = useMemo(
    () => new Map(data.departments.map((department) => [department.id, department.name])),
    [data.departments]
  );
  const subjectNames = useMemo(
    () => new Map(data.subjects.map((subject) => [subject.id, subject.name])),
    [data.subjects]
  );
  const departmentOptions = useMemo<SelectOption<string>[]>(
    () => data.departments.map((department) => ({ label: department.name, value: department.id })),
    [data.departments]
  );
  const groups = useMemo(
    () => [...data.groups].sort((a, b) => a.code.localeCompare(b.code)),
    [data.groups]
  );

  const semesterRows = (plan: StudyPlan) => {
    const bySemester = new Map<number, string[]>();
    for (const { subjectId, semester, blockId } of plan.subjects) {
      if (blockId) continue;
      bySemester.set(semester, [
        ...(bySemester.get(semester) ?? []),
        subjectNames.get(subjectId) ?? 'Materia'
      ]);
    }
    return [...bySemester.entries()].sort(([a], [b]) => a - b);
  };

  const assign = async (groupId: string, studyPlanId: string) => {
    setAssignMessage(undefined);
    try {
      await onAssign(groupId, studyPlanId || null);
    } catch (cause) {
      setAssignMessage({
        kind: 'error',
        text: errorText(cause, 'No se pudo cambiar el plan del grupo.')
      });
    }
  };

  const submit = async () => {
    setBusy(true);
    setImportMessage(undefined);
    try {
      const subjects = parsePlanCsv(csv);
      const yearNumber = Number(year);
      if (!departmentId) throw new Error('Selecciona la carrera.');
      if (!/^\d{4}$/.test(year) || yearNumber < 1990 || yearNumber > 2100)
        throw new Error('Escribe un año válido, por ejemplo 2024.');
      await onImport({
        departmentId,
        year: yearNumber,
        name: name.trim() || `Plan ${yearNumber}`,
        subjects
      });
      setImportMessage({
        kind: 'success',
        text: `Plan importado con ${subjects.length} materias.`
      });
      setCsv('');
    } catch (cause) {
      setImportMessage({ kind: 'error', text: errorText(cause, 'No se pudo importar el plan.') });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <View style={styles.card}>
        <View>
          <Text style={styles.cardTitle}>Planes de estudio</Text>
          <Text style={styles.help}>
            Cada carrera puede tener varios planes. El plan de un grupo decide en qué semestre va
            cada materia, así que una misma materia puede ser de 5.º en un plan y de 7.º en otro.
          </Text>
        </View>
        {data.studyPlans.length === 0 ? (
          <Text style={styles.help}>Todavía no hay planes. Importa uno más abajo.</Text>
        ) : null}
        {data.studyPlans.map((plan) => {
          const open = openPlanId === plan.id;
          return (
            <View key={plan.id} style={styles.plan}>
              <View style={styles.planHeader}>
                <View style={styles.planCopy}>
                  <Text style={styles.planName}>
                    {plan.name} · {departmentNames.get(plan.departmentId) ?? 'Carrera'}
                  </Text>
                  <Text style={styles.help}>
                    {plan.subjects.length} materias · {plan.groups} grupos
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ expanded: open }}
                  focusable
                  onPress={() => setOpenPlanId(open ? undefined : plan.id)}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>
                    {open ? 'Ocultar materias' : 'Ver materias'}
                  </Text>
                </Pressable>
              </View>
              {open
                ? semesterRows(plan).map(([semester, names]) => (
                    <Text key={semester} style={styles.semesterRow}>
                      <Text style={styles.semesterLabel}>{semester}.º semestre: </Text>
                      {names.join(', ')}
                    </Text>
                  ))
                : null}
              {open
                ? plan.blocks.map((block) => (
                    <View key={block.id} style={styles.block}>
                      <Text style={styles.semesterLabel}>
                        Bloque {block.name} · {block.semester}.º semestre
                      </Text>
                      <Text style={styles.help}>
                        Opciones ordenadas: primero las que mejor caben en el horario de los grupos
                        del plan.
                      </Text>
                      {block.options.map((option) => (
                        <View key={option.subjectId} style={styles.option}>
                          <View style={styles.optionHeader}>
                            <Text style={styles.optionName}>
                              {subjectNames.get(option.subjectId) ?? 'Materia'}
                            </Text>
                            <Text
                              style={[
                                styles.fit,
                                option.fit === 'fits' && styles.fitGood,
                                option.fit === 'shift' && styles.fitShift,
                                option.fit === 'conflict' && styles.fitBad
                              ]}
                            >
                              {fitLabels[option.fit](option.conflicts)}
                            </Text>
                          </View>
                          {option.slots.map((slot) => (
                            <Text key={slot} style={styles.help}>
                              {slot}
                            </Text>
                          ))}
                        </View>
                      ))}
                    </View>
                  ))
                : null}
            </View>
          );
        })}
      </View>

      <View style={styles.card}>
        <View>
          <Text style={styles.cardTitle}>Plan de cada grupo</Text>
          <Text style={styles.help}>
            Los avisos al guardar una clase comparan la materia con el plan del grupo.
          </Text>
        </View>
        <Feedback message={assignMessage} />
        <View style={styles.groupGrid}>
          {groups.map((group) => (
            <SelectField
              key={group.id}
              label={`${group.code} · ${group.semester}.º semestre`}
              onChange={(value) => {
                void assign(group.id, value);
              }}
              options={[
                { label: 'Sin plan', value: '' },
                ...data.studyPlans
                  .filter((plan) => plan.departmentId === group.departmentId)
                  .map((plan) => ({ label: plan.name, value: plan.id }))
              ]}
              style={styles.groupField}
              value={group.studyPlanId ?? ''}
            />
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View>
          <Text style={styles.cardTitle}>Importar plan de estudios</Text>
          <Text style={styles.help}>
            Pega un CSV con las columnas {planCsvHeader}. La columna bloque es opcional: las
            materias con el mismo bloque son opciones de una electiva (por ejemplo, Taller deportivo
            con vóley, fútbol y ajedrez) y deben ser del mismo semestre. Si la clave ya existe se
            reutiliza la materia; si no, se crea en la carrera elegida. Si la carrera ya tiene un
            plan de ese año, se reemplaza.
          </Text>
        </View>
        <View style={styles.formRow}>
          <SelectField
            label="Carrera"
            onChange={setDepartmentId}
            options={departmentOptions}
            placeholder="Selecciona una carrera"
            style={styles.formField}
            value={departmentId}
          />
          <View style={styles.formField}>
            <Text style={styles.label}>Año del plan</Text>
            <TextInput
              accessibilityLabel="Año del plan"
              keyboardType="numeric"
              maxLength={4}
              onChangeText={setYear}
              placeholder="2024"
              placeholderTextColor={dashboardColors.textMuted}
              style={styles.input}
              value={year}
            />
          </View>
          <View style={styles.formField}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              accessibilityLabel="Nombre del plan"
              maxLength={100}
              onChangeText={setName}
              placeholder="Plan 2024"
              placeholderTextColor={dashboardColors.textMuted}
              style={styles.input}
              value={name}
            />
          </View>
        </View>
        <TextInput
          accessibilityLabel="CSV del plan de estudios"
          multiline
          onChangeText={setCsv}
          placeholder={`${planCsvHeader}\nISC-001,Fundamentos de programación,1,\nISC-E01,Voleibol,5,Taller deportivo\nISC-E02,Ajedrez,5,Taller deportivo`}
          placeholderTextColor={dashboardColors.textMuted}
          style={[styles.input, styles.csv]}
          value={csv}
        />
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: busy || !csv.trim() }}
            disabled={busy || !csv.trim()}
            focusable
            onPress={() => {
              void submit();
            }}
            style={[styles.primaryButton, (busy || !csv.trim()) && styles.disabled]}
          >
            <Text style={styles.primaryButtonText}>{busy ? 'Importando…' : 'Importar plan'}</Text>
          </Pressable>
          <Feedback message={importMessage} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: dashboardColors.surface,
    borderRadius: 8,
    gap: 10,
    padding: 12
  },
  fit: { fontSize: 12, fontWeight: '700' },
  fitBad: { color: '#e2252a' },
  fitGood: { color: '#1aa34a' },
  fitShift: { color: dashboardColors.warning },
  option: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 2,
    padding: 10
  },
  optionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between'
  },
  optionName: { color: dashboardColors.textPrimary, fontSize: 14, fontWeight: '600' },
  actions: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  card: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 12,
    borderWidth: 1,
    gap: 20,
    padding: 24
  },
  cardTitle: { color: dashboardColors.textPrimary, fontSize: 18, fontWeight: '700' },
  csv: { height: 160, paddingTop: 12, textAlignVertical: 'top' },
  disabled: { opacity: 0.5 },
  errorText: { color: '#e2252a', flexShrink: 1, fontSize: 14, fontWeight: '600' },
  formField: { flexBasis: 220, flexGrow: 1, maxWidth: 320 },
  formRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, zIndex: 2 },
  groupField: { flexBasis: 240, flexGrow: 1, maxWidth: 300 },
  groupGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  help: { color: dashboardColors.textSecondary, fontSize: 14, lineHeight: 20, marginTop: 4 },
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
  plan: {
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 16
  },
  planCopy: { flexShrink: 1 },
  planHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between'
  },
  planName: { color: dashboardColors.textPrimary, fontSize: 15, fontWeight: '600' },
  primaryButton: {
    backgroundColor: dashboardColors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  primaryButtonText: { color: dashboardColors.card, fontSize: 14, fontWeight: '700' },
  secondaryButton: {
    backgroundColor: dashboardColors.card,
    borderColor: dashboardColors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  secondaryButtonText: { color: dashboardColors.textPrimary, fontSize: 13, fontWeight: '600' },
  semesterLabel: { color: dashboardColors.textPrimary, fontWeight: '700' },
  semesterRow: { color: dashboardColors.textSecondary, fontSize: 14, lineHeight: 20 },
  successText: { color: '#1aa34a', fontSize: 14, fontWeight: '600' }
});
