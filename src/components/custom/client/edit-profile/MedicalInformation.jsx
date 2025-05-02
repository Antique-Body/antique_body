import { motion } from "framer-motion";

import { Button } from "@/components/common/Button";
import { AlertIcon, InjuryIcon, MedicalIcon, PlusIcon, TrashIcon } from "@/components/common/Icons";
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

export const MedicalInformation = ({
  clientData,
  newCondition,
  setNewCondition,
  addCondition,
  removeCondition,
  newAllergy,
  setNewAllergy,
  addAllergy,
  removeAllergy,
  newInjury,
  setNewInjury,
  addInjury,
  removeInjury
}) => (
  <motion.div
    className="space-y-6 border-t border-[#333] pt-8"
    variants={staggerItems}
    initial="hidden"
    animate="visible"
  >
    <SectionTitle title="Medical Information" />
    
    {/* Medical Conditions Section */}
    <motion.div variants={fadeInUp}>
      <div className="mb-3 flex items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800]">
          <MedicalIcon size={18} />
        </div>
        <h3 className="ml-3 text-lg font-medium text-white">Medical Conditions</h3>
        <div className="ml-2 rounded-full bg-[#FF7800]/20 px-2 py-0.5 text-xs text-[#FF9A00]">
          {clientData.medicalConditions.length} conditions
        </div>
      </div>

      <motion.ul className="mb-6 space-y-3" variants={staggerItems}>
        {clientData.medicalConditions.map((condition) => (
          <motion.li
            key={condition}
            variants={listItemVariants}
            className="group flex items-center gap-3 rounded-xl border border-[#333] bg-[rgba(26,26,26,0.8)] px-4 py-3 transition-all duration-300 hover:border-[#FF7800]/40 hover:bg-[rgba(30,30,30,0.8)]"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800] transition-transform duration-300 group-hover:scale-110">
              <MedicalIcon size={18} />
            </div>
            <span className="flex-1 font-medium text-white">{condition}</span>
            <Button
              type="button"
              onClick={() => removeCondition(condition)}
              className="rounded-full p-2 text-gray-400 opacity-0 transition-all duration-300 hover:bg-[#333] hover:text-white group-hover:opacity-100"
              aria-label={`Remove condition: ${condition}`}
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
            name="newCondition"
            value={newCondition}
            onChange={e => setNewCondition(e.target.value)}
            placeholder="Add a medical condition"
            className="!mb-0 flex-1"
            backgroundStyle="semi-transparent"
          />
          <Button
            type="button"
            variant="compactOrange"
            size="compact"
            className="mt-3"
            onClick={addCondition}
            disabled={!newCondition.trim()}
            leftIcon={<PlusIcon size={14} />}
          >
            Add
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#FF7800]/5 via-[#FF7800]/20 to-[#FF7800]/5"></div>
      </div>
    </motion.div>

    {/* Allergies Section */}
    <motion.div variants={fadeInUp}>
      <div className="mb-3 flex items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800]">
          <AlertIcon size={18} />
        </div>
        <h3 className="ml-3 text-lg font-medium text-white">Allergies</h3>
        <div className="ml-2 rounded-full bg-[#FF7800]/20 px-2 py-0.5 text-xs text-[#FF9A00]">
          {clientData.allergies.length} allergies
        </div>
      </div>

      <motion.ul className="mb-6 space-y-3" variants={staggerItems}>
        {clientData.allergies.map((allergy) => (
          <motion.li
            key={allergy}
            variants={listItemVariants}
            className="group flex items-center gap-3 rounded-xl border border-[#333] bg-[rgba(26,26,26,0.8)] px-4 py-3 transition-all duration-300 hover:border-[#FF7800]/40 hover:bg-[rgba(30,30,30,0.8)]"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800] transition-transform duration-300 group-hover:scale-110">
              <AlertIcon size={18} />
            </div>
            <span className="flex-1 font-medium text-white">{allergy}</span>
            <Button
              type="button"
              onClick={() => removeAllergy(allergy)}
              className="rounded-full p-2 text-gray-400 opacity-0 transition-all duration-300 hover:bg-[#333] hover:text-white group-hover:opacity-100"
              aria-label={`Remove allergy: ${allergy}`}
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
            name="newAllergy"
            value={newAllergy}
            onChange={e => setNewAllergy(e.target.value)}
            placeholder="Add an allergy"
            className="!mb-0 flex-1"
            backgroundStyle="semi-transparent"
          />
          <Button
            type="button"
            variant="compactOrange"
            size="compact"
            className="mt-3"
            onClick={addAllergy}
            disabled={!newAllergy.trim()}
            leftIcon={<PlusIcon size={14} />}
          >
            Add
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#FF7800]/5 via-[#FF7800]/20 to-[#FF7800]/5"></div>
      </div>
    </motion.div>

    {/* Injuries Section */}
    <motion.div variants={fadeInUp}>
      <div className="mb-3 flex items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800]">
          <InjuryIcon size={18} />
        </div>
        <h3 className="ml-3 text-lg font-medium text-white">Injuries & Limitations</h3>
        <div className="ml-2 rounded-full bg-[#FF7800]/20 px-2 py-0.5 text-xs text-[#FF9A00]">
          {clientData.injuries.length} injuries
        </div>
      </div>

      <motion.ul className="mb-6 space-y-3" variants={staggerItems}>
        {clientData.injuries.map((injury) => (
          <motion.li
            key={injury}
            variants={listItemVariants}
            className="group flex items-center gap-3 rounded-xl border border-[#333] bg-[rgba(26,26,26,0.8)] px-4 py-3 transition-all duration-300 hover:border-[#FF7800]/40 hover:bg-[rgba(30,30,30,0.8)]"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800] transition-transform duration-300 group-hover:scale-110">
              <InjuryIcon size={18} />
            </div>
            <span className="flex-1 font-medium text-white">{injury}</span>
            <Button
              type="button"
              onClick={() => removeInjury(injury)}
              className="rounded-full p-2 text-gray-400 opacity-0 transition-all duration-300 hover:bg-[#333] hover:text-white group-hover:opacity-100"
              aria-label={`Remove injury: ${injury}`}
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
            name="newInjury"
            value={newInjury}
            onChange={e => setNewInjury(e.target.value)}
            placeholder="Add an injury or physical limitation"
            className="!mb-0 flex-1"
            backgroundStyle="semi-transparent"
          />
          <Button
            type="button"
            variant="compactOrange"
            className="mt-3"
            size="compact"
            onClick={addInjury}
            disabled={!newInjury.trim()}
            leftIcon={<PlusIcon size={14} />}
          >
            Add
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-[#FF7800]/5 via-[#FF7800]/20 to-[#FF7800]/5"></div>
      </div>
    </motion.div>

    {/* Health Tips */}
    <motion.div variants={fadeInUp}>
      <div className="mt-6 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a]/50 p-4">
        <h4 className="mb-2 text-sm font-medium text-white">Health & Safety Tips</h4>
        <p className="text-sm text-gray-300">
          Providing accurate medical information helps your trainers create safer workout plans tailored to your needs.
          Always consult with a healthcare professional before starting any new fitness program, especially if you have
          pre-existing medical conditions.
        </p>
      </div>
    </motion.div>
  </motion.div>
);
