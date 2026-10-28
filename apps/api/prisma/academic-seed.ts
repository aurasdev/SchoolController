import type { Prisma, PrismaClient } from '@prisma/client';
import { randomBytes } from 'node:crypto';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { USER_ROLES } from '../src/auth/auth-types.js';
import { passwordHasher } from '../src/auth/password-hasher.js';
import { getEnvironment } from '../src/config/env.js';
import { createDatabaseConnection } from '../src/database/database.js';
import {
  ACADEMIC_PERIOD_NAME,
  ACADEMIC_SCHEDULE_NAME,
  academicSeedId,
  buildAcademicSeedData
} from './academic-data.js';

async function validateAcademicPeriod(client: Prisma.TransactionClient, academicPeriodId: string) {
  const assignments = await client.scheduleAssignment.findMany({
    where: { academicPeriodId },
    include: {
      teacher: { include: { user: true } },
      group: { include: { _count: { select: { students: true } } } },
      classroom: true,
      subject: true
    }
  });
  const occupied = new Map<string, { start: number; end: number; id: string }[]>();
  for (const assignment of assignments) {
    if (assignment.teacher.employmentStatus !== 'Activo' || !assignment.teacher.user.isActive)
      throw new Error(`Assignment ${assignment.id} has an unavailable teacher.`);
    if (assignment.classroom.status !== 'available')
      throw new Error(`Assignment ${assignment.id} uses an unavailable classroom.`);
    if ((assignment.classroom.capacity ?? 0) < assignment.group._count.students)
      throw new Error(`Assignment ${assignment.id} exceeds its classroom capacity.`);
    if (
      assignment.teacher.departmentId !== assignment.group.departmentId ||
      assignment.subject.departmentId !== assignment.group.departmentId
    )
      throw new Error(`Assignment ${assignment.id} belongs to different academic departments.`);
    const start = assignment.startTime.getUTCHours() * 60 + assignment.startTime.getUTCMinutes();
    const end = assignment.endTime.getUTCHours() * 60 + assignment.endTime.getUTCMinutes();
    if (start < 8 * 60 || end > 17 * 60 || end <= start)
      throw new Error(`Assignment ${assignment.id} has invalid working hours.`);
    for (const resource of [
      `teacher-${assignment.teacherId}`,
      `group-${assignment.groupId}`,
      `classroom-${assignment.classroomId}`
    ]) {
      const key = `${resource}:${assignment.dayOfWeek}`;
      const intervals = occupied.get(key) ?? [];
      if (intervals.some((interval) => start < interval.end && end > interval.start))
        throw new Error(`Academic timetable conflict: ${key}.`);
      intervals.push({ start, end, id: assignment.id });
      occupied.set(key, intervals);
    }
  }
  return assignments.length;
}

