import type {
  AcademicData,
  AcademicDay,
  AcademicClass,
  ClassInput
} from '@school-controller/shared';
import { useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AddClassFormField } from '@/features/admin-dashboard/components/AddClassFormField';
import { dashboardColors as colors } from '@/features/admin-dashboard/tokens';
import { SelectField } from '@/features/classrooms/components/SelectField';

type Props = {
  data: AcademicData;
  item?: AcademicClass;
  onClose: () => void;
  onSave: (input: ClassInput) => Promise<void>;
};

const dayOptions: { label: string; value: AcademicDay }[] = [
  { label: 'Lunes', value: 'MONDAY' },
  { label: 'Martes', value: 'TUESDAY' },
  { label: 'Miércoles', value: 'WEDNESDAY' },
  { label: 'Jueves', value: 'THURSDAY' },
  { label: 'Viernes', value: 'FRIDAY' },
  { label: 'Sábado', value: 'SATURDAY' },
  { label: 'Domingo', value: 'SUNDAY' }
];

export function ClassEditor({ data, item, onClose, onSave }: Props) {
  const schedules = data.schedules.filter(
    (schedule) =>
      schedule.id === item?.scheduleId ||
      data.periods.some((period) => period.id === schedule.academicPeriodId && period.isActive)
  );
  const [input, setInput] = useState<ClassInput>({
    subjectId: item?.subjectId ?? '',
    teacherId: item?.teacherId ?? '',
    groupId: item?.groupId ?? '',
    classroomId: item?.classroomId ?? '',
    scheduleId: item?.scheduleId ?? schedules[0]?.id ?? '',
    dayOfWeek: item?.dayOfWeek ?? 'MONDAY',
    startTime: item?.startTime ?? '08:00',
    endTime: item?.endTime ?? '09:00',
    status: item?.status ?? 'Active'
  });
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);
  const subject = data.subjects.find((value) => value.id === input.subjectId);
  const selectedTeacher = data.teachers.find((value) => value.id === input.teacherId);
  const group = data.groups.find((value) => value.id === input.groupId);
  const schedule = data.schedules.find((value) => value.id === input.scheduleId);
  const selectedRoom = data.classrooms.find((value) => value.id === input.classroomId);
  const groups = data.groups.filter(
    (value) =>
      (!schedule || value.academicPeriodId === schedule.academicPeriodId) &&
      (!subject?.departmentId || value.departmentId === subject.departmentId)
  );
  const setField = <K extends keyof ClassInput>(key: K, value: ClassInput[K]) => {
    if (submitting.current) return;
    setInput((current) => ({ ...current, [key]: value }));
    setError('');
  };
  const selectSubject = (subjectId: string) => {
    if (submitting.current) return;
    const nextSubject = data.subjects.find((value) => value.id === subjectId);
    setInput((current) => {
      const teacher = data.teachers.find((value) => value.id === current.teacherId);
      const selectedGroup = data.groups.find((value) => value.id === current.groupId);
      return {
        ...current,
        subjectId,
        teacherId:
          !nextSubject?.departmentId || teacher?.departmentId === nextSubject.departmentId
            ? current.teacherId
            : '',
        groupId:
          !nextSubject?.departmentId || selectedGroup?.departmentId === nextSubject.departmentId
            ? current.groupId
            : ''
      };
    });
    setError('');
  };
  const close = () => {
    if (!submitting.current) onClose();
  };
  const save = async () => {
    if (submitting.current) return;
    if (
      !input.subjectId ||
      !input.teacherId ||
      !input.groupId ||
      !input.classroomId ||
      !input.scheduleId
    ) {
      setError('Selecciona la materia, el docente, el grupo, el aula y el horario.');
      return;
    }
    if (
      ![input.startTime, input.endTime].every((value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value)) ||
      input.startTime >= input.endTime
    ) {
      setError(
        'Escribe horas válidas en formato HH:MM; la hora final debe ser posterior a la inicial.'
      );
      return;
    }
    if (input.startTime < '06:00' || input.endTime > '22:00') {
      setError('Las clases deben estar entre las 06:00 y las 22:00.');
      return;
    }
    if (group && schedule && group.academicPeriodId !== schedule.academicPeriodId) {
      setError('El grupo debe pertenecer al periodo del horario seleccionado.');
      return;
    }
    if (
      subject?.departmentId &&
      (group?.departmentId !== subject.departmentId ||
        selectedTeacher?.departmentId !== subject.departmentId)
    ) {
      setError('El grupo y el docente deben pertenecer a la carrera de la materia seleccionada.');
      return;
    }
    if (group && selectedRoom && group.students > selectedRoom.capacity) {
      setError(
        `El grupo tiene ${group.students} alumnos y el aula admite ${selectedRoom.capacity}.`
      );
      return;
    }
    submitting.current = true;
    setPending(true);
    setError('');
    try {
      await onSave(input);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No fue posible guardar la clase.');
    } finally {
      submitting.current = false;
      setPending(false);
    }
  };

  return (
    <Modal transparent animationType="fade" onRequestClose={close}>
      <View style={styles.backdrop}>
        <View
          accessibilityViewIsModal
          role="dialog"
          aria-modal
          accessibilityLabel={item ? 'Editar clase' : 'Nueva clase'}
          style={styles.card}
        >
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            <Text accessibilityRole="header" style={styles.title}>
              {item ? 'Editar clase' : 'Nueva clase'}
            </Text>
            <Text style={styles.subtitle}>
              Asigna los recursos académicos y el bloque de horario de la clase.
            </Text>
            <View style={styles.grid}>
              <SelectField
                label="Materia"
                value={input.subjectId}
                placeholder="Selecciona una materia"
                onChange={selectSubject}
                options={data.subjects.map((value) => ({
                  label: `${value.code} · ${value.name}`,
                  value: value.id
                }))}
                style={styles.status}
              />
              <SelectField
                label="Docente"
                value={input.teacherId}
                placeholder="Selecciona un docente"
                onChange={(value) => setField('teacherId', value)}
                options={data.teachers
                  .filter(
                    (value) =>
                      (value.status === 'Activo' || value.id === item?.teacherId) &&
                      (!subject?.departmentId || value.departmentId === subject.departmentId)
                  )
                  .map((value) => ({
                    label: `${value.employeeId} · ${value.name}`,
                    value: value.id
                  }))}
                style={styles.status}
              />
              <SelectField
                label="Horario / periodo"
                value={input.scheduleId}
                placeholder="Selecciona un horario"
                onChange={(value) => {
                  if (submitting.current) return;
                  const nextSchedule = data.schedules.find((entry) => entry.id === value);
                  setInput((current) => ({
                    ...current,
                    scheduleId: value,
                    groupId:
                      group?.academicPeriodId === nextSchedule?.academicPeriodId
                        ? current.groupId
                        : ''
                  }));
                  setError('');
                }}
                options={schedules.map((value) => ({ label: value.name, value: value.id }))}
                style={styles.status}
              />
              <SelectField
                label="Grupo"
                value={input.groupId}
                placeholder="Selecciona un grupo"
                onChange={(value) => setField('groupId', value)}
                options={groups.map((value) => ({
                  label: `${value.code} · ${value.students} alumnos`,
                  value: value.id
                }))}
                style={styles.status}
              />
              <SelectField
                label="Aula"
                value={input.classroomId}
                placeholder="Selecciona un aula"
                onChange={(value) => setField('classroomId', value)}
                options={data.classrooms
                  .filter((value) => value.status === 'available' || value.id === item?.classroomId)
                  .map((value) => ({
                    label: `${value.code} · ${value.capacity} lugares`,
                    value: value.id
                  }))}
                style={styles.status}
              />
              <SelectField
                label="Día"
                value={input.dayOfWeek}
                onChange={(value) => setField('dayOfWeek', value)}
                options={dayOptions}
                style={styles.status}
              />
              <AddClassFormField
                label="Hora de inicio"
                placeholder="08:00"
                value={input.startTime}
                onChangeText={(value) => setField('startTime', value)}
                onSubmit={save}
              />
              <AddClassFormField
                label="Hora de fin"
                placeholder="09:00"
                value={input.endTime}
                onChangeText={(value) => setField('endTime', value)}
                onSubmit={save}
              />
              <SelectField
                label="Estado"
                value={input.status}
                onChange={(value) => setField('status', value)}
                options={[
                  { label: 'Activa', value: 'Active' },
                  { label: 'Pendiente', value: 'Pending' }
                ]}
                style={styles.status}
              />
            </View>
            {group ? (
              <Text style={styles.subtitle}>
                {group.degree} · Semestre {group.semester} · {group.students} alumnos
              </Text>
            ) : null}
            {error ? (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            ) : null}
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                disabled={pending}
                onPress={close}
                style={[styles.button, pending && styles.disabled]}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: pending, busy: pending }}
                disabled={pending}
                onPress={save}
                style={[styles.button, styles.primary, pending && styles.disabled]}
              >
                <Text style={styles.primaryText}>{pending ? 'Guardando…' : 'Guardar clase'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 29, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  card: {
    width: '100%',
    maxWidth: 660,
    maxHeight: '90%',
    borderRadius: 12,
    backgroundColor: colors.card
  },
  content: { padding: 24 },
  title: { color: colors.textPrimary, fontSize: 24, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 6, lineHeight: 21 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 24, zIndex: 1 },
  status: { flex: 1, minWidth: 240 },
  error: { color: '#b42318', marginTop: 16, fontSize: 13 },
  disabled: { opacity: 0.5 },
  actions: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end', marginTop: 24 },
  button: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 40,
    justifyContent: 'center'
  },
  buttonText: { color: colors.textPrimary, fontSize: 13, fontWeight: '500' },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  primaryText: { color: colors.card, fontSize: 13, fontWeight: '500' }
});
