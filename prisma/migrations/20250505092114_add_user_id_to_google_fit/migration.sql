/*
  Warnings:

  - Added the required column `userId` to the `GoogleFitAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GoogleFitAccount` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `GoogleFitAccount_userId_idx` ON `GoogleFitAccount`(`userId`);

-- AddForeignKey
ALTER TABLE `GoogleFitAccount` ADD CONSTRAINT `GoogleFitAccount_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
