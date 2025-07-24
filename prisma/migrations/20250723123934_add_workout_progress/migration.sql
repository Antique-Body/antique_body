-- CreateTable
CREATE TABLE `WorkoutProgress` (
    `id` VARCHAR(191) NOT NULL,
    `assignedPlanId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `workoutData` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `WorkoutProgress_assignedPlanId_idx`(`assignedPlanId`),
    INDEX `WorkoutProgress_userId_idx`(`userId`),
    UNIQUE INDEX `WorkoutProgress_assignedPlanId_userId_key`(`assignedPlanId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkoutProgress` ADD CONSTRAINT `WorkoutProgress_assignedPlanId_fkey` FOREIGN KEY (`assignedPlanId`) REFERENCES `AssignedTrainingPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkoutProgress` ADD CONSTRAINT `WorkoutProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
