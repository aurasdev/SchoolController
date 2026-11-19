import { Prisma, type PrismaClient } from '@prisma/client';
import type { ClassInput } from '@school-controller/shared';
import { describe, expect, it, vi } from 'vitest';

import { createAcademicService, mapAcademicError, validateClass } from './academic-service.js';
import { timeAsDate } from './academic-validation.js';

const input: ClassInput = {
  subjectId: 'subject',
  teacherId: 'teacher',
  groupId: 'group',
  classroomId: 'room',
  scheduleId: 'schedule',
  dayOfWeek: 'MONDAY',
  startTime: '08:00',
  endTime: '09:00',
  status: 'Active'
};
function setup() {
  const tx = {
    $executeRaw: vi.fn().mockResolvedValue(1),
    subject: {
      findUnique: vi
        .fn()
        .mockResolvedValue({ id: 'subject', name: 'Cálculo diferencial', departmentId: null }),
      create: vi.fn().mockResolvedValue({ id: 'new-subject' })
    },
    department: { findUnique: vi.fn().mockResolvedValue({ id: 'department' }) },
    teacher: {
      findUnique: vi.fn().mockResolvedValue({
        id: 'teacher',
        departmentId: 'department',
        employmentStatus: 'Activo',
        user: { isActive: true }
      }),
      findMany: vi.fn().mockResolvedValue([{ id: 'teacher', departmentId: 'department' }]),
      create: vi.fn().mockResolvedValue({ id: 'teacher' }),
      update: vi.fn().mockResolvedValue({ id: 'teacher' })
    },
    student: {
      findUnique: vi
        .fn()
        .mockResolvedValue({ id: 'student', groupId: 'group', user: { isActive: true } }),
      count: vi.fn().mockResolvedValue(30),
      create: vi.fn().mockResolvedValue({ id: 'student' }),
      update: vi.fn().mockResolvedValue({ id: 'student' })
    },
    group: {
      findUnique: vi.fn().mockResolvedValue({
        id: 'group',
        departmentId: 'department',
        academicPeriodId: 'period',
        academicPeriod: { isActive: true },
        _count: { students: 30 }
      }),
      update: vi.fn().mockResolvedValue({ id: 'group' })
    },
    classroom: {
      findUnique: vi
        .fn()
        .mockResolvedValue({ id: 'room', capacity: 35, status: 'available', code: 'A-101' }),
      update: vi.fn().mockResolvedValue({ id: 'room' })
    },
    schedule: {
      findUnique: vi.fn().mockResolvedValue({
        id: 'schedule',
        academicPeriodId: 'period',
        academicPeriod: { isActive: true }
      })
    },
    scheduleAssignment: {
      findFirst: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      create: vi.fn().mockResolvedValue({ id: 'assignment' }),
      findUnique: vi.fn().mockResolvedValue({ id: 'assignment' }),
      update: vi.fn().mockResolvedValue({ id: 'assignment' })
    },
    academicActivity: { create: vi.fn().mockResolvedValue({ id: 'activity' }) },
    schedulingSettings: {
      findUnique: vi.fn().mockResolvedValue(null),
      upsert: vi.fn().mockResolvedValue({})
    },
    studyPlan: {
      findUnique: vi.fn().mockResolvedValue(null),
      upsert: vi.fn().mockResolvedValue({ id: 'plan', name: 'Plan 2024' })
    },
    studyPlanSubject: {
      deleteMany: vi.fn().mockResolvedValue({}),
      createMany: vi.fn().mockResolvedValue({})
    },
    subjectTeacher: {
      findMany: vi.fn().mockResolvedValue([]),
      deleteMany: vi.fn().mockResolvedValue({}),
      createMany: vi.fn().mockResolvedValue({})
    }
  };
  const transaction = tx as unknown as Prisma.TransactionClient;
  const client = {
    $transaction: vi.fn(async (action: (value: Prisma.TransactionClient) => Promise<unknown>) =>
      action(transaction)
    )
  };
  return {
    tx,
    transaction,
    client,
    service: createAcademicService(client as unknown as PrismaClient)
  };
}

