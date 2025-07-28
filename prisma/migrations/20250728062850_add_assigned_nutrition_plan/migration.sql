-- CreateTable
CREATE TABLE "AssignedNutritionPlan" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "trainerId" TEXT NOT NULL,
    "originalPlanId" TEXT NOT NULL,
    "planData" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AssignedNutritionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AssignedNutritionPlan_clientId_idx" ON "AssignedNutritionPlan"("clientId");

-- CreateIndex
CREATE INDEX "AssignedNutritionPlan_trainerId_idx" ON "AssignedNutritionPlan"("trainerId");

-- CreateIndex
CREATE INDEX "AssignedNutritionPlan_status_idx" ON "AssignedNutritionPlan"("status");

-- AddForeignKey
ALTER TABLE "AssignedNutritionPlan" ADD CONSTRAINT "AssignedNutritionPlan_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ClientInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedNutritionPlan" ADD CONSTRAINT "AssignedNutritionPlan_originalPlanId_fkey" FOREIGN KEY ("originalPlanId") REFERENCES "NutritionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignedNutritionPlan" ADD CONSTRAINT "AssignedNutritionPlan_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "TrainerInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
