import { motion } from "framer-motion";

import { Button } from "@/components/common/Button";
import { ArrowRight, PlusIcon, TargetIcon, TrashIcon } from "@/components/common/Icons";
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

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
};

export const FitnessGoals = ({ clientData, handleChange, newGoal, setNewGoal, addGoal, removeGoal }) => (
  <motion.div
    className="space-y-6 border-t border-[#333] pt-8"
    variants={staggerItems}
    initial="hidden"
    animate="visible"
  >
    <SectionTitle title="Fitness Goals" />

    <motion.div
      variants={fadeInUp}
      className="flex overflow-hidden rounded-xl bg-[rgba(30,30,30,0.6)] p-0.5 backdrop-blur-md"
    >
      <div className="w-full rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-[#FF9A00]">Weight Goal</h3>
          <div className="flex items-center text-sm text-white/70">
            <ArrowRight size={12} className="mr-1 text-[#FF7800]" />
            <span>Track your progress</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <FormField
              label="Current Weight (kg)"
              name="currentWeight"
              type="number"
              value={clientData.currentWeight}
              onChange={handleChange}
              placeholder="Your current weight in kg"
              required
              backgroundStyle="darker"
            />
            <div className="ml-1 mt-1 text-xs text-gray-400">Last updated: Today</div>
          </div>

          <div className="relative">
            <FormField
              label="Target Weight (kg)"
              name="targetWeight"
              type="number"
              value={clientData.targetWeight}
              onChange={handleChange}
              placeholder="Your target weight in kg"
              backgroundStyle="darker"
            />

            {clientData.currentWeight && clientData.targetWeight && (
              <div className="ml-1 mt-1 text-xs">
                <span
                  className={`font-medium ${
                    clientData.targetWeight < clientData.currentWeight
                      ? "text-green-400"
                      : clientData.targetWeight > clientData.currentWeight
                        ? "text-blue-400"
                        : "text-gray-400"
                  }`}
                >
                  {Math.abs(clientData.currentWeight - clientData.targetWeight)} kg
                  {clientData.targetWeight < clientData.currentWeight
                    ? " to lose"
                    : clientData.targetWeight > clientData.currentWeight
                      ? " to gain"
                      : " (maintain)"}
                </span>
              </div>
            )}

            {clientData.currentWeight &&
              clientData.targetWeight &&
              clientData.currentWeight !== clientData.targetWeight && (
                <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 transform text-[#FF7800] md:block">
                  <ArrowRight size={24} />
                </div>
              )}
          </div>
        </div>
      </div>
    </motion.div>

    {/* Goals Section */}
    <motion.div variants={fadeInUp}>
      <div className="mb-3 flex items-center">
        <h3 className="text-lg font-medium text-white">Your Fitness Goals</h3>
        <div className="ml-2 rounded-full bg-[#FF7800]/20 px-2 py-0.5 text-xs text-[#FF9A00]">
          {clientData.fitnessGoals.length} goals
        </div>
      </div>

      <motion.ul className="mb-6 space-y-3" variants={staggerItems}>
        {clientData.fitnessGoals.map((goal, _index) => (
          <motion.li
            key={goal}
            variants={listItemVariants}
            className="group flex items-center gap-3 rounded-xl border border-[#333] bg-[rgba(26,26,26,0.8)] px-4 py-3 transition-all duration-300 hover:border-[#FF7800]/40 hover:bg-[rgba(30,30,30,0.8)]"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800] transition-transform duration-300 group-hover:scale-110">
              <TargetIcon size={18} />
            </div>
            <span className="flex-1 font-medium text-white">{goal}</span>
            <Button
              type="button"
              onClick={() => removeGoal(goal)}
              className="rounded-full p-2 text-gray-400 opacity-0 transition-all duration-300 hover:bg-[#333] hover:text-white group-hover:opacity-100"
              aria-label={`Remove goal: ${goal}`}
              variant="ghost"
              size="small"
              leftIcon={<TrashIcon size={16} />}
            />
          </motion.li>
        ))}
      </motion.ul>

      <div className="relative">
        <div className="flex gap-2">
          <FormField
            name="newGoal"
            value={newGoal}
            onChange={e => setNewGoal(e.target.value)}
            placeholder="Add a new fitness goal"
            className="mb-0 flex-1"
            backgroundStyle="semi-transparent"
          />
          <Button
            type="button"
            variant="orangeFilled"
            onClick={addGoal}
            disabled={!newGoal.trim()}
            className="group overflow-hidden transition-all duration-300"
            leftIcon={<PlusIcon size={16} className="transition-transform duration-300 group-hover:rotate-90" />}
          >
            Add Goal
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#FF7800]/5 via-[#FF7800]/20 to-[#FF7800]/5"></div>
      </div>

      <div className="mt-6 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a]/50 p-4">
        <h4 className="mb-2 text-sm font-medium text-white">Suggested goals:</h4>
        <div className="flex flex-wrap gap-2">
          {["Improve strength", "Run 5K", "Increase flexibility", "Build muscle mass", "Reduce body fat"].map(
            suggestion => (
              <Button
                key={suggestion}
                type="button"
                onClick={() => {
                  if (!clientData.fitnessGoals.includes(suggestion)) {
                    setNewGoal(suggestion);
                  }
                }}
                className="rounded-full border border-[#333] bg-[#222] px-3 py-1 text-xs text-gray-300 transition-all duration-300 hover:border-[#FF7800]/40 hover:bg-[#2a2a2a] hover:text-white"
                disabled={clientData.fitnessGoals.includes(suggestion)}
                variant="ghost"
                size="small"
              >
                {clientData.fitnessGoals.includes(suggestion) ? (
                  <span className="text-green-400">✓ {suggestion}</span>
                ) : (
                  <span>+ {suggestion}</span>
                )}
              </Button>
            ),
          )}
        </div>
      </div>
    </motion.div>
  </motion.div>
);
