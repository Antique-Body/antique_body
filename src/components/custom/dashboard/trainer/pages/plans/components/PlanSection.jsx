import { motion } from "framer-motion";
import PropTypes from "prop-types";

import { PlanCard } from ".";

const PlanSection = ({
  plans = [],
  type = "training",
  icon: Icon,
  iconBgColor = "bg-blue-500/20",
  emptyMessage = {},
  viewMode = "grid",
  containerVariants,
  itemVariants,
  fetchPlans,
}) => (
  <motion.div
    key={type}
    initial={{ opacity: 0, x: type === "nutrition" ? -20 : 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: type === "nutrition" ? 20 : -20 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-2 rounded-lg ${iconBgColor}`}>
        <Icon
          size={20}
          className={type === "nutrition" ? "text-green-400" : "text-blue-400"}
        />
      </div>
      <h2 className="text-xl font-bold text-white">
        {type === "nutrition" ? "Nutrition Plans" : "Training Plans"} (
        {plans.length})
      </h2>
    </div>
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid gap-4 ${
        viewMode === "grid" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
      }`}
    >
      {plans.map((plan, idx) => (
        <motion.div key={plan.id} variants={itemVariants}>
          <PlanCard
            id={plan.id}
            title={plan.title}
            description={plan.description}
            coverImage={plan.coverImage}
            createdAt={plan.createdAt}
            type={type}
            duration={
              plan.duration
                ? `${plan.duration} ${plan.durationType || "weeks"}`
                : "Not specified"
            }
            clientCount={plan.clientCount || 0}
            price={plan.price}
            editUrl={`/trainer/dashboard/plans/${plan.type}/edit/${plan.id}`}
            weeklySchedule={plan.weeklySchedule}
            index={idx}
            viewMode={viewMode}
            onDelete={fetchPlans}
          />
        </motion.div>
      ))}
      {plans.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="col-span-full bg-gradient-to-r from-[#1a1a1a] to-[#222] rounded-2xl border border-[#333] p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#222] flex items-center justify-center">
            <Icon size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {emptyMessage.title}
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            {emptyMessage.body}
          </p>
        </motion.div>
      )}
    </motion.div>
  </motion.div>
);

PlanSection.propTypes = {
  plans: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  iconBgColor: PropTypes.string,
  emptyMessage: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.string,
  }),
  viewMode: PropTypes.string,
  containerVariants: PropTypes.object,
  itemVariants: PropTypes.object,
  onDelete: PropTypes.func,
  fetchPlans: PropTypes.func,
};

export default PlanSection;
