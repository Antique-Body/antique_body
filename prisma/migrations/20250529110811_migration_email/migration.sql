-- AlterTable
ALTER TABLE `Certification` ADD COLUMN `status` ENUM('pending', 'accepted', 'rejected', 'expired') NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE `User` MODIFY `email` VARCHAR(191) NULL;
