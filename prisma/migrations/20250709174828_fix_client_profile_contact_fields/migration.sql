/*
  Warnings:

  - You are about to drop the column `email` on the `ClientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `ClientProfile` table. All the data in the column will be lost.

*/
-- AlterTable
-- First, add the new columns as nullable
ALTER TABLE `ClientProfile` ADD COLUMN `contactEmail` VARCHAR(191) NULL,
    ADD COLUMN `contactPhone` VARCHAR(191) NULL;

-- Copy data from old columns to new columns
UPDATE `ClientProfile` SET `contactEmail` = `email` WHERE `email` IS NOT NULL;
UPDATE `ClientProfile` SET `contactPhone` = `phone` WHERE `phone` IS NOT NULL;

-- Drop the old columns after data is preserved
ALTER TABLE `ClientProfile` DROP COLUMN `email`,
    DROP COLUMN `phone`;
