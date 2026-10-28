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
        .mockResolvedValue({ id: 'subject', name: 'Cálculo diferencial', departmentId: null })
    },
    department: { findUnique: vi.fn().mockResolvedValue({ id: 'department' }) },
    teacher: {
      findUnique: vi.fn().mockResolvedValue({
        id: 'teacher',
        departmentId: 'department',
        employmentStatus: 'Activo',
        user: { isActive: true }
      }),
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
      })
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
    academicActivity: { create: vi.fn().mockResolvedValue({ id: 'activity' }) }
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
    await expect(service.saveClass(input)).resolves.toEqual({ id: 'assignment' });
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
