import { z } from 'zod';

import { AppError } from '../errors/app-error.js';

const identifier = z.uuid();
const name = z
  .string()
  .trim()
  .min(3)
  .max(200)
  .refine((value) => {
    const [first = '', ...rest] = value.split(/\s+/);
    return first.length <= 100 && rest.join(' ').length <= 100;
  }, 'El nombre y los apellidos deben tener hasta 100 caracteres cada uno.');
const code = z
  .string()
  .trim()
  .min(2)
  .max(30)
  .regex(/^[\p{L}\p{N}._-]+$/u, 'Usa letras, números, puntos o guiones.');
export const teacherSchema = z
  .object({
    employeeId: code.max(50),
    name,
    departmentId: identifier,
    status: z.enum(['Activo', 'Licencia', 'Inactivo'])
  })
  .strict();
export const studentSchema = z
  .object({
    enrollment: code.max(50),
    name,
    groupId: identifier,
    status: z.enum(['Activo', 'Inactivo'])
  })
  .strict();
export const classroomSchema = z
  .object({
    building: z.string().trim().min(1).max(100),
    capacity: z.number().int().min(1).max(1000),
    code,
    equipment: z.array(z.string().trim().min(1).max(100)).max(30),
    status: z.enum(['available', 'occupied', 'maintenance']),
    type: z.enum(['standard', 'workshop', 'laboratory', 'auditorium'])
  })
  .strict();
const time = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, 'Usa el formato HH:mm.');
export const classSchema = z
  .object({
    subjectId: identifier,
    teacherId: identifier,
    groupId: identifier,
    classroomId: identifier,
    scheduleId: identifier,
    dayOfWeek: z.enum([
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY'
    ]),
    startTime: time,
    endTime: time,
    status: z.enum(['Active', 'Pending'])
  })
  .strict()
  .refine((input) => input.startTime < input.endTime, {
    path: ['endTime'],
    message: 'La hora de fin debe ser posterior al inicio.'
  })
  .refine((input) => input.startTime >= '06:00' && input.endTime <= '22:00', {
    path: ['startTime'],
    message: 'Las clases deben estar entre las 06:00 y las 22:00.'
  });
export const importSchema = z.object({ items: z.array(classSchema).min(1).max(200) }).strict();
export const idSchema = identifier;

export function parseInput<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new AppError(400, 'VALIDATION_ERROR', 'Revisa los datos del formulario.', {
      details: { fields: z.flattenError(result.error).fieldErrors }
    });
  }
  return result.data;
}

export function timeAsDate(value: string): Date {
  return new Date(`1970-01-01T${value}:00.000Z`);
}

export function timeAsString(value: Date): string {
  return value.toISOString().slice(11, 16);
}
