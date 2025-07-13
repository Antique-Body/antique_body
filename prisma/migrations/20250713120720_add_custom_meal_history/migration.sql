-- CreateTable
CREATE TABLE `CustomMeal` (
    `id` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `mealType` VARCHAR(191) NOT NULL,
    `calories` DOUBLE NOT NULL DEFAULT 0,
    `protein` DOUBLE NOT NULL DEFAULT 0,
    `carbs` DOUBLE NOT NULL DEFAULT 0,
    `fat` DOUBLE NOT NULL DEFAULT 0,
    `ingredients` JSON NOT NULL,
    `usageCount` INTEGER NOT NULL DEFAULT 1,
    `lastUsed` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CustomMeal_clientId_idx`(`clientId`),
    INDEX `CustomMeal_mealType_idx`(`mealType`),
    INDEX `CustomMeal_lastUsed_idx`(`lastUsed`),
    INDEX `CustomMeal_usageCount_idx`(`usageCount`),
    INDEX `CustomMeal_clientId_mealType_idx`(`clientId`, `mealType`),
    INDEX `CustomMeal_clientId_lastUsed_idx`(`clientId`, `lastUsed`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomMeal` ADD CONSTRAINT `CustomMeal_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `ClientInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
