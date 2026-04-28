/*
  Warnings:

  - You are about to drop the `Step` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RoutineStepType" AS ENUM ('TEXT', 'VIDEO');

-- DropForeignKey
ALTER TABLE "Step" DROP CONSTRAINT "Step_routineId_fkey";

-- DropTable
DROP TABLE "Step";

-- DropEnum
DROP TYPE "StepType";

-- CreateTable
CREATE TABLE "RoutineStep" (
    "id" TEXT NOT NULL,
    "routineId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "RoutineStepType" NOT NULL DEFAULT 'TEXT',
    "description" TEXT,
    "videoUrl" TEXT,

    CONSTRAINT "RoutineStep_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoutineStep" ADD CONSTRAINT "RoutineStep_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
