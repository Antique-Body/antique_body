-- AlterTable
ALTER TABLE `ClientProfile` MODIFY `primaryGoal` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `AssignedTrainingPlan` (
    `id` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `trainerId` VARCHAR(191) NOT NULL,
    `originalPlanId` VARCHAR(191) NOT NULL,
    `planData` JSON NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,

    INDEX `AssignedTrainingPlan_clientId_idx`(`clientId`),
    INDEX `AssignedTrainingPlan_trainerId_idx`(`trainerId`),
    INDEX `AssignedTrainingPlan_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AssignedTrainingPlan` ADD CONSTRAINT `AssignedTrainingPlan_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `ClientInfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignedTrainingPlan` ADD CONSTRAINT `AssignedTrainingPlan_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `TrainerInfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssignedTrainingPlan` ADD CONSTRAINT `AssignedTrainingPlan_originalPlanId_fkey` FOREIGN KEY (`originalPlanId`) REFERENCES `TrainingPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
