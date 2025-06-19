import { Icon } from "@iconify/react";
import { useState } from "react";

import { Button } from "@/components/common/Button";

export const Availability = ({ trainer }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Generate dates for the next 7 days
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }

  // Map trainer availability to days of the week
  const trainerAvailability = {};
  if (trainer?.availability) {
    trainer.availability.forEach((slot) => {
      if (!trainerAvailability[slot.weekday]) {
        trainerAvailability[slot.weekday] = [];
      }
      trainerAvailability[slot.weekday].push(slot.timeSlot);
    });
  }

  // Generate time slots based on trainer availability for the selected date
  const getAvailableTimesForDate = (date) => {
    if (!date) return [];

    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    const availableSlots = trainerAvailability[weekday] || [];

    // Map time slots to actual times
    const timeSlotMap = {
      Morning: ["08:00", "09:00", "10:00", "11:00"],
      Afternoon: ["12:00", "13:00", "14:00", "15:00"],
      Evening: ["16:00", "17:00", "18:00", "19:00"],
      Night: ["20:00", "21:00", "22:00"],
    };

    // Flatten and map all available times for this day
    const availableTimes = availableSlots.flatMap((slot) =>
      timeSlotMap[slot]
        ? timeSlotMap[slot].map((time) => ({ time, available: true }))
        : []
    );

    return availableTimes.length > 0
      ? availableTimes
      : [{ time: "No availability", available: false }];
  };

  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Format distance to display nicely
  const formatDistance = (distance) => {
    if (typeof distance !== "number") return null;

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    if (distance < 10) {
      return `${distance.toFixed(1)}km`;
    }
    return `${Math.round(distance)}km`;
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Get available times for selected date
  const availableTimes = selectedDate
    ? getAvailableTimesForDate(selectedDate)
    : [];

  // Get closest gym if available
  const getClosestGym = () => {
    if (
      !Array.isArray(trainer.trainerGyms) ||
      trainer.trainerGyms.length === 0
    ) {
      return null;
    }

    if (trainer.distanceSource === "gym" && trainer.trainerGyms.length > 0) {
      return trainer.trainerGyms[0].gym;
    }

    return null;
  };

  const closestGym = getClosestGym();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-white">
          Schedule a Session
        </h3>
        <p className="mb-4 text-gray-300">
          Select a date and time to book a session with {trainer?.name}.
          {trainer?.availability && trainer.availability.length > 0
            ? " They are currently available for new clients."
            : " They have limited availability at the moment."}
        </p>
      </div>

      {/* Weekly calendar */}
      <div className="mb-5">
        <h4 className="mb-3 text-lg font-medium text-white">Select Date</h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((date, index) => {
            const weekday = date.toLocaleDateString("en-US", {
              weekday: "long",
            });
            const hasAvailability =
              trainerAvailability[weekday] &&
              trainerAvailability[weekday].length > 0;

            return (
              <div
                key={index}
                onClick={() => hasAvailability && handleDateSelect(date)}
                className={`flex w-[90px] flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl p-3 transition-all duration-300 hover:-translate-y-1 ${
                  selectedDate && selectedDate.getDate() === date.getDate()
                    ? "border-[#FF6B00] bg-[#FF6B00] text-white"
                    : hasAvailability
                    ? "border border-[#444] bg-[rgba(30,30,30,0.8)] text-white hover:border-[#FF6B00]"
                    : "border border-[#333] bg-[rgba(20,20,20,0.5)] text-gray-500 cursor-not-allowed"
                }`}
              >
                <span className="mb-1 text-xs font-medium">
                  {isToday(date)
                    ? "TODAY"
                    : formatDate(date).split(",")[0].toUpperCase()}
                </span>
                <span className="text-2xl font-bold">{date.getDate()}</span>
                <span className="mt-1 text-xs">
                  {date.toLocaleString("default", { month: "short" })}
                </span>
                {hasAvailability && (
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6B00]"></span>
                )}
              </div>
            );
          })}
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
                onClick={() => slot.available && handleTimeSelect(slot.time)}
                className={`cursor-pointer rounded-lg px-4 py-3 text-center transition-all duration-300 ${
                  !slot.available
                    ? "cursor-not-allowed border border-[#333] bg-[rgba(20,20,20,0.5)] text-gray-500"
                    : selectedTime === slot.time
                    ? "border border-[#FF6B00] bg-[rgba(255,107,0,0.2)] text-white"
                    : "border border-[#444] bg-[rgba(30,30,30,0.8)] text-white hover:-translate-y-1 hover:border-[#FF6B00]"
                }`}
              >
                {slot.time}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Training locations */}
      {Array.isArray(trainer.trainerGyms) && trainer.trainerGyms.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3 text-lg font-medium text-white">
            Training Locations
          </h4>
          <div className="space-y-2">
            {trainer.trainerGyms.slice(0, 3).map((gymData, index) => (
              <div
                key={index}
                className="rounded-lg border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.1)] p-3"
              >
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:dumbbell"
                    width={16}
                    height={16}
                    className="text-[#FF6B00]"
                  />
                  <span className="font-medium text-white">
                    {gymData.gym?.name || "Unnamed Gym"}
                  </span>
                  {index === 0 &&
                    trainer.distanceSource === "gym" &&
                    typeof trainer.distance === "number" && (
                      <span className="ml-auto text-xs bg-[rgba(255,107,0,0.2)] px-2 py-0.5 rounded-full text-[#FF6B00]">
                        {formatDistance(trainer.distance)} away
                      </span>
                    )}
                </div>
                {gymData.gym?.address && (
                  <p className="mt-1 ml-6 text-sm text-gray-400">
                    {gymData.gym.address}
                  </p>
                )}
              </div>
            ))}
            {trainer.trainerGyms.length > 3 && (
              <p className="text-sm text-center text-gray-400">
                +{trainer.trainerGyms.length - 3} more locations
              </p>
            )}
          </div>
        </div>
      )}

      {/* Session details */}
      <div className="mt-6 rounded-lg border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.1)] p-4">
        <h4 className="mb-3 font-medium text-white">Session Information</h4>
        <ul className="space-y-2 text-gray-300">
          <li className="flex justify-between">
            <span>Session Duration:</span>
            <span>{trainer?.sessionDuration || 60} minutes</span>
          </li>
          <li className="flex justify-between">
            <span>Price:</span>
            <span className="font-medium text-[#FF6B00]">
              {trainer?.pricePerSession ? (
                <>
                  ${trainer.pricePerSession}/
                  {trainer?.pricingType === "per_session"
                    ? "session"
                    : "package"}
                </>
              ) : (
                <>
                  {trainer?.pricingType === "contact_for_pricing"
                    ? "Contact for pricing"
                    : trainer?.pricingType === "free_consultation"
                    ? "Free consultation"
                    : "Price not specified"}
                </>
              )}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Location:</span>
            <span>
              {closestGym
                ? `${closestGym.name} (${
                    trainer.distanceSource === "gym" &&
                    typeof trainer.distance === "number"
                      ? formatDistance(trainer.distance) + " away"
                      : "In person"
                  })`
                : trainer?.proximity || "In person or virtual"}
            </span>
          </li>
          <li className="flex justify-between">
            <span>Cancellation Policy:</span>
            <span>
              {trainer?.cancellationPolicy
                ? `${trainer.cancellationPolicy} hours notice`
                : "24 hours notice"}
            </span>
          </li>
        </ul>
      </div>

      <div className="pt-2">
        <Button
          variant={
            selectedDate && selectedTime ? "orangeFilled" : "orangeOutline"
          }
          size="large"
          disabled={!selectedDate || !selectedTime}
          fullWidth
          leftIcon={<Icon icon="mdi:calendar-check" width={16} height={16} />}
        >
          Book Session
        </Button>
      </div>
    </div>
  );
};
