-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('carpentry', 'electrician', 'plumber', 'internet_service', 'laundry', 'mason', 'mess_staff', 'sweeper');

-- CreateTable
CREATE TABLE "Student" (
    "domain_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hostel" TEXT NOT NULL,
    "room_number" TEXT NOT NULL,
    "phone_number" INTEGER NOT NULL,
    "profile_picture" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("domain_id")
);

-- CreateTable
CREATE TABLE "Technician" (
    "technician_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Categories" NOT NULL,
    "phone_number" INTEGER NOT NULL,
    "Address" TEXT,

    CONSTRAINT "Technician_pkey" PRIMARY KEY ("technician_id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "issue_id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "category" "Categories" NOT NULL,
    "is_resolved" BOOLEAN NOT NULL DEFAULT false,
    "issue_media" TEXT,
    "location" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "technician_id" TEXT,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("issue_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "issue_id" INTEGER NOT NULL,
    "student_id" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hostel_admin_id" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("issue_id","student_id")
);

-- CreateTable
CREATE TABLE "Hostel_admin" (
    "hostel_admin_id" TEXT NOT NULL,
    "hostel" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_number" INTEGER NOT NULL,

    CONSTRAINT "Hostel_admin_pkey" PRIMARY KEY ("hostel_admin_id")
);

-- CreateTable
CREATE TABLE "College_admin" (
    "college_admin_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "college_name" TEXT NOT NULL,
    "phone_number" INTEGER NOT NULL,

    CONSTRAINT "College_admin_pkey" PRIMARY KEY ("college_admin_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notification_issue_id_key" ON "Notification"("issue_id");

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("domain_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "Technician"("technician_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "Issue"("issue_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("domain_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_hostel_admin_id_fkey" FOREIGN KEY ("hostel_admin_id") REFERENCES "Hostel_admin"("hostel_admin_id") ON DELETE CASCADE ON UPDATE CASCADE;
