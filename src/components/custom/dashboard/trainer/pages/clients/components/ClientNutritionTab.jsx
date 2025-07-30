import { Icon } from "@iconify/react";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";

export function ClientNutritionTab({}) {
  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Nutrition Plans</h2>
        <Button
          variant="success"
          leftIcon={<Icon icon="mdi:plus" width={20} height={20} />}
        >
          Assign Meal Plan
        </Button>
      </div>

      {/* Placeholder Content */}
      <Card variant="dark" className="overflow-visible">
        <div className="text-center py-12">
          <Icon
            icon="mdi:food-apple"
            className="text-zinc-600 mx-auto mb-4"
            width={48}
            height={48}
          />
          <p className="text-zinc-400 text-lg mb-2">
            Nutrition tracking coming soon
          </p>
          <p className="text-zinc-500 text-sm mb-6">
            This feature will allow you to create and assign meal plans to your
            clients.
          </p>
          <Button
            variant="success"
            leftIcon={<Icon icon="mdi:food-apple" width={20} height={20} />}
          >
            Create Meal Plan
          </Button>
        </div>
      </Card>
    </div>
  );
}
