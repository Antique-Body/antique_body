"use client";

import { Icon } from "@iconify/react";
import { useRef, useEffect, useState } from "react";

export const DayNavigation = ({
  days,
  selectedDay,
  currentDay,
  onSelectDay,
  dailyLogs,
}) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const getDayStatus = (dayNumber) => {
    if (dayNumber < currentDay) return "past";
    if (dayNumber === currentDay) return "current";
    return "future";
  };

  const getDayCompletion = (dayNumber) => {
    const dayLog = dailyLogs?.find((log) => log.dayNumber === dayNumber);
    if (!dayLog) return 0;

    if (dayLog.totalMeals === 0) return 0;
    return (dayLog.completedMeals / dayLog.totalMeals) * 100;
  };

  const getStatusIcon = (dayNumber) => {
    const status = getDayStatus(dayNumber);
    const completion = getDayCompletion(dayNumber);

    if (status === "past" && completion === 100) {
      return "mdi:check-circle";
    } else if (status === "current") {
      return "mdi:play-circle";
    } else if (status === "past" && completion > 0) {
      return "mdi:clock-alert";
    } else if (status === "future") {
      return "mdi:lock";
    }
    return "mdi:circle-outline";
  };

  const getStatusColor = (dayNumber) => {
    const status = getDayStatus(dayNumber);
    const completion = getDayCompletion(dayNumber);

    if (status === "past" && completion === 100) {
      return "text-green-400";
    } else if (status === "current") {
      return "text-[#FF6B00]";
    } else if (status === "past" && completion > 0) {
      return "text-yellow-400";
    } else if (status === "future") {
      return "text-zinc-500";
    }
    return "text-zinc-400";
  };

  const getDayCardStyle = (dayNumber) => {
    const status = getDayStatus(dayNumber);
    const isSelected = selectedDay === dayNumber;
    const isCurrent = dayNumber === currentDay;

    let baseStyle =
      "relative p-5 rounded-xl transition-all duration-300 cursor-pointer min-w-[180px] ";

    if (isSelected) {
      baseStyle +=
        "bg-gradient-to-br from-[#FF6B00]/10 to-[#FF9A00]/8 border-2 border-[#FF6B00] shadow-xl shadow-[#FF6B00]/25 ";
    } else if (isCurrent) {
      baseStyle +=
        "bg-gradient-to-br from-[#FF6B00]/10 to-[#FF9A00]/8 border border-[#FF6B00]/70 hover:bg-gradient-to-br hover:from-[#FF6B00]/15 hover:to-[#FF9A00]/12 hover:border-[#FF6B00] hover:shadow-lg hover:shadow-[#FF6B00]/20 ";
    } else if (status === "past") {
      baseStyle +=
        "bg-zinc-800/50 border border-zinc-700/70 hover:bg-zinc-800/70 hover:border-zinc-600 ";
    } else {
      baseStyle +=
        "bg-zinc-800/30 border border-zinc-700/50 hover:bg-zinc-800/50 hover:border-zinc-600 ";
    }

    return baseStyle;
  };

  // Check scroll buttons visibility
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Scroll to current day on mount and when currentDay changes
  useEffect(() => {
    if (scrollContainerRef.current && currentDay) {
      const cardWidth = 180 + 16; // card width + gap
      const containerWidth = scrollContainerRef.current.clientWidth;
      const targetPosition =
        (currentDay - 1) * cardWidth - containerWidth / 2 + cardWidth / 2;

      scrollContainerRef.current.scrollTo({
        left: Math.max(0, targetPosition),
        behavior: "smooth",
      });
    }
  }, [currentDay]);

  // Check scroll buttons when component mounts
  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      return () => container.removeEventListener("scroll", checkScrollButtons);
    }
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Plan Days</h2>
        <div className="flex items-center gap-6 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-400" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:play-circle" className="w-4 h-4 text-[#FF6B00]" />
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:lock" className="w-4 h-4 text-zinc-500" />
            <span>Upcoming</span>
          </div>
        </div>
      </div>

      {/* Days Horizontal Scroll */}
      <div className="relative">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Icon icon="mdi:chevron-left" className="w-5 h-5" />
          </button>
        )}

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Icon icon="mdi:chevron-right" className="w-5 h-5" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-6 px-2 py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={checkScrollButtons}
        >
          {days?.map((day, index) => {
            const dayNumber = index + 1;
            const status = getDayStatus(dayNumber);
            const completion = getDayCompletion(dayNumber);
            const isSelected = selectedDay === dayNumber;
            const isCurrent = dayNumber === currentDay;

            return (
              <div
                key={dayNumber}
                className={getDayCardStyle(dayNumber)}
                onClick={() => onSelectDay(dayNumber)}
              >
                {/* Progress Ring - Fixed positioning */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="relative w-9 h-9">
                    <svg
                      className="w-9 h-9 transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className={
                          isSelected ? "text-[#FF6B00]/30" : "text-zinc-700"
                        }
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 16}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 16 * (1 - completion / 100)
                        }`}
                        className={
                          completion === 100
                            ? "text-green-400"
                            : isSelected
                            ? "text-[#FF6B00]"
                            : "text-[#FF6B00]/80"
                        }
                        style={{
                          transition: "stroke-dashoffset 0.5s ease-in-out",
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon
                        icon={getStatusIcon(dayNumber)}
                        className={`w-5 h-5 ${
                          isSelected
                            ? completion === 100
                              ? "text-green-400"
                              : "text-[#FF6B00]"
                            : getStatusColor(dayNumber)
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Day Content */}
                <div className="space-y-3 pr-10">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-lg font-bold ${
                        isSelected ? "text-[#FF6B00]" : "text-white"
                      }`}
                    >
                      Day {dayNumber}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-zinc-300">
                      {day.name || `Day ${dayNumber}`}
                    </p>

                    {day.isRestDay ? (
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="mdi:spa"
                          className="w-4 h-4 text-green-400/80"
                        />
                        <span className="text-sm font-medium text-green-400/80">
                          Rest Day
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="mdi:silverware-fork-knife"
                          className="w-4 h-4 text-zinc-400"
                        />
                        <span className="text-sm text-zinc-400">
                          {day.meals?.length || 0} meals
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Completion Status */}
                  {status !== "future" && !day.isRestDay && (
                    <div className="flex items-center justify-between text-sm pt-3 border-t border-zinc-700/50">
                      <span className="font-medium text-zinc-500 mr-2">
                        Progress
                      </span>
                      <span
                        className={`font-semibold ${
                          completion === 100
                            ? "text-green-400"
                            : isSelected
                            ? "text-[#FF6B00]"
                            : "text-[#FF6B00]/80"
                        }`}
                      >
                        {Math.round(completion)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Current Day Indicator */}
                {isCurrent && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF6B00] rounded-full animate-pulse shadow-lg shadow-[#FF6B00]/50 z-10"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="text-center">
        <p className="text-xs text-zinc-500 flex items-center justify-center gap-2">
          <Icon icon="mdi:gesture-swipe-horizontal" className="w-4 h-4" />
          Scroll horizontally or use arrow buttons to navigate days
        </p>
      </div>
    </div>
  );
};
