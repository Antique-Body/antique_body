"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export const DietPlanAssignmentCard = ({ onStartPlan, loading }) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartPlan = async () => {
    setIsStarting(true);
    try {
      await onStartPlan(true); // Use mock plan
    } catch (error) {
      console.error("Error starting plan:", error);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Your Nutrition Journey
        </h1>
        <p className="text-zinc-400 text-lg">
          Your trainer has prepared a personalized nutrition plan for you
        </p>
      </div>

      {/* Assignment Card */}
      <Card variant="planCard" className="overflow-hidden">
        <div className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/20 to-[#FF9A00]/20"></div>

          {/* Content */}
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Left side - Plan info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#FF6B00] rounded-full flex items-center justify-center">
                    <Icon icon="mdi:nutrition" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Muscle Gain Nutrition Plan
                    </h2>
                    <p className="text-[#FF6B00] font-medium">
                      Assigned by John Doe
                    </p>
                  </div>
                </div>

                <p className="text-zinc-300 text-lg mb-6 leading-relaxed">
                  A detailed nutrition plan for building muscle mass, with high
                  protein intake and balanced meals. This 8-month program
                  includes 10 days of carefully crafted meal plans designed to
                  fuel your muscle growth.
                </p>

                {/* Plan highlights */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:calendar"
                        className="w-5 h-5 text-[#FF6B00]"
                      />
                      <span className="text-white font-medium">Duration</span>
                    </div>
                    <p className="text-zinc-300">8 months</p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:target"
                        className="w-5 h-5 text-[#FF6B00]"
                      />
                      <span className="text-white font-medium">Goal</span>
                    </div>
                    <p className="text-zinc-300">Muscle Gain</p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:fire"
                        className="w-5 h-5 text-[#FF6B00]"
                      />
                      <span className="text-white font-medium">
                        Daily Calories
                      </span>
                    </div>
                    <p className="text-zinc-300">2000 kcal</p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon
                        icon="mdi:dumbbell"
                        className="w-5 h-5 text-[#FF6B00]"
                      />
                      <span className="text-white font-medium">Protein</span>
                    </div>
                    <p className="text-zinc-300">200g daily</p>
                  </div>
                </div>

                {/* Call to action */}
                <div className="space-y-4">
                  <Button
                    variant="orangeFilled"
                    size="large"
                    onClick={handleStartPlan}
                    disabled={isStarting || loading}
                    className="w-full h-14 text-lg font-semibold"
                  >
                    {isStarting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                        Starting Your Journey...
                      </>
                    ) : (
                      <>
                        <Icon
                          icon="mdi:rocket-launch"
                          className="w-6 h-6 mr-3"
                        />
                        Start My Nutrition Journey
                      </>
                    )}
                  </Button>

                  <p className="text-zinc-500 text-sm">
                    Ready to transform your nutrition? Click above to begin your
                    personalized meal plan.
                  </p>
                </div>
              </div>

              {/* Right side - Visual */}
              <div className="flex-shrink-0">
                <div className="relative w-80 h-80 rounded-2xl overflow-hidden">
                  <Image
                    src="https://storage.googleapis.com/antique-body-app/cover-images/b57ed1dd-08bd-4d02-8c4d-61472a77c99d.png"
                    alt="Nutrition Plan"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Floating stats */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-white">
                            10
                          </div>
                          <div className="text-xs text-zinc-300">Days</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">
                            40+
                          </div>
                          <div className="text-xs text-zinc-300">Meals</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">
                            200g
                          </div>
                          <div className="text-xs text-zinc-300">Protein</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="mdi:check-circle" className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Easy Tracking</h3>
          <p className="text-zinc-400 text-sm">
            Simple meal logging with one-tap completion and progress tracking.
          </p>
        </div>

        <div className="text-center p-6 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="mdi:chef-hat" className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Meal Options</h3>
          <p className="text-zinc-400 text-sm">
            Multiple meal options for each time slot, plus custom meal entry.
          </p>
        </div>

        <div className="text-center p-6 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
          <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="mdi:chart-line" className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-white font-semibold mb-2">Progress Insights</h3>
          <p className="text-zinc-400 text-sm">
            Real-time nutrition tracking and progress analytics.
          </p>
        </div>
      </div>
    </div>
  );
};
