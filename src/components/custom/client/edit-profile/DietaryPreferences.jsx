import { motion } from "framer-motion";

import { Button } from "@/components/common/Button";
import { NutritionIcon, TrashIcon, PlusIcon, InfoIcon } from "@/components/common/Icons";
import { FormField } from "@/components/shared";

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

export const DietaryPreferences = ({
  clientData,
  handleChange,
  newRestriction,
  setNewRestriction,
  addRestriction,
  removeRestriction,
  newIntolerance,
  setNewIntolerance,
  addIntolerance,
  removeIntolerance,
}) => (
  <motion.div
    className="space-y-6 border-t border-[#333] pt-8"
    variants={staggerItems}
    initial="hidden"
    animate="visible"
  >
    <motion.div variants={fadeInUp} className="flex items-center justify-between">
      <h2 className="bg-gradient-to-r from-[#FF7800] to-[#FF9A00] bg-clip-text text-xl font-semibold text-transparent">
        Dietary Preferences
      </h2>
      <div className="ml-4 h-px flex-1 bg-gradient-to-r from-[#FF7800]/50 to-transparent"></div>
    </motion.div>

    {/* Diet Type and Calorie Goals */}
    <motion.div
      variants={fadeInUp}
      className="flex overflow-hidden rounded-xl bg-[rgba(30,30,30,0.6)] p-0.5 backdrop-blur-md"
    >
      <div className="w-full rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-5">
        <div className="mb-4 flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800]">
            <NutritionIcon size={18} />
          </div>
          <h3 className="ml-3 text-lg font-medium text-[#FF9A00]">Diet Overview</h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <FormField
              label="Diet Type"
              name="dietType"
              type="select"
              value={clientData.dietType}
              onChange={handleChange}
              options={[
                { value: "", label: "Select diet type" },
                { value: "omnivore", label: "Omnivore" },
                { value: "vegetarian", label: "Vegetarian" },
                { value: "vegan", label: "Vegan" },
                { value: "pescatarian", label: "Pescatarian" },
                { value: "keto", label: "Keto" },
                { value: "paleo", label: "Paleo" },
                { value: "gluten-free", label: "Gluten-Free" },
                { value: "other", label: "Other" },
              ]}
              backgroundStyle="darker"
            />
          </div>

          <div>
            <FormField
              label="Daily Calorie Goal"
              name="calorieGoal"
              type="number"
              value={clientData.calorieGoal}
              onChange={handleChange}
              placeholder="e.g. 2000"
              backgroundStyle="darker"
            />
          </div>
        </div>
      </div>
    </motion.div>

    {/* Macronutrient Distribution */}
    <motion.div variants={fadeInUp} className="overflow-hidden rounded-xl bg-[rgba(26,26,26,0.8)] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-white">Macronutrient Distribution</h3>
        </div>
        <div className="text-xs text-gray-400">% of daily calories</div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-[#333] bg-[#1c1c1c] p-5">
        <div className="absolute -right-12 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-[#FF7800]/10 to-transparent blur-2xl"></div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="group">
            <FormField
              label="Protein %"
              name="proteinPercentage"
              type="number"
              value={clientData.proteinPercentage}
              onChange={handleChange}
              placeholder="e.g. 30"
              backgroundStyle="semi-transparent"
              className="transition-all duration-300 group-hover:border-[#FF7800]/40"
            />
            {clientData.proteinPercentage && (
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#333]">
                <div
                  className="h-full rounded-full bg-[#FF9A00]"
                  style={{ width: `${Math.min(clientData.proteinPercentage, 100)}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className="group">
            <FormField
              label="Carbohydrates %"
              name="carbsPercentage"
              type="number"
              value={clientData.carbsPercentage}
              onChange={handleChange}
              placeholder="e.g. 40"
              backgroundStyle="semi-transparent"
              className="transition-all duration-300 group-hover:border-[#FF7800]/40"
            />
            {clientData.carbsPercentage && (
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#333]">
                <div
                  className="h-full rounded-full bg-[#FF7800]"
                  style={{ width: `${Math.min(clientData.carbsPercentage, 100)}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className="group">
            <FormField
              label="Fats %"
              name="fatsPercentage"
              type="number"
              value={clientData.fatsPercentage}
              onChange={handleChange}
              placeholder="e.g. 30"
              backgroundStyle="semi-transparent"
              className="transition-all duration-300 group-hover:border-[#FF7800]/40"
            />
            {clientData.fatsPercentage && (
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#333]">
                <div
                  className="h-full rounded-full bg-[#FF6B00]"
                  style={{ width: `${Math.min(clientData.fatsPercentage, 100)}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {clientData.proteinPercentage && clientData.carbsPercentage && clientData.fatsPercentage && (
          <div className="mt-4 flex items-center">
            <div
              className={`text-sm font-medium ${
                Math.abs(
                  parseInt(clientData.proteinPercentage) +
                    parseInt(clientData.carbsPercentage) +
                    parseInt(clientData.fatsPercentage) -
                    100,
                ) <= 5
                  ? "text-green-400"
                  : "text-orange-400"
              }`}
            >
              Total:{" "}
              {parseInt(clientData.proteinPercentage) +
                parseInt(clientData.carbsPercentage) +
                parseInt(clientData.fatsPercentage)}
              %
            </div>
            {Math.abs(
              parseInt(clientData.proteinPercentage) +
                parseInt(clientData.carbsPercentage) +
                parseInt(clientData.fatsPercentage) -
                100,
            ) > 5 && <div className="ml-2 text-xs text-orange-400">(Should total approximately 100%)</div>}
          </div>
        )}
      </div>
    </motion.div>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Dietary Restrictions */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col overflow-hidden rounded-xl bg-[rgba(30,30,30,0.6)] p-0.5 backdrop-blur-md"
      >
        <div className="h-full w-full rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-5">
          <div className="mb-4 flex items-center">
            <h3 className="text-lg font-medium text-[#FF9A00]">Dietary Restrictions</h3>
          </div>

          {clientData.dietaryRestrictions.length > 0 ? (
            <motion.ul className="mb-4 space-y-2" variants={staggerItems}>
              {clientData.dietaryRestrictions.map(restriction => (
                <motion.li
                  key={restriction}
                  variants={listItemVariants}
                  className="group flex items-center gap-2 rounded-lg border border-[#333] bg-[rgba(26,26,26,0.8)] px-3 py-2 transition-all duration-300 hover:border-[#FF7800]/40 hover:bg-[rgba(30,30,30,0.8)]"
                >
                  <span className="flex-1 text-sm font-medium text-white">{restriction}</span>
                  <Button
                    type="button"
                    onClick={() => removeRestriction(restriction)}
                    className="rounded-full p-1.5 text-gray-400 opacity-0 transition-all duration-300 hover:bg-[#333] hover:text-white group-hover:opacity-100"
                    aria-label={`Remove restriction: ${restriction}`}
                    variant="ghost"
                    size="small"
                    leftIcon={<TrashIcon size={14} />}
                  />
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <div className="mb-4 rounded-lg border border-dashed border-gray-700 bg-[#1a1a1a]/50 p-3 text-center text-sm text-gray-400">
              No dietary restrictions added
            </div>
          )}

          <div className="relative mt-auto">
            <div className="flex gap-2">
              <FormField
                name="newRestriction"
                value={newRestriction}
                onChange={e => setNewRestriction(e.target.value)}
                placeholder="Add dietary restriction"
                className="mb-0 flex-1"
                backgroundStyle="semi-transparent"
              />
              <Button
                type="button"
                variant="orangeFilled"
                size="sm"
                onClick={addRestriction}
                disabled={!newRestriction.trim()}
                className="group flex-shrink-0 transition-all duration-300"
                leftIcon={<PlusIcon size={14} className="transition-transform duration-300 group-hover:rotate-90" />}
              >
                Add
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#FF7800]/5 via-[#FF7800]/20 to-[#FF7800]/5"></div>
          </div>
        </div>
      </motion.div>

      {/* Food Intolerances */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col overflow-hidden rounded-xl bg-[rgba(30,30,30,0.6)] p-0.5 backdrop-blur-md"
      >
        <div className="h-full w-full rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-5">
          <div className="mb-4 flex items-center">
            <h3 className="text-lg font-medium text-[#FF9A00]">Food Intolerances</h3>
          </div>

          {clientData.foodIntolerances.length > 0 ? (
            <motion.ul className="mb-4 space-y-2" variants={staggerItems}>
              {clientData.foodIntolerances.map(intolerance => (
                <motion.li
                  key={intolerance}
                  variants={listItemVariants}
                  className="group flex items-center gap-2 rounded-lg border border-[#333] bg-[rgba(26,26,26,0.8)] px-3 py-2 transition-all duration-300 hover:border-[#FF7800]/40 hover:bg-[rgba(30,30,30,0.8)]"
                >
                  <span className="flex-1 text-sm font-medium text-white">{intolerance}</span>
                  <Button
                    type="button"
                    onClick={() => removeIntolerance(intolerance)}
                    className="rounded-full p-1.5 text-gray-400 opacity-0 transition-all duration-300 hover:bg-[#333] hover:text-white group-hover:opacity-100"
                    aria-label={`Remove intolerance: ${intolerance}`}
                    variant="ghost"
                    size="small"
                    leftIcon={<TrashIcon size={14} />}
                  />
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <div className="mb-4 rounded-lg border border-dashed border-gray-700 bg-[#1a1a1a]/50 p-3 text-center text-sm text-gray-400">
              No food intolerances added
            </div>
          )}

          <div className="relative mt-auto">
            <div className="flex gap-2">
              <FormField
                name="newIntolerance"
                value={newIntolerance}
                onChange={e => setNewIntolerance(e.target.value)}
                placeholder="Add food intolerance"
                className="mb-0 flex-1"
                backgroundStyle="semi-transparent"
              />
              <Button
                type="button"
                variant="orangeFilled"
                size="sm"
                onClick={addIntolerance}
                disabled={!newIntolerance.trim()}
                className="group flex-shrink-0 transition-all duration-300"
                leftIcon={<PlusIcon size={14} className="transition-transform duration-300 group-hover:rotate-90" />}
              >
                Add
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#FF7800]/5 via-[#FF7800]/20 to-[#FF7800]/5"></div>
          </div>
        </div>
      </motion.div>
    </div>

    <motion.div variants={fadeInUp} className="mt-4 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a]/50 p-4">
      <div className="mb-2 flex items-center">
        <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800]">
          <InfoIcon size={12} className="text-[#FF7800]" />
        </div>
        <div className="text-sm font-medium text-white">Nutrition Information</div>
      </div>
      <p className="text-sm text-gray-300">
        Your dietary preferences help your trainer provide nutrition guidance that aligns with your goals and lifestyle.
        This information is used to customize meal plans and recommendations.
      </p>
    </motion.div>
  </motion.div>
);
