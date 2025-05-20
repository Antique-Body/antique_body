-- AlterTable
ALTER TABLE `User` ADD COLUMN `phoneVerificationToken` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `PhoneVerification_code_idx` ON `PhoneVerification`(`code`);

-- CreateIndex
CREATE INDEX `User_phoneVerificationToken_idx` ON `User`(`phoneVerificationToken`);
