import { motion } from "framer-motion";

export const StatsTab = ({ averageRating, successRate, testimonial }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
          <h4 className="text-white font-medium mb-2">Average Rating</h4>
          <p className="text-[#FF6B00] text-2xl font-bold">
            {averageRating || "N/A"}
          </p>
        </div>
        <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
          <h4 className="text-white font-medium mb-2">Success Rate</h4>
          <p className="text-[#FF6B00] text-2xl font-bold">
            {successRate || "N/A"}
          </p>
        </div>
        <div className="bg-[#1A1A1A] rounded-lg border border-[#333] p-5">
          <h4 className="text-white font-medium mb-2">Testimonial</h4>
          <p className="text-gray-300">
            {testimonial || "No testimonial available."}
          </p>
        </div>
      </div>
    </div>
  </motion.div>
);
