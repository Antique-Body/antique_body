-- CreateTable
CREATE TABLE `GoogleFitAccount` (
    `id` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `access_token` TEXT NULL,
    `refresh_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `GoogleFitAccount_providerAccountId_key`(`providerAccountId`),
    INDEX `GoogleFitAccount_providerAccountId_idx`(`providerAccountId`),
    INDEX `GoogleFitAccount_createdAt_idx`(`createdAt`),
    INDEX `GoogleFitAccount_updatedAt_idx`(`updatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
