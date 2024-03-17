/*
  Warnings:

  - You are about to drop the column `razorpay_subscription_id` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `razorpay_order_id` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "razorpay_subscription_id",
ADD COLUMN     "razorpay_order_id" TEXT NOT NULL;
