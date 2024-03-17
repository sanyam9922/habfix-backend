-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "mess_due" BIGINT NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Rebate" (
    "rebate_id" SERIAL NOT NULL,
    "from" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "to" DATE NOT NULL,
    "reason" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,

    CONSTRAINT "Rebate_pkey" PRIMARY KEY ("rebate_id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "razorpay_payment_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "razorpay_subscription_id" TEXT NOT NULL,
    "razorpay_signature" TEXT NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("razorpay_payment_id")
);

-- AddForeignKey
ALTER TABLE "Rebate" ADD CONSTRAINT "Rebate_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("domain_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("domain_id") ON DELETE CASCADE ON UPDATE CASCADE;
