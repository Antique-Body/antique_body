/*
  Warnings:

  - You are about to drop the column `documentUrl` on the `Certification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Certification` DROP COLUMN `documentUrl`;

-- CreateTable
CREATE TABLE `CertificationDocument` (
    `id` VARCHAR(191) NOT NULL,
    `certificationId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NULL,
    `mimetype` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CertificationDocument` ADD CONSTRAINT `CertificationDocument_certificationId_fkey` FOREIGN KEY (`certificationId`) REFERENCES `Certification`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
