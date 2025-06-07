import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { FormField } from "@/components/common";
import { Button } from "@/components/common/Button";
import { SectionTitle } from "@/components/custom/dashboard/shared";

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

export const ServicesOffered = ({
  trainerData,
  newService,
  setNewService,
  addService,
  removeService,
}) => (
  <motion.div
    variants={staggerItems}
    initial="hidden"
    animate="visible"
    className="space-y-6 border-t border-[#333] pt-8"
  >
    <SectionTitle title="Services Offered" />

    <motion.div
      variants={fadeInUp}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      {trainerData.services.map((service, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          whileHover="hover"
          className="group relative rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-5 shadow-lg transition-all duration-300 hover:border-[#FF7800]/40 hover:shadow-orange-500/20"
        >
          <Button
            type="button"
            onClick={() => removeService(index)}
            className="absolute right-3 top-3 rounded-full p-1.5 text-gray-400 opacity-80 transition-all duration-300 hover:bg-[rgba(255,120,0,0.3)] hover:text-white group-hover:opacity-100"
            variant="ghost"
            size="small"
            leftIcon={<Icon icon="lucide:trash-2" width={16} />}
          />
          <div className="mb-3 flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(255,120,0,0.15)]">
              <Icon
                icon="lucide:settings"
                width={20}
                className="text-[#FF7800]"
              />
            </div>
            <h5 className="ml-3 font-semibold text-white">{service.name}</h5>
          </div>
          <p className="text-gray-300">{service.description}</p>
        </motion.div>
      ))}
    </motion.div>

    <motion.h3
      variants={fadeInUp}
      className="mb-4 mt-8 bg-gradient-to-r from-[#FF7800] to-white bg-clip-text text-lg font-medium text-transparent"
    >
      Add New Service
    </motion.h3>

    <motion.div
      variants={fadeInUp}
      className="overflow-hidden rounded-xl bg-[rgba(30,30,30,0.6)] p-0.5 backdrop-blur-md"
    >
      <div className="w-full rounded-lg border border-[rgba(255,120,0,0.3)] bg-[rgba(255,120,0,0.1)] p-5">
        <div className="grid grid-cols-1 gap-4">
          <FormField
            label="Service Name"
            name="newServiceName"
            value={newService.name}
            onChange={(e) =>
              setNewService({ ...newService, name: e.target.value })
            }
            placeholder="e.g. Personal Training"
            backgroundStyle="darker"
          />

          <FormField
            label="Description"
            name="newServiceDescription"
            type="textarea"
            value={newService.description}
            onChange={(e) =>
              setNewService({ ...newService, description: e.target.value })
            }
            placeholder="Describe what this service includes, its benefits, and any other relevant details..."
            rows={3}
            backgroundStyle="darker"
          />

          <div className="flex flex-col space-y-3">
            <Button
              type="button"
              variant="orangeFilled"
              onClick={addService}
              disabled={
                !newService.name.trim() || !newService.description.trim()
              }
              className="ml-auto group overflow-hidden transition-all duration-300"
              leftIcon={
                <Icon
                  icon="lucide:plus"
                  width={16}
                  className="transition-transform duration-300 group-hover:rotate-90"
                />
              }
            >
              Add Service
            </Button>
            <p className="text-xs text-gray-400">
              Clear, detailed service descriptions help attract the right
              clients for your business
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);
