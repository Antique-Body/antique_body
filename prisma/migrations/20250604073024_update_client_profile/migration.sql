/*
  Warnings:

  - You are about to drop the `ClientAvailability` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ClientAvailability` DROP FOREIGN KEY `ClientAvailability_clientProfileId_fkey`;

-- AlterTable
ALTER TABLE `ClientProfile` MODIFY `goalTimeFrame` VARCHAR(191) NULL,
    MODIFY `workoutFrequency` VARCHAR(191) NULL,
    MODIFY `preferredContactMethod` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `ClientAvailability`;
