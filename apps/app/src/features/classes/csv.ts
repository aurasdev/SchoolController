import type { AcademicData, AcademicDay, ClassInput } from '@school-controller/shared';

export const csvHeader =
  'subjectCode,teacherEmployeeId,groupCode,classroomCode,scheduleName,dayOfWeek,startTime,endTime,status';
const days: AcademicDay[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY'
];

export function parseClassesCsv(source: string, data: AcademicData): ClassInput[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const text = source.replace(/^\uFEFF/, '').trim();
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index++;
      } else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(field.trim());
      field = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[index + 1] === '\n') index++;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = '';
    } else field += char;
  }
  if (quoted) throw new Error('A quoted CSV value is missing its closing quote.');
  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  if (
    rows
      .shift()
      ?.map((value) => value.toLowerCase())
      .join(',') !== csvHeader.toLowerCase()
  ) {
    throw new Error(`Use these column headers: ${csvHeader}`);
  }
  if (!rows.length) throw new Error('Add at least one class below the header.');
  if (rows.length > 100) throw new Error('Importa como máximo 100 clases a la vez.');
  return rows.map((values, index) => {
    const [
      subjectCode,
      teacherEmployeeId,
      groupCode,
      classroomCode,
      scheduleName,
      day,
      startTime,
      endTime,
      status
    ] = values;
    if (values.length !== 9 || values.some((value) => !value)) {
      throw new Error(`Fila ${index + 2}: completa las nueve columnas.`);
    }
    const equal = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();
    const subject = data.subjects.find((value) => equal(value.code, subjectCode));
    const teacher = data.teachers.find((value) => equal(value.employeeId, teacherEmployeeId));
    const classroom = data.classrooms.find((value) => equal(value.code, classroomCode));
    const schedules = data.schedules.filter((value) => equal(value.name, scheduleName));
    const schedule = schedules.length === 1 ? schedules[0] : undefined;
    const group = data.groups.find(
      (value) =>
        equal(value.code, groupCode) &&
        (!schedule || value.academicPeriodId === schedule.academicPeriodId)
    );
    if (!subject || !teacher || !group || !classroom || !schedule) {
      const resource = !subject
        ? `materia ${subjectCode}`
        : !teacher
          ? `docente ${teacherEmployeeId}`
          : !group
            ? `grupo ${groupCode}`
            : !classroom
              ? `aula ${classroomCode}`
              : `horario ${scheduleName}`;
      throw new Error(
        `Fila ${index + 2}: no se encontró un registro único de ${resource}. Usa los códigos del catálogo.`
      );
    }
    const dayOfWeek = days.find((value) => value === day.toUpperCase());
    if (
      !dayOfWeek ||
      ![startTime, endTime].every((value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value)) ||
      startTime >= endTime ||
      (status !== 'Active' && status !== 'Pending')
    ) {
      throw new Error(
        `Fila ${index + 2}: usa un día de MONDAY a SUNDAY, horas HH:MM en orden y estado Active o Pending.`
      );
    }
    if (group.academicPeriodId !== schedule.academicPeriodId) {
      throw new Error(`Fila ${index + 2}: el grupo y el horario pertenecen a periodos distintos.`);
    }
    if (startTime < '06:00' || endTime > '22:00') {
      throw new Error(`Fila ${index + 2}: las clases deben estar entre las 06:00 y las 22:00.`);
    }
    if (teacher.status !== 'Activo')
      throw new Error(`Fila ${index + 2}: el docente debe estar activo.`);
    if (
      subject.departmentId &&
      (group.departmentId !== subject.departmentId || teacher.departmentId !== subject.departmentId)
    ) {
      throw new Error(
        `Fila ${index + 2}: el grupo y el docente deben pertenecer a la carrera de la materia ${subject.code}.`
      );
    }
    if (classroom.status !== 'available')
      throw new Error(`Fila ${index + 2}: el aula ${classroom.code} no está disponible.`);
    if (group.students > classroom.capacity)
      throw new Error(
        `Fila ${index + 2}: el aula ${classroom.code} no tiene capacidad para los ${group.students} alumnos del grupo.`
      );
    if (
      !data.periods.some((period) => period.id === schedule.academicPeriodId && period.isActive)
    ) {
      throw new Error(
        `Fila ${index + 2}: el horario debe pertenecer a un periodo académico activo.`
      );
    }
    return {
      subjectId: subject.id,
      teacherId: teacher.id,
      groupId: group.id,
      classroomId: classroom.id,
      scheduleId: schedule.id,
      dayOfWeek,
      startTime,
      endTime,
      status
    };
  });
}
