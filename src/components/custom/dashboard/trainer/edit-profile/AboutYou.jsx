import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";
import { SectionTitle } from "@/components/custom/dashboard/shared";

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

export const AboutYou = ({
  trainerData,
  handleChange,
  newEducation,
  setNewEducation,
  addEducation,
  removeEducation,
}) => (
  <motion.div
    variants={staggerItems}
    initial="hidden"
    animate="visible"
    className="space-y-6 border-t border-[#333] pt-8"
  >
    <SectionTitle title="About You" />

    <motion.div variants={fadeInUp}>
      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={trainerData.description}
        onChange={handleChange}
        placeholder="Describe your background and experience..."
        rows={5}
        backgroundStyle="semi-transparent"
      />
      <p className="mt-1 text-xs text-gray-400">
        Tell clients about your background, specialties, and what makes you
        unique as a trainer (250-300 words recommended)
      </p>
    </motion.div>

    <motion.div variants={fadeInUp}>
      <FormField
        label="Training Philosophy"
        name="philosophy"
        type="textarea"
        value={trainerData.philosophy}
        onChange={handleChange}
        placeholder="Describe your approach to training..."
        rows={4}
        backgroundStyle="semi-transparent"
      />
      <p className="mt-1 text-xs text-gray-400">
        Share your training methodology and how you help clients achieve results
      </p>
    </motion.div>

    {/* Education Section */}
    <motion.h3
      variants={fadeInUp}
      className="mb-4 mt-8 bg-gradient-to-r from-[#FF7800] to-white bg-clip-text text-lg font-medium text-transparent"
    >
      Education & Background
    </motion.h3>

    <motion.div variants={fadeInUp}>
      <motion.ul className="mb-6 space-y-3" variants={staggerItems}>
        {trainerData.education.map((edu, index) => (
          <motion.li
            key={index}
            variants={listItemVariants}
            className="group flex items-center gap-3 rounded-xl border border-[#333] bg-[rgba(26,26,26,0.8)] px-4 py-3 transition-all duration-300 hover:border-[#FF7800]/40 hover:bg-[rgba(30,30,30,0.8)]"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(255,120,0,0.15)] text-[#FF7800] transition-transform duration-300 group-hover:scale-110">
              <Icon icon="lucide:graduation-cap" width={18} />
            </div>
            <span className="flex-1 font-medium text-white">{edu}</span>
            <Button
              type="button"
              onClick={() => removeEducation(index)}
              className="rounded-full p-2 text-gray-400 opacity-0 transition-all duration-300 hover:bg-[#333] hover:text-white group-hover:opacity-100"
              aria-label={`Remove education: ${edu}`}
              variant="ghost"
              size="small"
              leftIcon={<Icon icon="lucide:trash-2" width={16} />}
            />
          </motion.li>
        ))}
      </motion.ul>

      <div className="relative">
        <div className="flex gap-2">
          <FormField
            name="newEducation"
            value={newEducation}
            onChange={(e) => setNewEducation(e.target.value)}
            placeholder="Add degree or certification with institution"
            className="mb-0 flex-1"
            backgroundStyle="semi-transparent"
          />
          <Button
            type="button"
            variant="orangeFilled"
            onClick={addEducation}
            disabled={!newEducation.trim()}
            className="group overflow-hidden transition-all duration-300"
            leftIcon={
              <Icon
                icon="lucide:plus"
                width={16}
                className="transition-transform duration-300 group-hover:rotate-90"
              />
            }
          >
            Add
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#FF7800]/5 via-[#FF7800]/20 to-[#FF7800]/5"></div>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Example: "Bachelor's in Exercise Science, University of California"
      </p>
    </motion.div>
  </motion.div>
);
