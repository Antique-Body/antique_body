"use client";
import { Icon } from "@iconify/react";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DatePicker = ({
  value,
  onChange,
  name,
  min,
  max,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateValue, setDateValue] = useState(value ? new Date(value) : null);
  const [month, setMonth] = useState(
    dateValue ? dateValue.getMonth() : new Date().getMonth()
  );
  const [year, setYear] = useState(
    dateValue ? dateValue.getFullYear() : new Date().getFullYear()
  );
  const [calendarPos, setCalendarPos] = useState({ top: 0, left: 0, width: 0 });
  const [viewMode, setViewMode] = useState("days"); // 'days', 'months', 'years'
  const [yearRange, setYearRange] = useState([]);
  const containerRef = useRef(null);

  // Generate year range on mount and when needed
  useEffect(() => {
    generateYearRange(year);
  }, [year]);

  // Generate a range of years centered around the current year
  const generateYearRange = (centerYear) => {
    const startYear = centerYear - 10;
    const range = Array.from({ length: 21 }, (_, i) => startYear + i);
    setYearRange(range);
  };

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setDateValue(date);
      setMonth(date.getMonth());
      setYear(date.getFullYear());
    } else {
      setDateValue(null);
    }
  }, [value]);

  // Calculate calendar position
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCalendarPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !event.target.closest(".date-picker-calendar")
      ) {
        setIsOpen(false);
        setViewMode("days");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get days in month
  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();

  // Get first day of month (0-6, where 0 is Sunday)
  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert to Monday-based (0-6, where 0 is Monday)
  };

  const handleDateClick = (day) => {
    const newDate = new Date(year, month, day);

    // Check if the date is within min/max range
    if (min && new Date(min) > newDate) return;
    if (max && new Date(max) < newDate) return;

    setDateValue(newDate);
    setIsOpen(false);
    setViewMode("days");

    if (onChange) {
      // Format date as YYYY-MM-DD for form value
      const formattedDate = newDate.toISOString().split("T")[0];
      onChange({ target: { name, value: formattedDate } });
    }
  };

  const handleMonthClick = (monthIndex) => {
    setMonth(monthIndex);
    setViewMode("days");
  };

  const handleYearClick = (selectedYear) => {
    setYear(selectedYear);
    setViewMode("months");
  };

  const handlePrevPage = () => {
    if (viewMode === "days") {
      // Previous month
      if (month === 0) {
        setMonth(11);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    } else if (viewMode === "months") {
      // Previous year
      setYear(year - 1);
    } else if (viewMode === "years") {
      // Previous year range
      const newStartYear = yearRange[0] - 21;
      generateYearRange(newStartYear + 10);
    }
  };

  const handleNextPage = () => {
    if (viewMode === "days") {
      // Next month
      if (month === 11) {
        setMonth(0);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    } else if (viewMode === "months") {
      // Next year
      setYear(year + 1);
    } else if (viewMode === "years") {
      // Next year range
      const newStartYear = yearRange[yearRange.length - 1] + 1;
      generateYearRange(newStartYear);
    }
  };

  // Quick jump to a decade
  const jumpToDecade = (decade) => {
    generateYearRange(decade);
    setViewMode("years");
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected =
        dateValue &&
        date.getDate() === dateValue.getDate() &&
        date.getMonth() === dateValue.getMonth() &&
        date.getFullYear() === dateValue.getFullYear();

      const isToday =
        date.getDate() === new Date().getDate() &&
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear();

      const isDisabled =
        (min && new Date(min) > date) || (max && new Date(max) < date);

      days.push(
        <div
          key={day}
          className={`h-8 w-8 flex items-center justify-center rounded-full text-sm cursor-pointer transition-all
            ${isSelected ? "bg-[#FF6B00] text-white" : ""}
            ${
              isToday && !isSelected
                ? "border border-[#FF6B00] text-[#FF6B00]"
                : ""
            }
            ${
              isDisabled
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-[#FF6B00]/20"
            }
          `}
          onClick={() => !isDisabled && handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const renderMonths = () =>
    MONTHS.map((monthName, index) => {
      const isSelected =
        dateValue &&
        dateValue.getMonth() === index &&
        dateValue.getFullYear() === year;

      // Check if this month has any selectable dates (for min/max)
      const isDisabled =
        (min &&
          new Date(year, index, getDaysInMonth(index, year)) < new Date(min)) ||
        (max && new Date(year, index, 1) > new Date(max));

      return (
        <div
          key={monthName}
          className={`h-16 flex items-center justify-center rounded-lg text-sm cursor-pointer transition-all
            ${isSelected ? "bg-[#FF6B00] text-white" : ""}
            ${
              isDisabled
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-[#FF6B00]/20"
            }
          `}
          onClick={() => !isDisabled && handleMonthClick(index)}
        >
          {monthName}
        </div>
      );
    });

  const renderYears = () =>
    yearRange.map((yearNum) => {
      const isSelected = dateValue && dateValue.getFullYear() === yearNum;

      // Check if this year has any selectable dates (for min/max)
      const isDisabled =
        (min && new Date(yearNum, 11, 31) < new Date(min)) ||
        (max && new Date(yearNum, 0, 1) > new Date(max));

      return (
        <div
          key={yearNum}
          className={`h-12 flex items-center justify-center rounded-lg text-sm cursor-pointer transition-all
            ${isSelected ? "bg-[#FF6B00] text-white" : ""}
            ${
              isDisabled
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-[#FF6B00]/20"
            }
          `}
          onClick={() => !isDisabled && handleYearClick(yearNum)}
        >
          {yearNum}
        </div>
      );
    });

  // Quick decade selector buttons
  const renderQuickDecades = () => {
    const currentYear = new Date().getFullYear();
    const decades = [
      { label: "1950s", year: 1950 },
      { label: "1960s", year: 1960 },
      { label: "1970s", year: 1970 },
      { label: "1980s", year: 1980 },
      { label: "1990s", year: 1990 },
      { label: "2000s", year: 2000 },
      { label: "2010s", year: 2010 },
      { label: "Current", year: Math.floor(currentYear / 10) * 10 },
    ];

    return (
      <div className="flex flex-wrap gap-2 p-2 border-t border-[#333]">
        {decades.map((decade) => (
          <button
            key={decade.label}
            onClick={() => jumpToDecade(decade.year)}
            className="px-3 py-1 text-xs text-white bg-[#333] hover:bg-[#444] rounded transition-colors"
          >
            {decade.label}
          </button>
        ))}
      </div>
    );
  };

  // Format date for display
  const formatDisplayDate = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Render calendar portal
  const renderCalendar = () => {
    if (!isOpen || typeof window === "undefined") return null;

    let headerContent;
    if (viewMode === "days") {
      headerContent = (
        <button
          onClick={() => setViewMode("months")}
          className="text-white font-medium hover:text-[#FF6B00] transition-colors"
        >
          {MONTHS[month]} {year}
        </button>
      );
    } else if (viewMode === "months") {
      headerContent = (
        <button
          onClick={() => setViewMode("years")}
          className="text-white font-medium hover:text-[#FF6B00] transition-colors"
        >
          {year}
        </button>
      );
    } else {
      headerContent = (
        <span className="text-white font-medium">
          {yearRange[0]} - {yearRange[yearRange.length - 1]}
        </span>
      );
    }

    return createPortal(
      <div
        className="date-picker-calendar absolute z-50 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-lg overflow-hidden"
        style={{
          top: calendarPos.top + 5,
          left: calendarPos.left,
          width: calendarPos.width,
        }}
      >
        {/* Header with month and year */}
        <div className="p-3 border-b border-[#333] flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevPage}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#333] transition-colors"
          >
            <Icon
              icon="mdi:chevron-left"
              width={20}
              height={20}
              className="text-white"
            />
          </button>

          {headerContent}

          <button
            type="button"
            onClick={handleNextPage}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#333] transition-colors"
          >
            <Icon
              icon="mdi:chevron-right"
              width={20}
              height={20}
              className="text-white"
            />
          </button>
        </div>

        {/* Calendar grid - conditional based on viewMode */}
        <div className="p-3">
          {viewMode === "days" && (
            <>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="h-8 w-8 flex items-center justify-center text-xs font-medium text-gray-400"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendarDays()}
              </div>
            </>
          )}

          {viewMode === "months" && (
            <div className="grid grid-cols-3 gap-2">{renderMonths()}</div>
          )}

          {viewMode === "years" && (
            <div className="grid grid-cols-3 gap-2">{renderYears()}</div>
          )}
        </div>

        {/* Quick decades selector if in years mode */}
        {viewMode === "years" && renderQuickDecades()}

        {/* Footer with today button - only in days view */}
        {viewMode === "days" && (
          <div className="p-3 border-t border-[#333] flex justify-end">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                // Check if today is within min/max range
                if (min && new Date(min) > today) return;
                if (max && new Date(max) < today) return;

                setDateValue(today);
                setMonth(today.getMonth());
                setYear(today.getFullYear());

                if (onChange) {
                  const formattedDate = today.toISOString().split("T")[0];
                  onChange({ target: { name, value: formattedDate } });
                }
                setIsOpen(false);
                setViewMode("days");
              }}
              className="px-3 py-1 text-sm text-[#FF6B00] hover:bg-[#FF6B00]/10 rounded transition-colors"
            >
              Today
            </button>
          </div>
        )}
      </div>,
      document.body
    );
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`flex items-center justify-between p-2 rounded-lg bg-[#1a1a1a] border border-[#333] hover:border-[#FF6B00] transition-all ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FF6B00]/10 rounded-full flex items-center justify-center">
            <Icon
              icon="mdi:calendar"
              width={16}
              height={16}
              className="text-[#FF6B00]"
            />
          </div>
          <span className={dateValue ? "text-white" : "text-gray-500"}>
            {dateValue ? formatDisplayDate(dateValue) : "Select date..."}
          </span>
        </div>
        <Icon
          icon="mdi:chevron-down"
          width={20}
          height={20}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {renderCalendar()}
    </div>
  );
};
