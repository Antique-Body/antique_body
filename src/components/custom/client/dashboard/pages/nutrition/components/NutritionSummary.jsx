import { Button } from "@/components/common/Button";
import { CalendarIcon, CameraIcon, PlusIcon, WaterMediumIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { MacroDistribution } from "@/components/custom/client/dashboard/pages/nutrition/components";
import { useMemo } from "react";

export const NutritionSummary = ({ 
  userData, 
  meals, 
  waterIntake, 
  openNewMealModal, 
  openHistoryModal,
  foodAnalyzerRef,
  hydrationRef 
}) => {
  // Calculate totals
  const totals = useMemo(
    () =>
      meals.reduce(
        (acc, meal) => ({
          calories: acc.calories + meal.calories,
          protein: acc.protein + meal.protein,
          carbs: acc.carbs + meal.carbs,
          fat: acc.fat + meal.fat,
          fiber: acc.fiber + (meal.fiber || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      ),
    [meals],
  );

  // Calculate percentages for progress bars
  const getPercentage = (consumed, goal) => {
    const percentage = (consumed / goal) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  const scrollToSection = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <Card variant="darkStrong" width="100%" maxWidth="none">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Today's Nutrition</h2>
        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            size="small"
            onClick={openHistoryModal}
            leftIcon={<CalendarIcon size={14} />}
          >
            History
          </Button>
          <div className="text-sm bg-[rgba(255,107,0,0.15)] text-[#FF6B00] px-3 py-1 rounded-full">
            {userData.workout.type} Day
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card variant="dark" width="100%" maxWidth="none" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Macro Targets</h3>
            <div className="flex">
              <div className="text-2xl font-bold">{totals.calories}</div>
              <div className="text-gray-400 text-sm ml-1 self-end mb-1">/ {userData.stats.calorieGoal} cal</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <MacroProgressBar 
              label="Protein"
              color="bg-blue-500" 
              current={totals.protein} 
              goal={userData.stats.proteinGoal} 
              getPercentage={getPercentage} 
            />

            <MacroProgressBar 
              label="Carbs"
              color="bg-green-500" 
              current={totals.carbs} 
              goal={userData.stats.carbsGoal} 
              getPercentage={getPercentage} 
            />

            <MacroProgressBar 
              label="Fat"
              color="bg-yellow-500" 
              current={totals.fat} 
              goal={userData.stats.fatGoal} 
              getPercentage={getPercentage} 
            />
            
            <MacroProgressBar 
              label="Fiber"
              color="bg-orange-800" 
              current={totals.fiber} 
              goal={userData.stats.fiberGoal} 
              getPercentage={getPercentage} 
            />
          </div>
        </Card>

        <Card variant="dark" width="100%" maxWidth="none">
          <h3 className="font-bold mb-4">Macro Distribution</h3>
          
          <MacroDistribution 
            protein={totals.protein * 4} 
            carbs={totals.carbs * 4} 
            fat={totals.fat * 9} 
          />

          <div className="mt-4 bg-[rgba(30,30,30,0.7)] p-3 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Training Focus</h4>
            <div className="flex items-center text-sm">
              <div className="mr-2 w-4 h-4 rounded-full bg-[rgba(255,107,0,0.3)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#FF6B00]"></div>
              </div>
              <div>
                <p className="font-medium">{userData.workout.focus}</p>
                <p className="text-xs text-gray-400">{userData.workout.duration} • {userData.workout.intensityLevel} intensity</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ActionCard 
          title="Log Meal Manually"
          icon={<PlusIcon size={20} className="text-[#FF6B00]" />}
          description="Track your food intake"
          onClick={() => {
            openNewMealModal();
          }}
          color="rgba(255,107,0,0.15)"
          iconColor="#FF6B00"
          footer={`${meals.length} meals logged today`}
        />

        <ActionCard 
          title="Analyze Food Photo"
          icon={<CameraIcon size={20} className="text-[#FF6B00]" />}
          description="Identify with AI"
          onClick={() => scrollToSection(foodAnalyzerRef)}
          color="rgba(255,107,0,0.15)"
          iconColor="#FF6B00"
          footer="Quick nutrition details"
        />

        <ActionCard 
          title="Hydration Tracking"
          icon={<WaterMediumIcon size={20} className="text-[#3B82F6]" />}
          description="Monitor water intake"
          onClick={() => scrollToSection(hydrationRef)}
          color="rgba(59,130,246,0.15)"
          iconColor="#3B82F6"
          footer={`${(waterIntake / 1000).toFixed(1)} / 3.0 L consumed`}
          footerColor="text-blue-400"
        />
      </div>
    </Card>
  );
};

// Extracted component for macro progress bars
const MacroProgressBar = ({ label, color, current, goal, getPercentage }) => (
  <div>
    <div className="mb-1 flex justify-between text-sm">
      <div className="flex items-center">
        <div className={`mr-2 h-3 w-3 rounded-full ${color}`}></div>
        <p>{label}</p>
      </div>
      <p>
        <span className="text-white">{current}g</span> 
        <span className="text-gray-400"> / {goal}g</span>
      </p>
    </div>
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#333]">
      <div 
        className={`h-full ${color}`} 
        style={{ width: `${getPercentage(current, goal)}%` }}
      ></div>
    </div>
  </div>
);

// Extracted component for action cards
const ActionCard = ({ title, icon, description, onClick, color, iconColor, footer, footerColor = "text-gray-500" }) => (
  <Card
    variant="dark"
    width="100%" 
    maxWidth="none"
    className="cursor-pointer hover:border-[#FF6B00] transition-colors"
    onClick={onClick}
  >
    <div className="p-3 flex flex-col items-center text-center">
      <div className="mb-2 h-10 w-10 flex items-center justify-center rounded-full" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <h3 className="font-medium mb-1 text-sm">{title}</h3>
      <p className="text-gray-400 text-xs">{description}</p>
      <div className="mt-2">
        <p className={`text-xs ${footerColor}`}>{footer}</p>
      </div>
    </div>
  </Card>
); 