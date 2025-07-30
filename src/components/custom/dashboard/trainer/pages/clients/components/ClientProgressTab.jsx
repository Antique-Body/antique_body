import { Icon } from "@iconify/react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export function ClientProgressTab({ client }) {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:weight-kilogram"
              className="text-[#3E92CC]"
              width={20}
              height={20}
            />
            <span className="text-zinc-400 text-sm">Current Weight</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {client.client.clientProfile.weight} kg
          </p>
          <p className="text-green-400 text-sm mt-1">-2.5 kg this month</p>
        </Card>
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:target"
              className="text-[#3E92CC]"
              width={20}
              height={20}
            />
            <span className="text-zinc-400 text-sm">Goal Progress</span>
          </div>
          <p className="text-2xl font-bold text-white">75%</p>
          <p className="text-blue-400 text-sm mt-1">On track</p>
        </Card>
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:fire"
              className="text-[#3E92CC]"
              width={20}
              height={20}
            />
            <span className="text-zinc-400 text-sm">Workouts This Week</span>
          </div>
          <p className="text-2xl font-bold text-white">4/5</p>
          <p className="text-orange-400 text-sm mt-1">1 more to go</p>
        </Card>
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center gap-2 mb-2">
            <Icon
              icon="mdi:trophy"
              className="text-[#3E92CC]"
              width={20}
              height={20}
            />
            <span className="text-zinc-400 text-sm">Achievements</span>
          </div>
          <p className="text-2xl font-bold text-white">12</p>
          <p className="text-yellow-400 text-sm mt-1">3 this month</p>
        </Card>
      </div>

      {/* Progress Charts and Body Measurements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight Progress Chart */}
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:chart-line"
                className="text-[#3E92CC]"
                width={24}
                height={24}
              />
              <h3 className="text-xl font-semibold text-white">
                Weight Progress
              </h3>
            </div>
            <Button variant="secondary" size="small">
              <Icon icon="mdi:plus" width={16} height={16} />
              Add Entry
            </Button>
          </div>
          <div className="h-64 flex items-center justify-center">
            <p className="text-zinc-400">
              Weight progress chart coming soon...
            </p>
          </div>
        </Card>

        {/* Body Measurements */}
        <Card variant="dark" className="overflow-visible">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon
                icon="mdi:human-male-height"
                className="text-[#3E92CC]"
                width={24}
                height={24}
              />
              <h3 className="text-xl font-semibold text-white">
                Body Measurements
              </h3>
            </div>
            <Button variant="secondary" size="small">
              <Icon icon="mdi:plus" width={16} height={16} />
              Update
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <span className="text-zinc-300">Chest</span>
              <span className="text-white font-medium">102 cm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <span className="text-zinc-300">Waist</span>
              <span className="text-white font-medium">85 cm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <span className="text-zinc-300">Hips</span>
              <span className="text-white font-medium">95 cm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <span className="text-zinc-300">Arms</span>
              <span className="text-white font-medium">35 cm</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
              <span className="text-zinc-300">Thighs</span>
              <span className="text-white font-medium">58 cm</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Workout Analytics */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center gap-2 mb-4">
          <Icon
            icon="mdi:chart-bar"
            className="text-[#3E92CC]"
            width={24}
            height={24}
          />
          <h3 className="text-xl font-semibold text-white">
            Workout Analytics
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
            <Icon
              icon="mdi:clock"
              className="text-orange-400 mx-auto mb-2"
              width={24}
              height={24}
            />
            <p className="text-2xl font-bold text-white">24.5h</p>
            <p className="text-zinc-400 text-sm">Total Time</p>
          </div>
          <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
            <Icon
              icon="mdi:fire"
              className="text-red-400 mx-auto mb-2"
              width={24}
              height={24}
            />
            <p className="text-2xl font-bold text-white">12,450</p>
            <p className="text-zinc-400 text-sm">Calories Burned</p>
          </div>
          <div className="text-center p-4 bg-zinc-800/50 rounded-lg">
            <Icon
              icon="mdi:trending-up"
              className="text-green-400 mx-auto mb-2"
              width={24}
              height={24}
            />
            <p className="text-2xl font-bold text-white">+15%</p>
            <p className="text-zinc-400 text-sm">Strength Gain</p>
          </div>
        </div>
        <div className="h-48 flex items-center justify-center">
          <p className="text-zinc-400">
            Workout analytics chart coming soon...
          </p>
        </div>
      </Card>

      {/* Goal Tracking */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:bullseye-arrow"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">Goal Tracking</h3>
          </div>
          <Button variant="primary" size="small">
            <Icon icon="mdi:plus" width={16} height={16} />
            Add Goal
          </Button>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">Lose 5kg</h4>
              <span className="text-green-400 text-sm">75% complete</span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
              <div
                className="bg-green-400 h-2 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            <p className="text-zinc-400 text-sm">
              Target: Feb 28, 2024 • 3.75kg lost
            </p>
          </div>
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">Bench Press 80kg</h4>
              <span className="text-blue-400 text-sm">60% complete</span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
              <div
                className="bg-blue-400 h-2 rounded-full"
                style={{ width: "60%" }}
              ></div>
            </div>
            <p className="text-zinc-400 text-sm">
              Target: Mar 15, 2024 • Current: 65kg
            </p>
          </div>
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-medium">Run 5km in 25min</h4>
              <span className="text-orange-400 text-sm">40% complete</span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
              <div
                className="bg-orange-400 h-2 rounded-full"
                style={{ width: "40%" }}
              ></div>
            </div>
            <p className="text-zinc-400 text-sm">
              Target: Apr 1, 2024 • Current: 30min
            </p>
          </div>
        </div>
      </Card>

      {/* Progress Photos */}
      <Card variant="dark" className="overflow-visible">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon
              icon="mdi:camera"
              className="text-[#3E92CC]"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-semibold text-white">
              Progress Photos
            </h3>
          </div>
          <Button variant="primary" size="small">
            <Icon icon="mdi:plus" width={16} height={16} />
            Add Photo
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square bg-zinc-800/50 rounded-lg border border-zinc-700 flex items-center justify-center">
            <div className="text-center">
              <Icon
                icon="mdi:calendar"
                className="text-zinc-500 mx-auto mb-1"
                width={24}
                height={24}
              />
              <p className="text-zinc-400 text-xs">Week 1</p>
            </div>
          </div>
          <div className="aspect-square bg-zinc-800/50 rounded-lg border border-zinc-700 flex items-center justify-center">
            <div className="text-center">
              <Icon
                icon="mdi:calendar"
                className="text-zinc-500 mx-auto mb-1"
                width={24}
                height={24}
              />
              <p className="text-zinc-400 text-xs">Week 4</p>
            </div>
          </div>
          <div className="aspect-square bg-zinc-800/50 rounded-lg border border-zinc-700 flex items-center justify-center">
            <div className="text-center">
              <Icon
                icon="mdi:calendar"
                className="text-zinc-500 mx-auto mb-1"
                width={24}
                height={24}
              />
              <p className="text-zinc-400 text-xs">Week 8</p>
            </div>
          </div>
          <div className="aspect-square bg-zinc-800/50 rounded-lg border border-zinc-700 flex items-center justify-center border-dashed">
            <div className="text-center">
              <Icon
                icon="mdi:plus"
                className="text-zinc-500 mx-auto mb-1"
                width={24}
                height={24}
              />
              <p className="text-zinc-400 text-xs">Add Photo</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
