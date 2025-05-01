-- AlterTable
ALTER TABLE `User` ADD COLUMN `emailVerificationToken` VARCHAR(191) NULL,
    ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `resetToken` VARCHAR(191) NULL,
    ADD COLUMN `resetTokenExpiry` DATETIME(3) NULL;

-- CreateIndex
CREATE INDEX `User_emailVerificationToken_idx` ON `User`(`emailVerificationToken`);

-- CreateIndex
CREATE INDEX `User_resetToken_idx` ON `User`(`resetToken`);
