import { randomBytes } from 'node:crypto';

import { Prisma, type PrismaClient } from '@prisma/client';
import type {
  AcademicData,
  ClassInput,
  ClassroomInput,
  ShiftSettings,
  StudentInput,
  StudyPlanImportInput,
  TeacherInput
} from '@school-controller/shared';

import { passwordHasher } from '../auth/password-hasher.js';
import { AppError } from '../errors/app-error.js';
import { timeAsDate, timeAsString } from './academic-validation.js';
import { type ClassSlot, rankElectiveOptions } from './elective-rules.js';
import { planWarning } from './plan-rules.js';
import { defaultShiftSettings, shiftWarning } from './shift-rules.js';

type Transaction = Prisma.TransactionClient;
const days = {
  MONDAY: 'Lun',
  TUESDAY: 'Mar',
  WEDNESDAY: 'Mié',
  THURSDAY: 'Jue',
  FRIDAY: 'Vie',
  SATURDAY: 'Sáb',
  SUNDAY: 'Dom'
};
const duration = (start: Date, end: Date) => (end.getTime() - start.getTime()) / 3_600_000;
const notFound = (label: string) => new AppError(404, 'NOT_FOUND', `${label} no existe.`);
const conflict = (message: string) => new AppError(409, 'ACADEMIC_CONFLICT', message);

function fullName(user: { firstName: string; lastName: string }): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

function splitName(value: string) {
  const [firstName = '', ...rest] = value.trim().split(/\s+/);
  return { firstName, lastName: rest.join(' ') };
}

function initials(name: string): string {
  const words = name
    .replace(/^(?:Dr\.?|Dra\.?|Mtro\.?|Mtra\.?|Ing\.?|Lic\.?)\s+/i, '')
    .split(/\s+/);
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export function mapAcademicError(error: unknown): never {
  if (error instanceof AppError) throw error;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002')
      throw new AppError(
        409,
        'DUPLICATE_RECORD',
        'La matrícula, número de empleado o clave ya está registrada.'
      );
    if (error.code === 'P2003')
      throw conflict('El registro está relacionado con otros datos académicos.');
    if (error.code === 'P2025') throw notFound('El registro');
    if (error.code === 'P2034') throw conflict('Otro cambio ocurrió al guardar. Intenta de nuevo.');
  }
  throw error;
}

/** Every academic write takes the same transaction lock, including roster changes.
 * This keeps the overlap and classroom-capacity checks valid across concurrent requests. */
