-- CreateTable
CREATE TABLE "scheduling_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "shift_rules_enabled" BOOLEAN NOT NULL DEFAULT false,
    "morning_semesters" INTEGER[] DEFAULT ARRAY[1, 2]::INTEGER[],
    "afternoon_semesters" INTEGER[] DEFAULT ARRAY[3, 4, 5, 6, 7, 8, 9, 10]::INTEGER[],
    "morning_start" VARCHAR(5) NOT NULL DEFAULT '08:00',
    "afternoon_start" VARCHAR(5) NOT NULL DEFAULT '14:30',
    "day_end" VARCHAR(5) NOT NULL DEFAULT '22:00',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduling_settings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "scheduling_settings_single_row" CHECK ("id" = 1)
);
