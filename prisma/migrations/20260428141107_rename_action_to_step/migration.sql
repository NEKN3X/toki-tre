/*
  Warnings:

  - You are about to drop the `Action` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StepType" AS ENUM ('TEXT', 'VIDEO');

-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_routineId_fkey";

-- DropTable
DROP TABLE "Action";

-- DropEnum
DROP TYPE "ActionType";

-- CreateTable
CREATE TABLE "Step" (
    "id" TEXT NOT NULL,
    "routineId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "StepType" NOT NULL DEFAULT 'TEXT',
    "description" TEXT,
    "videoUrl" TEXT,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
