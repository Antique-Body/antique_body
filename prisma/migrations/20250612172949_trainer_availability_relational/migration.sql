/*
  Warnings:

  - You are about to drop the column `availability` on the `TrainerProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `TrainerProfile` DROP COLUMN `availability`,
    ADD COLUMN `cancellationPolicy` INTEGER NULL,
    ADD COLUMN `sessionDuration` INTEGER NULL;

-- CreateTable
CREATE TABLE `TrainerAvailability` (
    `id` VARCHAR(191) NOT NULL,
    `trainerProfileId` VARCHAR(191) NOT NULL,
    `weekday` VARCHAR(191) NOT NULL,
    `timeSlot` VARCHAR(191) NOT NULL,

    INDEX `TrainerAvailability_trainerProfileId_idx`(`trainerProfileId`),
    INDEX `TrainerAvailability_weekday_idx`(`weekday`),
    INDEX `TrainerAvailability_timeSlot_idx`(`timeSlot`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TrainerAvailability` ADD CONSTRAINT `TrainerAvailability_trainerProfileId_fkey` FOREIGN KEY (`trainerProfileId`) REFERENCES `TrainerProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
