import { Button } from "@/components/common/Button";
import { CheckIcon, CloseIcon } from "@/components/common/Icons";

export const ExerciseDetail = ({ exercise, isCompleted, onMarkComplete, onClose }) => {
  return (
    <div className="rounded-lg border border-[#333] bg-[rgba(20,20,20,0.3)] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{exercise.name}</h3>
        <Button 
          variant="ghost" 
          onClick={onClose}
          leftIcon={<CloseIcon size={16} />}
        >
          Back
        </Button>
      </div>
      
      {/* Video Player */}
      <div className="mb-4 aspect-video overflow-hidden rounded-lg">
        <iframe
          className="h-full w-full"
          src={exercise.videoUrl}
          title={exercise.name}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      {/* Exercise Details */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg bg-[rgba(40,40,40,0.5)] p-3 text-center">
          <p className="text-xs text-gray-400">Sets</p>
          <p className="text-lg font-bold text-white">{exercise.sets}</p>
        </div>
        <div className="rounded-lg bg-[rgba(40,40,40,0.5)] p-3 text-center">
          <p className="text-xs text-gray-400">Reps</p>
          <p className="text-lg font-bold text-white">{exercise.reps}</p>
        </div>
        <div className="rounded-lg bg-[rgba(40,40,40,0.5)] p-3 text-center">
          <p className="text-xs text-gray-400">Weight</p>
          <p className="text-lg font-bold text-white">{exercise.weight}</p>
        </div>
        <div className="rounded-lg bg-[rgba(40,40,40,0.5)] p-3 text-center">
          <p className="text-xs text-gray-400">Rest</p>
          <p className="text-lg font-bold text-white">{exercise.rest}</p>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="mb-6 rounded-lg bg-[rgba(30,30,30,0.5)] p-3">
        <p className="text-xs font-medium text-gray-400">Instructions</p>
        <p className="mt-1 text-sm text-gray-300">{exercise.instructions}</p>
      </div>
      
      {/* Complete Button */}
      <Button
        variant={isCompleted ? "ghost" : "orangeFilled"}
        onClick={onMarkComplete}
        fullWidth
        leftIcon={isCompleted ? <CheckIcon size={16} /> : null}
        disabled={isCompleted}
      >
        {isCompleted ? "Completed" : "Mark as Complete"}
      </Button>
    </div>
  );
}; 