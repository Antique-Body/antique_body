import { motion } from "framer-motion";

// Animation variants for the section title
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

export const SectionTitle = ({ title, className = "" }) => (
  <motion.div
    variants={fadeInUp}
    className={`flex items-center justify-between ${className}`}
  >
    <h2 className="bg-gradient-to-r from-[#FF7800] to-[#FF9A00] bg-clip-text text-xl font-semibold text-transparent">
      {title}
    </h2>
    <div className="ml-4 h-px flex-1 bg-gradient-to-r from-[#FF7800]/50 to-transparent"></div>
  </motion.div>
);
