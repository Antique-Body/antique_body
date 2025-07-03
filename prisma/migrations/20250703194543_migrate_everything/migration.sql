-- CreateTable
CREATE TABLE `TrainingPlan` (
    `id` VARCHAR(191) NOT NULL,
    `trainerInfoId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `coverImage` VARCHAR(191) NULL,
    `price` DOUBLE NULL,
    `duration` INTEGER NULL,
    `durationType` VARCHAR(191) NULL,
    `keyFeatures` JSON NULL,
    `trainingType` VARCHAR(191) NULL,
    `timeline` JSON NULL,
    `features` JSON NULL,
    `sessionsPerWeek` INTEGER NULL,
    `sessionFormat` JSON NULL,
    `difficultyLevel` VARCHAR(191) NULL,
    `schedule` JSON NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `clientCount` INTEGER NULL,

    INDEX `TrainingPlan_trainerInfoId_idx`(`trainerInfoId`),
    INDEX `TrainingPlan_isActive_idx`(`isActive`),
    INDEX `TrainingPlan_isPublished_idx`(`isPublished`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NutritionPlan` (
    `id` VARCHAR(191) NOT NULL,
    `trainerInfoId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `coverImage` VARCHAR(191) NULL,
    `price` DOUBLE NULL,
    `duration` INTEGER NULL,
    `durationType` VARCHAR(191) NULL,
    `keyFeatures` JSON NULL,
    `timeline` JSON NULL,
    `nutritionInfo` JSON NULL,
    `mealTypes` JSON NULL,
    `supplementRecommendations` VARCHAR(191) NULL,
    `cookingTime` VARCHAR(191) NULL,
    `targetGoal` VARCHAR(191) NULL,
    `days` JSON NULL,
    `recommendedFrequency` VARCHAR(191) NULL,
    `adaptability` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `clientCount` INTEGER NULL,

    INDEX `NutritionPlan_trainerInfoId_idx`(`trainerInfoId`),
    INDEX `NutritionPlan_isActive_idx`(`isActive`),
    INDEX `NutritionPlan_isPublished_idx`(`isPublished`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TrainingPlan` ADD CONSTRAINT `TrainingPlan_trainerInfoId_fkey` FOREIGN KEY (`trainerInfoId`) REFERENCES `TrainerInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NutritionPlan` ADD CONSTRAINT `NutritionPlan_trainerInfoId_fkey` FOREIGN KEY (`trainerInfoId`) REFERENCES `TrainerInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
