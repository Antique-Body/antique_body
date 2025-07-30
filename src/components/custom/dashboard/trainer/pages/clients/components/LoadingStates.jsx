export function ClientLoadingState({ message = "Loading client data..." }) {
  return (
    <div className="px-4 py-5">
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#3E92CC] border-t-transparent" />
          <p className="mt-4 text-zinc-400">{message}</p>
        </div>
      </div>
    </div>
  );
}

export function ClientsLoadingState({ message = "Loading clients..." }) {
  return (
    <div className="px-4 py-5">
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#3E92CC] border-t-transparent" />
          <p className="mt-4 text-zinc-400">{message}</p>
        </div>
      </div>
    </div>
  );
}

export function PlanLoadingState({ message = "Loading Training Plan" }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#3E92CC] border-t-transparent" />
        <p className="mt-6 text-xl text-zinc-300 font-medium">{message}</p>
      </div>
    </div>
  );
}
