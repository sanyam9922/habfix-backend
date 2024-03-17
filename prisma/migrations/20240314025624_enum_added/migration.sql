/*
  Warnings:

  - The `hostel` column on the `Hostel_admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hostel` column on the `Student` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Hostels" AS ENUM ('H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'Kalpana_Chawla_Bhawan', 'Bhagirathi_Bhawan', 'Cauvery_Bhawan', 'Alaknanda_Bhawan');

-- AlterTable
ALTER TABLE "Hostel_admin" DROP COLUMN "hostel",
ADD COLUMN     "hostel" "Hostels";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "hostel",
ADD COLUMN     "hostel" "Hostels";
