import { useState } from "react";

import { Button } from "@/components/common/Button";

export const Availability = ({ trainer }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Generate dates for the next 7 days
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  // Mock data for available times
  const availableTimes = [
    { time: "08:00", available: true },
    { time: "09:00", available: false },
    { time: "10:00", available: true },
    { time: "11:00", available: true },
    { time: "12:00", available: false },
    { time: "13:00", available: false },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: false },
    { time: "17:00", available: true },
    { time: "18:00", available: true },
    { time: "19:00", available: false },
  ];

  // Format date for display
  const formatDate = date => {
    const options = { weekday: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Check if date is today
  const isToday = date => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Handle date selection
  const handleDateSelect = date => {
    setSelectedDate(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-white">Schedule a Session</h3>
        <p className="mb-4 text-gray-300">
          Select a date and time to book a session with {trainer?.name}.
          {trainer?.available
            ? " They are currently available for new clients."
            : " They have limited availability at the moment."}
        </p>
      </div>

      {/* Weekly calendar */}
      <div className="mb-5">
        <h4 className="mb-3 text-lg font-medium text-white">Select Date</h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((date, index) => (
            <div
              key={index}
              onClick={() => handleDateSelect(date)}
              className={`flex w-[90px] flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl p-3 transition-all duration-300 hover:-translate-y-1 ${
                selectedDate && selectedDate.getDate() === date.getDate()
                  ? "border-[#FF6B00] bg-[#FF6B00] text-white"
                  : "border border-[#444] bg-[rgba(30,30,30,0.8)] text-white hover:border-[#FF6B00]"
              }`}
            >
              <span className="mb-1 text-xs font-medium">
                {isToday(date) ? "TODAY" : formatDate(date).split(",")[0].toUpperCase()}
              </span>
              <span className="text-2xl font-bold">{date.getDate()}</span>
              <span className="mt-1 text-xs">{date.toLocaleString("default", { month: "short" })}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <h4 className="mb-3 text-lg font-medium text-white">Select Time</h4>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {availableTimes.map((slot, index) => (
              <div
                key={index}
                className={`cursor-pointer rounded-lg px-4 py-3 text-center transition-all duration-300 ${
                  slot.available
                    ? "border border-[#444] bg-[rgba(30,30,30,0.8)] text-white hover:-translate-y-1 hover:border-[#FF6B00]"
                    : "cursor-not-allowed border border-[#333] bg-[rgba(20,20,20,0.5)] text-gray-500"
                }`}
              >
                {slot.time}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session details */}
      <div className="mt-6 rounded-lg border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.1)] p-4">
        <h4 className="mb-3 font-medium text-white">Session Information</h4>
        <ul className="space-y-2 text-gray-300">
          <li className="flex justify-between">
            <span>Session Duration:</span>
            <span>60 minutes</span>
          </li>
          <li className="flex justify-between">
            <span>Price:</span>
            <span className="font-medium text-[#FF6B00]">${trainer?.hourlyRate || 75}/session</span>
          </li>
          <li className="flex justify-between">
            <span>Location:</span>
            <span>In person or virtual</span>
          </li>
          <li className="flex justify-between">
            <span>Cancellation Policy:</span>
            <span>24 hours notice</span>
          </li>
        </ul>
      </div>

      <div className="pt-2">
        <Button variant={selectedDate ? "primary" : "orangeOutline"} size="large" disabled={!selectedDate} fullWidth>
          Book Session
        </Button>
      </div>
    </div>
  );
};
