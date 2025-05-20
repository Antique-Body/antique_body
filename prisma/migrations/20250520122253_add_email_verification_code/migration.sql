/*
  Warnings:

  - You are about to drop the column `expires` on the `EmailVerificationCode` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `EmailVerificationCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `EmailVerificationCode` DROP COLUMN `expires`,
    ADD COLUMN `expiresAt` DATETIME(3) NOT NULL;
