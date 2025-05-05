export const SessionProgress = ({ completedExercisesCount, totalExercises, waterIntake, waterGoal }) => {
  const exerciseProgress = totalExercises > 0 ? (completedExercisesCount / totalExercises) * 100 : 0;
  const waterProgress = waterGoal > 0 ? (waterIntake / waterGoal) * 100 : 0;

  return (
    <div className="mb-6 rounded-lg bg-[#1a1a1a] p-4">
      <h3 className="mb-3 text-sm font-semibold text-white">Workout Progress</h3>
      
      <div className="mb-3">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-gray-400">Exercises</span>
          <span className="text-gray-400">{completedExercisesCount}/{totalExercises}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#333]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#4CAF50] to-[#8BC34A]"
            style={{ width: `${exerciseProgress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-2">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-gray-400">Water Intake</span>
          <span className="text-gray-400">{waterIntake}/{waterGoal} ml</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#333]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2196F3] to-[#03A9F4]"
            style={{ width: `${waterProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}; 