/*
  Warnings:

  - You are about to drop the column `video` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `video` on the `Meal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Exercise` DROP COLUMN `video`,
    ADD COLUMN `videoUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Meal` DROP COLUMN `video`,
    ADD COLUMN `videoUrl` VARCHAR(191) NULL;
