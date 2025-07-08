-- CreateTable
CREATE TABLE `CoachingRequest` (
    `id` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `trainerId` VARCHAR(191) NOT NULL,
    `note` TEXT NULL,
    `status` ENUM('pending', 'accepted', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending',
    `rejectionReason` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `respondedAt` DATETIME(3) NULL,

    INDEX `CoachingRequest_clientId_idx`(`clientId`),
    INDEX `CoachingRequest_trainerId_idx`(`trainerId`),
    INDEX `CoachingRequest_status_idx`(`status`),
    INDEX `CoachingRequest_createdAt_idx`(`createdAt`),
    UNIQUE INDEX `CoachingRequest_clientId_trainerId_key`(`clientId`, `trainerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CoachingRequest` ADD CONSTRAINT `CoachingRequest_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `ClientInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachingRequest` ADD CONSTRAINT `CoachingRequest_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `TrainerInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
