import { Button } from "@/components/common/Button";
import { InfoIcon, WaterLargeIcon, WaterMediumIcon, WaterSmallIcon } from "@/components/common/Icons";
import { Card } from "@/components/custom/Card";

export const HydrationTracker = ({ waterIntake, onAddWater, userData }) => {
  // Calculate percentage for progress bar
  const getPercentage = (consumed, goal) => {
    const percentage = (consumed / goal) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

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
                <p className="ml-1 text-gray-400 text-sm self-end mb-1">/ 3.0 L</p>
              </div>
            </div>

            <div className="mb-6 h-6 overflow-hidden rounded-full bg-[#222]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                style={{ width: `${getPercentage(waterIntake, 3000)}%` }}
              ></div>
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
                  className="flex-1 h-auto py-3 px-2"
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
    </div>
  );
}; 