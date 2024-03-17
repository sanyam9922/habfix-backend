/*
  Warnings:

  - Added the required column `title` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "College_admin" ALTER COLUMN "phone_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Hostel_admin" ALTER COLUMN "phone_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Issue" ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "phone_number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Technician" ALTER COLUMN "phone_number" SET DATA TYPE TEXT;
