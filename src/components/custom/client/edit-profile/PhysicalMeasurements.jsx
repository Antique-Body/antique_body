import { motion } from "framer-motion";

import { ChartBarIcon, RulerIcon } from "@/components/common/Icons";
import { FormField, SectionTitle } from "@/components/shared";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const staggerItems = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const measurementFields = [
  { name: "chest", label: "Chest (cm)" },
  { name: "waist", label: "Waist (cm)" },
  { name: "hips", label: "Hips (cm)" },
  { name: "thighs", label: "Thighs (cm)" },
  { name: "arms", label: "Arms (cm)" },
  { name: "shoulders", label: "Shoulders (cm)" },
];

export const PhysicalMeasurements = ({ clientData, handleChange }) => (
  <motion.div
    className="space-y-6 border-t border-[#333] pt-8"
    variants={staggerItems}
    initial="hidden"
    animate="visible"
  >
    <SectionTitle title="Physical Measurements" />

    {/* Basic measurements */}
    <motion.div
      variants={fadeInUp}
      className="flex overflow-hidden rounded-xl bg-[rgba(30,30,30,0.6)] p-0.5 backdrop-blur-md"
    >
      <div className="w-full rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-5">
        <div className="mb-4 flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800]">
            <RulerIcon size={18} />
          </div>
          <h3 className="ml-3 text-lg font-medium text-[#FF9A00]">Basic Measurements</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-5">
            <FormField
              label="Height (cm)"
              name="height"
              type="number"
              value={clientData.height}
              onChange={handleChange}
              placeholder="Your height in centimeters"
              required
              backgroundStyle="darker"
            />

            <div className="relative overflow-hidden rounded-lg border border-[#333] bg-[#1c1c1c] p-4">
              <div className="absolute -right-8 -top-8 h-16 w-16 rounded-full bg-[#FF7800]/10"></div>
              <div className="absolute -bottom-8 -left-8 h-16 w-16 rounded-full bg-[#FF7800]/5"></div>

              <div className="relative z-10">
                <div className="mb-1 text-sm text-gray-400">BMI Calculation</div>
                {clientData.height && clientData.weight ? (
                  <div>
                    <div className="text-2xl font-semibold text-white">
                      {(clientData.weight / Math.pow(clientData.height / 100, 2)).toFixed(1)}
                    </div>
                    <div className="mt-1 text-sm">
                      {(() => {
                        const bmi = clientData.weight / Math.pow(clientData.height / 100, 2);
                        if (bmi < 18.5) return <span className="text-blue-400">Underweight</span>;
                        if (bmi < 25) return <span className="text-green-400">Normal</span>;
                        if (bmi < 30) return <span className="text-orange-400">Overweight</span>;
                        return <span className="text-red-400">Obese</span>;
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm italic text-gray-500">Enter height and weight to calculate BMI</div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <FormField
              label="Weight (kg)"
              name="weight"
              type="number"
              value={clientData.weight}
              onChange={handleChange}
              placeholder="Your weight in kilograms"
              required
              backgroundStyle="darker"
            />

            <FormField
              label="Body Fat (%)"
              name="bodyFat"
              type="number"
              value={clientData.bodyFat}
              onChange={handleChange}
              placeholder="Your body fat percentage"
              backgroundStyle="darker"
            />
          </div>
        </div>
      </div>
    </motion.div>

    {/* Detailed measurements */}
    <motion.div variants={fadeInUp}>
      <div className="mb-4 flex items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800]">
          <ChartBarIcon size={18} />
        </div>
        <h3 className="ml-3 text-lg font-medium text-white">Detailed Measurements</h3>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-[rgba(26,26,26,0.8)] p-5">
        <div className="absolute -right-12 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-[#FF7800]/10 to-transparent blur-2xl"></div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
          {measurementFields.map(field => (
            <motion.div
              key={field.name}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.3 },
                },
              }}
              className="group"
            >
              <FormField
                label={field.label}
                name={field.name}
                type="number"
                value={clientData[field.name]}
                onChange={handleChange}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                backgroundStyle="semi-transparent"
                className="transition-all duration-300 group-hover:border-[#FF7800]/40"
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-4 border-t border-[#333] pt-4">
          <div className="mb-2 text-sm text-gray-400">Measurement History</div>
          <div className="flex items-center">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#333]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF7800] to-[#FF9A00] transition-all duration-500"
                style={{ width: `${calculateCompletionPercentage(clientData)}%` }}
              ></div>
            </div>
            <div className="ml-3 min-w-[40px] text-sm">{calculateCompletionPercentage(clientData)}%</div>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {calculateCompletionPercentage(clientData) < 100
              ? "Complete your measurements for better tracking"
              : "All measurements complete"}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a]/50 p-4">
        <div className="mb-2 text-sm text-gray-400">Tip</div>
        <p className="text-sm text-gray-300">
          Regular tracking of your measurements can help you monitor progress and adjust your fitness program
          accordingly. We recommend updating measurements every 2-4 weeks.
        </p>
      </div>
    </motion.div>
  </motion.div>
);

// Helper function to calculate completion percentage
function calculateCompletionPercentage(clientData) {
  const measurementFields = ["height", "weight", "bodyFat", "chest", "waist", "hips", "thighs", "arms", "shoulders"];

  const filledFields = measurementFields.filter(
    field => clientData[field] !== undefined && clientData[field] !== null && clientData[field] !== "",
  );

  return Math.round((filledFields.length / measurementFields.length) * 100);
}
