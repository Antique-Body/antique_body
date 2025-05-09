-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `role` ENUM('trainer', 'client', 'user', 'admin') NULL,
    `language` VARCHAR(191) NOT NULL DEFAULT 'en',
    `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    `emailVerificationToken` VARCHAR(191) NULL,
    `resetToken` VARCHAR(191) NULL,
    `resetTokenExpiry` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    INDEX `User_email_idx`(`email`),
    INDEX `User_role_idx`(`role`),
    INDEX `User_emailVerificationToken_idx`(`emailVerificationToken`),
    INDEX `User_resetToken_idx`(`resetToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPreferences` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `hasInjury` BOOLEAN NOT NULL DEFAULT false,
    `injuryType` ENUM('no', 'past', 'current', 'chronic') NULL,
    `wantsRehabilitation` ENUM('yes', 'no') NULL,
    `environment` ENUM('gym', 'outside') NOT NULL,
    `equipment` ENUM('with_equipment', 'no_equipment') NOT NULL,
    `experience` ENUM('beginner', 'intermediate', 'advanced', 'expert') NOT NULL,
    `goal` ENUM('strength', 'muscle', 'lose_weight', 'endurance') NOT NULL,
    `frequency` INTEGER NOT NULL,
    `weight` DOUBLE NOT NULL,
    `height` DOUBLE NOT NULL,
    `bmi` DOUBLE NOT NULL,
    `bmiCategory` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserPreferences_userId_key`(`userId`),
    INDEX `UserPreferences_environment_idx`(`environment`),
    INDEX `UserPreferences_equipment_idx`(`equipment`),
    INDEX `UserPreferences_experience_idx`(`experience`),
    INDEX `UserPreferences_goal_idx`(`goal`),
    INDEX `UserPreferences_frequency_idx`(`frequency`),
    INDEX `UserPreferences_hasInjury_idx`(`hasInjury`),
    INDEX `UserPreferences_injuryType_idx`(`injuryType`),
    INDEX `UserPreferences_bmi_idx`(`bmi`),
    INDEX `UserPreferences_bmiCategory_idx`(`bmiCategory`),
    INDEX `UserPreferences_wantsRehabilitation_idx`(`wantsRehabilitation`),
    INDEX `UserPreferences_weight_idx`(`weight`),
    INDEX `UserPreferences_height_idx`(`height`),
    INDEX `UserPreferences_createdAt_idx`(`createdAt`),
    INDEX `UserPreferences_hasInjury_injuryType_idx`(`hasInjury`, `injuryType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserInjuryLocation` (
    `id` VARCHAR(191) NOT NULL,
    `userPreferencesId` VARCHAR(191) NOT NULL,
    `location` ENUM('head', 'neck', 'chest', 'shoulder_l', 'shoulder_r', 'bicep_l', 'bicep_r', 'forearm_l', 'forearm_r', 'abdomen', 'hip_l', 'hip_r', 'quad_l', 'quad_r', 'knee_l', 'knee_r', 'ankle_l', 'ankle_r', 'upper_back', 'lower_back', 'back_shoulder_l', 'back_shoulder_r', 'tricep_l', 'tricep_r', 'glute_l', 'glute_r', 'hamstring_l', 'hamstring_r', 'calf_back_l', 'calf_back_r', 'achilles_l', 'achilles_r') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserInjuryLocation_location_idx`(`location`),
    INDEX `UserInjuryLocation_userPreferencesId_idx`(`userPreferencesId`),
    INDEX `UserInjuryLocation_location_userPreferencesId_idx`(`location`, `userPreferencesId`),
    UNIQUE INDEX `UserInjuryLocation_userPreferencesId_location_key`(`userPreferencesId`, `location`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoogleFitAccount` (
    `id` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `access_token` TEXT NULL,
    `refresh_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `GoogleFitAccount_providerAccountId_key`(`providerAccountId`),
    INDEX `GoogleFitAccount_providerAccountId_idx`(`providerAccountId`),
    INDEX `GoogleFitAccount_createdAt_idx`(`createdAt`),
    INDEX `GoogleFitAccount_updatedAt_idx`(`updatedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPreferences` ADD CONSTRAINT `UserPreferences_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserInjuryLocation` ADD CONSTRAINT `UserInjuryLocation_userPreferencesId_fkey` FOREIGN KEY (`userPreferencesId`) REFERENCES `UserPreferences`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
