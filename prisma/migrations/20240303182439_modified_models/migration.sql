/*
  Warnings:

  - The primary key for the `College_admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `college_admin_id` on the `College_admin` table. All the data in the column will be lost.
  - The primary key for the `Hostel_admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `Hostel_admin` table. All the data in the column will be lost.
  - You are about to drop the column `hostel_admin_id` on the `Hostel_admin` table. All the data in the column will be lost.
  - Added the required column `domain_id` to the `College_admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `domain_id` to the `Hostel_admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Technician` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_hostel_admin_id_fkey";

-- AlterTable
ALTER TABLE "College_admin" DROP CONSTRAINT "College_admin_pkey",
DROP COLUMN "college_admin_id",
ADD COLUMN     "domain_id" TEXT NOT NULL,
ADD CONSTRAINT "College_admin_pkey" PRIMARY KEY ("domain_id");

-- AlterTable
ALTER TABLE "Hostel_admin" DROP CONSTRAINT "Hostel_admin_pkey",
DROP COLUMN "email",
DROP COLUMN "hostel_admin_id",
ADD COLUMN     "domain_id" TEXT NOT NULL,
ADD CONSTRAINT "Hostel_admin_pkey" PRIMARY KEY ("domain_id");

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "college_admin_id" TEXT;

-- AlterTable
ALTER TABLE "Technician" ADD COLUMN     "email" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_hostel_admin_id_fkey" FOREIGN KEY ("hostel_admin_id") REFERENCES "Hostel_admin"("domain_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_college_admin_id_fkey" FOREIGN KEY ("college_admin_id") REFERENCES "College_admin"("domain_id") ON DELETE CASCADE ON UPDATE CASCADE;