async function write<T>(client: PrismaClient, action: (tx: Transaction) => Promise<T>): Promise<T> {
  try {
    return await client.$transaction(
      async (tx) => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(27531, 1)`;
        return action(tx);
      },
      { maxWait: 10_000, timeout: 20_000 }
    );
  } catch (error) {
    return mapAcademicError(error);
  }
}

async function recordActivity(tx: Transaction, title: string) {
  await tx.academicActivity.create({ data: { title } });
}

async function readSettings(tx: Transaction): Promise<ShiftSettings> {
  const row = await tx.schedulingSettings.findUnique({ where: { id: 1 } });
  if (!row) return defaultShiftSettings;
  return {
    enabled: row.shiftRulesEnabled,
    morningSemesters: row.morningSemesters,
    afternoonSemesters: row.afternoonSemesters,
    morningStart: row.morningStart,
    afternoonStart: row.afternoonStart,
    dayEnd: row.dayEnd
  };
}

async function ensureGroupCapacity(tx: Transaction, groupId: string, additionalStudents = 0) {
  const count = await tx.student.count({ where: { groupId, user: { isActive: true } } });
  const assignment = await tx.scheduleAssignment.findFirst({
    where: {
      groupId,
      academicPeriod: { isActive: true },
      classroom: { capacity: { lt: count + additionalStudents } }
    },
    include: { classroom: true }
  });
  if (assignment)
    throw conflict(
      `El grupo supera la capacidad de ${assignment.classroom.code} (${assignment.classroom.capacity} lugares).`
    );
}

export async function validateClass(tx: Transaction, input: ClassInput, existingId?: string) {
  const [subject, teacher, group, classroom, schedule] = await Promise.all([
    tx.subject.findUnique({ where: { id: input.subjectId } }),
    tx.teacher.findUnique({ where: { id: input.teacherId }, include: { user: true } }),
    tx.group.findUnique({
      where: { id: input.groupId },
      include: { _count: { select: { students: { where: { user: { isActive: true } } } } } }
    }),
    tx.classroom.findUnique({ where: { id: input.classroomId } }),
    tx.schedule.findUnique({ where: { id: input.scheduleId }, include: { academicPeriod: true } })
  ]);
  if (!subject) throw notFound('La materia');
  if (!teacher) throw notFound('El docente');
  if (!group) throw notFound('El grupo');
  if (!classroom) throw notFound('El aula');
  if (!schedule) throw notFound('El horario');
  if (group.academicPeriodId !== schedule.academicPeriodId)
    throw conflict('El grupo y el horario deben pertenecer al mismo periodo académico.');
  if (!schedule.academicPeriod.isActive)
    throw conflict('Selecciona un horario de un periodo académico activo.');
  if (subject.departmentId && subject.departmentId !== group.departmentId)
    throw conflict('La materia debe pertenecer a la carrera del grupo o ser de formación general.');
  if (subject.departmentId && subject.departmentId !== teacher.departmentId)
    throw conflict('Selecciona un docente de la carrera de la materia.');
  if (!teacher.user.isActive || teacher.employmentStatus !== 'Activo')
    throw conflict('El docente debe estar activo para asignarle clases.');
  const eligible = await tx.subjectTeacher.findMany({ where: { subjectId: subject.id } });
  if (eligible.length && !eligible.some((entry) => entry.teacherId === teacher.id))
    throw conflict(
      eligible.length === 1
        ? `${subject.name} solo la puede impartir un docente y no es el seleccionado.`
        : `Selecciona uno de los ${eligible.length} docentes habilitados para ${subject.name}.`
    );
  if (classroom.status !== 'available')
    throw conflict(`El aula ${classroom.code} no está disponible.`);
  if (classroom.capacity === null || classroom.capacity < group._count.students) {
    throw conflict(
      `El aula ${classroom.code} no tiene capacidad para los ${group._count.students} alumnos del grupo.`
    );
  }
  const startTime = timeAsDate(input.startTime);
  const endTime = timeAsDate(input.endTime);
  const overlapping = await tx.scheduleAssignment.findFirst({
    where: {
      ...(existingId ? { id: { not: existingId } } : {}),
      academicPeriodId: schedule.academicPeriodId,
      dayOfWeek: input.dayOfWeek,
      startTime: { lt: endTime },
      endTime: { gt: startTime },
      OR: [
        { teacherId: input.teacherId },
        { groupId: input.groupId },
        { classroomId: input.classroomId }
      ]
    },
    include: { subject: true, classroom: true, group: true }
  });
  if (overlapping) {
    const resource =
      overlapping.teacherId === input.teacherId
        ? 'El docente'
        : overlapping.groupId === input.groupId
          ? `El grupo ${overlapping.group.code}`
          : `El aula ${overlapping.classroom.code}`;
    throw conflict(
      `${resource} ya tiene ${overlapping.subject.name} el ${days[input.dayOfWeek]} de ${timeAsString(overlapping.startTime)} a ${timeAsString(overlapping.endTime)}.`
    );
  }
  const shift = shiftWarning(
    await readSettings(tx),
    group.semester,
    group.code,
    input.startTime,
    input.endTime
  );
  const plan = group.studyPlanId
    ? await tx.studyPlan.findUnique({
        where: { id: group.studyPlanId },
        include: { subjects: { where: { subjectId: subject.id } } }
      })
    : null;
  const planIssue = plan
    ? planWarning({
        groupCode: group.code,
        groupSemester: group.semester,
        planName: plan.name,
        planSemester: plan.subjects[0]?.semester
      })
    : null;
  return {
    academicPeriodId: schedule.academicPeriodId,
    startTime,
    endTime,
    subjectName: subject.name,
    warnings: [shift, planIssue]
      .filter((message): message is string => message !== null)
      .map((message) => `${subject.name}: ${message}`)
  };
}

export function createAcademicService(client: PrismaClient) {
  return {
    async getData(): Promise<AcademicData> {
      return client.$transaction(
        async (tx) => {
          const [
            departments,
            subjects,
            groups,
            periods,
            schedules,
            assignments,
            classrooms,
            teachers,
            students,
            activities
          ] = await Promise.all([
            tx.department.findMany({ orderBy: { name: 'asc' } }),
            tx.subject.findMany({
              include: { teachers: { select: { teacherId: true } } },
              orderBy: { name: 'asc' }
            }),
            tx.group.findMany({
              include: {
                department: true,
                _count: { select: { students: { where: { user: { isActive: true } } } } }
              },
              orderBy: { code: 'asc' }
            }),
            tx.academicPeriod.findMany({ orderBy: { startsOn: 'desc' } }),
            tx.schedule.findMany({ orderBy: { name: 'asc' } }),
            tx.scheduleAssignment.findMany({
              include: {
                subject: { include: { department: true } },
                teacher: { include: { user: true } },
                group: {
                  include: {
                    _count: { select: { students: { where: { user: { isActive: true } } } } }
                  }
                },
                classroom: true,
                academicPeriod: true
              },
              orderBy: [{ subject: { name: 'asc' } }, { dayOfWeek: 'asc' }, { startTime: 'asc' }]
            }),
            tx.classroom.findMany({ orderBy: { code: 'asc' } }),
            tx.teacher.findMany({
              include: { department: true, user: true },
              orderBy: { employeeNumber: 'asc' }
            }),
            tx.student.findMany({
              include: { user: true, group: { include: { department: true } } },
              orderBy: { enrollmentNumber: 'asc' }
            }),
            tx.academicActivity.findMany({ take: 10, orderBy: { createdAt: 'desc' } })
          ]);
          const currentAssignments = assignments.filter((entry) => entry.academicPeriod.isActive);
          const settings = await readSettings(tx);
          const studyPlans = await tx.studyPlan.findMany({
            include: {
              subjects: true,
              electiveBlocks: { orderBy: [{ semester: 'asc' }, { name: 'asc' }] },
              _count: { select: { groups: true } }
            },
            orderBy: [{ year: 'desc' }, { name: 'asc' }]
          });
          const slots: ClassSlot[] = currentAssignments.map((entry) => {
            const start = timeAsString(entry.startTime);
            const end = timeAsString(entry.endTime);
            const teacherName = entry.teacher.displayName || fullName(entry.teacher.user);
            return {
              groupId: entry.groupId,
              subjectId: entry.subjectId,
              day: entry.dayOfWeek,
              start,
              end,
              label: `${days[entry.dayOfWeek]} ${start}–${end} · ${teacherName} · ${entry.classroom.code}`
            };
          });
          return {
            settings,
            studyPlans: studyPlans.map((plan) => ({
              id: plan.id,
              departmentId: plan.departmentId,
              year: plan.year,
              name: plan.name,
              groups: plan._count.groups,
              subjects: plan.subjects.map(({ subjectId, semester, electiveBlockId }) => ({
                subjectId,
                semester,
                blockId: electiveBlockId
              })),
              blocks: plan.electiveBlocks.map((block) => ({
                id: block.id,
                name: block.name,
                semester: block.semester,
                options: rankElectiveOptions({
                  optionSubjectIds: plan.subjects
                    .filter((entry) => entry.electiveBlockId === block.id)
                    .map((entry) => entry.subjectId),
                  targetGroupIds: groups
                    .filter(
                      (group) => group.studyPlanId === plan.id && group.semester === block.semester
                    )
                    .map((group) => group.id),
                  slots,
                  settings,
                  semester: block.semester
                })
              }))
            })),
            departments: departments.map(({ id, code, name }) => ({ id, code, name })),
            subjects: subjects.map(({ id, code, name, departmentId, teachers }) => ({
              id,
              code,
              name,
              departmentId,
              teacherIds: teachers.map((entry) => entry.teacherId)
            })),
            groups: groups.map((group) => ({
              id: group.id,
              code: group.code,
              name: group.name,
              departmentId: group.departmentId,
              degree: group.department.name,
              semester: group.semester,
              students: group._count.students,
              academicPeriodId: group.academicPeriodId,
              studyPlanId: group.studyPlanId
            })),
            periods: periods.map((period) => ({
              id: period.id,
              name: period.name,
              startsOn: period.startsOn.toISOString().slice(0, 10),
              endsOn: period.endsOn.toISOString().slice(0, 10),
              isActive: period.isActive
            })),
            schedules: schedules.map(({ id, name, academicPeriodId }) => ({
              id,
              name,
              academicPeriodId
            })),
            classes: assignments.map((entry) => {
              const teacherName = entry.teacher.displayName || fullName(entry.teacher.user);
              return {
                id: entry.id,
                subjectId: entry.subjectId,
                teacherId: entry.teacherId,
                groupId: entry.groupId,
                classroomId: entry.classroomId,
                scheduleId: entry.scheduleId,
                dayOfWeek: entry.dayOfWeek,
                startTime: timeAsString(entry.startTime),
                endTime: timeAsString(entry.endTime),
                status: entry.status === 'Pending' ? 'Pending' : 'Active',
                name: entry.subject.name,
                department: entry.subject.department?.name ?? 'Formación general',
                teacher: teacherName,
                initials: initials(teacherName),
                schedule: `${days[entry.dayOfWeek]} ${timeAsString(entry.startTime)}–${timeAsString(entry.endTime)}`,
                students: entry.group._count.students,
                room: entry.classroom.code,
                group: entry.group.code,
                academicPeriodId: entry.academicPeriodId
              };
            }),
            classrooms: classrooms.map((room) => ({
              id: room.id,
              code: room.code,
              building: room.building,
              capacity: room.capacity ?? 0,
              equipment: room.equipment,
              status:
                room.status === 'maintenance' || room.status === 'occupied'
                  ? room.status
                  : 'available',
              type:
                room.type === 'workshop' || room.type === 'laboratory' || room.type === 'auditorium'
                  ? room.type
                  : 'standard',
              weeklyOccupancy: Math.min(
                100,
                Math.round(
                  (currentAssignments
                    .filter((entry) => entry.classroomId === room.id)
                    .reduce((sum, entry) => sum + duration(entry.startTime, entry.endTime), 0) /
                    60) *
                    100
                )
              )
            })),
            teachers: teachers.map((teacher) => {
              const sessions = currentAssignments.filter((entry) => entry.teacherId === teacher.id);
              return {
                id: teacher.id,
                employeeId: teacher.employeeNumber,
                name: teacher.displayName || fullName(teacher.user),
                departmentId: teacher.departmentId,
                department: teacher.department.name,
                status:
                  teacher.employmentStatus === 'Licencia' || teacher.employmentStatus === 'Inactivo'
                    ? teacher.employmentStatus
                    : teacher.user.isActive
                      ? 'Activo'
                      : 'Inactivo',
                subjects: new Set(sessions.map((entry) => entry.subjectId)).size,
                weeklyHours:
                  Math.round(
                    sessions.reduce(
                      (sum, entry) => sum + duration(entry.startTime, entry.endTime),
                      0
                    ) * 100
                  ) / 100
              };
            }),
            students: students.map((student) => ({
              id: student.id,
              enrollment: student.enrollmentNumber,
              name: fullName(student.user),
              groupId: student.groupId ?? '',
              group: student.group?.code ?? 'Sin grupo',
              degree: student.group?.department.name ?? 'Sin carrera',
              semester: student.group?.semester ?? 0,
              status: student.user.isActive ? 'Activo' : 'Inactivo'
            })),
            activities: activities.map(({ id, title, createdAt }) => ({
              id,
              title,
              createdAt: createdAt.toISOString()
            }))
          };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead, timeout: 20_000 }
      );
    },

    async saveTeacher(input: TeacherInput, id?: string) {
      // Profiles have an unguessable password; adding a directory record does not grant a default login.
      const passwordHash = id
        ? undefined
        : await passwordHasher.hash(randomBytes(32).toString('hex'));
      return write(client, async (tx) => {
        if (!(await tx.department.findUnique({ where: { id: input.departmentId } })))
          throw notFound('La carrera');
        const existing = id ? await tx.teacher.findUnique({ where: { id } }) : null;
        if (id && !existing) throw notFound('El docente');
        if (
          id &&
          input.status !== 'Activo' &&
          (await tx.scheduleAssignment.count({
            where: { teacherId: id, academicPeriod: { isActive: true } }
          }))
        ) {
          throw conflict('Reasigna las clases del docente antes de cambiar su estado laboral.');
        }
        if (
          existing &&
          existing.departmentId !== input.departmentId &&
          (await tx.scheduleAssignment.count({
            where: {
              teacherId: existing.id,
              academicPeriod: { isActive: true },
              subject: { departmentId: { not: input.departmentId } }
            }
          }))
        ) {
          throw conflict(
            'Reasigna las materias de la carrera anterior antes de cambiar la carrera del docente.'
          );
        }
        const userData = { ...splitName(input.name), isActive: input.status === 'Activo' };
        const teacherData = {
          employeeNumber: input.employeeId.toUpperCase(),
          displayName: input.name,
          department: { connect: { id: input.departmentId } },
          employmentStatus: input.status
        };
        const teacher = existing
          ? await tx.teacher.update({
              where: { id },
              data: { ...teacherData, user: { update: userData } }
            })
          : await tx.teacher.create({
              data: {
                ...teacherData,
                user: {
                  create: {
                    ...userData,
                    email: `${input.employeeId.toLowerCase()}@docentes.iest.example`,
                    passwordHash: passwordHash!,
                    role: { connect: { name: 'TEACHER' } }
                  }
                }
              }
            });
        await recordActivity(
          tx,
          `${existing ? 'Se actualizó' : 'Se registró'} el docente ${input.name}.`
        );
        return { id: teacher.id };
      });
    },

    async saveStudent(input: StudentInput, id?: string) {
      const passwordHash = id
        ? undefined
        : await passwordHasher.hash(randomBytes(32).toString('hex'));
      return write(client, async (tx) => {
        const group = await tx.group.findUnique({
          where: { id: input.groupId },
          include: { academicPeriod: true }
        });
        if (!group) throw notFound('El grupo');
        if (!group.academicPeriod.isActive)
          throw conflict('Selecciona un grupo del periodo académico activo.');
        const existing = id
          ? await tx.student.findUnique({ where: { id }, include: { user: true } })
          : null;
        if (id && !existing) throw notFound('El alumno');
        if (
          input.status === 'Activo' &&
          !(existing?.groupId === input.groupId && existing.user.isActive)
        )
          await ensureGroupCapacity(tx, input.groupId, 1);
        const userData = { ...splitName(input.name), isActive: input.status === 'Activo' };
        const data = {
          enrollmentNumber: input.enrollment.toUpperCase(),
          group: { connect: { id: input.groupId } }
        };
        const student = existing
          ? await tx.student.update({
              where: { id },
              data: { ...data, user: { update: userData } }
            })
          : await tx.student.create({
              data: {
                ...data,
                user: {
                  create: {
                    ...userData,
                    email: `${input.enrollment.toLowerCase()}@alumnos.iest.example`,
                    passwordHash: passwordHash!,
                    role: { connect: { name: 'STUDENT' } }
                  }
                }
              }
            });
        await recordActivity(
          tx,
          `${existing ? 'Se actualizó' : 'Se registró'} el alumno ${input.name}.`
        );
        return { id: student.id };
      });
    },

    async saveClassroom(input: ClassroomInput, id?: string) {
      return write(client, async (tx) => {
        if (id && !(await tx.classroom.findUnique({ where: { id } }))) throw notFound('El aula');
        if (id) {
          const sessions = await tx.scheduleAssignment.findMany({
            where: { classroomId: id, academicPeriod: { isActive: true } },
            include: {
              group: {
                include: {
                  _count: { select: { students: { where: { user: { isActive: true } } } } }
                }
              }
            }
          });
          if (input.status !== 'available' && sessions.length)
            throw conflict('Reasigna las clases del aula antes de cambiar su disponibilidad.');
          if (sessions.some((session) => session.group._count.students > input.capacity))
            throw conflict(
              'La capacidad no puede ser menor al número de alumnos de los grupos asignados.'
            );
        }
        const data = {
          ...input,
          code: input.code.toUpperCase(),
          name: input.code.toUpperCase(),
          location: input.building
        };
        const room = id
          ? await tx.classroom.update({ where: { id }, data })
          : await tx.classroom.create({ data });
        await recordActivity(tx, `${id ? 'Se actualizó' : 'Se registró'} el aula ${room.code}.`);
        return { id: room.id };
      });
    },

    async importStudyPlan(input: StudyPlanImportInput) {
      return write(client, async (tx) => {
        const department = await tx.department.findUnique({ where: { id: input.departmentId } });
        if (!department) throw notFound('La carrera');
        const entries: { subjectId: string; semester: number; block?: string }[] = [];
        for (const item of input.subjects) {
          const code = item.code.toUpperCase();
          const existing = await tx.subject.findUnique({ where: { code } });
          if (existing?.departmentId && existing.departmentId !== department.id)
            throw conflict(`La materia ${code} pertenece a otra carrera.`);
          const subject =
            existing ??
            (await tx.subject.create({
              data: { code, name: item.name, departmentId: department.id }
            }));
          entries.push({ subjectId: subject.id, semester: item.semester, block: item.block });
        }
        const plan = await tx.studyPlan.upsert({
          where: { departmentId_year: { departmentId: department.id, year: input.year } },
          create: { departmentId: department.id, year: input.year, name: input.name },
          update: { name: input.name }
        });
        await tx.studyPlanSubject.deleteMany({ where: { studyPlanId: plan.id } });
        await tx.electiveBlock.deleteMany({ where: { studyPlanId: plan.id } });
        const blockIds = new Map<string, string>();
        for (const { block, semester } of entries) {
          const key = block?.toLowerCase();
          if (!block || !key || blockIds.has(key)) continue;
          const created = await tx.electiveBlock.create({
            data: { studyPlanId: plan.id, name: block, semester }
          });
          blockIds.set(key, created.id);
        }
        await tx.studyPlanSubject.createMany({
          data: entries.map(({ subjectId, semester, block }) => ({
            subjectId,
            semester,
            studyPlanId: plan.id,
            electiveBlockId: block ? (blockIds.get(block.toLowerCase()) ?? null) : null
          }))
        });
        await recordActivity(
          tx,
          `Se importó el ${plan.name} de ${department.name} con ${entries.length} materias.`
        );
        return { id: plan.id };
      });
    },

    async assignGroupPlan(groupId: string, studyPlanId: string | null) {
      return write(client, async (tx) => {
        const group = await tx.group.findUnique({ where: { id: groupId } });
        if (!group) throw notFound('El grupo');
        if (studyPlanId) {
          const plan = await tx.studyPlan.findUnique({ where: { id: studyPlanId } });
          if (!plan) throw notFound('El plan de estudios');
          if (plan.departmentId !== group.departmentId)
            throw conflict('El plan de estudios debe ser de la misma carrera que el grupo.');
        }
        await tx.group.update({ where: { id: groupId }, data: { studyPlanId } });
        await recordActivity(tx, `Se actualizó el plan de estudios del grupo ${group.code}.`);
        return { id: group.id };
      });
    },

    async saveSubjectTeachers(subjectId: string, teacherIds: string[]) {
      return write(client, async (tx) => {
        const subject = await tx.subject.findUnique({ where: { id: subjectId } });
        if (!subject) throw notFound('La materia');
        const teachers = await tx.teacher.findMany({ where: { id: { in: teacherIds } } });
        if (teachers.length !== teacherIds.length) throw notFound('El docente');
        if (subject.departmentId && teachers.some((t) => t.departmentId !== subject.departmentId))
          throw conflict('Los docentes habilitados deben ser de la carrera de la materia.');
        if (teacherIds.length) {
          const orphaned = await tx.scheduleAssignment.findFirst({
            where: {
              subjectId,
              teacherId: { notIn: teacherIds },
              academicPeriod: { isActive: true }
            },
            include: { teacher: { include: { user: true } } }
          });
          if (orphaned)
            throw conflict(
              `Reasigna las clases de ${subject.name} que imparte ${orphaned.teacher.displayName || fullName(orphaned.teacher.user)} antes de quitarlo.`
            );
        }
        await tx.subjectTeacher.deleteMany({ where: { subjectId } });
        await tx.subjectTeacher.createMany({
          data: teacherIds.map((teacherId) => ({ subjectId, teacherId }))
        });
        await recordActivity(
          tx,
          teacherIds.length
            ? `Se actualizaron los docentes habilitados para ${subject.name}.`
            : `${subject.name} quedó abierta a cualquier docente de la carrera.`
        );
        return { id: subject.id };
      });
    },

    async saveSettings(input: ShiftSettings) {
      return write(client, async (tx) => {
        const data = {
          shiftRulesEnabled: input.enabled,
          morningSemesters: [...new Set(input.morningSemesters)].sort((a, b) => a - b),
          afternoonSemesters: [...new Set(input.afternoonSemesters)].sort((a, b) => a - b),
          morningStart: input.morningStart,
          afternoonStart: input.afternoonStart,
          dayEnd: input.dayEnd
        };
        await tx.schedulingSettings.upsert({
          where: { id: 1 },
          create: { id: 1, ...data },
          update: data
        });
        await recordActivity(tx, 'Se actualizó la configuración de turnos por semestre.');
        return { id: 'settings' };
      });
    },

    async saveClass(input: ClassInput, id?: string) {
      return write(client, async (tx) => {
        if (id && !(await tx.scheduleAssignment.findUnique({ where: { id } })))
          throw notFound('La clase');
        const { subjectName, warnings, ...validated } = await validateClass(tx, input, id);
        const data = { ...input, ...validated };
        const session = id
          ? await tx.scheduleAssignment.update({ where: { id }, data })
          : await tx.scheduleAssignment.create({ data });
        await recordActivity(
          tx,
          `${id ? 'Se actualizó' : 'Se programó'} la clase de ${subjectName}.`
        );
        return { id: session.id, warnings };
      });
    },

    async importClasses(items: ClassInput[]) {
      return write(client, async (tx) => {
        const ids: string[] = [];
        const warnings: string[] = [];
        for (const input of items) {
          const {
            subjectName: _subjectName,
            warnings: itemWarnings,
            ...validated
          } = await validateClass(tx, input);
          warnings.push(...itemWarnings);
          const session = await tx.scheduleAssignment.create({ data: { ...input, ...validated } });
          ids.push(session.id);
        }
        await recordActivity(tx, `Se importaron ${ids.length} clases al horario académico.`);
        return { ids, warnings };
      });
    }
  };
}

export type AcademicService = ReturnType<typeof createAcademicService>;
