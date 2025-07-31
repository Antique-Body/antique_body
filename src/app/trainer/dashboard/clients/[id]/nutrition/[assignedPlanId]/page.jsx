"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

import { Button } from "@/components/common/Button";
import {
  LoadingState,
  ErrorState,
} from "@/components/custom/dashboard/client/pages/diet-tracker";

export default function ClientNutritionTrackingPage({ params }) {
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [assignedPlan, setAssignedPlan] = useState(null);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Unwrap params using React.use() for Next.js 15 compatibility
  const unwrappedParams = React.use(params);
  const { id: clientId, assignedPlanId } = unwrappedParams;

  // Fetch nutrition tracking data for trainer
  const fetchClientNutritionData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch nutrition tracking data using the new trainer-specific endpoint
      const trackingResponse = await fetch(
        `/api/coaching-requests/${clientId}/assigned-nutrition-plan/${assignedPlanId}/tracking`
      );

      if (!trackingResponse.ok) {
        const errorData = await trackingResponse.json();
        throw new Error(errorData.error || "Failed to fetch nutrition tracking data");
      }

      const trackingData = await trackingResponse.json();
      
      if (!trackingData.success) {
        throw new Error(trackingData.error || "Failed to fetch nutrition tracking data");
      }

      const { assignedPlan: planData, client: clientData, dailyLogs: logsData } = trackingData.data;

      setClient({ client: clientData });
      setAssignedPlan(planData);
      setDailyLogs(logsData || []);
    } catch (err) {
      console.error("Error fetching nutrition tracking data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [clientId, assignedPlanId]);


  // Get completion rate helper
  const getCompletionRate = () => {
    if (!assignedPlan || !dailyLogs) return 0;
    
    const totalDays = dailyLogs.length;
    if (totalDays === 0) return 0;
    
    const completedDays = dailyLogs.filter(log => log.isCompleted).length;
    return Math.round((completedDays / totalDays) * 100);
  };

  useEffect(() => {
    fetchClientNutritionData();
  }, [fetchClientNutritionData]);

  // Loading state
  if (loading) {
    return <LoadingState message="Loading nutrition tracking data..." />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={fetchClientNutritionData}
        onBackToClients={() => router.push("/trainer/dashboard/clients")}
      />
    );
  }

  // No data state
  if (!client || !assignedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
        <div className="text-center bg-zinc-900/80 backdrop-blur rounded-2xl p-8 border border-zinc-700/50">
          <Icon
            icon="mdi:food-apple"
            width={48}
            height={48}
            className="text-zinc-400 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-white mb-2">
            Nutrition Plan Not Found
          </h3>
          <p className="text-zinc-400 mb-4">
            The nutrition plan you're looking for doesn't exist or is no longer available.
          </p>
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={() => router.back()} 
              variant="secondary"
            >
              Go Back
            </Button>
            <Button 
              onClick={() => router.push("/trainer/dashboard/clients")} 
              variant="primary"
            >
              View Clients
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const profile = client.client.clientProfile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-zinc-700/50 p-4 sm:p-6 mb-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="secondary"
              onClick={() => router.back()}
              leftIcon={<Icon icon="mdi:arrow-left" width={18} height={18} />}
              className="bg-zinc-800/50 hover:bg-zinc-700/50 backdrop-blur"
              size="small"
            >
              Back
            </Button>
            <div className="h-8 w-px bg-zinc-700"></div>
            <Button
              variant="ghost"
              onClick={() => router.push(`/trainer/dashboard/clients/${clientId}`)}
              leftIcon={<Icon icon="mdi:account" width={18} height={18} />}
              className="text-zinc-400 hover:text-white"
              size="small"
            >
              Client Dashboard
            </Button>
          </div>

          {/* Client & Plan Info */}
          <div className="flex items-center gap-4">
            {profile.profileImage && (
              <div className="relative flex-shrink-0">
                <Image
                  src={profile.profileImage}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full border-2 border-zinc-600/50 shadow-lg"
                  width={64}
                  height={64}
                />
                <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-zinc-900">
                  <Icon
                    icon="mdi:food-apple"
                    width={8}
                    height={8}
                    className="text-white sm:w-3 sm:h-3"
                  />
                </div>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1">
                {profile.firstName} {profile.lastName}'s Nutrition Progress
              </h1>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-zinc-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Icon
                    icon="mdi:food-apple"
                    width={14}
                    height={14}
                    className="sm:w-4 sm:h-4"
                  />
                  {assignedPlan.nutritionPlan.title}
                </span>
                <span className="flex items-center gap-1">
                  <Icon
                    icon="mdi:calendar"
                    width={14}
                    height={14}
                    className="sm:w-4 sm:h-4"
                  />
                  {assignedPlan.nutritionPlan.duration} {assignedPlan.nutritionPlan.durationType}
                </span>
                <span className="flex items-center gap-1">
                  <Icon
                    icon="mdi:chart-line"
                    width={14}
                    height={14}
                    className="sm:w-4 sm:h-4"
                  />
                  {getCompletionRate()}% Complete
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {assignedPlan.startDate ? (
          <TrainerNutritionView
            assignedPlan={assignedPlan}
            dailyLogs={dailyLogs}
            client={client}
          />
        ) : (
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-zinc-700/50 p-8 sm:p-12 text-center shadow-2xl">
            <Icon
              icon="mdi:food-apple"
              className="text-zinc-600 mx-auto mb-4"
              width={48}
              height={48}
            />
            <h3 className="text-xl font-semibold text-white mb-2">
              Nutrition Plan Not Started
            </h3>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              This client has been assigned a nutrition plan but hasn't started tracking their meals yet.
            </p>
            <div className="bg-zinc-800/50 rounded-lg p-6 max-w-md mx-auto border border-zinc-700/50">
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Plan:</span>
                  <span className="font-medium text-white">{assignedPlan.nutritionPlan.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Assigned:</span>
                  <span className="text-white">{new Date(assignedPlan.assignedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Status:</span>
                  <span className="text-orange-400 capitalize font-medium">{assignedPlan.status}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Trainer-specific Nutrition View Component
function TrainerNutritionView({ assignedPlan, dailyLogs, client }) {
  const [showAllDays, setShowAllDays] = useState(false);
  
  // Get current day number based on start date and plan status
  const getCurrentDay = () => {
    if (!assignedPlan?.startDate) return 1;

    const startDate = new Date(assignedPlan.startDate);
    const today = new Date();
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // If plan is completed, return the last day they completed
    if (assignedPlan.status === "completed") {
      return assignedPlan.totalDays || dailyLogs.length;
    }

    return Math.max(1, Math.min(diffDays + 1, assignedPlan.nutritionPlan.days?.length || 30));
  };

  const currentDay = getCurrentDay();
  const totalPlanDays = assignedPlan.nutritionPlan.duration || 30;
  const planWeeks = Math.ceil(totalPlanDays / 7);
  
  // Set selected day to current day by default
  const [selectedDay, setSelectedDay] = useState(currentDay);

  // Update selected day when currentDay changes
  React.useEffect(() => {
    setSelectedDay(currentDay);
  }, [currentDay]);
  
  // Get daily log for selected day
  const getLogForDay = (dayNumber) => {
    if (!assignedPlan?.startDate || !dailyLogs) return null;

    const startDate = new Date(assignedPlan.startDate);
    const dayDate = new Date(startDate);
    dayDate.setDate(dayDate.getDate() + (dayNumber - 1));
    
    return dailyLogs.find(log => {
      const logDate = new Date(log.date);
      return logDate.toDateString() === dayDate.toDateString();
    });
  };

  // Calculate overall progress
  const getOverallProgress = () => {
    if (!dailyLogs || dailyLogs.length === 0) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = dailyLogs.filter(log => log.isCompleted).length;
    const total = dailyLogs.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  // Get all possible meal types for a day
  const getAllMealTypes = (dayLog) => {
    const allMealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    const mealsInfo = [];
    
    // Get all meal logs for this day
    const mealLogs = dayLog?.mealLogs || [];
    
    allMealTypes.forEach(mealType => {
      const mealLog = mealLogs.find(log => 
        log.mealName && log.mealName.toLowerCase() === mealType.toLowerCase()
      );
      
      mealsInfo.push({
        type: mealType,
        isLogged: mealLog?.isCompleted || false,
        data: mealLog || null
      });
    });
    
    return mealsInfo;
  };

  const progress = getOverallProgress();
  const selectedDayLog = getLogForDay(selectedDay);
  const dayRange = showAllDays ? totalPlanDays : Math.min(currentDay + 7, totalPlanDays);

  // Get plan status information
  const getPlanStatusInfo = () => {
    
    switch (assignedPlan.status) {
      case 'completed':
        return {
          status: 'Completed',
          statusColor: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          icon: 'mdi:check-circle'
        };
      case 'active':
        return {
          status: 'Active',
          statusColor: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
          icon: 'mdi:play-circle'
        };
      case 'abandoned':
        return {
          status: 'Abandoned',
          statusColor: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
          icon: 'mdi:stop-circle'
        };
      default:
        return {
          status: 'Assigned',
          statusColor: 'text-orange-400',
          bgColor: 'bg-orange-500/20',
          borderColor: 'border-orange-500/30',
          icon: 'mdi:clock-outline'
        };
    }
  };

  const statusInfo = getPlanStatusInfo();

  return (
    <div className="space-y-6">
      {/* Plan Status Header */}
      <div className={`bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-zinc-700/50 p-6 shadow-2xl ${statusInfo.borderColor}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${statusInfo.bgColor}`}>
              <Icon icon={statusInfo.icon} className={statusInfo.statusColor} width={24} height={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Plan Status: {statusInfo.status}</h3>
              <p className="text-sm text-zinc-400">
                {assignedPlan.status === 'completed' 
                  ? `Completed on ${new Date(assignedPlan.completedDate).toLocaleDateString()}`
                  : `Started ${new Date(assignedPlan.startDate).toLocaleDateString()}`
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">Day {currentDay}</div>
            <div className="text-sm text-zinc-400">
              of {totalPlanDays} ({planWeeks} weeks)
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-zinc-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              assignedPlan.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${(currentDay / totalPlanDays) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-zinc-500 mt-1">
          <span>Started: {new Date(assignedPlan.startDate).toLocaleDateString()}</span>
          <span>{Math.round((currentDay / totalPlanDays) * 100)}% Progress</span>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-zinc-700/50 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-400">Days Completed</h3>
            <Icon icon="mdi:calendar-check" className="text-green-400" width={20} height={20} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{progress.completed}</div>
          <div className="text-sm text-zinc-500">of {progress.total} days logged</div>
          <div className="mt-3 bg-zinc-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-zinc-700/50 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-400">Avg. Daily Calories</h3>
            <Icon icon="mdi:fire" className="text-orange-400" width={20} height={20} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {dailyLogs && dailyLogs.length > 0 
              ? Math.round(dailyLogs.reduce((sum, log) => sum + log.totalCalories, 0) / dailyLogs.length)
              : 0
            }
          </div>
          <div className="text-sm text-zinc-500">
            Target: {assignedPlan.nutritionPlan.nutritionInfo?.calories || 0} cal
          </div>
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-zinc-700/50 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-400">Avg. Daily Protein</h3>
            <Icon icon="mdi:egg" className="text-blue-400" width={20} height={20} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {dailyLogs && dailyLogs.length > 0 
              ? Math.round(dailyLogs.reduce((sum, log) => sum + log.totalProtein, 0) / dailyLogs.length)
              : 0
            }g
          </div>
          <div className="text-sm text-zinc-500">
            Target: {assignedPlan.nutritionPlan.nutritionInfo?.protein || 0}g
          </div>
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-zinc-700/50 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-zinc-400">Success Rate</h3>
            <Icon icon="mdi:target" className="text-purple-400" width={20} height={20} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{assignedPlan.successRate}%</div>
          <div className="text-sm text-zinc-500">
            Overall compliance
          </div>
        </div>
      </div>

      {/* Day Navigation */}
      <div className="bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-zinc-700/50 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">Daily Progress</h3>
            {assignedPlan.status === 'completed' && (
              <div className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
                Plan Completed
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-zinc-400">
              Current: <span className="text-orange-400 font-medium">Day {currentDay}</span>
            </div>
            <Button
              variant="ghost"
              size="small"
              onClick={() => setShowAllDays(!showAllDays)}
              className="text-zinc-400 hover:text-white"
            >
              <Icon icon={showAllDays ? "mdi:eye-off" : "mdi:eye"} width={16} height={16} />
              <span className="ml-1">{showAllDays ? 'Show Less' : 'Show All Days'}</span>
            </Button>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-green-500 bg-green-500/20"></div>
            <span className="text-zinc-400">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-orange-500 bg-orange-500/20"></div>
            <span className="text-zinc-400">Current Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-blue-500 bg-blue-500/20"></div>
            <span className="text-zinc-400">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-zinc-600 bg-zinc-800/50"></div>
            <span className="text-zinc-400">Not Started</span>
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: dayRange }, (_, i) => i + 1).map((day) => {
            const dayLog = getLogForDay(day);
            const isCompleted = dayLog?.isCompleted || false;
            const isSelected = day === selectedDay;
            const isCurrentDay = day === currentDay;
            const isFuture = day > currentDay && assignedPlan.status === 'active';

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`
                  relative flex-shrink-0 w-14 h-14 rounded-lg border-2 flex flex-col items-center justify-center text-sm font-medium transition-all hover:scale-105
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-500/20 text-blue-400 ring-2 ring-blue-500/30' 
                    : isCompleted
                      ? 'border-green-500 bg-green-500/20 text-green-400'
                      : isCurrentDay
                        ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                        : isFuture
                          ? 'border-zinc-600 bg-zinc-800/50 text-zinc-500'
                          : 'border-zinc-600 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500'
                  }
                `}
              >
                <span className="text-base font-bold">{day}</span>
                {isCompleted && (
                  <Icon icon="mdi:check" className="absolute -top-1 -right-1 text-green-400 bg-zinc-900 rounded-full" width={12} height={12} />
                )}
                {isCurrentDay && !isSelected && (
                  <div className="absolute -bottom-1 w-2 h-2 bg-orange-400 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDayLog ? (
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-zinc-700/50 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Day {selectedDay} - {new Date(selectedDayLog.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              selectedDayLog.isCompleted 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
            }`}>
              {selectedDayLog.isCompleted ? 'Completed' : 'In Progress'}
            </div>
          </div>

          {/* Daily Nutrition Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <div className="text-2xl font-bold text-white">{Math.round(selectedDayLog.totalCalories)}</div>
              <div className="text-sm text-zinc-400">Calories</div>
              <div className="text-xs text-zinc-500 mt-1">
                Target: {Math.round(selectedDayLog.targetCalories)}
              </div>
            </div>
            <div className="text-center p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <div className="text-2xl font-bold text-white">{Math.round(selectedDayLog.totalProtein)}g</div>
              <div className="text-sm text-zinc-400">Protein</div>
              <div className="text-xs text-zinc-500 mt-1">
                Target: {Math.round(selectedDayLog.targetProtein)}g
              </div>
            </div>
            <div className="text-center p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <div className="text-2xl font-bold text-white">{Math.round(selectedDayLog.totalCarbs)}g</div>
              <div className="text-sm text-zinc-400">Carbs</div>
              <div className="text-xs text-zinc-500 mt-1">
                Target: {Math.round(selectedDayLog.targetCarbs)}g
              </div>
            </div>
            <div className="text-center p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
              <div className="text-2xl font-bold text-white">{Math.round(selectedDayLog.totalFat)}g</div>
              <div className="text-sm text-zinc-400">Fat</div>
              <div className="text-xs text-zinc-500 mt-1">
                Target: {Math.round(selectedDayLog.targetFat)}g
              </div>
            </div>
          </div>

          {/* Meals Status */}
          <div>
            <h4 className="font-medium text-white mb-4">
              Meals Status ({selectedDayLog.completedMeals} of {selectedDayLog.totalMeals} logged)
            </h4>
            
            <div className="space-y-3">
              {getAllMealTypes(selectedDayLog).map((meal, index) => (
                <div key={index} className={`p-4 rounded-lg border transition-all ${
                  meal.isLogged 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-zinc-800/50 border-zinc-700/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        meal.isLogged ? 'bg-green-500' : 'bg-zinc-600'
                      }`}>
                        {meal.isLogged && (
                          <Icon icon="mdi:check" className="text-white" width={10} height={10} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white text-lg">
                          {meal.type}
                        </div>
                        {meal.isLogged && meal.data ? (
                          <div>
                            <div className="text-white font-medium">
                              {typeof meal.data.selectedOption === 'object' 
                                ? meal.data.selectedOption?.name || 'Custom Meal'
                                : 'Meal Logged'
                              }
                            </div>
                            <div className="text-sm text-zinc-400 mt-1">
                              {Math.round(meal.data.calories || 0)} cal • 
                              {Math.round(meal.data.protein || 0)}g protein • 
                              {Math.round(meal.data.carbs || 0)}g carbs • 
                              {Math.round(meal.data.fat || 0)}g fat
                            </div>
                            {meal.data.mealTime && (
                              <div className="text-xs text-zinc-500 mt-1">
                                Logged at: {meal.data.mealTime}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-zinc-500">Not logged</div>
                        )}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      meal.isLogged 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-zinc-700/50 text-zinc-500 border border-zinc-600/30'
                    }`}>
                      {meal.isLogged ? 'Completed' : 'Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Snacks */}
            {selectedDayLog.snackLogs && selectedDayLog.snackLogs.length > 0 && (
              <div className="mt-6">
                <h5 className="font-medium text-white mb-3">Additional Snacks</h5>
                <div className="space-y-2">
                  {selectedDayLog.snackLogs.map((snack, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                      <div>
                        <div className="font-medium text-white">{snack.name}</div>
                        <div className="text-sm text-zinc-400">
                          {Math.round(snack.calories)} cal • {Math.round(snack.protein)}g protein
                        </div>
                      </div>
                      <div className="text-sm text-blue-400 font-medium">
                        Extra Snack
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-xl border border-zinc-700/50 p-12 text-center shadow-2xl">
          <Icon icon="mdi:calendar-blank" className="text-zinc-600 mx-auto mb-4" width={48} height={48} />
          <h3 className="text-lg font-medium text-white mb-2">No Data for Day {selectedDay}</h3>
          <p className="text-zinc-400">
            {client.client.clientProfile.firstName} hasn't logged any meals for this day yet.
          </p>
        </div>
      )}
    </div>
  );
}