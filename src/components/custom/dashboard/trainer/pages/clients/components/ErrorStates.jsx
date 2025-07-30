import { Icon } from "@iconify/react";

import { Button } from "@/components/common/Button";

export function ClientErrorState({ error, onRetry, className = "" }) {
  return (
    <div className={`px-4 py-5 ${className}`}>
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <Icon
            icon="mdi:alert-circle"
            className="text-red-500"
            width={48}
            height={48}
          />
          <p className="mt-4 text-lg font-medium text-white">
            Failed to load client data
          </p>
          <p className="mt-2 text-zinc-400">{error}</p>
          <Button
            variant="primary"
            onClick={onRetry}
            leftIcon={<Icon icon="mdi:refresh" width={20} height={20} />}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ClientsErrorState({ error, onRetry, className = "" }) {
  return (
    <div className={`px-4 py-5 ${className}`}>
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <Icon
            icon="mdi:alert-circle"
            className="text-red-500"
            width={48}
            height={48}
          />
          <p className="mt-4 text-lg font-medium text-white">
            Failed to load clients
          </p>
          <p className="mt-2 text-zinc-400">{error}</p>
          <Button
            variant="primary"
            onClick={onRetry}
            leftIcon={<Icon icon="mdi:refresh" width={20} height={20} />}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ClientNotFoundState({ onBackToClients, className = "" }) {
  return (
    <div className={`px-4 py-5 ${className}`}>
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <Icon
            icon="mdi:account-off"
            className="text-zinc-600"
            width={48}
            height={48}
          />
          <p className="mt-4 text-lg font-medium text-white">
            Client not found
          </p>
          <p className="mt-2 text-zinc-400">
            This client may have been removed or doesn't exist.
          </p>
          <Button
            variant="primary"
            onClick={onBackToClients}
            leftIcon={<Icon icon="mdi:arrow-left" width={20} height={20} />}
            className="mt-4"
          >
            Back to Clients
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PlanErrorState({ error, onRetry, className = "" }) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center ${className}`}
    >
      <div className="text-center bg-zinc-900/80 backdrop-blur rounded-2xl p-8 border border-red-500/20">
        <Icon
          icon="mdi:alert-circle"
          width={48}
          height={48}
          className="text-red-400 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold text-white mb-2">
          Unable to Load Plan
        </h3>
        <p className="text-red-400 mb-4">{error}</p>
        <Button
          onClick={onRetry}
          variant="secondary"
          className="bg-red-600/20 border-red-500/30 text-red-300 hover:bg-red-600/30"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}

export function PlanNotFoundState({ onGoBack, className = "" }) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center ${className}`}
    >
      <div className="text-center bg-zinc-900/80 backdrop-blur rounded-2xl p-8 border border-zinc-700/50">
        <Icon
          icon="mdi:file-search"
          width={48}
          height={48}
          className="text-zinc-400 mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold text-white mb-2">
          Plan Not Found
        </h3>
        <p className="text-zinc-400 mb-4">
          The training plan you're looking for doesn't exist.
        </p>
        <Button onClick={onGoBack} variant="secondary">
          Go Back
        </Button>
      </div>
    </div>
  );
}
