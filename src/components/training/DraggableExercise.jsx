import React from "react";
import { useDrag, useDrop } from "react-dnd";

import { ItemTypes } from "@/constants/trainingConstants";

export function DraggableExercise({
  exercise,
  exerciseIdx,
  dayIdx,
  children,
  plan,
  setPlan,
  disabled = false,
}) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.EXERCISE,
    item: { exerciseIdx, dayIdx, exercise },
    canDrag: !disabled,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.EXERCISE,
    canDrop: () => !disabled,
    hover(item, monitor) {
      if (!monitor.isOver({ shallow: true }) || disabled) {
        return;
      }
      const dragExerciseIdx = item.exerciseIdx;
      const dragDayIdx = item.dayIdx;
      const hoverExerciseIdx = exerciseIdx;
      const hoverDayIdx = dayIdx;

      if (dragExerciseIdx === hoverExerciseIdx && dragDayIdx === hoverDayIdx) {
        return;
      }
      moveExercise(dragDayIdx, dragExerciseIdx, hoverDayIdx, hoverExerciseIdx);
      item.exerciseIdx = hoverExerciseIdx;
      item.dayIdx = hoverDayIdx;
    },
  });

  const moveExercise = (
    fromDayIdx,
    fromExerciseIdx,
    toDayIdx,
    toExerciseIdx
  ) => {
    const newSchedule = [...plan.schedule];

    if (fromDayIdx === toDayIdx) {
      // Moving within the same day
      const day = { ...newSchedule[fromDayIdx] };
      const exercises = [...day.exercises];
      const draggedExercise = exercises[fromExerciseIdx];

      // Remove from original position
      exercises.splice(fromExerciseIdx, 1);

      // Adjust target index if moving within same array
      const adjustedToIndex =
        fromExerciseIdx < toExerciseIdx ? toExerciseIdx - 1 : toExerciseIdx;

      // Insert at new position
      exercises.splice(adjustedToIndex, 0, draggedExercise);

      newSchedule[fromDayIdx] = { ...day, exercises };
    } else {
      // Moving between different days
      const fromDay = { ...newSchedule[fromDayIdx] };
      const toDay = { ...newSchedule[toDayIdx] };

      const draggedExercise = fromDay.exercises[fromExerciseIdx];

      // Remove from source day
      fromDay.exercises = [...fromDay.exercises];
      fromDay.exercises.splice(fromExerciseIdx, 1);

      // Add to target day
      toDay.exercises = [...toDay.exercises];
      toDay.exercises.splice(toExerciseIdx, 0, draggedExercise);

      newSchedule[fromDayIdx] = fromDay;
      newSchedule[toDayIdx] = toDay;
    }

    setPlan({ ...plan, schedule: newSchedule });
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.6 : 1,
        cursor: isDragging ? "grabbing" : "move",
        transform: isDragging ? "rotate(2deg) scale(1.02)" : "none",
      }}
      className="relative group transition-all duration-200"
    >
      {/* Left side drag indicator - only show if not disabled */}
      {!disabled && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500/0 via-green-500/60 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-full z-10" />
      )}

      {/* Left side drag handle - only show if not disabled */}
      {!disabled && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <div className="bg-green-600/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-green-500/30">
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drag overlay effect */}
      {isDragging && (
        <div className="absolute inset-0 bg-green-500/10 border-2 border-green-500/40 rounded-xl pointer-events-none" />
      )}

      {children}
    </div>
  );
}
