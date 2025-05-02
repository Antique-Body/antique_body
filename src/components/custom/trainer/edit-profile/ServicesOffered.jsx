import { motion } from "framer-motion";

import { Button } from "@/components/common/Button";
import { TrashIcon, SettingsIcon } from "@/components/common/Icons";
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

// Card animation
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  hover: { y: -5, transition: { duration: 0.2 } },
};

export const ServicesOffered = ({ trainerData, newService, setNewService, addService, removeService }) => (
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
      Services Offered
    </motion.h2>

    <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {trainerData.services.map((service, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          whileHover="hover"
          className="group relative rounded-lg border border-[rgba(255,107,0,0.2)] bg-gradient-to-b from-[rgba(255,107,0,0.15)] to-[rgba(255,107,0,0.05)] p-5 shadow-lg transition-all duration-300 hover:border-[rgba(255,107,0,0.3)] hover:shadow-orange-900/10"
        >
          <Button
            type="button"
            onClick={() => removeService(index)}
            className="absolute right-3 top-3 rounded-full p-1.5 text-gray-400 opacity-80 transition-all duration-300 hover:bg-[rgba(255,107,0,0.3)] hover:text-white group-hover:opacity-100"
            variant="ghost"
            size="small"
            leftIcon={<TrashIcon size={16} />}
          />
          <div className="mb-3 flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,107,0,0.2)]">
              <SettingsIcon size={20} className="text-[#FF6B00]" />
            </div>
            <h5 className="ml-3 font-semibold text-white">{service.name}</h5>
          </div>
          <p className="text-gray-300">{service.description}</p>
        </motion.div>
      ))}
    </motion.div>

    <motion.div
      variants={fadeInUp}
      className="rounded-lg border border-[#333] bg-gradient-to-b from-[#1A1A1A] to-[#111] p-5 shadow-lg"
    >
      <h3 className="mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-lg font-medium text-transparent">
        Add New Service
      </h3>

      <div className="grid grid-cols-1 gap-4">
        <FormField
          label="Service Name"
          name="newServiceName"
          value={newService.name}
          onChange={e => setNewService({ ...newService, name: e.target.value })}
          placeholder="e.g. Personal Training"
        />

        <FormField
          label="Description"
          name="newServiceDescription"
          type="textarea"
          value={newService.description}
          onChange={e => setNewService({ ...newService, description: e.target.value })}
          placeholder="Describe what this service includes, its benefits, and any other relevant details..."
          rows={3}
        />

        <div className="flex flex-col space-y-3">
          <Button
            type="button"
            variant="orangeOutline"
            onClick={addService}
            disabled={!newService.name.trim() || !newService.description.trim()}
            className="ml-auto transition-all duration-300 hover:shadow-md hover:shadow-orange-900/10"
          >
            Add Service
          </Button>
          <p className="text-xs text-gray-400">
            Clear, detailed service descriptions help attract the right clients for your business
          </p>
        </div>
      </div>
    </motion.div>
  </motion.div>
);
