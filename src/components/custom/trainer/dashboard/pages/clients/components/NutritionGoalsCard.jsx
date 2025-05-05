import { Button } from "@/components/common/Button";
import { NutritionIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { MacroDistribution } from "@/components/custom/client/dashboard/pages/nutrition/components";
import { FormField } from "@/components/common/FormField";

export const NutritionGoalsCard = ({ nutrition, onNutritionChange, onSubmit, clientGoal }) => {
    return (
        <Card variant="darkStrong" hover={true} width="100%" maxWidth="none">
            <h3 className="mb-4 flex items-center text-xl font-semibold">
                <NutritionIcon size={20} stroke="#FF6B00" className="mr-2" />
                Nutrition Goals
            </h3>

            <form className="mb-4 grid grid-cols-1 gap-3" onSubmit={onSubmit}>
                <div className="grid grid-cols-2 gap-2">
                    <FormField
                        type="number"
                        label="Protein (g)"
                        value={nutrition.protein || ""}
                        onChange={(e) => onNutritionChange({ ...nutrition, protein: parseInt(e.target.value) })}
                        className="mb-0"
                    />
                    <FormField
                        type="number"
                        label="Carbs (g)"
                        value={nutrition.carbs || ""}
                        onChange={(e) => onNutritionChange({ ...nutrition, carbs: parseInt(e.target.value) })}
                        className="mb-0"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <FormField
                        type="number"
                        label="Fats (g)"
                        value={nutrition.fats || ""}
                        onChange={(e) => onNutritionChange({ ...nutrition, fats: parseInt(e.target.value) })}
                        className="mb-0"
                    />
                    <FormField
                        type="number"
                        label="Calories"
                        value={nutrition.calories || ""}
                        onChange={(e) => onNutritionChange({ ...nutrition, calories: parseInt(e.target.value) })}
                        className="mb-0"
                    />
                </div>

                <Button type="submit" variant="orangeFilled" className="mt-2">
                    Update Nutrition Goals
                </Button>
            </form>

            {/* Macro distribution visualization */}
            <div className="mb-5">
                <h4 className="mb-2 text-sm font-medium">Macronutrient Distribution</h4>
                <MacroDistribution protein={nutrition.protein || 0} carbs={nutrition.carbs || 0} fat={nutrition.fats || 0} />
            </div>

            <div>
                <h4 className="mb-2 text-sm font-medium">Nutrition Recommendations</h4>
                <div className="text-sm text-gray-300">
                    <ul className="ml-5 list-disc space-y-1 text-gray-400">
                        <li>Maintain high protein intake for recovery</li>
                        <li>Consider {clientGoal === "Fat Loss" ? "reducing" : "increasing"} carb intake</li>
                        <li>Stay hydrated (3-4 liters per day)</li>
                        <li>Track food intake daily</li>
                    </ul>
                </div>
            </div>
        </Card>
    );
};
