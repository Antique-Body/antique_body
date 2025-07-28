import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useState } from "react";

import { FormField } from "@/components/common";
import { InfoBanner } from "@/components/common/InfoBanner";
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
  const [hasChanges, setHasChanges] = useState(false);

  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const timeSlots = [
    { id: "Morning", label: "Morning", time: "6:00 - 11:59 AM" },
    { id: "Afternoon", label: "Afternoon", time: "12:00 - 4:59 PM" },
    { id: "Evening", label: "Evening", time: "5:00 - 8:59 PM" },
    { id: "Night", label: "Night", time: "9:00 PM - 5:59 AM" },
  ];

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

    setHasChanges(true);
  };

  // Handle session duration change
  const handleSessionDurationChange = (e) => {
    setTrainerData({
      ...trainerData,
      trainerProfile: {
        ...trainerData.trainerProfile,
        sessionDuration: parseInt(e.target.value) || 60,
      },
    });
    setHasChanges(true);
  };

  // Handle cancellation policy change
  const handleCancellationPolicyChange = (e) => {
    setTrainerData({
      ...trainerData,
      trainerProfile: {
        ...trainerData.trainerProfile,
        cancellationPolicy: parseInt(e.target.value) || 24,
      },
    });
    setHasChanges(true);
  };

  return (
    <motion.div
      variants={staggerItems}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <SectionTitle title="Your Availability" />

      {hasChanges && (
        <InfoBanner
          icon="mdi:information"
          title="Don't forget to save your changes"
          subtitle="Click the 'Save Changes' button at the top of the page to apply your updates."
          variant="info"
          className="mb-4"
        />
      )}

      {/* Availability Grid - Modern Design */}
      <motion.div
        variants={fadeInUp}
        className="overflow-hidden rounded-xl bg-[rgba(30,30,30,0.6)] backdrop-blur-md"
      >
        <div className="border border-[rgba(255,120,0,0.3)] bg-[rgba(20,20,20,0.6)] rounded-xl">
          <div className="p-5 border-b border-[rgba(255,120,0,0.15)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white shadow-lg">
                <Icon icon="lucide:calendar" width={18} />
              </div>
              <h3 className="text-lg font-medium text-white">
                Available Days & Time Slots
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-400 ml-[52px]">
              Select the days and times when you're available to train clients
            </p>
          </div>

          {/* Desktop Layout (>= md) - Modern Grid */}
          <div className="hidden md:block p-5">
            <div className="grid grid-cols-8 gap-3">
              <div className="col-span-1"></div>
              {weekdays.map((day) => (
                <div key={day} className="text-center">
                  <span className="text-sm font-medium text-white">
                    {day.substring(0, 3)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-4">
              {timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="grid grid-cols-8 gap-3 items-center"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#FF9A00]">
                      {slot.label}
                    </span>
                    <span className="text-xs text-gray-400">{slot.time}</span>
                  </div>

                  {weekdays.map((day) => (
                    <div key={day} className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => toggleAvailability(day, slot.id)}
                        className={`w-full h-12 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isSelected(day, slot.id)
                            ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] shadow-lg shadow-orange-500/20 border border-orange-400/30"
                            : "bg-[rgba(40,40,40,0.6)] hover:bg-[rgba(255,120,0,0.15)] border border-[rgba(255,107,0,0.2)] hover:border-[rgba(255,107,0,0.4)]"
                        }`}
                      >
                        {isSelected(day, slot.id) ? (
                          <Icon
                            icon="mdi:check"
                            className="text-white"
                            width={20}
                            height={20}
                          />
                        ) : null}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Layout (< md) */}
          <div className="md:hidden p-4 space-y-4">
            {weekdays.map((day) => (
              <div key={day} className="rounded-lg bg-[rgba(30,30,30,0.6)] p-4">
                <h4 className="mb-3 text-base font-medium text-white flex items-center gap-2">
                  <Icon
                    icon="mdi:calendar-week"
                    className="text-[#FF9A00]"
                    width={18}
                    height={18}
                  />
                  {day}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => toggleAvailability(day, slot.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                        isSelected(day, slot.id)
                          ? "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white shadow-lg"
                          : "bg-[rgba(40,40,40,0.6)] text-gray-300 hover:bg-[rgba(255,120,0,0.15)] border border-[rgba(255,107,0,0.2)]"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected(day, slot.id)
                            ? "border-white bg-white/20"
                            : "border-gray-500"
                        }`}
                      >
                        {isSelected(day, slot.id) && (
                          <Icon
                            icon="mdi:check"
                            className="text-white"
                            width={12}
                            height={12}
                          />
                        )}
                      </div>
                      <div>
                        <div
                          className={`text-sm font-medium ${
                            isSelected(day, slot.id)
                              ? "text-white"
                              : "text-gray-300"
                          }`}
                        >
                          {slot.label}
                        </div>
                        <div
                          className={`text-xs ${
                            isSelected(day, slot.id)
                              ? "text-white/70"
                              : "text-gray-500"
                          }`}
                        >
                          {slot.time}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Session Information */}
      <motion.div
        variants={fadeInUp}
        className="overflow-hidden rounded-xl bg-[rgba(30,30,30,0.6)] backdrop-blur-md"
      >
        <div className="border border-[rgba(255,120,0,0.3)] bg-[rgba(20,20,20,0.6)] rounded-xl">
          <div className="p-5 border-b border-[rgba(255,120,0,0.15)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white shadow-lg">
                <Icon icon="mdi:clock-outline" width={18} />
              </div>
              <h3 className="text-lg font-medium text-white">
                Session Information
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-400 ml-[52px]">
              Configure your default session duration and cancellation policy
            </p>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  label="Session Duration (minutes)"
                  name="sessionDuration"
                  type="number"
                  value={sessionDuration}
                  onChange={handleSessionDurationChange}
                  placeholder="e.g. 60"
                  backgroundStyle="darker"
                  prefixIcon="mdi:timer-outline"
                />
                <p className="mt-1 text-xs text-gray-400 pl-1">
                  Standard session length for your services
                </p>
              </div>

              <div>
                <FormField
                  label="Cancellation Policy (hours notice)"
                  name="cancellationPolicy"
                  type="number"
                  value={cancellationPolicy}
                  onChange={handleCancellationPolicyChange}
                  placeholder="e.g. 24"
                  backgroundStyle="darker"
                  prefixIcon="mdi:calendar-remove"
                />
                <p className="mt-1 text-xs text-gray-400 pl-1">
                  How much advance notice you require for cancellations
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-gradient-to-r from-[rgba(255,107,0,0.1)] to-[rgba(255,154,0,0.05)] border border-[rgba(255,107,0,0.2)] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Icon
                    icon="mdi:lightbulb-on"
                    className="text-[#FF9A00]"
                    width={20}
                    height={20}
                  />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">
                    Availability Tips:
                  </p>
                  <ul className="mt-2 space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Icon
                        icon="mdi:check-circle"
                        className="text-[#FF7800] mt-0.5 flex-shrink-0"
                        width={16}
                        height={16}
                      />
                      <span className="text-gray-300">
                        Be realistic about your available times to prevent
                        burnout
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon
                        icon="mdi:check-circle"
                        className="text-[#FF7800] mt-0.5 flex-shrink-0"
                        width={16}
                        height={16}
                      />
                      <span className="text-gray-300">
                        Consider travel time between client sessions
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon
                        icon="mdi:check-circle"
                        className="text-[#FF7800] mt-0.5 flex-shrink-0"
                        width={16}
                        height={16}
                      />
                      <span className="text-gray-300">
                        Block time for administrative tasks and your own
                        workouts
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
