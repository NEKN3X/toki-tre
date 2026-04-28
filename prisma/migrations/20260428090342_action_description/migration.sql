/*
  Warnings:

  - Made the column `icon` on table `Action` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "description" TEXT,
ALTER COLUMN "icon" SET NOT NULL;
