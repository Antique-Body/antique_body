import { Icon } from "@iconify/react";
import Link from "next/link";

import { Button } from "@/components/common/Button";

export function NutritionPlanHeader({ planData, client, clientId }) {
  return (
    <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          <Link href={`/trainer/dashboard/clients/${clientId}`}>
            <Button
              variant="ghost"
              size="small"
              className="text-zinc-400 hover:text-white"
            >
              <Icon icon="mdi:arrow-left" width={20} height={20} />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Icon
                icon="mdi:food-apple"
                className="text-white"
                width={24}
                height={24}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {planData?.title || "Nutrition Plan"}
              </h1>
              <p className="text-zinc-400">
                {client.client?.clientProfile?.firstName}{" "}
                {client.client?.clientProfile?.lastName} • Nutrition Plan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}