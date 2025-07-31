import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { Button } from "@/components/common";

import { PlanCard } from "./PlanCard";

const PlanSection = ({
  plans = [],
  type = "training",
  containerVariants,
  itemVariants,
  fetchPlans,
}) => {
  const isNutrition = type === "nutrition";
  const iconColor = isNutrition ? "text-green-400" : "text-blue-400";
  const iconBgColor = isNutrition ? "bg-green-500/20" : "bg-blue-500/20";
  const router = useRouter();
  const emptyMessage = {
    title: isNutrition ? "No nutrition plans found" : "No training plans found",
    body: isNutrition
      ? "Start creating nutrition plans to help your clients achieve their dietary goals"
      : "Create your first training plan to help clients reach their fitness goals",
  };

  const handleCreatePlan = () => {
    router.push(`/trainer/dashboard/plans/${type}/create?fromTab=${type}`);
  };

  return (
    <motion.div
      key={type}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconBgColor} flex-shrink-0`}>
            <Icon
              icon={isNutrition ? "mdi:food-apple" : "mdi:dumbbell"}
              className={`${iconColor} w-5 h-5`}
            />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {isNutrition ? "Nutrition Plans" : "Training Plans"} ({plans.length})
          </h2>
        </div>
        
        <Button
          onClick={handleCreatePlan}
          variant="orangeFilled"
          className="whitespace-nowrap px-4 sm:px-6 py-2.5 flex items-center gap-2 bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] shadow-lg shadow-[#FF6B00]/25 flex-shrink-0"
        >
          <Icon icon="mdi:plus" className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Create {type === "nutrition" ? "Nutrition" : "Training"} Plan</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-r from-[#1a1a1a] to-[#222] rounded-xl border border-[#333] shadow-lg">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#222] flex items-center justify-center">
            <Icon
              icon={isNutrition ? "mdi:food-apple" : "mdi:dumbbell"}
              className={`${iconColor} w-8 h-8`}
            />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {emptyMessage.title}
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            {emptyMessage.body}
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-3 sm:gap-4"
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
                onDelete={fetchPlans}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default PlanSection;
