-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('trainer', 'client', 'user', 'admin');

-- CreateEnum
CREATE TYPE "CertificationStatus" AS ENUM ('pending', 'accepted', 'rejected', 'expired');

-- CreateEnum
CREATE TYPE "CoachingRequestStatus" AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');

-- CreateEnum
CREATE TYPE "DietPlanAssignmentStatus" AS ENUM ('assigned', 'active', 'completed', 'abandoned', 'expired');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "password" TEXT,
    "role" "UserRole",
    "language" TEXT NOT NULL DEFAULT 'en',
    "emailVerified" TIMESTAMP(3),
    "phoneVerified" TIMESTAMP(3),
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerification" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "EmailVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhoneVerification" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "PhoneVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gym" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "placeId" TEXT,
    "locationId" TEXT,

    CONSTRAINT "Gym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainerInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerProfile" (
    "id" TEXT NOT NULL,
    "trainerInfoId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "trainerSince" INTEGER,
    "profileImage" TEXT,
    "description" TEXT,
    "paidAds" TIMESTAMP(3),
    "trainingEnvironment" TEXT,
    "locationId" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "sessionDuration" INTEGER,
    "cancellationPolicy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerSettings" (
    "id" TEXT NOT NULL,
    "trainerInfoId" TEXT NOT NULL,
    "notifications" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "autoAcceptBookings" BOOLEAN NOT NULL DEFAULT false,
    "requireDeposit" BOOLEAN NOT NULL DEFAULT false,
    "depositAmount" INTEGER,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "workingHours" JSONB,
    "blackoutDates" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainerSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerSpecialty" (
    "id" TEXT NOT NULL,
    "trainerProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainerSpecialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerLanguage" (
    "id" TEXT NOT NULL,
    "trainerProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainerLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerType" (
    "id" TEXT NOT NULL,
    "trainerProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainerType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "trainerProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT,
    "expiryDate" TIMESTAMP(3),
    "status" "CertificationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificationDocument" (
    "id" TEXT NOT NULL,
    "certificationId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "originalName" TEXT,
    "mimetype" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CertificationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientProfile" (
    "id" TEXT NOT NULL,
    "clientInfoId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "height" INTEGER,
    "weight" INTEGER,
    "experienceLevel" TEXT NOT NULL,
    "previousActivities" TEXT,
    "primaryGoal" TEXT,
    "secondaryGoal" TEXT,
    "goalDescription" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "locationId" TEXT,
    "profileImage" TEXT,
    "description" TEXT,
    "medicalConditions" TEXT,
    "allergies" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientSettings" (
    "id" TEXT NOT NULL,
    "clientInfoId" TEXT NOT NULL,
    "notifications" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "reminderTime" INTEGER NOT NULL DEFAULT 24,
    "privacyLevel" TEXT NOT NULL DEFAULT 'public',
    "shareProgress" BOOLEAN NOT NULL DEFAULT true,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "measurementUnit" TEXT NOT NULL DEFAULT 'metric',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientLanguage" (
    "id" TEXT NOT NULL,
    "clientProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientActivity" (
    "id" TEXT NOT NULL,
    "clientProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerGym" (
    "id" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "gymId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainerGym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerAvailability" (
    "id" TEXT NOT NULL,
    "trainerProfileId" TEXT NOT NULL,
    "weekday" TEXT NOT NULL,
    "timeSlot" TEXT NOT NULL,

    CONSTRAINT "TrainerAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "trainerInfoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "equipment" BOOLEAN NOT NULL DEFAULT true,
    "type" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "videoUrl" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseMuscleGroup" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExerciseMuscleGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseInfo" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "totalUses" INTEGER NOT NULL DEFAULT 0,
    "averageRating" DOUBLE PRECISION,
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExerciseInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainerGalleryImage" (
    "id" TEXT NOT NULL,
    "trainerProfileId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "isHighlighted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainerGalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mealType" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "preparationTime" INTEGER NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "protein" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "carbs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dietary" JSONB NOT NULL,
    "cuisine" TEXT NOT NULL DEFAULT 'other',
    "ingredients" TEXT NOT NULL,
    "recipe" TEXT NOT NULL,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingPlan" (
    "id" TEXT NOT NULL,
    "trainerInfoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "price" DOUBLE PRECISION,
    "duration" INTEGER,
    "durationType" TEXT,
    "keyFeatures" JSONB,
    "trainingType" TEXT,
    "timeline" JSONB,
    "features" JSONB,
    "sessionsPerWeek" INTEGER,
    "sessionFormat" JSONB,
    "difficultyLevel" TEXT,
    "schedule" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "clientCount" INTEGER,

    CONSTRAINT "TrainingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NutritionPlan" (
    "id" TEXT NOT NULL,
    "trainerInfoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "price" DOUBLE PRECISION,
    "duration" INTEGER,
    "durationType" TEXT,
    "keyFeatures" JSONB,
    "timeline" JSONB,
    "nutritionInfo" JSONB,
    "mealTypes" JSONB,
    "supplementRecommendations" TEXT,
    "cookingTime" TEXT,
    "targetGoal" TEXT,
    "days" JSONB,
    "recommendedFrequency" TEXT,
    "adaptability" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "clientCount" INTEGER,

    CONSTRAINT "NutritionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachingRequest" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "note" TEXT,
    "status" "CoachingRequestStatus" NOT NULL DEFAULT 'pending',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "CoachingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachingRequestCooldown" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "removedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoachingRequestCooldown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DietPlanAssignment" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "nutritionPlanId" TEXT NOT NULL,
    "assignedById" TEXT NOT NULL,
    "status" "DietPlanAssignmentStatus" NOT NULL DEFAULT 'assigned',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "actualStartDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "totalDays" INTEGER NOT NULL DEFAULT 0,
    "completedDays" INTEGER NOT NULL DEFAULT 0,
    "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DietPlanAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyDietLog" (
    "id" TEXT NOT NULL,
    "dietPlanAssignmentId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "totalCalories" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalProtein" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCarbs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalFat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completedMeals" INTEGER NOT NULL DEFAULT 0,
    "totalMeals" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "targetCalories" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "targetProtein" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "targetCarbs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "targetFat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calorieVariance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "proteinVariance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyDietLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DietProgressSummary" (
    "id" TEXT NOT NULL,
    "dietPlanAssignmentId" TEXT NOT NULL,
    "averageCaloriesPerDay" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageProteinPerDay" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageCarbsPerDay" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageFatPerDay" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageCompletionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCaloriesConsumed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalProteinConsumed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bestDay" TIMESTAMP(3),
    "worstDay" TIMESTAMP(3),
    "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "adherenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "overallSuccess" BOOLEAN NOT NULL DEFAULT false,
    "completedOnTime" BOOLEAN NOT NULL DEFAULT false,
    "daysAhead" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DietProgressSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealLog" (
    "id" TEXT NOT NULL,
    "dailyDietLogId" TEXT NOT NULL,
    "mealName" TEXT NOT NULL,
    "mealTime" TEXT NOT NULL,
    "selectedOption" JSONB NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "calories" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "protein" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "carbs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MealLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SnackLog" (
    "id" TEXT NOT NULL,
    "dailyDietLogId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "mealType" TEXT NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "protein" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "carbs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ingredients" JSONB NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "loggedTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SnackLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomMeal" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "mealType" TEXT NOT NULL,
    "calories" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "protein" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "carbs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ingredients" JSONB NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 1,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomMeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssignedTrainingPlan" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "originalPlanId" TEXT NOT NULL,
    "planData" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AssignedTrainingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_resetToken_idx" ON "User"("resetToken");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "EmailVerification_email_idx" ON "EmailVerification"("email");

-- CreateIndex
CREATE INDEX "EmailVerification_code_idx" ON "EmailVerification"("code");

-- CreateIndex
CREATE INDEX "EmailVerification_userId_idx" ON "EmailVerification"("userId");

-- CreateIndex
CREATE INDEX "PhoneVerification_phone_idx" ON "PhoneVerification"("phone");

-- CreateIndex
CREATE INDEX "PhoneVerification_code_idx" ON "PhoneVerification"("code");

-- CreateIndex
CREATE INDEX "PhoneVerification_userId_idx" ON "PhoneVerification"("userId");

-- CreateIndex
CREATE INDEX "Location_city_idx" ON "Location"("city");

-- CreateIndex
CREATE INDEX "Location_country_idx" ON "Location"("country");

-- CreateIndex
CREATE UNIQUE INDEX "Gym_placeId_key" ON "Gym"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainerInfo_userId_key" ON "TrainerInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainerProfile_trainerInfoId_key" ON "TrainerProfile"("trainerInfoId");

-- CreateIndex
CREATE INDEX "TrainerProfile_trainingEnvironment_idx" ON "TrainerProfile"("trainingEnvironment");

-- CreateIndex
CREATE UNIQUE INDEX "TrainerSettings_trainerInfoId_key" ON "TrainerSettings"("trainerInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientInfo_userId_key" ON "ClientInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_clientInfoId_key" ON "ClientProfile"("clientInfoId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientSettings_clientInfoId_key" ON "ClientSettings"("clientInfoId");

-- CreateIndex
CREATE INDEX "TrainerGym_gymId_idx" ON "TrainerGym"("gymId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainerGym_trainerId_gymId_key" ON "TrainerGym"("trainerId", "gymId");

-- CreateIndex
CREATE INDEX "TrainerAvailability_trainerProfileId_idx" ON "TrainerAvailability"("trainerProfileId");

-- CreateIndex
CREATE INDEX "TrainerAvailability_weekday_idx" ON "TrainerAvailability"("weekday");

-- CreateIndex
CREATE INDEX "TrainerAvailability_timeSlot_idx" ON "TrainerAvailability"("timeSlot");

-- CreateIndex
CREATE INDEX "Exercise_trainerInfoId_idx" ON "Exercise"("trainerInfoId");

-- CreateIndex
CREATE INDEX "Exercise_type_idx" ON "Exercise"("type");

-- CreateIndex
CREATE INDEX "Exercise_level_idx" ON "Exercise"("level");

-- CreateIndex
CREATE INDEX "Exercise_location_idx" ON "Exercise"("location");

-- CreateIndex
CREATE INDEX "Exercise_equipment_idx" ON "Exercise"("equipment");

-- CreateIndex
CREATE INDEX "Exercise_name_idx" ON "Exercise"("name");

-- CreateIndex
CREATE INDEX "Exercise_createdAt_idx" ON "Exercise"("createdAt");

-- CreateIndex
CREATE INDEX "Exercise_trainerInfoId_type_idx" ON "Exercise"("trainerInfoId", "type");

-- CreateIndex
CREATE INDEX "Exercise_trainerInfoId_level_idx" ON "Exercise"("trainerInfoId", "level");

-- CreateIndex
CREATE INDEX "Exercise_trainerInfoId_location_idx" ON "Exercise"("trainerInfoId", "location");

-- CreateIndex
CREATE INDEX "Exercise_trainerInfoId_equipment_idx" ON "Exercise"("trainerInfoId", "equipment");

-- CreateIndex
CREATE INDEX "Exercise_trainerInfoId_createdAt_idx" ON "Exercise"("trainerInfoId", "createdAt");

-- CreateIndex
CREATE INDEX "ExerciseMuscleGroup_exerciseId_idx" ON "ExerciseMuscleGroup"("exerciseId");

-- CreateIndex
CREATE INDEX "ExerciseMuscleGroup_name_idx" ON "ExerciseMuscleGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseInfo_exerciseId_key" ON "ExerciseInfo"("exerciseId");

-- CreateIndex
CREATE INDEX "TrainerGalleryImage_trainerProfileId_idx" ON "TrainerGalleryImage"("trainerProfileId");

-- CreateIndex
CREATE INDEX "TrainerGalleryImage_trainerProfileId_order_idx" ON "TrainerGalleryImage"("trainerProfileId", "order");

-- CreateIndex
CREATE INDEX "Meal_trainerId_idx" ON "Meal"("trainerId");

-- CreateIndex
CREATE INDEX "Meal_mealType_idx" ON "Meal"("mealType");

-- CreateIndex
CREATE INDEX "Meal_difficulty_idx" ON "Meal"("difficulty");

-- CreateIndex
CREATE INDEX "Meal_cuisine_idx" ON "Meal"("cuisine");

-- CreateIndex
CREATE INDEX "Meal_name_idx" ON "Meal"("name");

-- CreateIndex
CREATE INDEX "Meal_createdAt_idx" ON "Meal"("createdAt");

-- CreateIndex
CREATE INDEX "Meal_trainerId_mealType_idx" ON "Meal"("trainerId", "mealType");

-- CreateIndex
CREATE INDEX "Meal_trainerId_difficulty_idx" ON "Meal"("trainerId", "difficulty");

-- CreateIndex
CREATE INDEX "Meal_trainerId_cuisine_idx" ON "Meal"("trainerId", "cuisine");

-- CreateIndex
CREATE INDEX "Meal_trainerId_createdAt_idx" ON "Meal"("trainerId", "createdAt");

-- CreateIndex
CREATE INDEX "TrainingPlan_trainerInfoId_idx" ON "TrainingPlan"("trainerInfoId");

-- CreateIndex
CREATE INDEX "NutritionPlan_trainerInfoId_idx" ON "NutritionPlan"("trainerInfoId");

-- CreateIndex
CREATE INDEX "CoachingRequest_clientId_idx" ON "CoachingRequest"("clientId");

-- CreateIndex
CREATE INDEX "CoachingRequest_trainerId_idx" ON "CoachingRequest"("trainerId");

-- CreateIndex
CREATE INDEX "CoachingRequest_status_idx" ON "CoachingRequest"("status");

-- CreateIndex
CREATE INDEX "CoachingRequest_createdAt_idx" ON "CoachingRequest"("createdAt");

-- CreateIndex
CREATE INDEX "CoachingRequestCooldown_clientId_idx" ON "CoachingRequestCooldown"("clientId");

-- CreateIndex
CREATE INDEX "CoachingRequestCooldown_trainerId_idx" ON "CoachingRequestCooldown"("trainerId");

-- CreateIndex
CREATE INDEX "CoachingRequestCooldown_expiresAt_idx" ON "CoachingRequestCooldown"("expiresAt");

-- CreateIndex
CREATE INDEX "CoachingRequestCooldown_removedAt_idx" ON "CoachingRequestCooldown"("removedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CoachingRequestCooldown_clientId_trainerId_key" ON "CoachingRequestCooldown"("clientId", "trainerId");

-- CreateIndex
CREATE INDEX "DietPlanAssignment_clientId_idx" ON "DietPlanAssignment"("clientId");

-- CreateIndex
CREATE INDEX "DietPlanAssignment_nutritionPlanId_idx" ON "DietPlanAssignment"("nutritionPlanId");

-- CreateIndex
CREATE INDEX "DietPlanAssignment_assignedById_idx" ON "DietPlanAssignment"("assignedById");

-- CreateIndex
CREATE INDEX "DietPlanAssignment_isActive_idx" ON "DietPlanAssignment"("isActive");

-- CreateIndex
CREATE INDEX "DietPlanAssignment_status_idx" ON "DietPlanAssignment"("status");

-- CreateIndex
CREATE INDEX "DietPlanAssignment_startDate_idx" ON "DietPlanAssignment"("startDate");

-- CreateIndex
CREATE INDEX "DietPlanAssignment_assignedAt_idx" ON "DietPlanAssignment"("assignedAt");

-- CreateIndex
CREATE INDEX "DailyDietLog_dietPlanAssignmentId_idx" ON "DailyDietLog"("dietPlanAssignmentId");

-- CreateIndex
CREATE INDEX "DailyDietLog_date_idx" ON "DailyDietLog"("date");

-- CreateIndex
CREATE INDEX "DailyDietLog_dayNumber_idx" ON "DailyDietLog"("dayNumber");

-- CreateIndex
CREATE INDEX "DailyDietLog_isCompleted_idx" ON "DailyDietLog"("isCompleted");

-- CreateIndex
CREATE INDEX "DailyDietLog_completionRate_idx" ON "DailyDietLog"("completionRate");

-- CreateIndex
CREATE UNIQUE INDEX "DailyDietLog_dietPlanAssignmentId_date_key" ON "DailyDietLog"("dietPlanAssignmentId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DietProgressSummary_dietPlanAssignmentId_key" ON "DietProgressSummary"("dietPlanAssignmentId");

-- CreateIndex
CREATE INDEX "DietProgressSummary_dietPlanAssignmentId_idx" ON "DietProgressSummary"("dietPlanAssignmentId");

-- CreateIndex
CREATE INDEX "DietProgressSummary_overallSuccess_idx" ON "DietProgressSummary"("overallSuccess");

-- CreateIndex
CREATE INDEX "DietProgressSummary_adherenceScore_idx" ON "DietProgressSummary"("adherenceScore");

-- CreateIndex
CREATE INDEX "MealLog_dailyDietLogId_idx" ON "MealLog"("dailyDietLogId");

-- CreateIndex
CREATE INDEX "MealLog_mealName_idx" ON "MealLog"("mealName");

-- CreateIndex
CREATE INDEX "MealLog_isCompleted_idx" ON "MealLog"("isCompleted");

-- CreateIndex
CREATE INDEX "MealLog_completedAt_idx" ON "MealLog"("completedAt");

-- CreateIndex
CREATE INDEX "SnackLog_dailyDietLogId_idx" ON "SnackLog"("dailyDietLogId");

-- CreateIndex
CREATE INDEX "SnackLog_mealType_idx" ON "SnackLog"("mealType");

-- CreateIndex
CREATE INDEX "SnackLog_loggedAt_idx" ON "SnackLog"("loggedAt");

-- CreateIndex
CREATE INDEX "SnackLog_loggedTime_idx" ON "SnackLog"("loggedTime");

-- CreateIndex
CREATE INDEX "CustomMeal_clientId_idx" ON "CustomMeal"("clientId");

-- CreateIndex
CREATE INDEX "CustomMeal_mealType_idx" ON "CustomMeal"("mealType");

-- CreateIndex
CREATE INDEX "CustomMeal_lastUsed_idx" ON "CustomMeal"("lastUsed");

-- CreateIndex
CREATE INDEX "CustomMeal_usageCount_idx" ON "CustomMeal"("usageCount");

-- CreateIndex
CREATE INDEX "CustomMeal_clientId_mealType_idx" ON "CustomMeal"("clientId", "mealType");

-- CreateIndex
CREATE INDEX "CustomMeal_clientId_lastUsed_idx" ON "CustomMeal"("clientId", "lastUsed");

-- CreateIndex
CREATE INDEX "AssignedTrainingPlan_clientId_idx" ON "AssignedTrainingPlan"("clientId");

-- CreateIndex
CREATE INDEX "AssignedTrainingPlan_trainerId_idx" ON "AssignedTrainingPlan"("trainerId");

-- CreateIndex
CREATE INDEX "AssignedTrainingPlan_status_idx" ON "AssignedTrainingPlan"("status");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailVerification" ADD CONSTRAINT "EmailVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhoneVerification" ADD CONSTRAINT "PhoneVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gym" ADD CONSTRAINT "Gym_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerInfo" ADD CONSTRAINT "TrainerInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerProfile" ADD CONSTRAINT "TrainerProfile_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerProfile" ADD CONSTRAINT "TrainerProfile_trainerInfoId_fkey" FOREIGN KEY ("trainerInfoId") REFERENCES "TrainerInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerSettings" ADD CONSTRAINT "TrainerSettings_trainerInfoId_fkey" FOREIGN KEY ("trainerInfoId") REFERENCES "TrainerInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerSpecialty" ADD CONSTRAINT "TrainerSpecialty_trainerProfileId_fkey" FOREIGN KEY ("trainerProfileId") REFERENCES "TrainerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerLanguage" ADD CONSTRAINT "TrainerLanguage_trainerProfileId_fkey" FOREIGN KEY ("trainerProfileId") REFERENCES "TrainerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerType" ADD CONSTRAINT "TrainerType_trainerProfileId_fkey" FOREIGN KEY ("trainerProfileId") REFERENCES "TrainerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_trainerProfileId_fkey" FOREIGN KEY ("trainerProfileId") REFERENCES "TrainerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificationDocument" ADD CONSTRAINT "CertificationDocument_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "Certification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientInfo" ADD CONSTRAINT "ClientInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_clientInfoId_fkey" FOREIGN KEY ("clientInfoId") REFERENCES "ClientInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientSettings" ADD CONSTRAINT "ClientSettings_clientInfoId_fkey" FOREIGN KEY ("clientInfoId") REFERENCES "ClientInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientLanguage" ADD CONSTRAINT "ClientLanguage_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "ClientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientActivity" ADD CONSTRAINT "ClientActivity_clientProfileId_fkey" FOREIGN KEY ("clientProfileId") REFERENCES "ClientProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerGym" ADD CONSTRAINT "TrainerGym_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerGym" ADD CONSTRAINT "TrainerGym_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "TrainerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerAvailability" ADD CONSTRAINT "TrainerAvailability_trainerProfileId_fkey" FOREIGN KEY ("trainerProfileId") REFERENCES "TrainerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_trainerInfoId_fkey" FOREIGN KEY ("trainerInfoId") REFERENCES "TrainerInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseMuscleGroup" ADD CONSTRAINT "ExerciseMuscleGroup_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseInfo" ADD CONSTRAINT "ExerciseInfo_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainerGalleryImage" ADD CONSTRAINT "TrainerGalleryImage_trainerProfileId_fkey" FOREIGN KEY ("trainerProfileId") REFERENCES "TrainerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "TrainerInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlan" ADD CONSTRAINT "TrainingPlan_trainerInfoId_fkey" FOREIGN KEY ("trainerInfoId") REFERENCES "TrainerInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NutritionPlan" ADD CONSTRAINT "NutritionPlan_trainerInfoId_fkey" FOREIGN KEY ("trainerInfoId") REFERENCES "TrainerInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingRequest" ADD CONSTRAINT "CoachingRequest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ClientInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingRequest" ADD CONSTRAINT "CoachingRequest_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "TrainerInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingRequestCooldown" ADD CONSTRAINT "CoachingRequestCooldown_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ClientInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingRequestCooldown" ADD CONSTRAINT "CoachingRequestCooldown_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "TrainerInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DietPlanAssignment" ADD CONSTRAINT "DietPlanAssignment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ClientInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DietPlanAssignment" ADD CONSTRAINT "DietPlanAssignment_nutritionPlanId_fkey" FOREIGN KEY ("nutritionPlanId") REFERENCES "NutritionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DietPlanAssignment" ADD CONSTRAINT "DietPlanAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "TrainerInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDietLog" ADD CONSTRAINT "DailyDietLog_dietPlanAssignmentId_fkey" FOREIGN KEY ("dietPlanAssignmentId") REFERENCES "DietPlanAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DietProgressSummary" ADD CONSTRAINT "DietProgressSummary_dietPlanAssignmentId_fkey" FOREIGN KEY ("dietPlanAssignmentId") REFERENCES "DietPlanAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealLog" ADD CONSTRAINT "MealLog_dailyDietLogId_fkey" FOREIGN KEY ("dailyDietLogId") REFERENCES "DailyDietLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnackLog" ADD CONSTRAINT "SnackLog_dailyDietLogId_fkey" FOREIGN KEY ("dailyDietLogId") REFERENCES "DailyDietLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomMeal" ADD CONSTRAINT "CustomMeal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ClientInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedTrainingPlan" ADD CONSTRAINT "AssignedTrainingPlan_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ClientInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedTrainingPlan" ADD CONSTRAINT "AssignedTrainingPlan_originalPlanId_fkey" FOREIGN KEY ("originalPlanId") REFERENCES "TrainingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedTrainingPlan" ADD CONSTRAINT "AssignedTrainingPlan_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "TrainerInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
