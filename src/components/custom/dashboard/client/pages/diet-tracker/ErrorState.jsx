"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/common/Button";

export const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <Icon icon="mdi:alert-circle" className="w-8 h-8 text-red-500" />
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">
          Unable to Load Diet Plan
        </h3>

        <p className="text-zinc-400 mb-6 max-w-md">
          {error ||
            "We encountered an error while loading your nutrition plan. Please try again."}
        </p>

        {onRetry && (
          <Button
            variant="orangeFilled"
            size="large"
            onClick={onRetry}
            className="h-12 px-6"
          >
            <Icon icon="mdi:refresh" className="w-5 h-5 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};
