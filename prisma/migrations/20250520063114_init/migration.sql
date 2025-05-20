/*
  Warnings:

  - You are about to drop the `UserInjuryLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPreferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `UserInjuryLocation` DROP FOREIGN KEY `UserInjuryLocation_userPreferencesId_fkey`;

-- DropForeignKey
ALTER TABLE `UserPreferences` DROP FOREIGN KEY `UserPreferences_userId_fkey`;

-- DropTable
DROP TABLE `UserInjuryLocation`;

-- DropTable
DROP TABLE `UserPreferences`;