export async function seedAcademicData(client: PrismaClient) {
  const data = buildAcademicSeedData();
  // These accounts have no published shared password. A later enrollment/reset flow can issue individual credentials.
  const passwordHash = await passwordHasher.hash(randomBytes(48).toString('base64url'));
  return client.$transaction(
    async (transaction) => {
      await transaction.$executeRaw`SELECT pg_advisory_xact_lock(27531, 1)`;
      for (const name of USER_ROLES)
        await transaction.role.upsert({ where: { name }, create: { name }, update: {} });
      const studentRole = await transaction.role.findUniqueOrThrow({ where: { name: 'STUDENT' } });
      const teacherRole = await transaction.role.findUniqueOrThrow({ where: { name: 'TEACHER' } });
      const departments = new Map<string, string>();
      for (const department of data.departments) {
        const record = await transaction.department.upsert({
          where: { code: department.code },
          create: { code: department.code, name: department.name },
          update: {}
        });
        departments.set(department.code, record.id);
      }
      const departmentId = (code: string) => {
        const id = departments.get(code);
        if (!id) throw new Error(`Unknown academic department ${code}.`);
        return id;
      };
      const period = await transaction.academicPeriod.upsert({
        where: { name: ACADEMIC_PERIOD_NAME },
        create: {
          name: ACADEMIC_PERIOD_NAME,
          startsOn: new Date('2026-08-17T00:00:00.000Z'),
          endsOn: new Date('2026-12-18T00:00:00.000Z'),
          isActive: true
        },
        update: {}
      });
      const schedule = await transaction.schedule.upsert({
        where: {
          name_academicPeriodId: { name: ACADEMIC_SCHEDULE_NAME, academicPeriodId: period.id }
        },
        create: { name: ACADEMIC_SCHEDULE_NAME, academicPeriodId: period.id },
        update: {}
      });
      const teacherIds = new Map<string, string>();
      for (const teacher of data.teachers) {
        const user = await transaction.user.upsert({
          where: { email: teacher.email },
          create: {
            email: teacher.email,
            firstName: teacher.firstName,
            lastName: teacher.lastName,
            passwordHash,
            roleId: teacherRole.id,
            isActive: teacher.employmentStatus === 'Activo'
          },
          update: {}
        });
        const record = await transaction.teacher.upsert({
          where: { employeeNumber: teacher.employeeNumber },
          create: {
            employeeNumber: teacher.employeeNumber,
            userId: user.id,
            departmentId: departmentId(teacher.departmentCode),
            displayName: teacher.displayName,
            employmentStatus: teacher.employmentStatus
          },
          update: {}
        });
        teacherIds.set(teacher.employeeNumber, record.id);
      }
      const groupIds = new Map<string, string>();
      for (const group of data.groups) {
        const record = await transaction.group.upsert({
          where: { code_academicPeriodId: { code: group.code, academicPeriodId: period.id } },
          create: {
            code: group.code,
            name: group.name,
            semester: group.semester,
            departmentId: departmentId(group.departmentCode),
            academicPeriodId: period.id
          },
          update: {}
        });
        groupIds.set(group.code, record.id);
      }
      for (const student of data.students) {
        const user = await transaction.user.upsert({
          where: { email: student.email },
          create: {
            email: student.email,
            firstName: student.firstName,
            lastName: student.lastName,
            passwordHash,
            roleId: studentRole.id,
            isActive: student.isActive
          },
          update: {}
        });
        const groupId = groupIds.get(student.groupCode);
        if (!groupId) throw new Error(`Unknown student group ${student.groupCode}.`);
        await transaction.student.upsert({
          where: { enrollmentNumber: student.enrollmentNumber },
          create: { enrollmentNumber: student.enrollmentNumber, userId: user.id, groupId },
          update: {}
        });
      }
      const subjectIds = new Map<string, string>();
      for (const subject of data.subjects) {
        const record = await transaction.subject.upsert({
          where: { code: subject.code },
          create: {
            code: subject.code,
            name: subject.name,
            description: subject.description,
            departmentId: departmentId(subject.departmentCode)
          },
          update: {}
        });
        subjectIds.set(subject.code, record.id);
      }
      const classroomIds = new Map<string, string>();
      for (const classroom of data.classrooms) {
        const record = await transaction.classroom.upsert({
          where: { code: classroom.code },
          create: classroom,
          update: {}
        });
        classroomIds.set(classroom.code, record.id);
      }
      for (const meeting of data.meetings) {
        const teacherId = teacherIds.get(meeting.employeeNumber);
        const groupId = groupIds.get(meeting.groupCode);
        const subjectId = subjectIds.get(meeting.subjectCode);
        const classroomId = classroomIds.get(meeting.classroomCode);
        if (!teacherId || !groupId || !subjectId || !classroomId)
          throw new Error(`Incomplete academic meeting ${meeting.id}.`);
        await transaction.scheduleAssignment.upsert({
          where: { id: meeting.id },
          create: {
            id: meeting.id,
            academicPeriodId: period.id,
            scheduleId: schedule.id,
            teacherId,
            groupId,
            subjectId,
            classroomId,
            dayOfWeek: meeting.dayOfWeek,
            startTime: meeting.startTime,
            endTime: meeting.endTime,
            status: meeting.status
          },
          update: {}
        });
      }
      const activities = [
        {
          title: 'Horario del periodo agosto - diciembre 2026 publicado',
          createdAt: new Date('2026-10-27T15:30:00.000Z')
        },
        {
          title: 'Directorio de alumnos actualizado: 24 grupos inscritos',
          createdAt: new Date('2026-10-27T14:45:00.000Z')
        },
        {
          title: 'Asignación de aulas revisada para Ingeniería y Arquitectura',
          createdAt: new Date('2026-10-26T20:10:00.000Z')
        },
        {
          title: 'Carga académica de docentes autorizada por coordinación',
          createdAt: new Date('2026-10-26T17:20:00.000Z')
        },
        {
          title: 'Mantenimiento programado en aula B-204 y taller TI-01',
          createdAt: new Date('2026-10-23T18:00:00.000Z')
        }
      ];
      for (let index = 0; index < activities.length; index += 1) {
        const activity = activities[index];
        if (activity)
          await transaction.academicActivity.upsert({
            where: { id: academicSeedId(`activity:${index}`) },
            create: { id: academicSeedId(`activity:${index}`), ...activity },
            update: {}
          });
      }
      const assignments = await validateAcademicPeriod(transaction, period.id);
      return {
        departments: await transaction.department.count(),
        students: await transaction.student.count(),
        teachers: await transaction.teacher.count(),
        groups: await transaction.group.count(),
        subjects: await transaction.subject.count(),
        classrooms: await transaction.classroom.count(),
        assignments,
        activities: await transaction.academicActivity.count(),
        period: period.name,
        validation: 'Sin cruces de docente, grupo o aula; capacidades y relaciones correctas.'
      };
    },
    { maxWait: 10_000, timeout: 120_000 }
  );
}

async function main() {
  const database = createDatabaseConnection(getEnvironment().databaseUrl);
  try {
    await database.connect();
    console.log(JSON.stringify(await seedAcademicData(database.client), null, 2));
  } finally {
    await database.disconnect();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error: unknown) => {
    console.error('Academic seed failed.', error);
    process.exitCode = 1;
  });
}
