"use client";

import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export const TodoStats = ({ stats }) => {
  const statCards = [
    {
      label: "Total Tasks",
      value: stats.total,
      icon: "mdi:format-list-checkbox",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: "mdi:check-circle",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: "mdi:clock",
      color: "from-[#FF6B00] to-[#FF8A00]",
      bgColor: "bg-[#FF6B00]/10",
      borderColor: "border-[#FF6B00]/20",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: "mdi:pause-circle",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      label: "Overdue",
      value: stats.overdue,
      icon: "mdi:alert-circle",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
  ];

  return (
    <div className="mb-8">
      {/* Completion Rate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] border border-gray-700/50 rounded-2xl p-6 mb-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Completion Rate</h3>
          <div className="text-2xl font-bold text-[#FF6B00]">
            {stats.completionRate}%
          </div>
        </div>
        
        <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.completionRate}%` }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] rounded-full"
          />
        </div>
        
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>0%</span>
          <span>100%</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-4 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 bg-gradient-to-r ${stat.color} rounded-lg`}>
                <Icon icon={stat.icon} className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </div>
            
            <div className="text-sm font-medium text-gray-300">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};