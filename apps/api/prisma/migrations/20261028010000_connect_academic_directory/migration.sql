CREATE TABLE "departments" (
    "id" UUID NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "departments_code_key" ON "departments"("code");
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

ALTER TABLE "teachers"
  ADD COLUMN "department_id" UUID NOT NULL,
  ADD COLUMN "display_name" VARCHAR(200) NOT NULL DEFAULT '',
  ADD COLUMN "employment_status" VARCHAR(20) NOT NULL DEFAULT 'Activo';
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_employment_status_check" CHECK ("employment_status" IN ('Activo', 'Licencia', 'Inactivo'));
CREATE INDEX "teachers_department_id_idx" ON "teachers"("department_id");

ALTER TABLE "subjects" ADD COLUMN "department_id" UUID;
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "subjects_department_id_idx" ON "subjects"("department_id");

ALTER TABLE "academic_groups" ADD COLUMN "department_id" UUID NOT NULL, ADD COLUMN "semester" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "academic_groups" ADD CONSTRAINT "academic_groups_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "academic_groups" ADD CONSTRAINT "academic_groups_semester_check" CHECK ("semester" BETWEEN 1 AND 12);
CREATE INDEX "academic_groups_department_id_idx" ON "academic_groups"("department_id");

ALTER TABLE "classrooms"
  ADD COLUMN "building" VARCHAR(100) NOT NULL DEFAULT 'Edificio A',
  ADD COLUMN "type" VARCHAR(30) NOT NULL DEFAULT 'standard',
  ADD COLUMN "equipment" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "status" VARCHAR(30) NOT NULL DEFAULT 'available';
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_type_check" CHECK ("type" IN ('standard', 'workshop', 'laboratory', 'auditorium'));
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_status_check" CHECK ("status" IN ('available', 'occupied', 'maintenance'));
ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_capacity_check" CHECK ("capacity" IS NULL OR "capacity" > 0);

ALTER TABLE "schedule_assignments" ADD COLUMN "status" VARCHAR(20) NOT NULL DEFAULT 'Active';
ALTER TABLE "schedule_assignments" ADD CONSTRAINT "schedule_assignments_status_check" CHECK ("status" IN ('Active', 'Pending'));
ALTER TABLE "schedule_assignments" ADD CONSTRAINT "schedule_assignments_time_check" CHECK ("start_time" < "end_time");

CREATE TABLE "academic_activities" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "academic_activities_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "academic_activities_created_at_idx" ON "academic_activities"("created_at");
