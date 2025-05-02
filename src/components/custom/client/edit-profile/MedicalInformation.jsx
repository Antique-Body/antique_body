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
  removeInjury,
}) => (
  <motion.div
    className="space-y-6 border-t border-[#333] pt-8"
    variants={staggerItems}
    initial="hidden"
    animate="visible"
  >
    <SectionTitle title="Medical Information" />

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Medical Conditions */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col overflow-hidden rounded-xl bg-[rgba(30,30,30,0.6)] p-0.5 backdrop-blur-md"
      >
        <div className="h-full w-full rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-5">
          <div className="mb-4 flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800]">
              <MedicalIcon size={18} />
            </div>
            <h3 className="ml-3 text-lg font-medium text-[#FF9A00]">Medical Conditions</h3>
          </div>

          {clientData.medicalConditions.length > 0 ? (
            <motion.ul className="mb-4 space-y-2" variants={staggerItems}>
              {clientData.medicalConditions.map(condition => (
                <motion.li
                  key={condition}
                  variants={listItemVariants}
                  className="group flex items-center gap-2 rounded-lg border border-[#333] bg-[rgba(26,26,26,0.8)] px-3 py-2 transition-all duration-300 hover:border-[#FF7800]/40 hover:bg-[rgba(30,30,30,0.8)]"
                >
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800]">
                    <MedicalIcon size={14} />
                  </div>
                  <span className="flex-1 text-sm font-medium text-white">{condition}</span>
                  <Button
                    type="button"
                    onClick={() => removeCondition(condition)}
                    className="rounded-full p-1.5 text-gray-400 opacity-0 transition-all duration-300 hover:bg-[#333] hover:text-white group-hover:opacity-100"
                    aria-label={`Remove condition: ${condition}`}
                    variant="ghost"
                    size="small"
                    leftIcon={<TrashIcon size={14} />}
                  />
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <div className="mb-4 rounded-lg border border-dashed border-gray-700 bg-[#1a1a1a]/50 p-3 text-center text-sm text-gray-400">
              No medical conditions added
            </div>
          )}

          <div className="relative mt-auto">
            <div className="flex gap-2">
              <FormField
                name="newCondition"
                value={newCondition}
                onChange={e => setNewCondition(e.target.value)}
                placeholder="Add medical condition"
                className="mb-0 flex-1"
                backgroundStyle="semi-transparent"
              />
              <Button
                type="button"
                variant="orangeFilled"
                size="sm"
                onClick={addCondition}
                disabled={!newCondition.trim()}
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

      {/* Allergies */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col overflow-hidden rounded-xl bg-[rgba(30,30,30,0.6)] p-0.5 backdrop-blur-md"
      >
        <div className="h-full w-full rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-5">
          <div className="mb-4 flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800]">
              <AlertIcon size={18} />
            </div>
            <h3 className="ml-3 text-lg font-medium text-[#FF9A00]">Allergies</h3>
          </div>

          {clientData.allergies.length > 0 ? (
            <motion.ul className="mb-4 space-y-2" variants={staggerItems}>
              {clientData.allergies.map(allergy => (
                <motion.li
                  key={allergy}
                  variants={listItemVariants}
                  className="group flex items-center gap-2 rounded-lg border border-[#333] bg-[rgba(26,26,26,0.8)] px-3 py-2 transition-all duration-300 hover:border-[#FF7800]/40 hover:bg-[rgba(30,30,30,0.8)]"
                >
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800]">
                    <AlertIcon size={14} />
                  </div>
                  <span className="flex-1 text-sm font-medium text-white">{allergy}</span>
                  <Button
                    type="button"
                    onClick={() => removeAllergy(allergy)}
                    className="rounded-full p-1.5 text-gray-400 opacity-0 transition-all duration-300 hover:bg-[#333] hover:text-white group-hover:opacity-100"
                    aria-label={`Remove allergy: ${allergy}`}
                    variant="ghost"
                    size="small"
                    leftIcon={<TrashIcon size={14} />}
                  />
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <div className="mb-4 rounded-lg border border-dashed border-gray-700 bg-[#1a1a1a]/50 p-3 text-center text-sm text-gray-400">
              No allergies added
            </div>
          )}

          <div className="relative mt-auto">
            <div className="flex gap-2">
              <FormField
                name="newAllergy"
                value={newAllergy}
                onChange={e => setNewAllergy(e.target.value)}
                placeholder="Add allergy"
                className="mb-0 flex-1"
                backgroundStyle="semi-transparent"
              />
              <Button
                type="button"
                variant="orangeFilled"
                size="sm"
                onClick={addAllergy}
                disabled={!newAllergy.trim()}
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

      {/* Injuries */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col overflow-hidden rounded-xl bg-[rgba(30,30,30,0.6)] p-0.5 backdrop-blur-md"
      >
        <div className="h-full w-full rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-5">
          <div className="mb-4 flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800]">
              <InjuryIcon size={18} />
            </div>
            <h3 className="ml-3 text-lg font-medium text-[#FF9A00]">Injuries</h3>
          </div>

          {clientData.injuries.length > 0 ? (
            <motion.ul className="mb-4 space-y-2" variants={staggerItems}>
              {clientData.injuries.map(injury => (
                <motion.li
                  key={injury}
                  variants={listItemVariants}
                  className="group flex items-center gap-2 rounded-lg border border-[#333] bg-[rgba(26,26,26,0.8)] px-3 py-2 transition-all duration-300 hover:border-[#FF7800]/40 hover:bg-[rgba(30,30,30,0.8)]"
                >
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] text-[#FF7800]">
                    <InjuryIcon size={14} />
                  </div>
                  <span className="flex-1 text-sm font-medium text-white">{injury}</span>
                  <Button
                    type="button"
                    onClick={() => removeInjury(injury)}
                    className="rounded-full p-1.5 text-gray-400 opacity-0 transition-all duration-300 hover:bg-[#333] hover:text-white group-hover:opacity-100"
                    aria-label={`Remove injury: ${injury}`}
                    variant="ghost"
                    size="small"
                    leftIcon={<TrashIcon size={14} />}
                  />
                </motion.li>
              ))}
            </motion.ul>
          ) : (
            <div className="mb-4 rounded-lg border border-dashed border-gray-700 bg-[#1a1a1a]/50 p-3 text-center text-sm text-gray-400">
              No injuries added
            </div>
          )}

          <div className="relative mt-auto">
            <div className="flex gap-2">
              <FormField
                name="newInjury"
                value={newInjury}
                onChange={e => setNewInjury(e.target.value)}
                placeholder="Add injury"
                className="mb-0 flex-1"
                backgroundStyle="semi-transparent"
              />
              <Button
                type="button"
                variant="orangeFilled"
                size="sm"
                onClick={addInjury}
                disabled={!newInjury.trim()}
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
          <MedicalIcon size={12} />
        </div>
        <div className="text-sm font-medium text-white">Medical Information Privacy</div>
      </div>
      <p className="text-sm text-gray-300">
        This information is confidential and will only be used by your trainer to create a safe and effective fitness
        program. You can update or remove this information at any time.
      </p>
    </motion.div>
  </motion.div>
);
