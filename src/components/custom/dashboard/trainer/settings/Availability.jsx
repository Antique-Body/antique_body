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
        <div className="rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-5">
          <div className="mb-4 flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,120,0,0.15)] text-[#FF7800]">
              <Icon icon="lucide:calendar" width={18} />
            </div>
            <h3 className="ml-3 text-lg font-medium text-[#FF9A00]">
              Available Days & Time Slots
            </h3>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-7">
            {weekdays.map((day) => (
              <div key={day} className="flex flex-col items-center">
                <span className="mb-2 text-sm font-medium text-white">
                  {day.substring(0, 3)}
                </span>
                <div className="flex flex-col gap-2">
                  {timeSlots.map((slot) => (
                    <label
                      key={slot}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected(day, slot)}
                        onChange={() => toggleAvailability(day, slot)}
                        className="accent-[#FF7800]"
                      />
                      <span
                        className={`text-xs ${
                          isSelected(day, slot)
                            ? "text-[#FF7800] font-semibold"
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
        <div className="w-full rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-5">
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
