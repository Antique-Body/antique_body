import { motion } from "framer-motion";

import { Button } from "@/components/common/Button";

const renderDayButton = (day, index, activeDay, setActiveDay) => (
  <Button
    key={day.id ?? index}
    type="button"
    onClick={() => setActiveDay(day.day || day.name)}
    className={`py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
      activeDay === (day.day || day.name)
        ? "bg-[#FF6B00] text-white"
        : "bg-[#1A1A1A] text-gray-400 hover:text-white"
    }`}
    variant="ghost"
  >
    {day.name || day.day}
  </Button>
);

export const WeeklyScheduleTab = ({
  isNutrition,
  days,
  plan,
  schedule,
  activeDay,
  setActiveDay,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Weekly Schedule</h3>
      <div className="flex space-x-2 overflow-x-auto mb-6">
        {(isNutrition
          ? days || plan.days || []
          : schedule || plan.schedule || []
        ).map((day, index) =>
          renderDayButton(day, index, activeDay, setActiveDay)
        )}
      </div>
      <div>
        {(() => {
          const dayList = isNutrition
            ? days || plan.days || []
            : schedule || plan.schedule || [];
          const currentDay = dayList.find(
            (d) => (d.day || d.name) === activeDay
          );

          if (!currentDay) {
            return (
              <div className="text-zinc-400">No details for this day.</div>
            );
          }

          // Render details for the current day
          return (
            <div className="bg-zinc-900/40 rounded-lg p-6 border border-zinc-700/40 mt-2">
              <h4 className="text-lg font-semibold text-white mb-4">
                {currentDay.name || currentDay.day}
              </h4>

              <div className="space-y-4">
                {/* Details section */}
                {currentDay.details && (
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-zinc-300 mb-2">
                      Details
                    </h5>
                    <div className="text-zinc-200 text-sm whitespace-pre-line">
                      {currentDay.details}
                    </div>
                  </div>
                )}

                {/* Description section */}
                {currentDay.description && (
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-zinc-300 mb-2">
                      Description
                    </h5>
                    <div className="text-zinc-200 text-sm whitespace-pre-line">
                      {currentDay.description}
                    </div>
                  </div>
                )}

                {/* Training duration and type */}
                {!isNutrition && (currentDay.duration || currentDay.type) && (
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-zinc-300 mb-2">
                      Training Info
                    </h5>
                    <div className="space-y-1">
                      {currentDay.duration && (
                        <div className="text-zinc-200 text-sm">
                          Duration: {currentDay.duration} minutes
                        </div>
                      )}
                      {currentDay.type && (
                        <div className="text-zinc-200 text-sm">
                          Type: {currentDay.type}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Rest Day indicator for nutrition */}
                {isNutrition && currentDay.isRestDay && (
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-zinc-300 mb-2">
                      Rest Day
                    </h5>
                    <div className="text-zinc-200 text-sm">
                      This is a rest day.
                    </div>
                  </div>
                )}

                {/* Exercises section */}
                {currentDay.exercises && currentDay.exercises.length > 0 && (
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-zinc-300 mb-3">
                      Exercises
                    </h5>
                    <div className="space-y-3">
                      {currentDay.exercises.map((exercise, index) => (
                        <div
                          key={index}
                          className="bg-zinc-700/30 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-white font-medium">
                              {exercise.name || exercise.exercise}
                            </div>
                            {exercise.type && (
                              <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                                {exercise.type}
                              </span>
                            )}
                          </div>
                          
                          {/* Enhanced exercise metrics */}
                          <div className="grid grid-cols-3 gap-3 mt-3">
                            {/* Sets display */}
                            {exercise.sets && (
                              <div className="bg-zinc-600/30 rounded-lg p-2 text-center">
                                <div className="text-zinc-400 text-xs uppercase tracking-wide mb-1">Sets</div>
                                <div className="text-white font-semibold">
                                  {typeof exercise.sets === "number"
                                    ? exercise.sets
                                    : Array.isArray(exercise.sets)
                                    ? exercise.sets.length
                                    : 0}
                                </div>
                              </div>
                            )}
                            
                            {/* Reps display */}
                            {exercise.reps && (
                              <div className="bg-zinc-600/30 rounded-lg p-2 text-center">
                                <div className="text-zinc-400 text-xs uppercase tracking-wide mb-1">
                                  {exercise.repsUnit === "seconds" ? "Seconds" : "Reps"}
                                </div>
                                <div className="text-white font-semibold">{exercise.reps}</div>
                              </div>
                            )}
                            
                            {/* Rest display */}
                            {exercise.rest && (
                              <div className="bg-zinc-600/30 rounded-lg p-2 text-center">
                                <div className="text-zinc-400 text-xs uppercase tracking-wide mb-1">Rest</div>
                                <div className="text-white font-semibold">{exercise.rest}s</div>
                              </div>
                            )}
                          </div>

                          {/* Weight progression display */}
                          {Array.isArray(exercise.sets) && exercise.sets.some(set => set.weight) && (
                            <div className="mt-3 bg-orange-600/10 border border-orange-500/30 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span className="text-orange-300 text-sm font-medium">Weight Progression</span>
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                {exercise.sets.map((set, setIndex) => (
                                  set.weight && (
                                    <div key={setIndex} className="text-center">
                                      <div className="text-xs text-zinc-400 mb-1">Set {set.setNumber || setIndex + 1}</div>
                                      <div className="text-white font-bold text-sm bg-zinc-700/50 rounded py-1">
                                        {set.weight}kg
                                      </div>
                                    </div>
                                  )
                                ))}
                              </div>
                              {/* Total weight calculation */}
                              {(() => {
                                const totalWeight = exercise.sets.reduce((sum, set) => {
                                  const weight = Number(set.weight) || 0;
                                  const reps = Number(set.reps) || Number(exercise.reps) || 0;
                                  return sum + (weight * reps);
                                }, 0);
                                
                                if (totalWeight > 0) {
                                  return (
                                    <div className="mt-2 pt-2 border-t border-orange-500/20">
                                      <div className="text-center">
                                        <span className="text-orange-300 text-xs">Total Volume: </span>
                                        <span className="text-white font-bold">{totalWeight}kg</span>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })()}
                            </div>
                          )}

                          {/* Duration for cardio exercises */}
                          {exercise.duration && (
                            <div className="mt-2 bg-green-600/10 border border-green-500/30 rounded-lg p-2">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-green-300 text-sm">Duration: {exercise.duration}</span>
                              </div>
                            </div>
                          )}

                          {/* Legacy weight display for non-array sets */}
                          {exercise.weight && !Array.isArray(exercise.sets) && (
                            <div className="mt-2 bg-orange-600/10 border border-orange-500/30 rounded-lg p-2">
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span className="text-orange-300 text-sm">Weight: {exercise.weight}</span>
                              </div>
                            </div>
                          )}
                          {exercise.instructions && (
                            <div className="text-zinc-400 text-sm mt-2">
                              <strong>Instructions:</strong>{" "}
                              {exercise.instructions}
                            </div>
                          )}
                          {exercise.muscleGroups &&
                            exercise.muscleGroups.length > 0 && (
                              <div className="text-zinc-400 text-sm mt-1">
                                <strong>Muscle Groups:</strong>{" "}
                                {exercise.muscleGroups
                                  .map((mg) => mg.name || mg)
                                  .join(", ")}
                              </div>
                            )}
                          {exercise.notes && (
                            <div className="text-zinc-400 text-sm mt-2 italic">
                              {exercise.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Meals section for nutrition */}
                {currentDay.meals && currentDay.meals.length > 0 && (
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-zinc-300 mb-3">
                      Meals
                    </h5>
                    <div className="space-y-3">
                      {currentDay.meals.map((meal, index) => (
                        <div
                          key={index}
                          className="bg-zinc-700/30 rounded-lg p-3"
                        >
                          <div className="text-white font-medium">
                            {meal.name || meal.meal}
                          </div>
                          {meal.time && (
                            <div className="text-zinc-300 text-sm mt-1">
                              Time: {meal.time}
                            </div>
                          )}

                          {/* Handle meal options if they exist */}
                          {meal.options && meal.options.length > 0 ? (
                            <div className="mt-3 space-y-2">
                              <div className="text-zinc-300 text-sm font-medium">
                                Options:
                              </div>
                              {meal.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className="bg-zinc-600/30 rounded-lg p-3 ml-2"
                                >
                                  <div className="text-white font-medium text-sm">
                                    {option.name}
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 mt-2">
                                    {option.calories && (
                                      <div className="text-zinc-300 text-xs">
                                        Calories: {option.calories}
                                      </div>
                                    )}
                                    {option.protein && (
                                      <div className="text-zinc-300 text-xs">
                                        Protein: {option.protein}g
                                      </div>
                                    )}
                                    {option.carbs && (
                                      <div className="text-zinc-300 text-xs">
                                        Carbs: {option.carbs}g
                                      </div>
                                    )}
                                    {option.fat && (
                                      <div className="text-zinc-300 text-xs">
                                        Fat: {option.fat}g
                                      </div>
                                    )}
                                  </div>
                                  {option.description && (
                                    <div className="text-zinc-400 text-xs mt-2">
                                      {option.description}
                                    </div>
                                  )}
                                  {option.ingredients &&
                                    option.ingredients.length > 0 && (
                                      <div className="text-zinc-400 text-xs mt-1">
                                        <strong>Ingredients:</strong>{" "}
                                        {option.ingredients.join(", ")}
                                      </div>
                                    )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            // Handle direct meal properties (fallback for old format)
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {meal.calories && (
                                <div className="text-zinc-300 text-sm">
                                  Calories: {meal.calories}
                                </div>
                              )}
                              {meal.protein && (
                                <div className="text-zinc-300 text-sm">
                                  Protein: {meal.protein}g
                                </div>
                              )}
                              {meal.carbs && (
                                <div className="text-zinc-300 text-sm">
                                  Carbs: {meal.carbs}g
                                </div>
                              )}
                              {meal.fat && (
                                <div className="text-zinc-300 text-sm">
                                  Fat: {meal.fat}g
                                </div>
                              )}
                            </div>
                          )}

                          {meal.description && (
                            <div className="text-zinc-400 text-sm mt-2">
                              {meal.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generic data mapping for any other properties */}
                {Object.entries(currentDay).map(([key, value]) => {
                  // Skip already handled properties
                  if (
                    [
                      "name",
                      "day",
                      "details",
                      "description",
                      "exercises",
                      "meals",
                      "id",
                      "duration",
                      "type",
                      "isRestDay",
                    ].includes(key)
                  ) {
                    return null;
                  }

                  // Skip null, undefined, or empty values
                  if (!value || (Array.isArray(value) && value.length === 0)) {
                    return null;
                  }

                  return (
                    <div key={key} className="bg-zinc-800/50 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-zinc-300 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </h5>
                      <div className="text-zinc-200 text-sm">
                        {Array.isArray(value) ? (
                          <ul className="space-y-1">
                            {value.map((item, index) => (
                              <li key={index} className="text-zinc-300">
                                •{" "}
                                {typeof item === "object"
                                  ? JSON.stringify(item, null, 2)
                                  : item}
                              </li>
                            ))}
                          </ul>
                        ) : typeof value === "object" ? (
                          <pre className="text-zinc-300 text-xs bg-zinc-700/30 p-2 rounded overflow-x-auto">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        ) : (
                          <div className="text-zinc-300">{value}</div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Fallback if no data is available */}
                {!currentDay.details &&
                  !currentDay.description &&
                  (!currentDay.exercises ||
                    currentDay.exercises.length === 0) &&
                  (!currentDay.meals || currentDay.meals.length === 0) &&
                  Object.keys(currentDay).filter(
                    (key) =>
                      ![
                        "name",
                        "day",
                        "id",
                        "duration",
                        "type",
                        "isRestDay",
                      ].includes(key)
                  ).length === 0 && (
                    <div className="text-zinc-400 text-center py-8">
                      No additional details available for this day.
                    </div>
                  )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  </motion.div>
);
