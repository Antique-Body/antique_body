/*
  Warnings:

  - You are about to drop the column `city` on the `ClientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `ClientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `ClientProfile` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `TrainerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `TrainerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `TrainerProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ClientProfile` DROP COLUMN `city`,
    DROP COLUMN `country`,
    DROP COLUMN `state`,
    ADD COLUMN `locationId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `TrainerProfile` DROP COLUMN `city`,
    DROP COLUMN `country`,
    DROP COLUMN `state`,
    ADD COLUMN `locationId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Location` (
    `id` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TrainerProfile` ADD CONSTRAINT `TrainerProfile_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientProfile` ADD CONSTRAINT `ClientProfile_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
