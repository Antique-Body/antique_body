import { Button } from "@/components/common/Button";
import { InfoIcon, WaterLargeIcon, WaterMediumIcon, WaterSmallIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const HydrationTracker = ({ waterIntake, onAddWater, userData }) => {
  // Calculate percentage for progress bar
  const getPercentage = (consumed, goal) => {
    const percentage = (consumed / goal) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  const percentage = getPercentage(waterIntake, 3000);
  const waterGoal = 3.0; // L

  return (
    <div className="scroll-mt-8">
      <Card variant="darkStrong" width="100%" maxWidth="none">
        <h2 className="mb-4 text-xl font-bold">Hydration Tracker</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card variant="dark" className="lg:col-span-2" width="100%" maxWidth="none">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h3 className="font-bold mb-2 md:mb-0">Today's Water Intake</h3>
              <div className="flex items-end">
                <p className="text-2xl font-bold text-blue-400">{(waterIntake / 1000).toFixed(1)}</p>
                <p className="ml-1 text-gray-400 text-sm self-end mb-1">/ {waterGoal} L</p>
              </div>
            </div>

            <div className="relative mb-8">
              {/* Progress bar container */}
              <div className="h-8 overflow-hidden rounded-full bg-[#111] shadow-inner border border-[#333] relative">
                {/* Main water progress */}
                <div
                  className="h-full rounded-r-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-700 ease-out relative overflow-hidden"
                  style={{ width: `${percentage}%` }}
                >
                  {/* Animated water effect */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="water-wave"></div>
                  </div>
                  
                  {/* Small bubbles */}
                  {percentage > 10 && (
                    <>
                      <div className="bubble bubble-1"></div>
                      <div className="bubble bubble-2"></div>
                      <div className="bubble bubble-3"></div>
                    </>
                  )}
                </div>
              </div>

              {/* Goal markers */}
              <div className="flex justify-between px-2 absolute w-full top-0 left-0 right-0">
                {[0, 25, 50, 75, 100].map(mark => (
                  <div key={mark} className="h-8 flex items-center justify-center">
                    <div className="h-2 w-0.5 bg-[#444]"></div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between px-2 text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>{(waterGoal * 0.25).toFixed(1)}L</span>
                <span>{(waterGoal * 0.5).toFixed(1)}L</span>
                <span>{(waterGoal * 0.75).toFixed(1)}L</span>
                <span>{waterGoal}L</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { amount: 250, icon: <WaterSmallIcon size={24} />, label: "Small" },
                { amount: 500, icon: <WaterMediumIcon size={24} />, label: "Medium" },
                { amount: 750, icon: <WaterLargeIcon size={24} />, label: "Large" }
              ].map((option, index) => (
                <Button 
                  key={index}
                  variant="blueOutline" 
                  onClick={() => onAddWater(option.amount)} 
                  className="flex-1 h-auto py-3 px-2 hover:bg-blue-500/10 transition-all duration-300"
                >
                  <div className="flex flex-col items-center">
                    <div className="text-blue-400 mb-1">{option.icon}</div>
                    <p className="font-bold text-sm">+{option.amount}ml</p>
                    <p className="text-xs text-gray-400">{option.label}</p>
                  </div>
                </Button>
              ))}
            </div>

            <div className="mt-5 p-3 bg-[rgba(59,130,246,0.1)] rounded-lg">
              <div className="flex items-start">
                <div className="mt-0.5 mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(59,130,246,0.2)]">
                  <InfoIcon size={12} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-300">
                    Water needs vary based on body weight, activity level, and climate. Active individuals
                    should aim for 3-4 liters per day.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="dark" width="100%" maxWidth="none">
            <h3 className="font-bold mb-4">Hydration Tips</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-300">Based on your workout intensity ({userData.workout.intensityLevel}), you should aim for at least 3 liters of water today.</p>
              
              <div className="bg-[rgba(30,30,30,0.7)] p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <InfoIcon size={16} className="mr-2 text-blue-400" />
                  Optimal Timing
                </h4>
                <ul className="text-sm text-gray-300 list-inside list-disc">
                  <li>Drink 500ml 2 hours before workout</li>
                  <li>Drink 250ml every 15-20 minutes during exercise</li>
                  <li>Drink 500ml after workout to rehydrate</li>
                </ul>
              </div>

              <div className="bg-[rgba(30,30,30,0.7)] p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <InfoIcon size={16} className="mr-2 text-blue-400" />
                  Hydration Benefits
                </h4>
                <ul className="text-sm text-gray-300 list-inside list-disc">
                  <li>Improved performance and endurance</li>
                  <li>Better recovery and reduced muscle soreness</li>
                  <li>Enhanced cognitive function and focus</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </Card>
      
      {/* Add CSS for water animations */}
      <style jsx>{`
        .water-wave {
          position: absolute;
          width: 200%;
          height: 100%;
          animation: wave 3s linear infinite;
          top: -5px;
          left: 0;
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%23ffffff22'/%3E%3C/svg%3E");
          background-position: 0 bottom;
          background-size: 100% 100%;
        }
        
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .bubble {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
        }
        
        .bubble-1 {
          width: 8px;
          height: 8px;
          bottom: 8px;
          left: 15%;
          animation: bubble-rise 4s infinite ease-in;
        }
        
        .bubble-2 {
          width: 6px;
          height: 6px;
          bottom: 12px;
          left: 40%;
          animation: bubble-rise 3s infinite ease-in 1s;
        }
        
        .bubble-3 {
          width: 4px;
          height: 4px;
          bottom: 10px;
          left: 65%;
          animation: bubble-rise 3.5s infinite ease-in 0.5s;
        }
        
        @keyframes bubble-rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-20px) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}; 