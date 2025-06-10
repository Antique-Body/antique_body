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

export const Availability = ({ trainerData, setTrainerData }) => (
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
            Available Days
          </h3>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
          {[
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].map((day) => (
            <motion.div
              key={day}
              className="text-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="checkbox"
                id={day}
                className="peer hidden"
                checked={trainerData.availability.weekdays.includes(day)}
                onChange={(e) => {
                  const weekdays = e.target.checked
                    ? [...trainerData.availability.weekdays, day]
                    : trainerData.availability.weekdays.filter(
                        (d) => d !== day
                      );

                  setTrainerData({
                    ...trainerData,
                    availability: {
                      ...trainerData.availability,
                      weekdays,
                    },
                  });
                }}
              />
              <label
                htmlFor={day}
                className="block cursor-pointer rounded-lg border border-[#444] bg-[rgba(30,30,30,0.8)] px-3 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-orange-900/5 peer-checked:border-[#FF7800] peer-checked:bg-[rgba(255,120,0,0.15)] peer-checked:text-[#FF7800] peer-checked:shadow-orange-900/20"
              >
                {day.substring(0, 3)}
              </label>
            </motion.div>
          ))}
        </div>

        <div className="mb-4 flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,120,0,0.15)] text-[#FF7800]">
            <Icon icon="lucide:clock" width={18} />
          </div>
          <h3 className="ml-3 text-lg font-medium text-[#FF9A00]">
            Available Time Slots
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {["Morning", "Afternoon", "Evening", "Night"].map((slot) => (
            <motion.div
              key={slot}
              className="text-center"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="checkbox"
                id={slot}
                className="peer hidden"
                checked={trainerData.availability.timeSlots.includes(slot)}
                onChange={(e) => {
                  const timeSlots = e.target.checked
                    ? [...trainerData.availability.timeSlots, slot]
                    : trainerData.availability.timeSlots.filter(
                        (s) => s !== slot
                      );

                  setTrainerData({
                    ...trainerData,
                    availability: {
                      ...trainerData.availability,
                      timeSlots,
                    },
                  });
                }}
              />
              <label
                htmlFor={slot}
                className="group block cursor-pointer rounded-lg border border-[#444] bg-[rgba(30,30,30,0.8)] px-4 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-orange-900/5 peer-checked:border-[#FF7800] peer-checked:bg-[rgba(255,120,0,0.15)] peer-checked:text-[#FF7800] peer-checked:shadow-orange-900/20"
              >
                <div className="flex items-center justify-center">
                  <span>{slot}</span>
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: trainerData.availability.timeSlots.includes(slot)
                        ? 1
                        : 0,
                    }}
                    className="ml-2 h-2 w-2 rounded-full bg-[#FF7800]"
                  ></motion.div>
                </div>
              </label>
            </motion.div>
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
              value={trainerData.availability.sessionDuration || 60}
              onChange={(e) => {
                setTrainerData({
                  ...trainerData,
                  availability: {
                    ...trainerData.availability,
                    sessionDuration: e.target.value,
                  },
                });
              }}
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
              value={trainerData.availability.cancellationPolicy || 24}
              onChange={(e) => {
                setTrainerData({
                  ...trainerData,
                  availability: {
                    ...trainerData.availability,
                    cancellationPolicy: e.target.value,
                  },
                });
              }}
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
            <li>• Block time for administrative tasks and your own workouts</li>
          </ul>
        </div>
      </div>
    </motion.div>
  </motion.div>
);
