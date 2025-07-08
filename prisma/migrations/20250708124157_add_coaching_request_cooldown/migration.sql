-- CreateTable
CREATE TABLE `CoachingRequestCooldown` (
    `id` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `trainerId` VARCHAR(191) NOT NULL,
    `removedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,

    INDEX `CoachingRequestCooldown_clientId_idx`(`clientId`),
    INDEX `CoachingRequestCooldown_trainerId_idx`(`trainerId`),
    INDEX `CoachingRequestCooldown_expiresAt_idx`(`expiresAt`),
    INDEX `CoachingRequestCooldown_removedAt_idx`(`removedAt`),
    UNIQUE INDEX `CoachingRequestCooldown_clientId_trainerId_key`(`clientId`, `trainerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CoachingRequestCooldown` ADD CONSTRAINT `CoachingRequestCooldown_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `ClientInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachingRequestCooldown` ADD CONSTRAINT `CoachingRequestCooldown_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `TrainerInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
