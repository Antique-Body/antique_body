import { Icon } from "@iconify/react";

import { ClientCard } from "./ClientCard";

import { Button } from "@/components/common/Button";

export const ClientsGrid = ({
  clients,
  handleViewClient,
  isPlanTracking = false,
  currentPage,
  totalPages,
  handlePageChange,
  handleSearchClear,
  searchQuery,
}) => {
  if (clients.length === 0) {
    return (
      <div className="text-center py-12 bg-zinc-900/60 backdrop-blur-md rounded-xl border border-zinc-800">
        <Icon
          icon="mdi:account-group-outline"
          className="text-zinc-600 mx-auto mb-4"
          width={64}
          height={64}
        />
        <p className="text-xl font-medium text-zinc-400 mb-2">
          No Active Clients
        </p>
        <p className="text-zinc-500 mb-6">
          {searchQuery
            ? "No clients match your search criteria. Try a different search term."
            : 'Accept client requests from the "New Clients" tab to start coaching!'}
        </p>
        {searchQuery && (
          <Button
            variant="primary"
            onClick={handleSearchClear}
            leftIcon={<Icon icon="mdi:close" width={16} height={16} />}
          >
            Clear Search
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {clients.map((clientRequest) => (
          <ClientCard
            key={clientRequest.id}
            clientRequest={clientRequest}
            handleViewClient={handleViewClient}
            isPlanTracking={isPlanTracking}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="secondary"
              size="small"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 disabled:opacity-50"
            >
              <Icon icon="mdi:chevron-double-left" width={16} height={16} />
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 disabled:opacity-50"
            >
              <Icon icon="mdi:chevron-left" width={16} height={16} />
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show 5 pages max, centered around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "primary" : "secondary"}
                    size="small"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center ${
                      currentPage === pageNum
                        ? "bg-[#3E92CC] text-white"
                        : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="secondary"
              size="small"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 disabled:opacity-50"
            >
              <Icon icon="mdi:chevron-right" width={16} height={16} />
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 disabled:opacity-50"
            >
              <Icon icon="mdi:chevron-double-right" width={16} height={16} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
