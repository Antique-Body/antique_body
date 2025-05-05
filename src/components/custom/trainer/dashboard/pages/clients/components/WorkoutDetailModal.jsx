import { Modal } from "@/components/common";

export const WorkoutDetailModal = ({ isOpen, onClose, workout }) => {
  if (!workout) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={workout?.details?.planned || workout?.name || "Workout Details"}
      size="large"
      footerButtons={false}
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-400">Completed on {workout.date}</div>
          <div className={`rounded-full px-2 py-1 text-xs font-medium ${
            workout.status === "completed" 
              ? "bg-green-900/40 text-green-400" 
              : workout.status === "upcoming"
              ? "bg-blue-900/40 text-blue-400"
              : "bg-yellow-900/40 text-yellow-400"
          }`}>
            {workout.status === "completed" ? "Completed" : 
             workout.status === "upcoming" ? "Upcoming" : "Partial"}
          </div>
        </div>

        {workout.details?.note && (
          <div className="mb-5 rounded-md bg-[#FF6B00]/10 p-3 text-sm">
            <span className="font-medium text-[#FF6B00]">Note: </span>
            <span className="text-gray-300">{workout.details.note}</span>
          </div>
        )}

        <div className="mb-5">
          <div className="mb-2 text-sm font-medium text-white">Workout Plan</div>
          
          <div className="overflow-hidden rounded-md border border-[#333]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#333] bg-[rgba(30,30,30,0.6)]">
                  <th className="p-3 text-sm font-medium text-gray-300">Exercise</th>
                  <th className="p-3 text-sm font-medium text-gray-300">Sets × Reps</th>
                  <th className="p-3 text-sm font-medium text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {workout.details?.exercises?.map((exercise, idx) => (
                  <tr key={idx} className={`border-b border-[#333] last:border-0 ${idx % 2 === 0 ? "bg-[rgba(20,20,20,0.3)]" : ""}`}>
                    <td className="p-3 font-medium text-white">{exercise.name}</td>
                    <td className="p-3 text-gray-400">{exercise.planned}</td>
                    <td className="p-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                        workout.status === "upcoming"
                          ? "bg-blue-900/40 text-blue-400"
                          : exercise.completed 
                            ? "bg-green-900/40 text-green-400" 
                            : "bg-red-900/40 text-red-400"
                      }`}>
                        {workout.status === "upcoming" 
                          ? "Planned" 
                          : exercise.completed ? "Completed" : "Skipped"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-md bg-[rgba(30,30,30,0.6)] p-3 text-center">
            <div className="text-sm text-gray-400">Water Goal</div>
            <div className="mt-1 font-medium text-white">{workout.details?.waterGoal || 0} ml</div>
          </div>
          <div className="rounded-md bg-[rgba(30,30,30,0.6)] p-3 text-center">
            <div className="text-sm text-gray-400">Completion</div>
            <div className="mt-1 font-medium text-white">
              {workout.status === "upcoming" 
                ? "Not started"
                : workout.details?.exercises 
                  ? `${workout.details.exercises.filter(ex => ex.completed).length}/${workout.details.exercises.length} exercises` 
                  : workout.stats?.exercises || "N/A"}
            </div>
          </div>
          <div className="rounded-md bg-[rgba(30,30,30,0.6)] p-3 text-center">
            <div className="text-sm text-gray-400">Water Consumed</div>
            <div className="mt-1 font-medium text-white">
              {workout.status === "upcoming" 
                ? "0 ml"
                : workout.details?.waterConsumed !== undefined 
                ? (
                    <>
                      {workout.details.waterConsumed} ml
                      <span className="ml-1 text-xs text-gray-500">
                        ({Math.round((workout.details.waterConsumed / (workout.details.waterGoal || 1)) * 100)}%)
                      </span>
                    </>
                  ) 
                : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}; 