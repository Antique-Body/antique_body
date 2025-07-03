import mockNutritionPlans from "./mockNutritionPlans";
import mockTrainingPlans from "./mockTrainingPlans";

// Combine all plans for easy use
const mockPlans = [...mockTrainingPlans, ...mockNutritionPlans];

export { mockTrainingPlans, mockNutritionPlans, mockPlans };
