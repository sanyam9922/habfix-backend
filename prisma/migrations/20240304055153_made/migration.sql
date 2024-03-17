-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('student', 'technician', 'hostel_admin', 'college_admin');

-- AlterTable
ALTER TABLE "College_admin" ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'college_admin';

-- AlterTable
ALTER TABLE "Hostel_admin" ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'hostel_admin';

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'student';

-- AlterTable
ALTER TABLE "Technician" ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'technician';
