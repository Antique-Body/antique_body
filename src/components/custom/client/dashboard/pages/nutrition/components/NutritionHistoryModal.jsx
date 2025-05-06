import { useMemo, useState } from 'react';

import { MacroDistribution } from "./MacroDistribution";

import { Modal } from "@/components/common/Modal";
import { Card } from "@/components/custom/Card";

export const NutritionHistoryModal = ({ 
  isOpen, 
  onClose, 
  meals, 
  selectedDate, 
  onDateChange, 
  waterIntake, 
  dailyGoals 
}) => {
  const [selectedView, setSelectedView] = useState('summary'); // 'summary' or 'meals'
  
  // Format date for display
  const formattedDate = useMemo(() => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  }, [selectedDate]);
  
  // Calculate total macros for the day
  const totals = useMemo(() => meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
        fiber: acc.fiber + (meal.fiber || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    ), [meals]);
  
  // Calculate percentages for progress bars
  const getPercentage = (consumed, goal) => {
    const percentage = (consumed / goal) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  // Format date for input
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nutrition History"
      size="large"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Calendar */}
        <Card variant="dark" className="md:col-span-1 p-5">
          <h3 className="font-bold mb-4 text-lg">Select Date</h3>
          <div className="mb-4">
            <input
              type="date"
              value={formatDateForInput(selectedDate)}
              onChange={(e) => onDateChange(new Date(e.target.value))}
              className="w-full bg-[#121212] border border-[#333] rounded-lg shadow-lg p-2 text-white"
            />
          </div>
          
          <div className="mt-6 pt-4 border-t border-[#333]">
            <h4 className="font-medium text-sm mb-4">Nutrition Insights</h4>
            <div className="bg-[rgba(30,30,30,0.7)] p-4 rounded-lg">
              <p className="text-sm text-gray-300 mb-3">
                <strong>Week of {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong>
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                  Average protein: 145g/day
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mr-2"></div>
                  Average calories: 2150/day
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></div>
                  Best hydration day: Monday
                </li>
              </ul>
            </div>
          </div>
        </Card>
        
        {/* Nutrition data */}
        <div className="md:col-span-2">
          <div className="mb-5">
            <h3 className="text-xl font-bold">{formattedDate}</h3>
            <div className="flex mt-4 border-b border-[#333]">
              <button
                className={`py-3 px-5 text-sm font-medium border-b-2 whitespace-nowrap ${
                  selectedView === 'summary' 
                    ? 'border-[#FF6B00] text-[#FF6B00]' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
                onClick={() => setSelectedView('summary')}
              >
                Daily Summary
              </button>
              <button
                className={`py-3 px-5 text-sm font-medium border-b-2 whitespace-nowrap ${
                  selectedView === 'meals' 
                    ? 'border-[#FF6B00] text-[#FF6B00]' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
                onClick={() => setSelectedView('meals')}
              >
                Meal Details
              </button>
            </div>
          </div>
          
          {selectedView === 'summary' ? (
            <div className="space-y-6">
              {/* Nutrition Summary */}
              <Card variant="dark" className="p-5">
                <h4 className="font-bold mb-4 text-lg">Macro Summary</h4>
                
                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div className="text-center bg-[rgba(255,107,0,0.1)] rounded-lg p-3">
                    <div className="text-2xl font-bold text-[#FF6B00]">{totals.calories}</div>
                    <div className="text-sm text-gray-300 mt-1">Calories</div>
                    <div className="text-xs text-gray-500 mt-1">Goal: {dailyGoals.calorieGoal}</div>
                  </div>
                  <div className="text-center bg-[rgba(59,130,246,0.1)] rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-500">{totals.protein}g</div>
                    <div className="text-sm text-gray-300 mt-1">Protein</div>
                    <div className="text-xs text-gray-500 mt-1">Goal: {dailyGoals.proteinGoal}g</div>
                  </div>
                  <div className="text-center bg-[rgba(34,197,94,0.1)] rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-500">{totals.carbs}g</div>
                    <div className="text-sm text-gray-300 mt-1">Carbs</div>
                    <div className="text-xs text-gray-500 mt-1">Goal: {dailyGoals.carbsGoal}g</div>
                  </div>
                </div>
                
                <div className="space-y-4 mb-5">
                  <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <div className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
                        <p>Protein</p>
                      </div>
                      <p>{Math.round(getPercentage(totals.protein, dailyGoals.proteinGoal))}%</p>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#333]">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${getPercentage(totals.protein, dailyGoals.proteinGoal)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <div className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                        <p>Carbs</p>
                      </div>
                      <p>{Math.round(getPercentage(totals.carbs, dailyGoals.carbsGoal))}%</p>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#333]">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${getPercentage(totals.carbs, dailyGoals.carbsGoal)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <div className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
                        <p>Fat</p>
                      </div>
                      <p>{Math.round(getPercentage(totals.fat, dailyGoals.fatGoal))}%</p>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#333]">
                      <div 
                        className="h-full bg-yellow-500" 
                        style={{ width: `${getPercentage(totals.fat, dailyGoals.fatGoal)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <div className="flex items-center">
                        <div className="mr-2 h-3 w-3 rounded-full bg-orange-800"></div>
                        <p>Fiber</p>
                      </div>
                      <p>{Math.round(getPercentage(totals.fiber, dailyGoals.fiberGoal))}%</p>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#333]">
                      <div 
                        className="h-full bg-orange-800" 
                        style={{ width: `${getPercentage(totals.fiber, dailyGoals.fiberGoal)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-[#333]">
                  <h5 className="text-sm font-medium mb-3">Macro Distribution</h5>
                  <MacroDistribution 
                    protein={totals.protein * 4} 
                    carbs={totals.carbs * 4} 
                    fat={totals.fat * 9} 
                    size="small"
                  />
                </div>
              </Card>
              
              {/* Hydration Card */}
              <Card variant="dark" className="p-5">
                <h4 className="font-bold mb-4 text-lg">Hydration</h4>
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm text-gray-300">Daily Water Intake</div>
                  <div className="text-xl font-bold text-blue-400">{(waterIntake / 1000).toFixed(1)} L <span className="text-xs text-gray-400 ml-1">/ 3.0 L</span></div>
                </div>
                <div className="h-5 overflow-hidden rounded-full bg-[#222] mb-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                    style={{ width: `${getPercentage(waterIntake, 3000)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 mt-3">
                  {waterIntake >= 3000 ? "Great job! You've reached your hydration goal." : "Try to drink more water to reach your daily goal."}
                </div>
              </Card>
              
              {/* Distribution by meal */}
              <Card variant="dark" className="p-5">
                <h4 className="font-bold mb-4 text-lg">Meal Distribution</h4>
                <div className="space-y-4">
                  {meals.length > 0 ? (
                    meals.map(meal => (
                      <div key={meal.id} className="flex justify-between items-center p-3 rounded-lg bg-[rgba(30,30,30,0.5)] hover:bg-[rgba(30,30,30,0.7)] transition-colors">
                        <div>
                          <div className="text-sm font-medium">{meal.name}</div>
                          <div className="text-xs text-gray-400 mt-1">{meal.time}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{meal.calories} kcal</div>
                          <div className="text-xs text-gray-400 mt-1">
                            P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 text-gray-400">
                      No meals logged for this date
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {meals.length > 0 ? (
                meals.map(meal => (
                  <Card key={meal.id} variant="dark" className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-bold text-lg">{meal.name}</h4>
                        <div className="text-sm text-gray-400 mt-1">{meal.time}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{meal.calories} kcal</div>
                        <div className="text-xs text-gray-400 mt-1">
                          P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div className="rounded bg-[rgba(59,130,246,0.15)] px-2 py-2 text-center">
                        <p className="text-xs text-gray-400">Protein</p>
                        <p className="text-sm font-medium text-blue-500">{meal.protein}g</p>
                      </div>
                      <div className="rounded bg-[rgba(34,197,94,0.15)] px-2 py-2 text-center">
                        <p className="text-xs text-gray-400">Carbs</p>
                        <p className="text-sm font-medium text-green-500">{meal.carbs}g</p>
                      </div>
                      <div className="rounded bg-[rgba(234,179,8,0.15)] px-2 py-2 text-center">
                        <p className="text-xs text-gray-400">Fat</p>
                        <p className="text-sm font-medium text-yellow-500">{meal.fat}g</p>
                      </div>
                      <div className="rounded bg-[rgba(180,83,9,0.15)] px-2 py-2 text-center">
                        <p className="text-xs text-gray-400">Fiber</p>
                        <p className="text-sm font-medium text-orange-800">{meal.fiber || 0}g</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-[#333] pt-4 mt-4">
                      <div className="text-sm font-medium mb-3">Food Items</div>
                      <div className="space-y-3">
                        {meal.items.map(item => (
                          <div key={item.id} className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-lg">
                            <div>
                              <div className="text-sm font-medium">{item.name}</div>
                              <div className="text-xs text-gray-400 mt-1">{item.amount}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm">{item.calories} kcal</div>
                              <div className="text-xs text-gray-400 mt-1">
                                P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="bg-[rgba(30,30,30,0.7)] rounded-lg p-8 text-center">
                  <p className="text-gray-400">No meals logged for this date</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}; 