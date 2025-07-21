/*
  Warnings:

  - You are about to drop the column `isActive` on the `NutritionPlan` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `NutritionPlan` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `TrainerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerSession` on the `TrainerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `pricingType` on the `TrainerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `TrainingPlan` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `TrainingPlan` table. All the data in the column will be lost.
  - You are about to drop the `CustomMeal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DailyDietLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DietPlanAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MealLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SnackLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CustomMeal` DROP FOREIGN KEY `CustomMeal_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `DailyDietLog` DROP FOREIGN KEY `DailyDietLog_dietPlanAssignmentId_fkey`;

-- DropForeignKey
ALTER TABLE `DietPlanAssignment` DROP FOREIGN KEY `DietPlanAssignment_assignedById_fkey`;

-- DropForeignKey
ALTER TABLE `DietPlanAssignment` DROP FOREIGN KEY `DietPlanAssignment_clientId_fkey`;

-- DropForeignKey
ALTER TABLE `DietPlanAssignment` DROP FOREIGN KEY `DietPlanAssignment_nutritionPlanId_fkey`;

-- DropForeignKey
ALTER TABLE `MealLog` DROP FOREIGN KEY `MealLog_dailyDietLogId_fkey`;

-- DropForeignKey
ALTER TABLE `SnackLog` DROP FOREIGN KEY `SnackLog_dailyDietLogId_fkey`;

-- DropIndex
DROP INDEX `NutritionPlan_isActive_idx` ON `NutritionPlan`;

-- DropIndex
DROP INDEX `NutritionPlan_isPublished_idx` ON `NutritionPlan`;

-- DropIndex
DROP INDEX `TrainingPlan_isActive_idx` ON `TrainingPlan`;

-- DropIndex
DROP INDEX `TrainingPlan_isPublished_idx` ON `TrainingPlan`;

-- AlterTable
ALTER TABLE `NutritionPlan` DROP COLUMN `isActive`,
    DROP COLUMN `isPublished`;

-- AlterTable
ALTER TABLE `TrainerProfile` DROP COLUMN `currency`,
    DROP COLUMN `pricePerSession`,
    DROP COLUMN `pricingType`;

-- AlterTable
ALTER TABLE `TrainingPlan` DROP COLUMN `isActive`,
    DROP COLUMN `isPublished`;

-- DropTable
DROP TABLE `CustomMeal`;

-- DropTable
DROP TABLE `DailyDietLog`;

-- DropTable
DROP TABLE `DietPlanAssignment`;

-- DropTable
DROP TABLE `MealLog`;

-- DropTable
DROP TABLE `SnackLog`;
