import { Button } from "@/components/common/Button";
import { CalendarIcon, CameraIcon, ChevronDownIcon, ChevronUpIcon, PlusIcon, TrashIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";
import { FoodImageAnalyzer } from "@/components/custom/client/dashboard/pages/nutrition/components";
import { useMemo, useState } from "react";

export const MealLoggingSection = ({ 
  meals, 
  userData, 
  onDeleteMeal, 
  onEditMeal, 
  onAddMeal, 
  onOpenHistory,
  onAddAnalyzedMeal,
  selectedMealForEdit,
  foodAnalyzerRef
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

  const scrollToSection = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="scroll-mt-8">
      <Card variant="darkStrong" width="100%" maxWidth="none" className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <h2 className="text-2xl font-bold mb-4 sm:mb-0">Daily Meals</h2>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="orangeFilled" 
              onClick={() => onAddMeal()}
              leftIcon={<PlusIcon size={18} />}
              className="py-2.5 px-5 text-base"
            >
              Add Meal
            </Button>
            <Button 
              variant="secondary" 
              onClick={onOpenHistory}
              leftIcon={<CalendarIcon size={18} />}
              className="py-2.5 px-5 text-base"
            >
              History
            </Button>
          </div>
        </div>

        {meals.length === 0 ? (
          <div className="bg-[rgba(30,30,30,0.7)] rounded-lg p-10 text-center">
            <p className="text-gray-300 text-lg mb-5">No meals logged for today</p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Button 
                variant="orangeFilled" 
                onClick={() => onAddMeal()}
                leftIcon={<PlusIcon size={18} />}
                className="py-3 px-5 text-base"
              >
                Add Meal Manually
              </Button>
              <Button 
                variant="orangeOutline" 
                onClick={() => {
                  setTimeout(() => {
                    scrollToSection(foodAnalyzerRef);
                  }, 100);
                }}
                leftIcon={<CameraIcon size={18} />}
                className="py-3 px-5 text-base"
              >
                Use AI Food Scanner
              </Button>
            </div>
          </div>
        ) : (
          <div>
            {/* Daily summary banner */}
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-[#222] to-[#1A1A1A] border border-[#333]">
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="mr-4">
                    <div className="text-xl font-bold text-[#FF6B00]">{totals.calories}</div>
                    <div className="text-sm text-gray-400">calories</div>
                  </div>
                  <div className="flex gap-4">
                    <MacroStat label="Protein" value={`${totals.protein}g`} color="text-blue-500" />
                    <MacroStat label="Carbs" value={`${totals.carbs}g`} color="text-green-500" />
                    <MacroStat label="Fat" value={`${totals.fat}g`} color="text-yellow-500" />
                  </div>
                </div>
                <div className="text-sm text-gray-300">
                  <span className="font-medium">{meals.length} meals</span> logged today
                </div>
              </div>
            </div>
            
            {/* Meal list */}
            <div className="bg-[#181818] rounded-xl overflow-hidden border border-[#333]">
              <div className="grid grid-cols-7 text-sm font-medium text-gray-300 py-3 px-4 border-b border-[#333] bg-[#1d1d1d]">
                <div className="col-span-2">Meal</div>
                <div className="text-center">Calories</div>
                <div className="text-center">Protein</div>
                <div className="text-center">Carbs</div>
                <div className="text-center">Fat</div>
                <div className="text-right">Actions</div>
              </div>
              
              {meals.map(meal => (
                <MealRow 
                  key={meal.id} 
                  meal={meal} 
                  onDelete={() => onDeleteMeal(meal.id)} 
                  onEdit={() => onEditMeal(meal)}
                  onAddFood={() => {
                    onEditMeal(meal);
                    scrollToSection(foodAnalyzerRef);
                  }}
                />
              ))}
              
              {/* Add meal button at the bottom */}
              <div className="p-3 border-t border-[#333] bg-[#1d1d1d] text-center">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => onAddMeal()}
                  leftIcon={<PlusIcon size={14} />}
                  className="text-[#FF6B00] hover:text-[#FF8A30] text-sm py-1.5"
                >
                  Add Another Meal
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      <div ref={foodAnalyzerRef} className="mt-6 scroll-mt-8">
        <FoodImageAnalyzer 
          onAddToMeal={onAddAnalyzedMeal} 
          dailyGoals={userData.stats}
          dailyMacros={totals}
          selectedMeal={selectedMealForEdit}
        />
      </div>
    </div>
  );
};

// Meal row component with expandable details
const MealRow = ({ meal, onDelete, onEdit, onAddFood }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="border-b border-[#333] last:border-b-0">
      {/* Main row */}
      <div className="grid grid-cols-7 items-center py-4 px-4 hover:bg-[#1d1d1d] cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="col-span-2 flex items-center">
          <Button
            variant="ghost"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="mr-3 text-gray-400 hover:text-white p-1"
          >
            {isExpanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
          </Button>
          <div>
            <p className="font-medium text-base">{meal.name}</p>
            <p className="text-sm text-gray-400">{meal.time}</p>
          </div>
        </div>
        <div className="text-center font-medium">{meal.calories}</div>
        <div className="text-center text-blue-500">{meal.protein}g</div>
        <div className="text-center text-green-500">{meal.carbs}g</div>
        <div className="text-center text-yellow-500">{meal.fat}g</div>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#333] rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-[#333] rounded-full"
          >
            <TrashIcon size={15} />
          </Button>
        </div>
      </div>
      
      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 bg-[#1a1a1a]">
          <div className="py-3 border-t border-[#333] mt-1">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Food Items ({meal.items.length})</h4>
              <Button
                variant="ghost"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddFood();
                }}
                className="py-1 px-2 text-sm text-[#FF6B00]"
              >
                <PlusIcon size={12} className="mr-1" /> Add Item
              </Button>
            </div>
            
            {meal.items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                {meal.items.map(item => (
                  <div 
                    key={item.id} 
                    className="flex justify-between py-2 px-3 rounded bg-[#222] border border-[#333]"
                  >
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.amount}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm text-[#FF6B00]">{item.calories} cal</p>
                      <div className="flex gap-2 text-xs text-gray-400">
                        <span className="text-blue-400">P: {item.protein}g</span>
                        <span className="text-green-400">C: {item.carbs}g</span>
                        <span className="text-yellow-400">F: {item.fat}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 text-gray-400 bg-[#222] rounded-lg">
                No items in this meal
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Macro stat component
const MacroStat = ({ label, value, color }) => (
  <div>
    <div className={`font-medium ${color}`}>{value}</div>
    <div className="text-xs text-gray-400">{label}</div>
  </div>
); 