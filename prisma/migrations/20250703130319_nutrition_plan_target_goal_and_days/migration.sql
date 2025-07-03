/*
  Warnings:

  - You are about to drop the column `difficultyLevel` on the `NutritionPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `NutritionPlan` DROP COLUMN `difficultyLevel`,
    ADD COLUMN `days` JSON NULL,
    ADD COLUMN `targetGoal` VARCHAR(191) NULL;
