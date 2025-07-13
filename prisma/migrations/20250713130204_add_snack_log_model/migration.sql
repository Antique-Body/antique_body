-- CreateTable
CREATE TABLE `SnackLog` (
    `id` VARCHAR(191) NOT NULL,
    `dailyDietLogId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `mealType` VARCHAR(191) NOT NULL,
    `calories` DOUBLE NOT NULL DEFAULT 0,
    `protein` DOUBLE NOT NULL DEFAULT 0,
    `carbs` DOUBLE NOT NULL DEFAULT 0,
    `fat` DOUBLE NOT NULL DEFAULT 0,
    `ingredients` JSON NOT NULL,
    `loggedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `loggedTime` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SnackLog_dailyDietLogId_idx`(`dailyDietLogId`),
    INDEX `SnackLog_mealType_idx`(`mealType`),
    INDEX `SnackLog_loggedAt_idx`(`loggedAt`),
    INDEX `SnackLog_loggedTime_idx`(`loggedTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SnackLog` ADD CONSTRAINT `SnackLog_dailyDietLogId_fkey` FOREIGN KEY (`dailyDietLogId`) REFERENCES `DailyDietLog`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
