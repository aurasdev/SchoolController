-- AlterTable
ALTER TABLE "academic_groups" ADD COLUMN "study_plan_id" UUID;

-- CreateTable
CREATE TABLE "study_plans" (
    "id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_plan_subjects" (
    "id" UUID NOT NULL,
    "study_plan_id" UUID NOT NULL,
    "subject_id" UUID NOT NULL,
    "semester" INTEGER NOT NULL,

    CONSTRAINT "study_plan_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "study_plans_department_id_year_key" ON "study_plans"("department_id", "year");

-- CreateIndex
CREATE INDEX "study_plan_subjects_subject_id_idx" ON "study_plan_subjects"("subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "study_plan_subjects_study_plan_id_subject_id_key" ON "study_plan_subjects"("study_plan_id", "subject_id");

-- CreateIndex
CREATE INDEX "academic_groups_study_plan_id_idx" ON "academic_groups"("study_plan_id");

-- AddForeignKey
ALTER TABLE "academic_groups" ADD CONSTRAINT "academic_groups_study_plan_id_fkey" FOREIGN KEY ("study_plan_id") REFERENCES "study_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plans" ADD CONSTRAINT "study_plans_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plan_subjects" ADD CONSTRAINT "study_plan_subjects_study_plan_id_fkey" FOREIGN KEY ("study_plan_id") REFERENCES "study_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plan_subjects" ADD CONSTRAINT "study_plan_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
