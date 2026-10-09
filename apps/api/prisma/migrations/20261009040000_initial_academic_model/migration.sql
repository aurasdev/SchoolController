-- The btree_gist operator classes let exclusion constraints compare UUID and enum values.
CREATE EXTENSION IF NOT EXISTS "btree_gist";

CREATE TYPE "DayOfWeek" AS ENUM (
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
);

CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "students" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "group_id" UUID,
    "enrollment_number" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "teachers" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "employee_number" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "subjects" (
    "id" UUID NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "academic_periods" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "starts_on" DATE NOT NULL,
    "ends_on" DATE NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "academic_periods_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "academic_periods_valid_dates" CHECK ("ends_on" >= "starts_on")
);

CREATE TABLE "academic_groups" (
    "id" UUID NOT NULL,
    "academic_period_id" UUID NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "academic_groups_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "classrooms" (
    "id" UUID NOT NULL,
    "code" VARCHAR(30) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "capacity" INTEGER,
    "location" VARCHAR(150),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "classrooms_positive_capacity" CHECK ("capacity" IS NULL OR "capacity" > 0)
);

CREATE TABLE "schedules" (
    "id" UUID NOT NULL,
    "academic_period_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "schedule_assignments" (
    "id" UUID NOT NULL,
    "schedule_id" UUID NOT NULL,
    "academic_period_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "teacher_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "classroom_id" UUID NOT NULL,
    "day_of_week" "DayOfWeek" NOT NULL,
    "start_time" TIME(0) NOT NULL,
    "end_time" TIME(0) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "schedule_assignments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "schedule_assignments_valid_time" CHECK ("end_time" > "start_time")
);

CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_role_id_idx" ON "users"("role_id");
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");
CREATE UNIQUE INDEX "students_enrollment_number_key" ON "students"("enrollment_number");
CREATE INDEX "students_group_id_idx" ON "students"("group_id");
CREATE UNIQUE INDEX "teachers_user_id_key" ON "teachers"("user_id");
CREATE UNIQUE INDEX "teachers_employee_number_key" ON "teachers"("employee_number");
CREATE UNIQUE INDEX "subjects_code_key" ON "subjects"("code");
CREATE UNIQUE INDEX "academic_periods_name_key" ON "academic_periods"("name");
CREATE INDEX "academic_groups_academic_period_id_idx" ON "academic_groups"("academic_period_id");
CREATE UNIQUE INDEX "academic_groups_id_academic_period_id_key" ON "academic_groups"("id", "academic_period_id");
CREATE UNIQUE INDEX "academic_groups_code_academic_period_id_key" ON "academic_groups"("code", "academic_period_id");
CREATE UNIQUE INDEX "classrooms_code_key" ON "classrooms"("code");
CREATE INDEX "schedules_academic_period_id_idx" ON "schedules"("academic_period_id");
CREATE UNIQUE INDEX "schedules_id_academic_period_id_key" ON "schedules"("id", "academic_period_id");
CREATE UNIQUE INDEX "schedules_name_academic_period_id_key" ON "schedules"("name", "academic_period_id");
CREATE INDEX "schedule_assignments_schedule_id_academic_period_id_idx" ON "schedule_assignments"("schedule_id", "academic_period_id");
CREATE INDEX "schedule_assignments_subject_id_idx" ON "schedule_assignments"("subject_id");
CREATE INDEX "schedule_assignments_teacher_id_academic_period_id_day_of_w_idx" ON "schedule_assignments"("teacher_id", "academic_period_id", "day_of_week");
CREATE INDEX "schedule_assignments_group_id_academic_period_id_day_of_wee_idx" ON "schedule_assignments"("group_id", "academic_period_id", "day_of_week");
CREATE INDEX "schedule_assignments_classroom_id_academic_period_id_day_of_idx" ON "schedule_assignments"("classroom_id", "academic_period_id", "day_of_week");

ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey"
    FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "students" ADD CONSTRAINT "students_group_id_fkey"
    FOREIGN KEY ("group_id") REFERENCES "academic_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "academic_groups" ADD CONSTRAINT "academic_groups_academic_period_id_fkey"
    FOREIGN KEY ("academic_period_id") REFERENCES "academic_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_academic_period_id_fkey"
    FOREIGN KEY ("academic_period_id") REFERENCES "academic_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "schedule_assignments" ADD CONSTRAINT "schedule_assignments_schedule_id_academic_period_id_fkey"
    FOREIGN KEY ("schedule_id", "academic_period_id") REFERENCES "schedules"("id", "academic_period_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "schedule_assignments" ADD CONSTRAINT "schedule_assignments_academic_period_id_fkey"
    FOREIGN KEY ("academic_period_id") REFERENCES "academic_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "schedule_assignments" ADD CONSTRAINT "schedule_assignments_subject_id_fkey"
    FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "schedule_assignments" ADD CONSTRAINT "schedule_assignments_teacher_id_fkey"
    FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "schedule_assignments" ADD CONSTRAINT "schedule_assignments_group_id_academic_period_id_fkey"
    FOREIGN KEY ("group_id", "academic_period_id") REFERENCES "academic_groups"("id", "academic_period_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "schedule_assignments" ADD CONSTRAINT "schedule_assignments_classroom_id_fkey"
    FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Half-open ranges allow one class to start exactly when another one ends.
ALTER TABLE "schedule_assignments" ADD CONSTRAINT "schedule_assignments_teacher_time_excl"
    EXCLUDE USING gist (
        "academic_period_id" WITH =,
        "teacher_id" WITH =,
        "day_of_week" WITH =,
        tsrange(DATE '2000-01-01' + "start_time", DATE '2000-01-01' + "end_time", '[)') WITH &&
    );

ALTER TABLE "schedule_assignments" ADD CONSTRAINT "schedule_assignments_group_time_excl"
    EXCLUDE USING gist (
        "academic_period_id" WITH =,
        "group_id" WITH =,
        "day_of_week" WITH =,
        tsrange(DATE '2000-01-01' + "start_time", DATE '2000-01-01' + "end_time", '[)') WITH &&
    );

ALTER TABLE "schedule_assignments" ADD CONSTRAINT "schedule_assignments_classroom_time_excl"
    EXCLUDE USING gist (
        "academic_period_id" WITH =,
        "classroom_id" WITH =,
        "day_of_week" WITH =,
        tsrange(DATE '2000-01-01' + "start_time", DATE '2000-01-01' + "end_time", '[)') WITH &&
    );
