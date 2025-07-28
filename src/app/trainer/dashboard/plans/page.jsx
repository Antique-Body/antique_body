"use client";

import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

import { Button } from "@/components/common";
import {
  TabsComponent,
  PlanSection,
} from "@/components/custom/dashboard/trainer/pages/plans/components";

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

  // Sort plans by newest first (default)
  const sortedPlans = [...filteredPlans].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

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
    <div className="px-4 py-5 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="mb-8 relative pb-2">
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            Plan Management
          </h1>
          <p className="text-zinc-400 max-w-2xl">
            Create, manage, and track your training & nutrition plans
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] p-4 rounded-xl border border-[#333] shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Plans</p>
                <p className="text-2xl font-bold text-white">{plans.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#FF6B00]/10 flex items-center justify-center">
                <Icon
                  icon="mdi:file-document-outline"
                  className="text-[#FF6B00] w-5 h-5"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] p-4 rounded-xl border border-[#333] shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Active Clients</p>
                <p className="text-2xl font-bold text-white">{totalClients}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Icon
                  icon="mdi:account-group"
                  className="text-green-400 w-5 h-5"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#1a1a1a] to-[#222] p-4 rounded-xl border border-[#333] shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-white">
                  ${totalEarnings}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Icon
                  icon="mdi:currency-usd"
                  className="text-purple-400 w-5 h-5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs with Create Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex-grow w-full md:w-auto">
            <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
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
              <p className="text-red-400 mb-4">Failed to load plans: {error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] text-white rounded-md hover:from-[#FF5500] hover:to-[#FF7700] transition-colors shadow-lg shadow-[#FF6B00]/25"
                type="button"
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        ) : (
          <PlanSection
            plans={filteredPlans}
            type={activeTab}
            fetchPlans={fetchPlans}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanManagementPage;
