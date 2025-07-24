/*
  Warnings:

  - You are about to drop the `WorkoutProgress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `WorkoutProgress` DROP FOREIGN KEY `WorkoutProgress_assignedPlanId_fkey`;

-- DropForeignKey
ALTER TABLE `WorkoutProgress` DROP FOREIGN KEY `WorkoutProgress_userId_fkey`;

-- DropTable
DROP TABLE `WorkoutProgress`;
