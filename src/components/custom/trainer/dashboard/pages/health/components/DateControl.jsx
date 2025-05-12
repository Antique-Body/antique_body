import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import React, { useState } from "react";

export const DateControl = ({
    selectedDate = new Date(),
    onDateChange,
    rangeOptions = ["day", "week", "month", "year"],
    activeRange = "day",
    className = "",
}) => {
    const [currentRange, setCurrentRange] = useState(activeRange);

    const formatDate = (date) => {
        if (typeof date === "string") {
            date = new Date(date);
        }

        return new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date);
    };

    const handleRangeChange = (range) => {
        setCurrentRange(range);
        if (onDateChange) {
            // Adjust the date range based on selection
            const now = new Date();
            switch (range) {
                case "day":
                    onDateChange(now, "day");
                    break;
                case "week":
                    const weekStart = new Date(now);
                    weekStart.setDate(now.getDate() - now.getDay());
                    onDateChange(weekStart, "week");
                    break;
                case "month":
                    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                    onDateChange(monthStart, "month");
                    break;
                case "year":
                    const yearStart = new Date(now.getFullYear(), 0, 1);
                    onDateChange(yearStart, "year");
                    break;
                default:
                    onDateChange(now, "day");
            }
        }
    };

    const handlePrevDate = () => {
        if (!onDateChange) return;

        const newDate = new Date(selectedDate);
        switch (currentRange) {
            case "day":
                newDate.setDate(newDate.getDate() - 1);
                break;
            case "week":
                newDate.setDate(newDate.getDate() - 7);
                break;
            case "month":
                newDate.setMonth(newDate.getMonth() - 1);
                break;
            case "year":
                newDate.setFullYear(newDate.getFullYear() - 1);
                break;
            default:
                newDate.setDate(newDate.getDate() - 1);
        }
        onDateChange(newDate, currentRange);
    };

    const handleNextDate = () => {
        if (!onDateChange) return;

        const newDate = new Date(selectedDate);
        switch (currentRange) {
            case "day":
                newDate.setDate(newDate.getDate() + 1);
                break;
            case "week":
                newDate.setDate(newDate.getDate() + 7);
                break;
            case "month":
                newDate.setMonth(newDate.getMonth() + 1);
                break;
            case "year":
                newDate.setFullYear(newDate.getFullYear() + 1);
                break;
            default:
                newDate.setDate(newDate.getDate() + 1);
        }
        onDateChange(newDate, currentRange);
    };

    const getDisplayDateRange = () => {
        const formattedDate = typeof selectedDate === "string" ? new Date(selectedDate) : selectedDate;

        switch (currentRange) {
            case "day":
                return new Intl.DateTimeFormat("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }).format(formattedDate);
            case "week": {
                const weekStart = new Date(formattedDate);
                const weekEnd = new Date(formattedDate);
                weekEnd.setDate(weekStart.getDate() + 6);
                return `${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(weekStart)} - ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(weekEnd)}`;
            }
            case "month":
                return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(formattedDate);
            case "year":
                return new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(formattedDate);
            default:
                return formatDate(formattedDate);
        }
    };

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="flex items-center justify-between mb-5">
                <motion.button
                    onClick={handlePrevDate}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-900/80 text-white hover:bg-gray-800 transition-colors shadow-md backdrop-blur-sm"
                    whileHover={{ scale: 1.1, x: -2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Icon icon="heroicons:chevron-left" width="18" height="18" />
                </motion.button>

                <motion.div
                    className="flex items-center bg-gray-900/80 px-5 py-3 rounded-2xl shadow-md backdrop-blur-sm border border-gray-800/40"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <motion.div
                        className="mr-3 text-xl text-blue-400"
                        animate={{
                            rotate: [0, 10, 0, -10, 0],
                        }}
                        transition={{
                            duration: 0.5,
                            repeatDelay: 5,
                            repeat: Infinity,
                        }}
                    >
                        <Icon icon="heroicons:calendar" />
                    </motion.div>
                    <div>
                        <motion.div
                            className="text-lg font-semibold text-white"
                            key={getDisplayDateRange()} // Key helps re-trigger animation when date changes
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {getDisplayDateRange()}
                        </motion.div>
                        <div className="text-xs text-gray-400 mt-0.5">
                            {currentRange.charAt(0).toUpperCase() + currentRange.slice(1)} View
                        </div>
                    </div>
                </motion.div>

                <motion.button
                    onClick={handleNextDate}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-900/80 text-white hover:bg-gray-800 transition-colors shadow-md backdrop-blur-sm"
                    whileHover={{ scale: 1.1, x: 2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Icon icon="heroicons:chevron-right" width="18" height="18" />
                </motion.button>
            </div>

            <motion.div
                className="flex bg-gray-900/80 p-1 rounded-full self-center shadow-md backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                {rangeOptions.map((range) => (
                    <motion.button
                        key={range}
                        onClick={() => handleRangeChange(range)}
                        className={`px-5 py-2 rounded-full text-sm transition-colors ${
                            currentRange === range
                                ? "bg-blue-500 text-white font-medium shadow-md"
                                : "text-gray-400 hover:text-white hover:bg-gray-800"
                        }`}
                        whileHover={{ scale: currentRange !== range ? 1.05 : 1 }}
                        whileTap={{ scale: 0.95 }}
                        initial={currentRange === range ? { scale: 0.9 } : { scale: 1 }}
                        animate={currentRange === range ? { scale: 1 } : { scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 17 }}
                    >
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
};

export const WeekdayControl = ({ selectedDay = new Date(), onSelectDay, className = "" }) => {
    // Get dates for last 3 days, today, and next 3 days
    const getWeekDays = () => {
        const today = new Date();
        const days = [];

        // Get last 3 days
        for (let i = 3; i > 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            days.push(date);
        }

        // Add today
        days.push(new Date(today));

        // Get next 3 days
        for (let i = 1; i <= 3; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push(date);
        }

        return days;
    };

    const weekDays = getWeekDays();

    const isSelected = (date) => {
        const selectedDate = typeof selectedDay === "string" ? new Date(selectedDay) : selectedDay;
        return date.toDateString() === selectedDate.toDateString();
    };

    const isToday = (date) => date.toDateString() === new Date().toDateString();

    const getDayLabel = (date) => {
        const today = new Date();
        const diff = Math.floor((date - today) / (1000 * 60 * 60 * 24));

        if (diff === 0) return "Today";
        if (diff === -1) return "Yesterday";
        if (diff === 1) return "Tomorrow";
        if (diff < 0) return `${Math.abs(diff)} days ago`;
        if (diff > 0) return `In ${diff} days`;
        return "";
    };

    return (
        <motion.div
            className={`grid grid-cols-7 gap-2 mt-6 ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            {weekDays.map((date, index) => {
                const dayName = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
                const dayNum = date.getDate();
                const selected = isSelected(date);
                const today = isToday(date);
                const dayLabel = getDayLabel(date);

                return (
                    <motion.button
                        key={index}
                        onClick={() => onSelectDay(date)}
                        className={`flex flex-col items-center justify-center rounded-xl py-3 transition-colors ${
                            selected
                                ? "bg-blue-500 text-white shadow-md"
                                : today
                                  ? "bg-gray-900/80 border border-blue-500/30 backdrop-blur-sm"
                                  : "bg-gray-900/80 hover:bg-gray-800 backdrop-blur-sm"
                        }`}
                        whileHover={{ y: -5, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={selected ? { scale: 0.9 } : { scale: 1 }}
                        animate={selected ? { scale: 1 } : { scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 17 }}
                    >
                        <span className={`text-xs mb-1 ${selected ? "text-white" : "text-gray-400"}`}>{dayName}</span>
                        <motion.span
                            className={`text-xl ${selected ? "font-bold" : today ? "font-semibold" : "font-medium"}`}
                            animate={
                                today && !selected
                                    ? {
                                          scale: [1, 1.15, 1],
                                          transition: {
                                              repeat: Infinity,
                                              repeatDelay: 5,
                                              duration: 1,
                                          },
                                      }
                                    : {}
                            }
                        >
                            {dayNum}
                        </motion.span>
                        <span className={`text-xs mt-1 ${selected ? "text-white/80" : "text-gray-500"}`}>{dayLabel}</span>
                        {selected && (
                            <motion.div
                                className="w-1 h-1 rounded-full bg-white mt-1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                            />
                        )}
                    </motion.button>
                );
            })}
        </motion.div>
    );
};
