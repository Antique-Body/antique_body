/*
  Warnings:

  - You are about to drop the column `injuryLocations` on the `UserPreferences` table. All the data in the column will be lost.
  - Added the required column `bmiCategory` to the `UserPreferences` table without a default value. This is not possible if the table is not empty.

*/
-- First, add bmiCategory column with a default value
ALTER TABLE `UserPreferences` ADD COLUMN `bmiCategory` VARCHAR(191) NOT NULL DEFAULT 'normal';

-- Update bmiCategory based on existing BMI values
UPDATE `UserPreferences`
SET `bmiCategory` = 
  CASE
    WHEN `bmi` < 18.5 THEN 'underweight'
    WHEN `bmi` < 25 THEN 'normal'
    WHEN `bmi` < 30 THEN 'overweight'
    ELSE 'obese'
  END;

-- Create the UserInjuryLocation table
CREATE TABLE `UserInjuryLocation` (
    `id` VARCHAR(191) NOT NULL,
    `userPreferencesId` VARCHAR(191) NOT NULL,
    `location` ENUM('neck', 'shoulder_l', 'shoulder_r', 'back_upper', 'back_lower', 'elbow_l', 'elbow_r', 'wrist_l', 'wrist_r', 'hip_l', 'hip_r', 'knee_l', 'knee_r', 'ankle_l', 'ankle_r') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserInjuryLocation_location_idx`(`location`),
    INDEX `UserInjuryLocation_userPreferencesId_idx`(`userPreferencesId`),
    UNIQUE INDEX `UserInjuryLocation_userPreferencesId_location_key`(`userPreferencesId`, `location`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create temporary table for valid JSON data
CREATE TEMPORARY TABLE temp_injury_locations AS
SELECT 
    id as userPreferencesId,
    CASE 
        WHEN injuryLocations IS NULL OR injuryLocations = '' OR injuryLocations = 'null' 
        THEN '[]'
        ELSE injuryLocations
    END as locations
FROM `UserPreferences`
WHERE hasInjury = true
AND injuryLocations IS NOT NULL
AND injuryLocations != ''
AND injuryLocations != 'null';

-- Insert into UserInjuryLocation only valid data
INSERT INTO `UserInjuryLocation` (`id`, `userPreferencesId`, `location`)
SELECT 
    UUID(),
    t.userPreferencesId,
    TRIM(BOTH '"' FROM JSON_UNQUOTE(locations.value)) as location
FROM 
    temp_injury_locations t
    CROSS JOIN JSON_TABLE(
        t.locations,
        '$[*]' COLUMNS (value VARCHAR(191) PATH '$')
    ) locations
WHERE 
    TRIM(BOTH '"' FROM JSON_UNQUOTE(locations.value)) IN (
        'neck', 'shoulder_l', 'shoulder_r', 'back_upper', 'back_lower',
        'elbow_l', 'elbow_r', 'wrist_l', 'wrist_r', 'hip_l', 'hip_r',
        'knee_l', 'knee_r', 'ankle_l', 'ankle_r'
    );

-- Drop temporary table
DROP TEMPORARY TABLE IF EXISTS temp_injury_locations;

-- Now we can safely drop the old injuryLocations column
ALTER TABLE `UserPreferences` DROP COLUMN `injuryLocations`;

-- Create new indexes
CREATE INDEX `UserPreferences_hasInjury_idx` ON `UserPreferences`(`hasInjury`);
CREATE INDEX `UserPreferences_injuryType_idx` ON `UserPreferences`(`injuryType`);
CREATE INDEX `UserPreferences_bmi_idx` ON `UserPreferences`(`bmi`);
CREATE INDEX `UserPreferences_bmiCategory_idx` ON `UserPreferences`(`bmiCategory`);
CREATE INDEX `UserPreferences_wantsRehabilitation_idx` ON `UserPreferences`(`wantsRehabilitation`);
CREATE INDEX `UserPreferences_weight_idx` ON `UserPreferences`(`weight`);
CREATE INDEX `UserPreferences_height_idx` ON `UserPreferences`(`height`);
CREATE INDEX `UserPreferences_createdAt_idx` ON `UserPreferences`(`createdAt`);

-- Add foreign key constraint
ALTER TABLE `UserInjuryLocation` ADD CONSTRAINT `UserInjuryLocation_userPreferencesId_fkey` FOREIGN KEY (`userPreferencesId`) REFERENCES `UserPreferences`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
