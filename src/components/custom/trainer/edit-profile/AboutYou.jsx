import { motion } from "framer-motion";

import { Button } from "@/components/common/Button";
import { EducationIcon, TrashIcon } from "@/components/common/Icons";
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
    <motion.h2
      variants={fadeInUp}
      className="bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] bg-clip-text text-xl font-semibold text-transparent"
    >
      About You
    </motion.h2>

    <motion.div variants={fadeInUp}>
      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={trainerData.description}
        onChange={handleChange}
        placeholder="Describe your background and experience..."
        rows={5}
      />
      <p className="mt-1 text-xs text-gray-400">
        Tell clients about your background, specialties, and what makes you unique as a trainer (250-300 words
        recommended)
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
      />
      <p className="mt-1 text-xs text-gray-400">
        Share your training methodology and how you help clients achieve results
      </p>
    </motion.div>

    {/* Education Section */}
    <motion.div variants={fadeInUp}>
      <h3 className="mb-3 text-lg font-medium">Education & Background</h3>

      <ul className="mb-4 space-y-2">
        {trainerData.education.map((edu, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 rounded-lg border border-[#333] bg-[rgba(30,30,30,0.5)] p-2 transition-all duration-200 hover:border-[#444] hover:bg-[rgba(40,40,40,0.5)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] p-2 text-[#FF6B00]">
              <EducationIcon size={18} />
            </div>
            <span className="flex-1 font-medium">{edu}</span>
            <Button
              type="button"
              onClick={() => removeEducation(index)}
              className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-[#333] hover:text-white"
              variant="ghost"
              size="small"
              leftIcon={<TrashIcon size={16} />}
            />
          </motion.li>
        ))}
      </ul>

      <div className="rounded-lg border border-[#333] bg-[#1A1A1A] p-4">
        <h4 className="mb-2 text-sm font-medium text-gray-300">Add New Education</h4>
        <div className="flex gap-2">
          <FormField
            name="newEducation"
            value={newEducation}
            onChange={e => setNewEducation(e.target.value)}
            placeholder="Add degree or certification with institution"
            className="mb-0 flex-1"
          />
          <Button
            type="button"
            variant="orangeOutline"
            onClick={addEducation}
            disabled={!newEducation.trim()}
            className="transition-all duration-300 hover:shadow-md hover:shadow-orange-900/10"
          >
            Add
          </Button>
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Example: "Bachelor's in Exercise Science, University of California"
        </p>
      </div>
    </motion.div>
  </motion.div>
);
