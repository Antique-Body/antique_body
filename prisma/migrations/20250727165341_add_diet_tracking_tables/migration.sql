-- CreateTable
CREATE TABLE "DietPlanAssignment" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "nutritionPlanId" TEXT NOT NULL,
    "assignedById" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyDietLog_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE INDEX "DietPlanAssignment_clientId_idx" ON "DietPlanAssignment"("clientId");

-- CreateIndex
CREATE INDEX "DietPlanAssignment_nutritionPlanId_idx" ON "DietPlanAssignment"("nutritionPlanId");

-- CreateIndex
CREATE INDEX "DietPlanAssignment_assignedById_idx" ON "DietPlanAssignment"("assignedById");

-- CreateIndex
CREATE INDEX "DietPlanAssignment_isActive_idx" ON "DietPlanAssignment"("isActive");

-- CreateIndex
CREATE INDEX "DietPlanAssignment_startDate_idx" ON "DietPlanAssignment"("startDate");

-- CreateIndex
CREATE INDEX "DailyDietLog_dietPlanAssignmentId_idx" ON "DailyDietLog"("dietPlanAssignmentId");

-- CreateIndex
CREATE INDEX "DailyDietLog_date_idx" ON "DailyDietLog"("date");

-- CreateIndex
CREATE INDEX "DailyDietLog_dayNumber_idx" ON "DailyDietLog"("dayNumber");

-- CreateIndex
CREATE INDEX "DailyDietLog_isCompleted_idx" ON "DailyDietLog"("isCompleted");

-- CreateIndex
CREATE UNIQUE INDEX "DailyDietLog_dietPlanAssignmentId_date_key" ON "DailyDietLog"("dietPlanAssignmentId", "date");

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
CREATE INDEX "CustomMeal_clientId_name_mealType_calories_protein_carbs_fa_idx" ON "CustomMeal"("clientId", "name", "mealType", "calories", "protein", "carbs", "fat");

-- AddForeignKey
ALTER TABLE "DietPlanAssignment" ADD CONSTRAINT "DietPlanAssignment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ClientInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DietPlanAssignment" ADD CONSTRAINT "DietPlanAssignment_nutritionPlanId_fkey" FOREIGN KEY ("nutritionPlanId") REFERENCES "NutritionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DietPlanAssignment" ADD CONSTRAINT "DietPlanAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "TrainerInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyDietLog" ADD CONSTRAINT "DailyDietLog_dietPlanAssignmentId_fkey" FOREIGN KEY ("dietPlanAssignmentId") REFERENCES "DietPlanAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealLog" ADD CONSTRAINT "MealLog_dailyDietLogId_fkey" FOREIGN KEY ("dailyDietLogId") REFERENCES "DailyDietLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SnackLog" ADD CONSTRAINT "SnackLog_dailyDietLogId_fkey" FOREIGN KEY ("dailyDietLogId") REFERENCES "DailyDietLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomMeal" ADD CONSTRAINT "CustomMeal_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ClientInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
