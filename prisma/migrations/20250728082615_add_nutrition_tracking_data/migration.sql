-- CreateTable
CREATE TABLE "NutritionTrackingData" (
    "id" TEXT NOT NULL,
    "assignedNutritionPlanId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "meals" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NutritionTrackingData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NutritionTrackingData_assignedNutritionPlanId_idx" ON "NutritionTrackingData"("assignedNutritionPlanId");

-- CreateIndex
CREATE INDEX "NutritionTrackingData_date_idx" ON "NutritionTrackingData"("date");

-- CreateIndex
CREATE UNIQUE INDEX "NutritionTrackingData_assignedNutritionPlanId_date_key" ON "NutritionTrackingData"("assignedNutritionPlanId", "date");

-- AddForeignKey
ALTER TABLE "NutritionTrackingData" ADD CONSTRAINT "NutritionTrackingData_assignedNutritionPlanId_fkey" FOREIGN KEY ("assignedNutritionPlanId") REFERENCES "AssignedNutritionPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
