import { Router } from 'express';

import { requireAuthentication, requireRoles } from '../auth/auth-middleware.js';
import type { AuthService } from '../auth/auth-service.js';
import type { AcademicService } from './academic-service.js';
import {
  classroomSchema,
  classSchema,
  idSchema,
  importSchema,
  parseInput,
  studentSchema,
  teacherSchema
} from './academic-validation.js';

export function createAcademicRouter(service: AcademicService, authService: AuthService): Router {
  const router = Router();
  router.use(requireAuthentication(authService), requireRoles('ADMIN'));
  router.get('/', async (_request, response) => response.json(await service.getData()));
  router.post('/teachers', async (request, response) => {
    response.status(201).json(await service.saveTeacher(parseInput(teacherSchema, request.body)));
  });
  router.patch('/teachers/:id', async (request, response) => {
    response.json(
      await service.saveTeacher(
        parseInput(teacherSchema, request.body),
        parseInput(idSchema, request.params.id)
      )
    );
  });
  router.post('/students', async (request, response) => {
    response.status(201).json(await service.saveStudent(parseInput(studentSchema, request.body)));
  });
  router.patch('/students/:id', async (request, response) => {
    response.json(
      await service.saveStudent(
        parseInput(studentSchema, request.body),
        parseInput(idSchema, request.params.id)
      )
    );
  });
  router.post('/classrooms', async (request, response) => {
    response
      .status(201)
      .json(await service.saveClassroom(parseInput(classroomSchema, request.body)));
  });
  router.patch('/classrooms/:id', async (request, response) => {
    response.json(
      await service.saveClassroom(
        parseInput(classroomSchema, request.body),
        parseInput(idSchema, request.params.id)
      )
    );
  });
  router.post('/classes/import', async (request, response) => {
    response
      .status(201)
      .json(await service.importClasses(parseInput(importSchema, request.body).items));
  });
  router.post('/classes', async (request, response) => {
    response.status(201).json(await service.saveClass(parseInput(classSchema, request.body)));
  });
  router.patch('/classes/:id', async (request, response) => {
    response.json(
      await service.saveClass(
        parseInput(classSchema, request.body),
        parseInput(idSchema, request.params.id)
      )
    );
  });
  return router;
}
