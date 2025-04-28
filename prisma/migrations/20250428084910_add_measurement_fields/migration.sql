/*
  Warnings:

  - You are about to drop the column `measurements` on the `UserPreferences` table. All the data in the column will be lost.
  - Added the required column `bmi` to the `UserPreferences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `UserPreferences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `UserPreferences` table without a default value. This is not possible if the table is not empty.

*/
-- First add the columns as nullable
ALTER TABLE `UserPreferences` 
    ADD COLUMN `bmi` DOUBLE NULL,
    ADD COLUMN `height` DOUBLE NULL,
    ADD COLUMN `weight` DOUBLE NULL;

-- Update existing records with default values
UPDATE `UserPreferences` 
SET `bmi` = 0.0,
    `height` = 0.0,
    `weight` = 0.0
WHERE `bmi` IS NULL;

-- Make the columns required
ALTER TABLE `UserPreferences` 
    MODIFY COLUMN `bmi` DOUBLE NOT NULL,
    MODIFY COLUMN `height` DOUBLE NOT NULL,
    MODIFY COLUMN `weight` DOUBLE NOT NULL;

-- Finally drop the old measurements column
ALTER TABLE `UserPreferences` DROP COLUMN `measurements`;
