/*
  Warnings:

  - You are about to drop the column `email` on the `ClientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `ClientProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ClientProfile` DROP COLUMN `email`,
    DROP COLUMN `phone`,
    ADD COLUMN `contactEmail` VARCHAR(191) NULL,
    ADD COLUMN `contactPhone` VARCHAR(191) NULL;
