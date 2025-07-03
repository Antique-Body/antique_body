"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Card } from "@/components/common";
import { FormField } from "@/components/common/FormField";
import {
  NutritionPlanIcon,
  PlanManagementIcon,
  TrainingPlanIcon,
  UsersIcon,
} from "@/components/common/Icons";
import {
  CreatePlanCard,
  PlanCard,
  TabsComponent,
} from "@/components/custom/dashboard/trainer/pages/plans/components";

const PLAN_FILTERS = [
  { id: "all", label: "All Plans", icon: "mdi:view-grid-outline" },
  { id: "active", label: "Active", icon: "mdi:play-circle-outline" },
  { id: "draft", label: "Drafts", icon: "mdi:file-document-edit-outline" },
  { id: "archived", label: "Archived", icon: "mdi:archive-outline" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest First", icon: "mdi:sort-calendar-descending" },
  { id: "oldest", label: "Oldest First", icon: "mdi:sort-calendar-ascending" },
  { id: "popular", label: "Most Popular", icon: "mdi:star-outline" },
  {
    id: "alphabetical",
    label: "A to Z",
    icon: "mdi:sort-alphabetical-ascending",
  },
];

const PlanManagementPage = () => {
  const [activeTab, setActiveTab] = useState("training");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refactored fetchPlans function
  const fetchPlans = async () => {
    try {
      setLoading(true);
      // Only send type param if training or nutrition
      const typeParam = ["training", "nutrition"].includes(activeTab)
        ? `?type=${activeTab}`
        : "";
      const response = await fetch(`/api/users/trainer/plans${typeParam}`);
      if (!response.ok) throw new Error("Failed to fetch plans");
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error("Error fetching plans:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch plans from API on mount and when activeTab changes
  useEffect(() => {
    fetchPlans();
  }, [activeTab]);

  // Filter plans based on active tab and search query
  const filteredPlans = plans
    .filter((plan) => {
      if (activeTab === "training") {
        return plan.type === "training";
      } else if (activeTab === "nutrition") {
        return plan.type === "nutrition";
      }
      return true;
    })
    .filter((plan) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          plan.title.toLowerCase().includes(query) ||
          plan.description.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((plan) => {
      if (activeFilter === "active") return plan.isActive && plan.isPublished;
      if (activeFilter === "draft") return !plan.isPublished;
      if (activeFilter === "archived") return !plan.isActive;
      return true;
    });

  // Sort plans
  const sortedPlans = [...filteredPlans].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "popular":
        // For now, sort by price as a placeholder for popularity
        return (b.price || 0) - (a.price || 0);
      default:
        return 0;
    }
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const currentPlans = sortedPlans;
  const totalEarnings = currentPlans.reduce(
    (sum, plan) => sum + (plan.price || 0),
    0
  );
  const totalClients = currentPlans.reduce(
    (sum, plan) => sum + (plan.clientCount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a]">
      <main className="py-6 sm:py-8 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Title Section */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] shadow-lg shadow-[#FF6B00]/25">
                <PlanManagementIcon className="text-white w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  Plan Management
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Create, manage, and track your training & nutrition plans
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-80">
                <Icon
                  icon="mdi:magnify"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                />

                <FormField
                  type="text"
                  placeholder="Search plans by name, description, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className=""
                  prefixIcon={
                    <Icon
                      icon="mdi:magnify"
                      className="w-5 h-5 text-[#FF7800]"
                    />
                  }
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-[#1a1a1a] border border-[#333] rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-[#FF6B00] text-white shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon icon="mdi:view-grid-outline" className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-[#FF6B00] text-white shadow-sm"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon icon="mdi:view-list-outline" className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">List</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Create Plan Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-gradient-to-r from-[#1a1a1a] via-[#222] to-[#1a1a1a] rounded-2xl border border-[#333] p-6 shadow-xl backdrop-blur-sm relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/5 to-purple-500/5 opacity-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FF6B00]/10 to-transparent rounded-bl-full"></div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#FF6B00]/20 to-purple-500/20">
                <Icon
                  icon="mdi:plus-circle"
                  className="w-6 h-6 text-[#FF6B00]"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Create New Plan
                </h2>
                <p className="text-gray-400 text-sm">
                  Build powerful training or nutrition plans for your clients
                </p>
              </div>
            </div>

            <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="mt-6">
              <CreatePlanCard type={activeTab} />
            </div>
          </div>
        </motion.div>

        {/* Enhanced Dashboard Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card
            variant="dark"
            className="p-6 border border-[#333] hover:border-[#444] transition-all duration-300 bg-gradient-to-r from-[#1a1a1a] to-[#222] group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Total Plans</p>
                <p className="text-2xl font-bold text-white">{plans.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#FF6B00]/20 to-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlanManagementIcon className="text-[#FF6B00] w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card
            variant="dark"
            className="p-6 border border-[#333] hover:border-[#444] transition-all duration-300 bg-gradient-to-r from-[#1a1a1a] to-[#222] group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Active Clients</p>
                <p className="text-2xl font-bold text-white">{totalClients}</p>
                <p className="text-xs text-green-400 mt-1">
                  Currently enrolled
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UsersIcon className="text-emerald-400 w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card
            variant="dark"
            className="p-6 border border-[#333] hover:border-[#444] transition-all duration-300 bg-gradient-to-r from-[#1a1a1a] to-[#222] group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-white">
                  ${totalEarnings}
                </p>
                <p className="text-xs text-purple-400 mt-1">
                  From active plans
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500/20 to-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon
                  icon="mdi:currency-usd"
                  className="text-purple-400 w-6 h-6"
                />
              </div>
            </div>
          </Card>

          <Card
            variant="dark"
            className="p-6 border border-[#333] hover:border-[#444] transition-all duration-300 bg-gradient-to-r from-[#1a1a1a] to-[#222] group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Avg. Rating</p>
                <p className="text-2xl font-bold text-white">4.8</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      icon="mdi:star"
                      className="w-3 h-3 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon
                  icon="mdi:star-outline"
                  className="text-yellow-400 w-6 h-6"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {PLAN_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeFilter === filter.id
                    ? "bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/25"
                    : "bg-[#1a1a1a] border border-[#333] text-gray-400 hover:text-white hover:border-[#444]"
                }`}
              >
                <Icon icon={filter.icon} className="w-4 h-4" />
                <span className="text-sm font-medium">{filter.label}</span>
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-2 pr-10 text-white text-sm focus:outline-none focus:border-[#FF6B00] min-w-[160px]"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon
              icon="mdi:chevron-down"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            />
          </div>
        </motion.div>

        {/* Content sections with enhanced animations */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <div className="text-center">
                <Icon
                  icon="mdi:loading"
                  className="w-8 h-8 text-[#FF6B00] animate-spin mx-auto mb-4"
                />
                <p className="text-gray-400">Loading your plans...</p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <div className="text-center">
                <Icon
                  icon="mdi:alert-circle"
                  className="w-8 h-8 text-red-400 mx-auto mb-4"
                />
                <p className="text-red-400 mb-4">
                  Failed to load plans: {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-[#FF6B00] text-white rounded-xl hover:bg-[#FF6B00]/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          ) : activeTab === "nutrition" ? (
            <motion.div
              key="nutrition"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <NutritionPlanIcon size={20} className="text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Nutrition Plans ({filteredPlans.length})
                </h2>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredPlans.map((plan) => (
                  <motion.div key={plan.id} variants={itemVariants}>
                    <PlanCard
                      id={plan.id}
                      title={plan.title}
                      description={plan.description}
                      coverImage={plan.coverImage}
                      createdAt={plan.createdAt}
                      planType={plan.type}
                      type={plan.type}
                      duration={
                        plan.duration
                          ? `${plan.duration} ${plan.durationType || "weeks"}`
                          : "Not specified"
                      }
                      clientCount={plan.clientCount || 0}
                      price={plan.price}
                      editUrl={`/trainer/dashboard/plans/${plan.type}/edit/${plan.id}`}
                      weeklySchedule={plan.weeklySchedule}
                      index={filteredPlans.indexOf(plan)}
                      viewMode={viewMode}
                      onDelete={fetchPlans}
                    />
                  </motion.div>
                ))}

                {filteredPlans.length === 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="col-span-full bg-gradient-to-r from-[#1a1a1a] to-[#222] rounded-2xl border border-[#333] p-8 text-center"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#222] flex items-center justify-center">
                      <NutritionPlanIcon size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No nutrition plans found
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      Start creating nutrition plans to help your clients
                      achieve their dietary goals
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="training"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <TrainingPlanIcon size={20} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Training Plans ({filteredPlans.length})
                </h2>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredPlans.map((plan) => (
                  <motion.div key={plan.id} variants={itemVariants}>
                    <PlanCard
                      id={plan.id}
                      title={plan.title}
                      description={plan.description}
                      coverImage={plan.coverImage}
                      createdAt={plan.createdAt}
                      planType={plan.type}
                      type={plan.type}
                      duration={
                        plan.duration
                          ? `${plan.duration} ${plan.durationType || "weeks"}`
                          : "Not specified"
                      }
                      clientCount={plan.clientCount || 0}
                      price={plan.price}
                      editUrl={`/trainer/dashboard/plans/${plan.type}/edit/${plan.id}`}
                      weeklySchedule={plan.weeklySchedule}
                      index={filteredPlans.indexOf(plan)}
                      viewMode={viewMode}
                      onDelete={fetchPlans}
                    />
                  </motion.div>
                ))}

                {filteredPlans.length === 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="col-span-full bg-gradient-to-r from-[#1a1a1a] to-[#222] rounded-2xl border border-[#333] p-8 text-center"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#222] flex items-center justify-center">
                      <TrainingPlanIcon size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No training plans found
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      Create your first training plan to help clients reach
                      their fitness goals
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default PlanManagementPage;
