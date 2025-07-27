import { Icon } from "@iconify/react";

import { Button } from "@/components/common/Button";

export const LoadingState = () => (
  <div className="flex h-64 w-full items-center justify-center">
    <div className="flex flex-col items-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#3E92CC] border-t-transparent" />
      <p className="mt-4 text-zinc-400">Loading coaching requests...</p>
    </div>
  </div>
);

export const ErrorState = ({ error, onRetry }) => (
  <div className="flex h-64 w-full items-center justify-center">
    <div className="flex flex-col items-center text-center">
      <Icon
        icon="mdi:alert-circle"
        className="text-red-500"
        width={48}
        height={48}
      />
      <p className="mt-4 text-lg font-medium text-white">
        Failed to load coaching requests
      </p>
      <p className="mt-2 text-zinc-400">{error}</p>
      <Button
        type="button"
        className="mt-4"
        variant="primary"
        onClick={onRetry}
      >
        Try Again
      </Button>
    </div>
  </div>
);

export const EmptyState = () => (
  <div className="text-center py-16">
    <div className="bg-zinc-800/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-zinc-700/30">
      <Icon
        icon="mdi:account-multiple-outline"
        className="text-zinc-500"
        width={40}
        height={40}
      />
    </div>
    <h3 className="text-xl font-semibold text-zinc-300 mb-2">
      No Pending Requests
    </h3>
    <p className="text-zinc-500 max-w-md mx-auto">
      You don't have any coaching requests at the moment. New requests will
      appear here when potential clients reach out.
    </p>
  </div>
);
