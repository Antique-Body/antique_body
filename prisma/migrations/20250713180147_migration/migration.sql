-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `role` ENUM('trainer', 'client', 'user', 'admin') NULL,
    `language` VARCHAR(191) NOT NULL DEFAULT 'en',
    `emailVerified` DATETIME(3) NULL,
    `phoneVerified` DATETIME(3) NULL,
    `resetToken` VARCHAR(191) NULL,
    `resetTokenExpiry` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    INDEX `User_email_idx`(`email`),
    INDEX `User_phone_idx`(`phone`),
    INDEX `User_role_idx`(`role`),
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
CREATE TABLE `EmailVerification` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NULL,

    INDEX `EmailVerification_email_idx`(`email`),
    INDEX `EmailVerification_code_idx`(`code`),
    INDEX `EmailVerification_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhoneVerification` (
    `id` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `expires` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NULL,

    INDEX `PhoneVerification_phone_idx`(`phone`),
    INDEX `PhoneVerification_code_idx`(`code`),
    INDEX `PhoneVerification_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NOT NULL,
    `lat` DOUBLE NULL,
    `lon` DOUBLE NULL,

    INDEX `Location_city_idx`(`city`),
    INDEX `Location_country_idx`(`country`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Gym` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `lat` DOUBLE NOT NULL,
    `lon` DOUBLE NOT NULL,
    `placeId` VARCHAR(191) NULL,
    `locationId` VARCHAR(191) NULL,

    UNIQUE INDEX `Gym_placeId_key`(`placeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainerInfo` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TrainerInfo_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainerProfile` (
    `id` VARCHAR(191) NOT NULL,
    `trainerInfoId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `gender` VARCHAR(191) NULL,
    `trainerSince` INTEGER NULL,
    `profileImage` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `paidAds` DATETIME(3) NULL,
    `trainingEnvironment` VARCHAR(191) NULL,
    `locationId` VARCHAR(191) NULL,
    `pricingType` VARCHAR(191) NULL,
    `pricePerSession` INTEGER NULL,
    `currency` VARCHAR(191) NULL,
    `contactEmail` VARCHAR(191) NULL,
    `contactPhone` VARCHAR(191) NULL,
    `sessionDuration` INTEGER NULL,
    `cancellationPolicy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TrainerProfile_trainerInfoId_key`(`trainerInfoId`),
    INDEX `TrainerProfile_trainingEnvironment_idx`(`trainingEnvironment`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainerSettings` (
    `id` VARCHAR(191) NOT NULL,
    `trainerInfoId` VARCHAR(191) NOT NULL,
    `notifications` BOOLEAN NOT NULL DEFAULT true,
    `emailNotifications` BOOLEAN NOT NULL DEFAULT true,
    `smsNotifications` BOOLEAN NOT NULL DEFAULT false,
    `autoAcceptBookings` BOOLEAN NOT NULL DEFAULT false,
    `requireDeposit` BOOLEAN NOT NULL DEFAULT false,
    `depositAmount` INTEGER NULL,
    `timezone` VARCHAR(191) NOT NULL DEFAULT 'UTC',
    `workingHours` JSON NULL,
    `blackoutDates` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TrainerSettings_trainerInfoId_key`(`trainerInfoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainerSpecialty` (
    `id` VARCHAR(191) NOT NULL,
    `trainerProfileId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainerLanguage` (
    `id` VARCHAR(191) NOT NULL,
    `trainerProfileId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainerType` (
    `id` VARCHAR(191) NOT NULL,
    `trainerProfileId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certification` (
    `id` VARCHAR(191) NOT NULL,
    `trainerProfileId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `issuer` VARCHAR(191) NULL,
    `expiryDate` DATETIME(3) NULL,
    `status` ENUM('pending', 'accepted', 'rejected', 'expired') NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `hidden` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CertificationDocument` (
    `id` VARCHAR(191) NOT NULL,
    `certificationId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NULL,
    `mimetype` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientInfo` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `totalSessions` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ClientInfo_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientProfile` (
    `id` VARCHAR(191) NOT NULL,
    `clientInfoId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `height` INTEGER NOT NULL,
    `weight` INTEGER NOT NULL,
    `experienceLevel` VARCHAR(191) NOT NULL,
    `previousActivities` TEXT NULL,
    `primaryGoal` VARCHAR(191) NOT NULL,
    `secondaryGoal` VARCHAR(191) NULL,
    `goalDescription` TEXT NULL,
    `contactEmail` VARCHAR(191) NULL,
    `contactPhone` VARCHAR(191) NULL,
    `locationId` VARCHAR(191) NULL,
    `profileImage` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `medicalConditions` TEXT NULL,
    `allergies` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ClientProfile_clientInfoId_key`(`clientInfoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientSettings` (
    `id` VARCHAR(191) NOT NULL,
    `clientInfoId` VARCHAR(191) NOT NULL,
    `notifications` BOOLEAN NOT NULL DEFAULT true,
    `emailNotifications` BOOLEAN NOT NULL DEFAULT true,
    `smsNotifications` BOOLEAN NOT NULL DEFAULT false,
    `reminderTime` INTEGER NOT NULL DEFAULT 24,
    `privacyLevel` VARCHAR(191) NOT NULL DEFAULT 'public',
    `shareProgress` BOOLEAN NOT NULL DEFAULT true,
    `timezone` VARCHAR(191) NOT NULL DEFAULT 'UTC',
    `preferredLanguage` VARCHAR(191) NOT NULL DEFAULT 'en',
    `measurementUnit` VARCHAR(191) NOT NULL DEFAULT 'metric',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ClientSettings_clientInfoId_key`(`clientInfoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientLanguage` (
    `id` VARCHAR(191) NOT NULL,
    `clientProfileId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientActivity` (
    `id` VARCHAR(191) NOT NULL,
    `clientProfileId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainerGym` (
    `id` VARCHAR(191) NOT NULL,
    `trainerId` VARCHAR(191) NOT NULL,
    `gymId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TrainerGym_gymId_idx`(`gymId`),
    UNIQUE INDEX `TrainerGym_trainerId_gymId_key`(`trainerId`, `gymId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainerAvailability` (
    `id` VARCHAR(191) NOT NULL,
    `trainerProfileId` VARCHAR(191) NOT NULL,
    `weekday` VARCHAR(191) NOT NULL,
    `timeSlot` VARCHAR(191) NOT NULL,

    INDEX `TrainerAvailability_trainerProfileId_idx`(`trainerProfileId`),
    INDEX `TrainerAvailability_weekday_idx`(`weekday`),
    INDEX `TrainerAvailability_timeSlot_idx`(`timeSlot`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exercise` (
    `id` VARCHAR(191) NOT NULL,
    `trainerInfoId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `equipment` BOOLEAN NOT NULL DEFAULT true,
    `type` VARCHAR(191) NOT NULL,
    `level` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `instructions` TEXT NOT NULL,
    `videoUrl` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Exercise_trainerInfoId_idx`(`trainerInfoId`),
    INDEX `Exercise_type_idx`(`type`),
    INDEX `Exercise_level_idx`(`level`),
    INDEX `Exercise_location_idx`(`location`),
    INDEX `Exercise_equipment_idx`(`equipment`),
    INDEX `Exercise_name_idx`(`name`),
    INDEX `Exercise_createdAt_idx`(`createdAt`),
    INDEX `Exercise_trainerInfoId_type_idx`(`trainerInfoId`, `type`),
    INDEX `Exercise_trainerInfoId_level_idx`(`trainerInfoId`, `level`),
    INDEX `Exercise_trainerInfoId_location_idx`(`trainerInfoId`, `location`),
    INDEX `Exercise_trainerInfoId_equipment_idx`(`trainerInfoId`, `equipment`),
    INDEX `Exercise_trainerInfoId_createdAt_idx`(`trainerInfoId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExerciseMuscleGroup` (
    `id` VARCHAR(191) NOT NULL,
    `exerciseId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ExerciseMuscleGroup_exerciseId_idx`(`exerciseId`),
    INDEX `ExerciseMuscleGroup_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExerciseInfo` (
    `id` VARCHAR(191) NOT NULL,
    `exerciseId` VARCHAR(191) NOT NULL,
    `totalUses` INTEGER NOT NULL DEFAULT 0,
    `averageRating` DOUBLE NULL,
    `totalRatings` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ExerciseInfo_exerciseId_key`(`exerciseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainerGalleryImage` (
    `id` VARCHAR(191) NOT NULL,
    `trainerProfileId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `order` INTEGER NOT NULL,
    `isHighlighted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TrainerGalleryImage_trainerProfileId_idx`(`trainerProfileId`),
    INDEX `TrainerGalleryImage_trainerProfileId_order_idx`(`trainerProfileId`, `order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Meal` (
    `id` VARCHAR(191) NOT NULL,
    `trainerId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `mealType` VARCHAR(191) NOT NULL,
    `difficulty` VARCHAR(191) NOT NULL,
    `preparationTime` INTEGER NOT NULL,
    `calories` DOUBLE NOT NULL DEFAULT 0,
    `protein` DOUBLE NOT NULL DEFAULT 0,
    `carbs` DOUBLE NOT NULL DEFAULT 0,
    `fat` DOUBLE NOT NULL DEFAULT 0,
    `dietary` JSON NOT NULL,
    `cuisine` VARCHAR(191) NOT NULL DEFAULT 'other',
    `ingredients` TEXT NOT NULL,
    `recipe` TEXT NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `videoUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Meal_trainerId_idx`(`trainerId`),
    INDEX `Meal_mealType_idx`(`mealType`),
    INDEX `Meal_difficulty_idx`(`difficulty`),
    INDEX `Meal_cuisine_idx`(`cuisine`),
    INDEX `Meal_name_idx`(`name`),
    INDEX `Meal_createdAt_idx`(`createdAt`),
    INDEX `Meal_trainerId_mealType_idx`(`trainerId`, `mealType`),
    INDEX `Meal_trainerId_difficulty_idx`(`trainerId`, `difficulty`),
    INDEX `Meal_trainerId_cuisine_idx`(`trainerId`, `cuisine`),
    INDEX `Meal_trainerId_createdAt_idx`(`trainerId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `CoachingRequest` (
    `id` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `trainerId` VARCHAR(191) NOT NULL,
    `note` TEXT NULL,
    `status` ENUM('pending', 'accepted', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending',
    `rejectionReason` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `respondedAt` DATETIME(3) NULL,

    INDEX `CoachingRequest_clientId_idx`(`clientId`),
    INDEX `CoachingRequest_trainerId_idx`(`trainerId`),
    INDEX `CoachingRequest_status_idx`(`status`),
    INDEX `CoachingRequest_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoachingRequestCooldown` (
    `id` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `trainerId` VARCHAR(191) NOT NULL,
    `removedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiresAt` DATETIME(3) NOT NULL,

    INDEX `CoachingRequestCooldown_clientId_idx`(`clientId`),
    INDEX `CoachingRequestCooldown_trainerId_idx`(`trainerId`),
    INDEX `CoachingRequestCooldown_expiresAt_idx`(`expiresAt`),
    INDEX `CoachingRequestCooldown_removedAt_idx`(`removedAt`),
    UNIQUE INDEX `CoachingRequestCooldown_clientId_trainerId_key`(`clientId`, `trainerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmailVerification` ADD CONSTRAINT `EmailVerification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PhoneVerification` ADD CONSTRAINT `PhoneVerification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gym` ADD CONSTRAINT `Gym_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainerInfo` ADD CONSTRAINT `TrainerInfo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainerProfile` ADD CONSTRAINT `TrainerProfile_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainerProfile` ADD CONSTRAINT `TrainerProfile_trainerInfoId_fkey` FOREIGN KEY (`trainerInfoId`) REFERENCES `TrainerInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainerSettings` ADD CONSTRAINT `TrainerSettings_trainerInfoId_fkey` FOREIGN KEY (`trainerInfoId`) REFERENCES `TrainerInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainerSpecialty` ADD CONSTRAINT `TrainerSpecialty_trainerProfileId_fkey` FOREIGN KEY (`trainerProfileId`) REFERENCES `TrainerProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainerLanguage` ADD CONSTRAINT `TrainerLanguage_trainerProfileId_fkey` FOREIGN KEY (`trainerProfileId`) REFERENCES `TrainerProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainerType` ADD CONSTRAINT `TrainerType_trainerProfileId_fkey` FOREIGN KEY (`trainerProfileId`) REFERENCES `TrainerProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certification` ADD CONSTRAINT `Certification_trainerProfileId_fkey` FOREIGN KEY (`trainerProfileId`) REFERENCES `TrainerProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CertificationDocument` ADD CONSTRAINT `CertificationDocument_certificationId_fkey` FOREIGN KEY (`certificationId`) REFERENCES `Certification`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientInfo` ADD CONSTRAINT `ClientInfo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientProfile` ADD CONSTRAINT `ClientProfile_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientProfile` ADD CONSTRAINT `ClientProfile_clientInfoId_fkey` FOREIGN KEY (`clientInfoId`) REFERENCES `ClientInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientSettings` ADD CONSTRAINT `ClientSettings_clientInfoId_fkey` FOREIGN KEY (`clientInfoId`) REFERENCES `ClientInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientLanguage` ADD CONSTRAINT `ClientLanguage_clientProfileId_fkey` FOREIGN KEY (`clientProfileId`) REFERENCES `ClientProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientActivity` ADD CONSTRAINT `ClientActivity_clientProfileId_fkey` FOREIGN KEY (`clientProfileId`) REFERENCES `ClientProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainerGym` ADD CONSTRAINT `TrainerGym_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `TrainerProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainerGym` ADD CONSTRAINT `TrainerGym_gymId_fkey` FOREIGN KEY (`gymId`) REFERENCES `Gym`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainerAvailability` ADD CONSTRAINT `TrainerAvailability_trainerProfileId_fkey` FOREIGN KEY (`trainerProfileId`) REFERENCES `TrainerProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exercise` ADD CONSTRAINT `Exercise_trainerInfoId_fkey` FOREIGN KEY (`trainerInfoId`) REFERENCES `TrainerInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExerciseMuscleGroup` ADD CONSTRAINT `ExerciseMuscleGroup_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `Exercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExerciseInfo` ADD CONSTRAINT `ExerciseInfo_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `Exercise`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainerGalleryImage` ADD CONSTRAINT `TrainerGalleryImage_trainerProfileId_fkey` FOREIGN KEY (`trainerProfileId`) REFERENCES `TrainerProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Meal` ADD CONSTRAINT `Meal_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `TrainerInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainingPlan` ADD CONSTRAINT `TrainingPlan_trainerInfoId_fkey` FOREIGN KEY (`trainerInfoId`) REFERENCES `TrainerInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NutritionPlan` ADD CONSTRAINT `NutritionPlan_trainerInfoId_fkey` FOREIGN KEY (`trainerInfoId`) REFERENCES `TrainerInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachingRequest` ADD CONSTRAINT `CoachingRequest_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `ClientInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachingRequest` ADD CONSTRAINT `CoachingRequest_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `TrainerInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachingRequestCooldown` ADD CONSTRAINT `CoachingRequestCooldown_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `ClientInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoachingRequestCooldown` ADD CONSTRAINT `CoachingRequestCooldown_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `TrainerInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE `SnackLog` ADD CONSTRAINT `SnackLog_dailyDietLogId_fkey` FOREIGN KEY (`dailyDietLogId`) REFERENCES `DailyDietLog`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomMeal` ADD CONSTRAINT `CustomMeal_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `ClientInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
