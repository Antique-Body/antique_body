-- AlterTable
ALTER TABLE `Location` ADD COLUMN `lat` DOUBLE NULL,
    ADD COLUMN `lon` DOUBLE NULL;

-- CreateTable
CREATE TABLE `Gym` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `lat` DOUBLE NOT NULL,
    `lon` DOUBLE NOT NULL,
    `placeId` VARCHAR(191) NULL,
    `locationId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainerGym` (
    `id` VARCHAR(191) NOT NULL,
    `trainerId` VARCHAR(191) NOT NULL,
    `gymId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TrainerGym_trainerId_gymId_key`(`trainerId`, `gymId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Gym` ADD CONSTRAINT `Gym_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainerGym` ADD CONSTRAINT `TrainerGym_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `TrainerProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainerGym` ADD CONSTRAINT `TrainerGym_gymId_fkey` FOREIGN KEY (`gymId`) REFERENCES `Gym`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
