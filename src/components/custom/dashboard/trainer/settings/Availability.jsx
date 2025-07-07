import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { FormField } from "@/components/common";
import { SectionTitle } from "@/components/custom/dashboard/shared";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const Availability = ({ trainerData, setTrainerData }) => {
  const availabilities = trainerData.trainerProfile.availabilities || [];
  const sessionDuration = trainerData.trainerProfile.sessionDuration || 60;
  const cancellationPolicy =
    trainerData.trainerProfile.cancellationPolicy || 24;

  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const timeSlots = ["Morning", "Afternoon", "Evening", "Night"];

  // Helper to check if a (day, slot) is selected
  const isSelected = (day, slot) =>
    availabilities.some((a) => a.weekday === day && a.timeSlot === slot);

  // Toggle (day, slot)
  const toggleAvailability = (day, slot) => {
    const exists = isSelected(day, slot);
    let newAvailabilities;
    if (exists) {
      newAvailabilities = availabilities.filter(
        (a) => !(a.weekday === day && a.timeSlot === slot)
      );
    } else {
      newAvailabilities = [...availabilities, { weekday: day, timeSlot: slot }];
    }
    setTrainerData({
      ...trainerData,
      trainerProfile: {
        ...trainerData.trainerProfile,
        availabilities: newAvailabilities,
      },
    });
  };

  return (
    <motion.div
      variants={staggerItems}
      initial="hidden"
      animate="visible"
      className="space-y-6 border-t border-[#333] pt-8"
    >
      <SectionTitle title="Your Availability" />

      <motion.div
        variants={fadeInUp}
        className="overflow-hidden rounded-xl bg-[rgba(30,30,30,0.6)] p-0.5 backdrop-blur-md"
      >
        <div className="rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-4 sm:p-5">
          <div className="mb-4 flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,120,0,0.15)] text-[#FF7800]">
              <Icon icon="lucide:calendar" width={18} />
            </div>
            <h3 className="ml-3 text-lg font-medium text-[#FF9A00]">
              Available Days & Time Slots
            </h3>
          </div>

          {/* Mobile Layout (< lg) */}
          <div className="space-y-4 lg:hidden">
            {weekdays.map((day) => (
              <div key={day} className="rounded-lg bg-[rgba(0,0,0,0.2)] p-4">
                <h4 className="mb-3 text-base font-medium text-white">{day}</h4>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {timeSlots.map((slot) => (
                    <label
                      key={slot}
                      className="flex cursor-pointer items-center gap-3 rounded-lg bg-[rgba(255,255,255,0.05)] p-3 transition-all duration-200 hover:bg-[rgba(255,120,0,0.1)] active:scale-95"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected(day, slot)}
                        onChange={() => toggleAvailability(day, slot)}
                        className="h-4 w-4 accent-[#FF7800]"
                      />
                      <span
                        className={`text-sm font-medium transition-colors ${
                          isSelected(day, slot)
                            ? "text-[#FF7800]"
                            : "text-white"
                        }`}
                      >
                        {slot}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Layout (>= lg) - Compact Grid */}
          <div className="hidden lg:block">
            <div className="mb-4 grid grid-cols-8 gap-4">
              {/* Header row */}
              {weekdays.map((day) => (
                <div key={day} className="text-center">
                  <span className="text-sm font-medium text-white">
                    {day.substring(0, 3)}
                  </span>
                </div>
              ))}
            </div>

            {/* Time slots rows */}
            {timeSlots.map((slot) => (
              <div
                key={slot}
                className="mb-3 grid grid-cols-8 gap-4 items-center"
              >
                <div className="text-sm font-medium text-[#FF9A00]">{slot}</div>
                {weekdays.map((day) => (
                  <div key={day} className="flex justify-center">
                    <label className="flex cursor-pointer items-center justify-center rounded-lg bg-[rgba(255,255,255,0.05)] p-2 transition-all duration-200 hover:bg-[rgba(255,120,0,0.1)] active:scale-95">
                      <input
                        type="checkbox"
                        checked={isSelected(day, slot)}
                        onChange={() => toggleAvailability(day, slot)}
                        className="h-4 w-4 accent-[#FF7800]"
                      />
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.h3
        variants={fadeInUp}
        className="mb-4 mt-8 bg-gradient-to-r from-[#FF7800] to-white bg-clip-text text-lg font-medium text-transparent"
      >
        Session Information
      </motion.h3>

      <motion.div
        variants={fadeInUp}
        className="overflow-hidden rounded-xl bg-[rgba(30,30,30,0.6)] p-0.5 backdrop-blur-md"
      >
        <div className="w-full rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <FormField
                label="Session Duration (minutes)"
                name="sessionDuration"
                type="number"
                value={sessionDuration}
                onChange={(e) =>
                  setTrainerData({
                    ...trainerData,
                    trainerProfile: {
                      ...trainerData.trainerProfile,
                      sessionDuration: e.target.value,
                    },
                  })
                }
                placeholder="e.g. 60"
                backgroundStyle="darker"
              />
              <p className="mt-1 text-xs text-gray-400">
                Standard session length for your services
              </p>
            </div>

            <div>
              <FormField
                label="Cancellation Policy (hours notice)"
                name="cancellationPolicy"
                type="number"
                value={cancellationPolicy}
                onChange={(e) =>
                  setTrainerData({
                    ...trainerData,
                    trainerProfile: {
                      ...trainerData.trainerProfile,
                      cancellationPolicy: e.target.value,
                    },
                  })
                }
                placeholder="e.g. 24"
                backgroundStyle="darker"
              />
              <p className="mt-1 text-xs text-gray-400">
                How much advance notice you require for cancellations
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-[rgba(255,255,255,0.05)] p-3 text-sm">
            <p className="font-medium text-white">Availability Tips:</p>
            <ul className="mt-2 space-y-1 text-gray-300">
              <li>
                • Be realistic about your available times to prevent burnout
              </li>
              <li>• Consider travel time between client sessions</li>
              <li>
                • Block time for administrative tasks and your own workouts
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
