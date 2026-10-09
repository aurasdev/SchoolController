# Modelo inicial de datos — SC-008

Este modelo representa las relaciones académicas iniciales de School Controller. La fuente de
verdad ejecutable es [`apps/api/prisma/schema.prisma`](../apps/api/prisma/schema.prisma) y su
migración inicial está en `apps/api/prisma/migrations`.

## Diagrama entidad-relación

```mermaid
erDiagram
    ROLE ||--o{ USER : "autoriza"
    USER ||--o| STUDENT : "tiene perfil"
    USER ||--o| TEACHER : "tiene perfil"
    ACADEMIC_PERIOD ||--o{ GROUP : "contiene"
    GROUP ||--o{ STUDENT : "agrupa"
    ACADEMIC_PERIOD ||--o{ SCHEDULE : "organiza"
    SCHEDULE ||--o{ SCHEDULE_ASSIGNMENT : "contiene"
    ACADEMIC_PERIOD ||--o{ SCHEDULE_ASSIGNMENT : "delimita"
    SUBJECT ||--o{ SCHEDULE_ASSIGNMENT : "se imparte en"
    TEACHER ||--o{ SCHEDULE_ASSIGNMENT : "imparte"
    GROUP ||--o{ SCHEDULE_ASSIGNMENT : "recibe"
    CLASSROOM ||--o{ SCHEDULE_ASSIGNMENT : "aloja"

    ROLE {
        uuid id PK
        varchar name UK
        varchar description
    }
    USER {
        uuid id PK
        uuid role_id FK
        varchar email UK
        varchar password_hash
        varchar first_name
        varchar last_name
        boolean is_active
    }
    STUDENT {
        uuid id PK
        uuid user_id FK,UK
        uuid group_id FK
        varchar enrollment_number UK
    }
    TEACHER {
        uuid id PK
        uuid user_id FK,UK
        varchar employee_number UK
    }
    SUBJECT {
        uuid id PK
        varchar code UK
        varchar name
        text description
    }
    GROUP {
        uuid id PK
        uuid academic_period_id FK
        varchar code
        varchar name
    }
    CLASSROOM {
        uuid id PK
        varchar code UK
        varchar name
        int capacity
        varchar location
    }
    ACADEMIC_PERIOD {
        uuid id PK
        varchar name UK
        date starts_on
        date ends_on
        boolean is_active
    }
    SCHEDULE {
        uuid id PK
        uuid academic_period_id FK
        varchar name
    }
    SCHEDULE_ASSIGNMENT {
        uuid id PK
        uuid schedule_id FK
        uuid academic_period_id FK
        uuid subject_id FK
        uuid teacher_id FK
        uuid group_id FK
        uuid classroom_id FK
        enum day_of_week
        time start_time
        time end_time
    }
```

`PK` indica clave primaria, `FK` clave foránea y `UK` clave única. Todas las entidades usan UUID
como clave primaria y tienen campos de auditoría `created_at` y `updated_at`.

## Relaciones y reglas principales

- Un `User` pertenece a un `Role` y puede tener como máximo un perfil `Student` o `Teacher`. Que el
  rol coincida con el tipo de perfil se validará en la capa de aplicación.
- Un `Student` puede pertenecer a un `Group`; la relación es opcional para permitir altas antes de
  asignar grupo.
- Cada `Group` y `Schedule` pertenece a un `AcademicPeriod`.
- `ScheduleAssignment` relaciona horario, periodo, materia, docente, grupo, aula, día y rango de
  hora. Sus claves foráneas compuestas obligan a que horario, grupo y asignación pertenezcan al
  mismo periodo.
- No se permite borrar un registro académico referenciado por una asignación. Al borrar un horario
  sí se eliminan sus asignaciones; al borrar un usuario se elimina únicamente su perfil asociado.
- Las fechas del periodo deben ser válidas, la capacidad de aula debe ser positiva y toda
  asignación debe terminar después de comenzar.

## Detección de colisiones

La migración instala `btree_gist` y crea tres restricciones de exclusión sobre
`ScheduleAssignment`. Dentro del mismo periodo y día, PostgreSQL rechaza rangos de hora que se
solapen para el mismo:

1. docente;
2. grupo;
3. aula.

Los rangos son semiabiertos (`[inicio, fin)`), por lo que una clase puede iniciar exactamente a la
hora en que termina la anterior. Además, los índices por periodo, día y recurso permiten consultar
conflictos antes de intentar guardar una asignación y presentar un mensaje útil en la API.

## Aplicación local

```bash
cp .env.example .env
npm run db:up
npm run db:migrate
```

Para validar o regenerar el cliente de Prisma sin ejecutar migraciones:

```bash
npm run db:validate
npm run db:generate
```
