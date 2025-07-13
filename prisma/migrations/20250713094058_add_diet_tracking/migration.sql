-- CreateTable
CREATE TABLE `DietPlanAssignment` (
    `id` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `nutritionPlanId` VARCHAR(191) NOT NULL,
    `assignedById` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DietPlanAssignment_clientId_idx`(`clientId`),
    INDEX `DietPlanAssignment_nutritionPlanId_idx`(`nutritionPlanId`),
    INDEX `DietPlanAssignment_assignedById_idx`(`assignedById`),
    INDEX `DietPlanAssignment_isActive_idx`(`isActive`),
    INDEX `DietPlanAssignment_startDate_idx`(`startDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyDietLog` (
    `id` VARCHAR(191) NOT NULL,
    `dietPlanAssignmentId` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `dayNumber` INTEGER NOT NULL,
    `totalCalories` DOUBLE NOT NULL DEFAULT 0,
    `totalProtein` DOUBLE NOT NULL DEFAULT 0,
    `totalCarbs` DOUBLE NOT NULL DEFAULT 0,
    `totalFat` DOUBLE NOT NULL DEFAULT 0,
    `completedMeals` INTEGER NOT NULL DEFAULT 0,
    `totalMeals` INTEGER NOT NULL DEFAULT 0,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DailyDietLog_dietPlanAssignmentId_idx`(`dietPlanAssignmentId`),
    INDEX `DailyDietLog_date_idx`(`date`),
    INDEX `DailyDietLog_dayNumber_idx`(`dayNumber`),
    INDEX `DailyDietLog_isCompleted_idx`(`isCompleted`),
    UNIQUE INDEX `DailyDietLog_dietPlanAssignmentId_date_key`(`dietPlanAssignmentId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MealLog` (
    `id` VARCHAR(191) NOT NULL,
    `dailyDietLogId` VARCHAR(191) NOT NULL,
    `mealName` VARCHAR(191) NOT NULL,
    `mealTime` VARCHAR(191) NOT NULL,
    `selectedOption` JSON NOT NULL,
    `isCompleted` BOOLEAN NOT NULL DEFAULT false,
    `completedAt` DATETIME(3) NULL,
    `calories` DOUBLE NOT NULL DEFAULT 0,
    `protein` DOUBLE NOT NULL DEFAULT 0,
    `carbs` DOUBLE NOT NULL DEFAULT 0,
    `fat` DOUBLE NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `MealLog_dailyDietLogId_idx`(`dailyDietLogId`),
    INDEX `MealLog_mealName_idx`(`mealName`),
    INDEX `MealLog_isCompleted_idx`(`isCompleted`),
    INDEX `MealLog_completedAt_idx`(`completedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DietPlanAssignment` ADD CONSTRAINT `DietPlanAssignment_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `ClientInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DietPlanAssignment` ADD CONSTRAINT `DietPlanAssignment_nutritionPlanId_fkey` FOREIGN KEY (`nutritionPlanId`) REFERENCES `NutritionPlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DietPlanAssignment` ADD CONSTRAINT `DietPlanAssignment_assignedById_fkey` FOREIGN KEY (`assignedById`) REFERENCES `TrainerInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyDietLog` ADD CONSTRAINT `DailyDietLog_dietPlanAssignmentId_fkey` FOREIGN KEY (`dietPlanAssignmentId`) REFERENCES `DietPlanAssignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MealLog` ADD CONSTRAINT `MealLog_dailyDietLogId_fkey` FOREIGN KEY (`dailyDietLogId`) REFERENCES `DailyDietLog`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