describe('academic scheduling invariants', () => {
  it('derives the period from the persisted schedule and stores time without a timezone shift', async () => {
    const { transaction } = setup();
    const value = await validateClass(transaction, input);
    expect(value.academicPeriodId).toBe('period');
    expect(value.startTime.toISOString()).toBe('1970-01-01T08:00:00.000Z');
  });

  describe('shift rules', () => {
    const enabled = {
      shiftRulesEnabled: true,
      morningSemesters: [1, 2],
      afternoonSemesters: [3],
      morningStart: '08:00',
      afternoonStart: '14:30',
      dayEnd: '22:00'
    };
    const thirdSemesterGroup = {
      id: 'group',
      code: 'ISC-3A',
      semester: 3,
      departmentId: 'department',
      academicPeriodId: 'period',
      academicPeriod: { isActive: true },
      _count: { students: 30 }
    };

    it('warns, without rejecting, when a class is outside the shift of its semester', async () => {
      const { tx, transaction } = setup();
      tx.schedulingSettings.findUnique.mockResolvedValue(enabled);
      tx.group.findUnique.mockResolvedValue(thirdSemesterGroup);
      const value = await validateClass(transaction, input);
      expect(value.warnings).toHaveLength(1);
      expect(value.warnings[0]).toContain('ISC-3A');
    });

    it('does not warn inside the shift or when the rule is disabled', async () => {
      const { tx, transaction } = setup();
      tx.group.findUnique.mockResolvedValue(thirdSemesterGroup);
      expect((await validateClass(transaction, input)).warnings).toEqual([]);
      tx.schedulingSettings.findUnique.mockResolvedValue(enabled);
      const inShift = { ...input, startTime: '15:00', endTime: '16:00' };
      expect((await validateClass(transaction, inShift)).warnings).toEqual([]);
    });
  });

  describe('eligible teachers', () => {
    it('lets any teacher of the career teach a subject without a list', async () => {
      const { transaction } = setup();
      await expect(validateClass(transaction, input)).resolves.toBeDefined();
    });

    it('rejects a teacher outside the list, with a message for a single-teacher subject', async () => {
      const { tx, transaction } = setup();
      tx.subjectTeacher.findMany.mockResolvedValue([{ subjectId: 'subject', teacherId: 'other' }]);
      await expect(validateClass(transaction, input)).rejects.toThrow(
        'solo la puede impartir un docente'
      );
      tx.subjectTeacher.findMany.mockResolvedValue([
        { subjectId: 'subject', teacherId: 'other' },
        { subjectId: 'subject', teacherId: 'another' }
      ]);
      await expect(validateClass(transaction, input)).rejects.toThrow('2 docentes habilitados');
    });

    it('accepts a teacher that is on the list', async () => {
      const { tx, transaction } = setup();
      tx.subjectTeacher.findMany.mockResolvedValue([
        { subjectId: 'subject', teacherId: 'teacher' }
      ]);
      await expect(validateClass(transaction, input)).resolves.toBeDefined();
    });

    it('replaces the list, and an empty list opens the subject again', async () => {
      const { tx, service } = setup();
      await expect(service.saveSubjectTeachers('subject', ['teacher'])).resolves.toEqual({
        id: 'subject'
      });
      expect(tx.subjectTeacher.createMany).toHaveBeenLastCalledWith({
        data: [{ subjectId: 'subject', teacherId: 'teacher' }]
      });
      tx.teacher.findMany.mockResolvedValue([]);
      await service.saveSubjectTeachers('subject', []);
      expect(tx.subjectTeacher.createMany).toHaveBeenLastCalledWith({ data: [] });
    });

    it('does not drop a teacher who still has classes in the active period', async () => {
      const { tx, service } = setup();
      tx.scheduleAssignment.findFirst.mockResolvedValue({
        teacher: { displayName: 'Dra. Ana Ruiz', user: { firstName: 'Ana', lastName: 'Ruiz' } }
      });
      await expect(service.saveSubjectTeachers('subject', ['teacher'])).rejects.toThrow(
        'Reasigna las clases'
      );
      expect(tx.subjectTeacher.deleteMany).not.toHaveBeenCalled();
    });

    it('only accepts teachers of the career of the subject', async () => {
      const { tx, service } = setup();
      tx.subject.findUnique.mockResolvedValue({
        id: 'subject',
        name: 'Cálculo',
        departmentId: 'other'
      });
      await expect(service.saveSubjectTeachers('subject', ['teacher'])).rejects.toMatchObject({
        statusCode: 409
      });
    });
  });

  describe('study plans', () => {
    it('warns when the group plan places the subject in another semester', async () => {
      const { tx, transaction } = setup();
      tx.group.findUnique.mockResolvedValue({
        id: 'group',
        code: 'ISC-3A',
        semester: 3,
        studyPlanId: 'plan',
        departmentId: 'department',
        academicPeriodId: 'period',
        academicPeriod: { isActive: true },
        _count: { students: 30 }
      });
      tx.studyPlan.findUnique.mockResolvedValue({ name: 'Plan 2020', subjects: [{ semester: 5 }] });
      const value = await validateClass(transaction, input);
      expect(value.warnings).toHaveLength(1);
      expect(value.warnings[0]).toContain('5.º semestre');
    });

    it('imports a plan creating missing subjects and replacing the previous entries', async () => {
      const { tx, service } = setup();
      tx.subject.findUnique.mockResolvedValue(null);
      await expect(
        service.importStudyPlan({
          departmentId: 'department',
          year: 2024,
          name: 'Plan 2024',
          subjects: [
            { code: 'isc-001', name: 'Fundamentos de programación', semester: 1 },
            { code: 'ISC-002', name: 'Matemáticas discretas', semester: 3 }
          ]
        })
      ).resolves.toEqual({ id: 'plan' });
      expect(tx.subject.create).toHaveBeenCalledTimes(2);
      expect(tx.subject.create.mock.calls[0]![0].data.code).toBe('ISC-001');
      expect(tx.studyPlanSubject.deleteMany).toHaveBeenCalledOnce();
      expect(tx.studyPlanSubject.createMany.mock.calls[0]![0].data).toEqual([
        { subjectId: 'new-subject', semester: 1, studyPlanId: 'plan' },
        { subjectId: 'new-subject', semester: 3, studyPlanId: 'plan' }
      ]);
    });

    it('does not take over a subject that belongs to another career', async () => {
      const { tx, service } = setup();
      tx.subject.findUnique.mockResolvedValue({ id: 'subject', departmentId: 'another' });
      await expect(
        service.importStudyPlan({
          departmentId: 'department',
          year: 2024,
          name: 'Plan 2024',
          subjects: [{ code: 'ISC-001', name: 'Cálculo', semester: 1 }]
        })
      ).rejects.toMatchObject({ statusCode: 409 });
      expect(tx.studyPlan.upsert).not.toHaveBeenCalled();
    });

    it('only assigns a plan of the same career as the group', async () => {
      const { tx, service } = setup();
      tx.studyPlan.findUnique.mockResolvedValue({ id: 'plan', departmentId: 'another' });
      await expect(service.assignGroupPlan('group', 'plan')).rejects.toMatchObject({
        statusCode: 409
      });
      expect(tx.group.update).not.toHaveBeenCalled();
      await expect(service.assignGroupPlan('group', null)).resolves.toEqual({ id: 'group' });
    });
  });

  it('rejects a group from another period', async () => {
    const { tx, transaction } = setup();
    tx.group.findUnique.mockResolvedValue({
      id: 'group',
      academicPeriodId: 'previous-period',
      _count: { students: 30 }
    });
    await expect(validateClass(transaction, input)).rejects.toMatchObject({ statusCode: 409 });
  });

  it('rejects an inactive period', async () => {
    const { tx, transaction } = setup();
    tx.schedule.findUnique.mockResolvedValue({
      id: 'schedule',
      academicPeriodId: 'period',
      academicPeriod: { isActive: false }
    });
    await expect(validateClass(transaction, input)).rejects.toThrow('periodo académico activo');
  });

  it('rejects assigning a career-owned subject to a different career group', async () => {
    const { tx, transaction } = setup();
    tx.subject.findUnique.mockResolvedValue({
      id: 'subject',
      name: 'Cálculo diferencial',
      departmentId: 'another-department'
    });
    await expect(validateClass(transaction, input)).rejects.toThrow('carrera del grupo');
  });

  it('rejects a teacher from another career for a career-owned subject', async () => {
    const { tx, transaction } = setup();
    tx.subject.findUnique.mockResolvedValue({
      id: 'subject',
      name: 'Cálculo diferencial',
      departmentId: 'department'
    });
    tx.teacher.findUnique.mockResolvedValue({
      id: 'teacher',
      departmentId: 'another-department',
      employmentStatus: 'Activo',
      user: { isActive: true }
    });
    await expect(validateClass(transaction, input)).rejects.toThrow('docente de la carrera');
  });

  it('allows a shared subject to be taught across careers', async () => {
    const { tx, transaction } = setup();
    tx.subject.findUnique.mockResolvedValue({
      id: 'subject',
      name: 'Ética profesional',
      departmentId: null
    });
    tx.teacher.findUnique.mockResolvedValue({
      id: 'teacher',
      departmentId: 'another-department',
      employmentStatus: 'Activo',
      user: { isActive: true }
    });
    await expect(validateClass(transaction, input)).resolves.toMatchObject({
      subjectName: 'Ética profesional'
    });
  });

  it.each(['Licencia', 'Inactivo'])(
    'rejects a teacher whose status is %s',
    async (employmentStatus) => {
      const { tx, transaction } = setup();
      tx.teacher.findUnique.mockResolvedValue({
        id: 'teacher',
        employmentStatus,
        user: { isActive: true }
      });
      await expect(validateClass(transaction, input)).rejects.toThrow('docente debe estar activo');
    }
  );

  it.each(['occupied', 'maintenance'])(
    'rejects a classroom whose availability is %s',
    async (status) => {
      const { tx, transaction } = setup();
      tx.classroom.findUnique.mockResolvedValue({
        id: 'room',
        status,
        capacity: 35,
        code: 'A-101'
      });
      await expect(validateClass(transaction, input)).rejects.toThrow('no está disponible');
    }
  );

  it('rejects a room smaller than the enrolled active group', async () => {
    const { tx, transaction } = setup();
    tx.classroom.findUnique.mockResolvedValue({
      id: 'room',
      status: 'available',
      capacity: 25,
      code: 'A-101'
    });
    await expect(validateClass(transaction, input)).rejects.toThrow('30 alumnos');
  });

  it.each([
    ['teacher', 'other-group', 'other-room', 'El docente'],
    ['other-teacher', 'group', 'other-room', 'El grupo'],
    ['other-teacher', 'other-group', 'room', 'El aula']
  ])(
    'rejects an overlapping session for %s / %s / %s',
    async (teacherId, groupId, classroomId, expected) => {
      const { tx, transaction } = setup();
      tx.scheduleAssignment.findFirst.mockResolvedValue({
        teacherId,
        groupId,
        classroomId,
        subject: { name: 'Física' },
        group: { code: 'ISC-4A' },
        classroom: { code: 'A-101' },
        startTime: timeAsDate('08:30'),
        endTime: timeAsDate('09:30')
      });
      await expect(validateClass(transaction, input, 'same-assignment')).rejects.toThrow(expected);
      expect(tx.scheduleAssignment.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: { not: 'same-assignment' },
            startTime: { lt: timeAsDate('09:00') },
            endTime: { gt: timeAsDate('08:00') }
          })
        })
      );
    }
  );

  it('takes a transaction lock before checking and writing a session', async () => {
    const { tx, service } = setup();
    await expect(service.saveClass(input)).resolves.toEqual({ id: 'assignment', warnings: [] });
    expect(tx.$executeRaw.mock.invocationCallOrder[0]).toBeLessThan(
      tx.subject.findUnique.mock.invocationCallOrder[0]!
    );
    expect(tx.subject.findUnique.mock.invocationCallOrder[0]).toBeLessThan(
      tx.scheduleAssignment.create.mock.invocationCallOrder[0]!
    );
    expect(tx.academicActivity.create).toHaveBeenCalledOnce();
  });

  it('imports all rows in one transaction and rejects the import when a later row conflicts', async () => {
    const { tx, client, service } = setup();
    tx.scheduleAssignment.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({
      teacherId: 'teacher',
      groupId: 'group',
      classroomId: 'room',
      subject: { name: 'Cálculo diferencial' },
      group: { code: 'ISC-4A' },
      classroom: { code: 'A-101' },
      startTime: timeAsDate('08:00'),
      endTime: timeAsDate('09:00')
    });
    await expect(service.importClasses([input, input])).rejects.toMatchObject({
      code: 'ACADEMIC_CONFLICT'
    });
    expect(client.$transaction).toHaveBeenCalledOnce();
    expect(tx.scheduleAssignment.create).toHaveBeenCalledOnce();
    expect(tx.academicActivity.create).not.toHaveBeenCalled();
  });

  it('maps duplicate-key database errors to a useful conflict', () => {
    expect(() =>
      mapAcademicError(
        new Prisma.PrismaClientKnownRequestError('duplicate', {
          code: 'P2002',
          clientVersion: '7.10.0'
        })
      )
    ).toThrow('ya está registrada');
  });

  it('rejects moving an active student into a group whose assigned room is full', async () => {
    const { tx, service } = setup();
    tx.student.findUnique.mockResolvedValue({
      id: 'student',
      groupId: 'previous-group',
      user: { isActive: true }
    });
    tx.scheduleAssignment.findFirst.mockResolvedValue({
      classroom: { code: 'A-101', capacity: 30 }
    });
    await expect(
      service.saveStudent(
        {
          enrollment: 'A2026-001',
          name: 'María González Pérez',
          groupId: 'group',
          status: 'Activo'
        },
        'student'
      )
    ).rejects.toThrow('supera la capacidad');
    expect(tx.student.update).not.toHaveBeenCalled();
  });

  it('allows editing a name in the same full group without counting the student twice', async () => {
    const { tx, service } = setup();
    await expect(
      service.saveStudent(
        {
          enrollment: 'A2026-001',
          name: 'María González Pérez',
          groupId: 'group',
          status: 'Activo'
        },
        'student'
      )
    ).resolves.toEqual({ id: 'student' });
    expect(tx.student.count).not.toHaveBeenCalled();
    expect(tx.student.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user: { update: { firstName: 'María', lastName: 'González Pérez', isActive: true } }
        })
      })
    );
  });

  it('requires reassignment before deactivating a teacher with current classes', async () => {
    const { tx, service } = setup();
    tx.scheduleAssignment.count.mockResolvedValue(2);
    await expect(
      service.saveTeacher(
        {
          employeeId: 'EMP-001',
          name: 'Dra. Ana Ramos',
          departmentId: 'department',
          status: 'Licencia'
        },
        'teacher'
      )
    ).rejects.toThrow('Reasigna las clases');
    expect(tx.teacher.update).not.toHaveBeenCalled();
  });

  it('requires reassignment before a department change invalidates current specialist classes', async () => {
    const { tx, service } = setup();
    tx.scheduleAssignment.count.mockResolvedValue(2);
    await expect(
      service.saveTeacher(
        {
          employeeId: 'EMP-001',
          name: 'Dra. Ana Ramos',
          departmentId: 'another-department',
          status: 'Activo'
        },
        'teacher'
      )
    ).rejects.toThrow('carrera anterior');
    expect(tx.teacher.update).not.toHaveBeenCalled();
  });

  it('uses a reserved domain when creating a teacher profile', async () => {
    const { tx, service } = setup();
    await service.saveTeacher({
      employeeId: 'EMP-001',
      name: 'Dra. Ana Ramos',
      departmentId: 'department',
      status: 'Activo'
    });
    expect(tx.teacher.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user: { create: expect.objectContaining({ email: 'emp-001@docentes.iest.example' }) }
        })
      })
    );
  });

  it('uses a reserved domain when creating a student profile', async () => {
    const { tx, service } = setup();
    await service.saveStudent({
      enrollment: 'A2026-001',
      name: 'María González Pérez',
      groupId: 'group',
      status: 'Activo'
    });
    expect(tx.student.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user: { create: expect.objectContaining({ email: 'a2026-001@alumnos.iest.example' }) }
        })
      })
    );
  });

  it('requires reassignment before putting a scheduled room into maintenance', async () => {
    const { tx, service } = setup();
    tx.scheduleAssignment.findMany.mockResolvedValue([{ group: { _count: { students: 30 } } }]);
    await expect(
      service.saveClassroom(
        {
          code: 'A-101',
          building: 'Edificio A',
          capacity: 35,
          type: 'standard',
          equipment: [],
          status: 'maintenance'
        },
        'room'
      )
    ).rejects.toThrow('Reasigna las clases');
    expect(tx.classroom.update).not.toHaveBeenCalled();
  });

  it('rejects reducing room capacity below its assigned active enrollment', async () => {
    const { tx, service } = setup();
    tx.scheduleAssignment.findMany.mockResolvedValue([{ group: { _count: { students: 30 } } }]);
    await expect(
      service.saveClassroom(
        {
          code: 'A-101',
          building: 'Edificio A',
          capacity: 25,
          type: 'standard',
          equipment: [],
          status: 'available'
        },
        'room'
      )
    ).rejects.toThrow('capacidad no puede ser menor');
    expect(tx.classroom.update).not.toHaveBeenCalled();
  });
});
