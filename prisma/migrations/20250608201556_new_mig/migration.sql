/*
  Warnings:

  - You are about to drop the column `experience` on the `TrainerInfo` table. All the data in the column will be lost.
  - You are about to drop the column `specialty` on the `TrainerInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `TrainerInfo` DROP COLUMN `experience`,
    DROP COLUMN `specialty`;
