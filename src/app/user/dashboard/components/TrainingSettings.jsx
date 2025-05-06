"use client";
import { useState } from "react";

const TrainingSettings = () => {
  const [settings, setSettings] = useState({
    workoutPreferences: {
      difficulty: "intermediate",
      focusAreas: ["strength", "cardio"],
      duration: 60,
      restDays: 2,
    },
    equipment: {
      hasGymAccess: true,
      availableEquipment: ["dumbbells", "barbell", "bench"],
    },
    goals: {
      primary: "muscle_gain",
      target: {
        weight: 75,
        date: "2024-12-31",
      },
    },
    schedule: {
      preferredDays: ["monday", "wednesday", "friday"],
      preferredTime: "morning",
    },
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Workout Preferences */}
      <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-6">Workout Preferences</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Difficulty Level
            </label>
            <div className="grid grid-cols-4 gap-4">
              {["beginner", "intermediate", "advanced", "expert"].map(
                (level) => (
                  <button
                    key={level}
                    onClick={() =>
                      handleSettingChange(
                        "workoutPreferences",
                        "difficulty",
                        level
                      )
                    }
                    className={`px-4 py-3 rounded-xl text-sm font-medium capitalize transition-colors ${
                      settings.workoutPreferences.difficulty === level
                        ? "bg-[#FF6B00]"
                        : "bg-[#222] hover:bg-[#333]"
                    }`}>
                    {level}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Focus Areas
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "strength",
                "cardio",
                "flexibility",
                "endurance",
                "power",
                "balance",
              ].map((area) => (
                <button
                  key={area}
                  onClick={() => {
                    const newAreas =
                      settings.workoutPreferences.focusAreas.includes(area)
                        ? settings.workoutPreferences.focusAreas.filter(
                            (a) => a !== area
                          )
                        : [...settings.workoutPreferences.focusAreas, area];
                    handleSettingChange(
                      "workoutPreferences",
                      "focusAreas",
                      newAreas
                    );
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium capitalize transition-colors ${
                    settings.workoutPreferences.focusAreas.includes(area)
                      ? "bg-[#FF6B00]"
                      : "bg-[#222] hover:bg-[#333]"
                  }`}>
                  {area}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Workout Duration (minutes)
            </label>
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={settings.workoutPreferences.duration}
              onChange={(e) =>
                handleSettingChange(
                  "workoutPreferences",
                  "duration",
                  parseInt(e.target.value)
                )
              }
              className="w-full h-2 bg-[#333] rounded-full appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm mt-2">
              <span>15 min</span>
              <span className="text-[#FF6B00]">
                {settings.workoutPreferences.duration} min
              </span>
              <span>120 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Settings */}
      <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-6">Equipment Settings</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-[#222] rounded-xl">
            <div>
              <h4 className="font-medium">Gym Access</h4>
              <p className="text-sm text-gray-400">
                Do you have access to a gym?
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.equipment.hasGymAccess}
                onChange={(e) =>
                  handleSettingChange(
                    "equipment",
                    "hasGymAccess",
                    e.target.checked
                  )
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B00]"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Available Equipment
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "dumbbells",
                "barbell",
                "bench",
                "resistance bands",
                "kettlebell",
                "pull-up bar",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    const newEquipment =
                      settings.equipment.availableEquipment.includes(item)
                        ? settings.equipment.availableEquipment.filter(
                            (e) => e !== item
                          )
                        : [...settings.equipment.availableEquipment, item];
                    handleSettingChange(
                      "equipment",
                      "availableEquipment",
                      newEquipment
                    );
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium capitalize transition-colors ${
                    settings.equipment.availableEquipment.includes(item)
                      ? "bg-[#FF6B00]"
                      : "bg-[#222] hover:bg-[#333]"
                  }`}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-6">Fitness Goals</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Primary Goal
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "muscle_gain", label: "Muscle Gain" },
                { id: "weight_loss", label: "Weight Loss" },
                { id: "strength", label: "Strength" },
                { id: "endurance", label: "Endurance" },
              ].map((goal) => (
                <button
                  key={goal.id}
                  onClick={() =>
                    handleSettingChange("goals", "primary", goal.id)
                  }
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    settings.goals.primary === goal.id
                      ? "bg-[#FF6B00]"
                      : "bg-[#222] hover:bg-[#333]"
                  }`}>
                  {goal.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Target Weight (kg)
              </label>
              <input
                type="number"
                value={settings.goals.target.weight}
                onChange={(e) =>
                  handleSettingChange("goals", "target", {
                    ...settings.goals.target,
                    weight: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-xl focus:outline-none focus:border-[#FF6B00] text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Target Date
              </label>
              <input
                type="date"
                value={settings.goals.target.date}
                onChange={(e) =>
                  handleSettingChange("goals", "target", {
                    ...settings.goals.target,
                    date: e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-[#222] border border-[#333] rounded-xl focus:outline-none focus:border-[#FF6B00] text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-[#333] rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-6">Workout Schedule</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Preferred Days
            </label>
            <div className="grid grid-cols-7 gap-2">
              {[
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ].map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    const newDays = settings.schedule.preferredDays.includes(
                      day
                    )
                      ? settings.schedule.preferredDays.filter((d) => d !== day)
                      : [...settings.schedule.preferredDays, day];
                    handleSettingChange("schedule", "preferredDays", newDays);
                  }}
                  className={`p-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                    settings.schedule.preferredDays.includes(day)
                      ? "bg-[#FF6B00]"
                      : "bg-[#222] hover:bg-[#333]"
                  }`}>
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Preferred Time
            </label>
            <div className="grid grid-cols-3 gap-4">
              {["morning", "afternoon", "evening"].map((time) => (
                <button
                  key={time}
                  onClick={() =>
                    handleSettingChange("schedule", "preferredTime", time)
                  }
                  className={`px-4 py-3 rounded-xl text-sm font-medium capitalize transition-colors ${
                    settings.schedule.preferredTime === time
                      ? "bg-[#FF6B00]"
                      : "bg-[#222] hover:bg-[#333]"
                  }`}>
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button className="w-full py-4 bg-[#FF6B00] hover:bg-[#FF8533] rounded-xl text-white font-medium transition-colors">
        Save Training Settings
      </button>
    </div>
  );
};

export default TrainingSettings;
