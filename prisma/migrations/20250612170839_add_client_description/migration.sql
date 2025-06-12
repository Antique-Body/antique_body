/*
  Warnings:

  - You are about to drop the column `bio` on the `ClientProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ClientProfile` DROP COLUMN `bio`,
    ADD COLUMN `description` TEXT NULL;

-- CreateTable
CREATE TABLE `ClientInfo` (
    `id` VARCHAR(191) NOT NULL,
    `clientProfileId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ClientInfo_clientProfileId_key`(`clientProfileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClientInfo` ADD CONSTRAINT `ClientInfo_clientProfileId_fkey` FOREIGN KEY (`clientProfileId`) REFERENCES `ClientProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
