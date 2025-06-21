-- CreateIndex
CREATE INDEX `Exercise_name_idx` ON `Exercise`(`name`);

-- CreateIndex
CREATE INDEX `Exercise_createdAt_idx` ON `Exercise`(`createdAt`);

-- CreateIndex
CREATE INDEX `Exercise_trainerInfoId_type_idx` ON `Exercise`(`trainerInfoId`, `type`);

-- CreateIndex
CREATE INDEX `Exercise_trainerInfoId_level_idx` ON `Exercise`(`trainerInfoId`, `level`);

-- CreateIndex
CREATE INDEX `Exercise_trainerInfoId_location_idx` ON `Exercise`(`trainerInfoId`, `location`);

-- CreateIndex
CREATE INDEX `Exercise_trainerInfoId_equipment_idx` ON `Exercise`(`trainerInfoId`, `equipment`);

-- CreateIndex
CREATE INDEX `Exercise_trainerInfoId_createdAt_idx` ON `Exercise`(`trainerInfoId`, `createdAt`);

-- CreateIndex
CREATE FULLTEXT INDEX `Exercise_name_description_instructions_idx` ON `Exercise`(`name`, `description`, `instructions`);
