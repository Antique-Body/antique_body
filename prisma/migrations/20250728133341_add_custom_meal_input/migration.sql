-- DropForeignKey
ALTER TABLE "AssignedNutritionPlan" DROP CONSTRAINT "AssignedNutritionPlan_originalPlanId_fkey";

-- AlterTable
ALTER TABLE "AssignedNutritionPlan" ADD COLUMN     "customMealInputEnabled" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "originalPlanId" DROP NOT NULL,
ALTER COLUMN "planData" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DietPlanAssignment" ALTER COLUMN "nutritionPlanId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AssignedNutritionPlan" ADD CONSTRAINT "AssignedNutritionPlan_originalPlanId_fkey" FOREIGN KEY ("originalPlanId") REFERENCES "NutritionPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
