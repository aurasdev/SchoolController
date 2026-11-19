-- AlterTable
ALTER TABLE "study_plan_subjects" ADD COLUMN "elective_block_id" UUID;

-- CreateTable
CREATE TABLE "elective_blocks" (
    "id" UUID NOT NULL,
    "study_plan_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "semester" INTEGER NOT NULL,

    CONSTRAINT "elective_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "elective_blocks_study_plan_id_name_key" ON "elective_blocks"("study_plan_id", "name");

-- CreateIndex
CREATE INDEX "study_plan_subjects_elective_block_id_idx" ON "study_plan_subjects"("elective_block_id");

-- AddForeignKey
ALTER TABLE "study_plan_subjects" ADD CONSTRAINT "study_plan_subjects_elective_block_id_fkey" FOREIGN KEY ("elective_block_id") REFERENCES "elective_blocks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "elective_blocks" ADD CONSTRAINT "elective_blocks_study_plan_id_fkey" FOREIGN KEY ("study_plan_id") REFERENCES "study_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
