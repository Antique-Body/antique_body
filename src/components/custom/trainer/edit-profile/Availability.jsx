import { FormField } from "@/components/shared";

export const Availability = ({ trainerData, handleChange, setTrainerData }) => (
  <div className="space-y-6 border-t border-[#333] pt-8">
    <h2 className="text-xl font-semibold text-[#FF6B00]">Your Availability</h2>

    <div className="rounded-lg border border-[#333] bg-[#1A1A1A] p-4">
      <h3 className="mb-4 text-lg font-medium">Available Days</h3>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
          <div key={day} className="text-center">
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
              className="block cursor-pointer rounded-lg border border-[#444] bg-[rgba(30,30,30,0.8)] px-3 py-2 text-sm text-white transition-colors peer-checked:border-[#FF6B00] peer-checked:bg-[rgba(255,107,0,0.15)] peer-checked:text-[#FF6B00]"
            >
              {day.substring(0, 3)}
            </label>
          </div>
        ))}
      </div>

      <h3 className="mb-4 text-lg font-medium">Available Time Slots</h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {["Morning", "Afternoon", "Evening", "Night"].map(slot => (
          <div key={slot} className="text-center">
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
              className="block cursor-pointer rounded-lg border border-[#444] bg-[rgba(30,30,30,0.8)] px-4 py-3 text-sm text-white transition-colors peer-checked:border-[#FF6B00] peer-checked:bg-[rgba(255,107,0,0.15)] peer-checked:text-[#FF6B00]"
            >
              {slot}
            </label>
          </div>
        ))}
      </div>
    </div>

    <div className="rounded-lg border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.1)] p-4">
      <h3 className="mb-3 font-medium text-white">Session Information</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          label="Session Duration (minutes)"
          name="sessionDuration"
          type="number"
          value={trainerData.sessionDuration || 60}
          onChange={handleChange}
          placeholder="e.g. 60"
        />

        <FormField
          label="Cancellation Policy (hours notice)"
          name="cancellationPolicy"
          type="number"
          value={trainerData.cancellationPolicy || 24}
          onChange={handleChange}
          placeholder="e.g. 24"
        />
      </div>
    </div>
  </div>
);
