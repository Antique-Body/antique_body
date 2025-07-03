/*
  Warnings:

  - You are about to drop the column `planSchedule` on the `NutritionPlan` table. All the data in the column will be lost.
  - You are about to drop the column `planSchedule` on the `TrainingPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `NutritionPlan` DROP COLUMN `planSchedule`;

-- AlterTable
ALTER TABLE `TrainingPlan` DROP COLUMN `planSchedule`;
