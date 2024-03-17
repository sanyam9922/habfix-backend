/*
  Warnings:

  - Made the column `hostel` on table `Hostel_admin` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hostel` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AuthRoles" AS ENUM ('technician', 'hostel_admin', 'college_admin');

-- AlterTable
ALTER TABLE "Hostel_admin" ALTER COLUMN "hostel" SET NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "hostel" SET NOT NULL;

-- CreateTable
CREATE TABLE "AuthKey" (
    "key" TEXT NOT NULL,
    "role" "AuthRoles" NOT NULL,

    CONSTRAINT "AuthKey_pkey" PRIMARY KEY ("key")
);
