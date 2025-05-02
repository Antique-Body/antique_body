import { motion } from "framer-motion";

import { NutritionIcon, PerformanceIcon, RecoveryIcon, StrengthIcon } from "@/components/common/Icons";
import { SectionTitle } from "@/components/shared";

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

export const AreasOfExpertise = ({ trainerData, updateExpertiseLevel }) => (
  <motion.div
    variants={staggerItems}
    initial="hidden"
    animate="visible"
    className="space-y-6 border-t border-[#333] pt-8"
  >
    <SectionTitle title="Areas of Expertise" />

    <motion.div variants={fadeInUp} className="mb-6 space-y-4">
      {trainerData.expertise.map((item, index) => (
        <motion.div key={index} whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
          <div className="mb-1 flex justify-between">
            <span className="font-medium text-white">{item.area}</span>
            <span className="font-semibold text-[#FF7800]">{item.level}%</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-[#333]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.level}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[#FF7800] to-[#FF9A00]"
              ></motion.div>
              {/* Adding subtle animation */}
              <motion.div
                initial={{ opacity: 0.7, x: "-100%" }}
                animate={{
                  opacity: [0.7, 0.3, 0.7],
                  x: ["0%", "100%", "0%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "linear",
                }}
                className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
              ></motion.div>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={item.level}
              onChange={e => updateExpertiseLevel(index, e.target.value)}
              className="w-24 accent-[#FF7800]"
            />
          </div>
        </motion.div>
      ))}
    </motion.div>

    <motion.h3
      variants={fadeInUp}
      className="mb-4 mt-8 bg-gradient-to-r from-[#FF7800] to-white bg-clip-text text-lg font-medium text-transparent"
    >
      Specialization Details
    </motion.h3>

    <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-5 shadow-lg transition-all duration-300 hover:border-[#FF7800]/40 hover:shadow-orange-500/20"
      >
        <div className="mb-3 flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,120,0,0.15)]">
            <PerformanceIcon size={20} className="text-[#FF7800]" />
          </div>
          <h4 className="ml-3 text-lg font-semibold text-[#FF7800]">Sports Performance</h4>
        </div>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center">
            <span className="mr-2 text-[#FF7800]">•</span>
            <span>Sport-specific functional movement patterns</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-[#FF7800]">•</span>
            <span>Speed and agility development</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-[#FF7800]">•</span>
            <span>Power and explosiveness training</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-[#FF7800]">•</span>
            <span>Competition preparation cycles</span>
          </li>
        </ul>
      </motion.div>

      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-5 shadow-lg transition-all duration-300 hover:border-[#FF7800]/40 hover:shadow-orange-500/20"
      >
        <div className="mb-3 flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,120,0,0.15)]">
            <StrengthIcon size={20} className="text-[#FF7800]" />
          </div>
          <h4 className="ml-3 text-lg font-semibold text-[#FF7800]">Strength & Conditioning</h4>
        </div>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center">
            <span className="mr-2 text-[#FF7800]">•</span>
            <span>Compound movement optimization</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-[#FF7800]">•</span>
            <span>Progressive overload programming</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-[#FF7800]">•</span>
            <span>Muscular endurance development</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-[#FF7800]">•</span>
            <span>Functional strength training</span>
          </li>
        </ul>
      </motion.div>

      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-5 shadow-lg transition-all duration-300 hover:border-[#FF7800]/40 hover:shadow-orange-500/20"
      >
        <div className="mb-3 flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,120,0,0.15)]">
            <RecoveryIcon size={20} className="text-[#FF7800]" />
          </div>
          <h4 className="ml-3 text-lg font-semibold text-[#FF7800]">Recovery & Mobility</h4>
        </div>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center">
            <span className="mr-2 text-[#FF7800]">•</span>
            <span>Active recovery protocols</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-[#FF7800]">•</span>
            <span>Joint mobility enhancement</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-[#FF7800]">•</span>
            <span>Myofascial release techniques</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-[#FF7800]">•</span>
            <span>Sleep optimization strategies</span>
          </li>
        </ul>
      </motion.div>

      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-5 shadow-lg transition-all duration-300 hover:border-[#FF7800]/40 hover:shadow-orange-500/20"
      >
        <div className="mb-3 flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,120,0,0.15)]">
            <NutritionIcon size={20} className="text-[#FF7800]" />
          </div>
          <h4 className="ml-3 text-lg font-semibold text-[#FF7800]">Nutrition Planning</h4>
        </div>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-center">
            <span className="mr-2 text-[#FF7800]">•</span>
            <span>Macronutrient calculation</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-[#FF7800]">•</span>
            <span>Performance nutrition timing</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-[#FF7800]">•</span>
            <span>Hydration strategies</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-[#FF7800]">•</span>
            <span>Supplementation guidance</span>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  </motion.div>
);
