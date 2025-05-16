import { Button } from "@/components/common/Button";
import { Icon } from "@iconify/react";

export const ExerciseList = ({ exercises, completedExercises, onViewExercise }) => (
    <>
      <h3 className="mb-3 flex items-center text-sm font-semibold text-white">
        <Icon icon="mdi:dumbbell" className="mr-2 text-[#FF6B00] text-lg" />
        Your Exercises
      </h3>
      
      <div className="space-y-3">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            onClick={() => !completedExercises[exercise.id] && onViewExercise(exercise)}
            className={`cursor-pointer rounded-lg border ${
              completedExercises[exercise.id]
                ? "border-[rgba(76,175,80,0.3)] bg-[rgba(76,175,80,0.05)]"
                : "border-[#333] bg-[rgba(30,30,30,0.3)]"
            } p-4 transition-all hover:border-[#FF6B00] hover:bg-[rgba(255,107,0,0.05)]`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {completedExercises[exercise.id] ? (
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(76,175,80,0.15)]">
                    <Icon icon="mdi:check-circle" className="text-[#4CAF50] text-lg" />
                  </div>
                ) : (
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)]">
                    <span className="text-xs font-medium text-[#FF6B00]">{exercise.sets}x</span>
                  </div>
                )}
                <div>
                  <h4 className={`font-medium ${completedExercises[exercise.id] ? 'text-gray-400' : 'text-white'}`}>{exercise.name}</h4>
                  <p className="text-sm text-gray-400">
                    {exercise.sets} sets × {exercise.reps} • {exercise.weight}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {!completedExercises[exercise.id] && (
                  <Button
                    variant="ghost"
                    size="small"
                    leftIcon={<Icon icon="mdi:play-circle" className="text-[#FF6B00]" />}
                    className="mr-1"
                  >
                    View
                  </Button>
                )}
                <Icon icon="mdi:chevron-right" className="text-gray-500" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  ); 