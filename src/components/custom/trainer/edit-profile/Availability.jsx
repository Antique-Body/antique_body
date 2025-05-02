import { motion } from "framer-motion";

import { ClockIcon, CalendarIcon } from "@/components/common/Icons";
import { FormField } from "@/components/shared";

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

export const Availability = ({ trainerData, handleChange, setTrainerData }) => (
  <motion.div
    variants={staggerItems}
    initial="hidden"
    animate="visible"
    className="space-y-6 border-t border-[#333] pt-8"
  >
    <motion.h2
      variants={fadeInUp}
      className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-xl font-semibold text-transparent"
    >
      Your Availability
    </motion.h2>

    <motion.div
      variants={fadeInUp}
      className="rounded-lg border border-[#333] bg-gradient-to-b from-[#1A1A1A] to-[#111] p-5 shadow-lg"
    >
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)]">
          <CalendarIcon size={18} className="text-[#FF6B00]" />
        </div>
        <h3 className="text-lg font-medium">Available Days</h3>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
          <motion.div key={day} className="text-center" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <input
              type="checkbox"
              id={day}
              className="peer hidden"
              checked={trainerData.availability.weekdays.includes(day)}
              onChange={e => {
                const weekdays = e.target.checked
                  ? [...trainerData.availability.weekdays, day]
                  : trainerData.availability.weekdays.filter(d => d !== day);

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
              className="block cursor-pointer rounded-lg border border-[#444] bg-[rgba(30,30,30,0.8)] px-3 py-2 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-orange-900/5 peer-checked:border-[#FF6B00] peer-checked:bg-[rgba(255,107,0,0.15)] peer-checked:text-[#FF6B00] peer-checked:shadow-orange-900/20"
            >
              {day.substring(0, 3)}
            </label>
          </motion.div>
        ))}
      </div>

      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)]">
          <ClockIcon size={18} className="text-[#FF6B00]" />
        </div>
        <h3 className="text-lg font-medium">Available Time Slots</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {["Morning", "Afternoon", "Evening", "Night"].map(slot => (
          <motion.div key={slot} className="text-center" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <input
              type="checkbox"
              id={slot}
              className="peer hidden"
              checked={trainerData.availability.timeSlots.includes(slot)}
              onChange={e => {
                const timeSlots = e.target.checked
                  ? [...trainerData.availability.timeSlots, slot]
                  : trainerData.availability.timeSlots.filter(s => s !== slot);

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
              className="group block cursor-pointer rounded-lg border border-[#444] bg-[rgba(30,30,30,0.8)] px-4 py-3 text-sm font-medium text-white shadow-md transition-all duration-300 hover:shadow-orange-900/5 peer-checked:border-[#FF6B00] peer-checked:bg-[rgba(255,107,0,0.15)] peer-checked:text-[#FF6B00] peer-checked:shadow-orange-900/20"
            >
              <div className="flex items-center justify-center">
                <span>{slot}</span>
                <motion.div
                  initial={false}
                  animate={{ opacity: trainerData.availability.timeSlots.includes(slot) ? 1 : 0 }}
                  className="ml-2 h-2 w-2 rounded-full bg-[#FF6B00]"
                ></motion.div>
              </div>
            </label>
          </motion.div>
        ))}
      </div>
    </motion.div>

    <motion.div
      variants={fadeInUp}
      className="rounded-lg border border-[rgba(255,107,0,0.2)] bg-gradient-to-b from-[rgba(255,107,0,0.15)] to-[rgba(255,107,0,0.05)] p-5 shadow-lg"
    >
      <h3 className="mb-4 font-medium text-white">Session Information</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <FormField
            label="Session Duration (minutes)"
            name="sessionDuration"
            type="number"
            value={trainerData.sessionDuration || 60}
            onChange={handleChange}
            placeholder="e.g. 60"
          />
          <p className="mt-1 text-xs text-gray-400">Standard session length for your services</p>
        </div>

        <div>
          <FormField
            label="Cancellation Policy (hours notice)"
            name="cancellationPolicy"
            type="number"
            value={trainerData.cancellationPolicy || 24}
            onChange={handleChange}
            placeholder="e.g. 24"
          />
          <p className="mt-1 text-xs text-gray-400">How much advance notice you require for cancellations</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-[rgba(255,255,255,0.05)] p-3 text-sm">
        <p className="font-medium text-white">Availability Tips:</p>
        <ul className="mt-2 space-y-1 text-gray-300">
          <li>• Be realistic about your available times to prevent burnout</li>
          <li>• Consider travel time between client sessions</li>
          <li>• Block time for administrative tasks and your own workouts</li>
        </ul>
      </div>
    </motion.div>
  </motion.div>
);
