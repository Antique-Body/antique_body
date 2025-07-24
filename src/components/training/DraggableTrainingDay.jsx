import React from "react";
import { useDrag, useDrop } from "react-dnd";

import { ItemTypes } from "@/constants/trainingConstants";

export function DraggableTrainingDay({
  day,
  dayIdx,
  children,
  plan,
  setPlan,
  disabled = false,
}) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TRAINING_DAY,
    item: { index: dayIdx, day },
    canDrag: !disabled,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.TRAINING_DAY,
    canDrop: () => !disabled,
    hover(item, monitor) {
      if (!monitor.isOver({ shallow: true }) || disabled) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = dayIdx;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveTrainingDay(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const moveTrainingDay = (dragIndex, hoverIndex) => {
    const newSchedule = [...plan.schedule];
    const draggedDay = newSchedule[dragIndex];
    newSchedule.splice(dragIndex, 1);
    newSchedule.splice(hoverIndex, 0, draggedDay);
    setPlan({ ...plan, schedule: newSchedule });
  };

  return (
    <div
      ref={disabled ? null : (node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.6 : 1,
        cursor: disabled ? "default" : isDragging ? "grabbing" : "move",
        transform: isDragging ? "rotate(1deg) scale(1.01)" : "none",
      }}
      className={`relative transition-all duration-200 ${
        disabled ? "" : "group"
      }`}
    >
      {/* Left side drag indicator - only show if not disabled */}
      {!disabled && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500/0 via-blue-500/60 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r-full z-10" />
      )}

      {/* Left side drag handle - only show if not disabled */}
      {!disabled && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <div className="bg-blue-600/90 backdrop-blur-sm rounded-md p-1.5 shadow-md border border-blue-500/30">
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
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500/40 rounded-2xl pointer-events-none" />
      )}

      {children}
    </div>
  );
}
