import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

import { createApp } from '../app.js';
import type { AuthService } from '../auth/auth-service.js';
import type { UserRole } from '../auth/auth-types.js';
import { AppError } from '../errors/app-error.js';
import { createAcademicRouter } from './academic-router.js';
import type { AcademicService } from './academic-service.js';

const id = '3a2ec5ea-3818-4610-8592-86221709e650';
const classInput = {
  subjectId: id,
  teacherId: id,
  groupId: id,
  classroomId: id,
  scheduleId: id,
  dayOfWeek: 'MONDAY',
  startTime: '08:00',
  endTime: '09:30',
  status: 'Active'
};

function setup(role: UserRole = 'ADMIN') {
  const service: AcademicService = {
    getData: vi.fn().mockResolvedValue({
      departments: [],
      classes: [],
      classrooms: [],
      teachers: [],
      students: []
    }),
    saveTeacher: vi.fn().mockResolvedValue({ id }),
    saveStudent: vi.fn().mockResolvedValue({ id }),
    saveClassroom: vi.fn().mockResolvedValue({ id }),
    saveClass: vi.fn().mockResolvedValue({ id }),
    importClasses: vi.fn().mockResolvedValue({ ids: [id] })
  };
  const auth: AuthService = {
    login: vi.fn(),
    logout: vi.fn(),
    authenticate: vi.fn().mockResolvedValue({
      sessionId: 'session',
      user: { id: 'user', email: 'admin@school.edu', firstName: 'Ana', lastName: 'Ruiz', role }
    })
  };
  const app = createApp({
    academicRouter: createAcademicRouter(service, auth),
    database: { checkConnection: vi.fn() }
  });
  return { app, service };
}

describe('academic routes', () => {
  it('requires authentication before reading or changing academic data', async () => {
    const { app, service } = setup();
    for (const path of ['/academic', '/academic/teachers', '/academic/classes/import']) {
      const response =
        path === '/academic'
          ? await request(app).get(path)
          : await request(app).post(path).send({});
      expect(response.status).toBe(401);
    }
    expect(service.getData).not.toHaveBeenCalled();
    expect(service.saveTeacher).not.toHaveBeenCalled();
  });

  it.each(['STUDENT', 'TEACHER', 'COORDINATOR'] as const)(
    'blocks %s from the administrator dataset and writes',
    async (role) => {
      const { app, service } = setup(role);
      expect(
        (await request(app).get('/academic').set('Authorization', 'Bearer token')).status
      ).toBe(403);
      expect(
        (
          await request(app)
            .post('/academic/classes')
            .set('Authorization', 'Bearer token')
            .send(classInput)
        ).status
      ).toBe(403);
      expect(service.getData).not.toHaveBeenCalled();
      expect(service.saveClass).not.toHaveBeenCalled();
    }
  );

  it('returns the database dataset directly for an administrator', async () => {
    const { app, service } = setup();
    const response = await request(app).get('/academic').set('Authorization', 'Bearer token');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(await service.getData());
  });

  it.each([
    { ...classInput, startTime: '09:30', endTime: '08:00' },
    { ...classInput, startTime: '8:00' },
    { ...classInput, startTime: '05:30' },
    { ...classInput, endTime: '23:00' },
    { ...classInput, teacherId: 'missing' },
    { ...classInput, students: 50 }
  ])('rejects malformed sessions before writing', async (input) => {
    const { app, service } = setup();
    const response = await request(app)
      .post('/academic/classes')
      .set('Authorization', 'Bearer token')
      .send(input);
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(service.saveClass).not.toHaveBeenCalled();
  });

  it('passes a complete session and returns its persisted identifier', async () => {
    const { app, service } = setup();
    const response = await request(app)
      .post('/academic/classes')
      .set('Authorization', 'Bearer token')
      .send(classInput);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id });
    expect(service.saveClass).toHaveBeenCalledWith(classInput);
  });

  it('validates the full import before invoking the atomic service', async () => {
    const { app, service } = setup();
    const response = await request(app)
      .post('/academic/classes/import')
      .set('Authorization', 'Bearer token')
      .send({ items: [classInput, { ...classInput, dayOfWeek: 'LUNES' }] });
    expect(response.status).toBe(400);
    expect(service.importClasses).not.toHaveBeenCalled();
  });

  it('returns actionable scheduling conflicts without changing the response contract', async () => {
    const { app, service } = setup();
    vi.mocked(service.saveClass).mockRejectedValue(
      new AppError(409, 'ACADEMIC_CONFLICT', 'El docente ya tiene una clase a esa hora.')
    );
    const response = await request(app)
      .patch(`/academic/classes/${id}`)
      .set('Authorization', 'Bearer token')
      .send(classInput);
    expect(response.status).toBe(409);
    expect(response.body.error.message).toContain('docente');
    expect(service.saveClass).toHaveBeenCalledWith(classInput, id);
  });
});
