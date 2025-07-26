"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

import { Card, Button } from "@/components/common";
import {
  NutritionPlanIcon,
  PlanManagementIcon,
  TrainingPlanIcon,
  UsersIcon,
} from "@/components/common/Icons";
import {
  CreatePlanCard,
  TabsComponent,
  PlanSection,
} from "@/components/custom/dashboard/trainer/pages/plans/components";

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

const VALID_PLAN_TYPES = ["training", "nutrition"];

const PlanManagementPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab =
    searchParams.get("fromTab") === "nutrition" ||
    searchParams.get("fromTab") === "training"
      ? searchParams.get("fromTab")
      : "training";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refactored fetchPlans function
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      // Only send type param if training or nutrition
      const typeParam = VALID_PLAN_TYPES.includes(activeTab)
        ? `?type=${activeTab}`
        : "";
      const response = await fetch(
        `/api/users/trainer/plans${typeParam}${typeParam ? "&" : "?"}basic=true`
      );
      if (!response.ok) throw new Error("Failed to fetch plans");
      const data = await response.json();
      setPlans(data);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // Fetch plans from API on mount and when activeTab changes
  useEffect(() => {
    fetchPlans();
  }, [activeTab, fetchPlans]);

  // Filter plans based on active tab
  const filteredPlans = plans.filter((plan) => {
    if (activeTab === "training") {
      return plan.type === "training";
    } else if (activeTab === "nutrition") {
      return plan.type === "nutrition";
    }
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
        // Sort by clientCount in descending order, defaulting to zero if undefined or null
        return (b.clientCount || 0) - (a.clientCount || 0);
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

  useEffect(() => {
    if (searchParams.get("refresh") === "1") {
      fetchPlans();
      // Clear refresh param from URL
      const params = new URLSearchParams(window.location.search);
      params.delete("refresh");
      router.replace(`${window.location.pathname}?${params}`, {
        scroll: false,
      });
    }
  }, [searchParams, fetchPlans, router]);

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
            <div className="flex bg-[#1a1a1a] border border-[#333] rounded-xl p-1">
              <button
                type="button"
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
        </motion.div>

        {/* Enhanced Create Plan Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-gradient-to-r from-[#1a1a1a] via-[#222] to-[#1a1a1a] rounded-2xl border border-[#333] p-6 shadow-xl backdrop-blur-sm relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/5 to-purple-500/5 opacity-50" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FF6B00]/10 to-transparent rounded-bl-full" />

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
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          {/* Static All Plans Label as Button */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/25"
            tabIndex={-1}
            aria-disabled="true"
          >
            <Icon icon="mdi:view-grid-outline" className="w-4 h-4" />
            <span className="text-sm font-medium">All Plans</span>
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
                <Button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-[#FF6B00] text-white rounded-xl hover:bg-[#FF6B00]/90 transition-colors"
                  type="button"
                >
                  Try Again
                </Button>
              </div>
            </motion.div>
          ) : activeTab === "nutrition" ? (
            <PlanSection
              plans={filteredPlans}
              type="nutrition"
              icon={NutritionPlanIcon}
              iconBgColor="bg-green-500/20"
              emptyMessage={{
                title: "No nutrition plans found",
                body: "Start creating nutrition plans to help your clients achieve their dietary goals",
              }}
              viewMode={viewMode}
              containerVariants={containerVariants}
              itemVariants={itemVariants}
              fetchPlans={fetchPlans}
            />
          ) : (
            <PlanSection
              plans={filteredPlans}
              type="training"
              icon={TrainingPlanIcon}
              iconBgColor="bg-blue-500/20"
              emptyMessage={{
                title: "No training plans found",
                body: "Create your first training plan to help clients reach their fitness goals",
              }}
              viewMode={viewMode}
              containerVariants={containerVariants}
              itemVariants={itemVariants}
              fetchPlans={fetchPlans}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default PlanManagementPage;
