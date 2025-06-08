-- CreateTable
CREATE TABLE `TrainerInfo` (
    `id` VARCHAR(191) NOT NULL,
    `trainerProfileId` VARCHAR(191) NOT NULL,
    `specialty` VARCHAR(191) NULL,
    `experience` VARCHAR(191) NULL,
    `rating` DOUBLE NULL,
    `totalSessions` INTEGER NULL,
    `totalEarnings` INTEGER NULL,
    `upcomingSessions` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TrainerInfo_trainerProfileId_key`(`trainerProfileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TrainerInfo` ADD CONSTRAINT `TrainerInfo_trainerProfileId_fkey` FOREIGN KEY (`trainerProfileId`) REFERENCES `TrainerProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
