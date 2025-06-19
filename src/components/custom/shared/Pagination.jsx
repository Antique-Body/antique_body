import { Icon } from "@iconify/react";

import { Button } from "@/components/common/Button";

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  variant = "blue", // 'blue' or 'orange'
}) => {
  const colorVariants = {
    blue: {
      accent: "#3E92CC",
      gradient: "bg-gradient-to-r from-[#3E92CC] to-[#2A6B9F]",
      activeButton:
        "bg-gradient-to-r from-[#3E92CC] to-[#2A6B9F] text-white font-medium",
    },
    orange: {
      accent: "#FF6B00",
      gradient: "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]",
      activeButton:
        "bg-gradient-to-r from-[#FF6B00] to-[#FF9A00] text-white font-medium",
    },
  };

  const colors = colorVariants[variant];

  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 sm:mt-12 mb-6 sm:mb-8 flex flex-col items-center">
      <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
        <Button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          variant={currentPage === 1 ? "ghost" : "secondary"}
          className={`flex items-center px-2 sm:px-4 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
          }`}
          aria-label="Go to previous page"
          leftIcon={
            <Icon
              icon="mdi:chevron-left"
              className="w-4 h-4 sm:w-5 sm:h-5 mr-0 sm:mr-1"
            />
          }
        >
          <span className="text-xs sm:text-sm hidden sm:inline">Previous</span>
        </Button>

        <div className="flex items-center overflow-x-auto max-w-[180px] sm:max-w-none hide-scrollbar py-1">
          {generatePaginationNumbers().map((pageNum, index) => (
            <div key={index} className="px-0.5 sm:px-1">
              {pageNum === "..." ? (
                <span className="px-2 sm:px-3 py-2 text-zinc-500">...</span>
              ) : (
                <Button
                  onClick={() => onPageChange(pageNum)}
                  variant={currentPage === pageNum ? "filled" : "secondary"}
                  className={`min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 flex items-center justify-center rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? colors.activeButton
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {pageNum}
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          variant={currentPage === totalPages ? "ghost" : "secondary"}
          className={`flex items-center px-2 sm:px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed"
              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
          }`}
          aria-label="Go to next page"
          rightIcon={
            <Icon
              icon="mdi:chevron-right"
              className="w-4 h-4 sm:w-5 sm:h-5 ml-0 sm:ml-1"
            />
          }
        >
          <span className="text-xs sm:text-sm hidden sm:inline">Next</span>
        </Button>
      </nav>

      {/* Page indication */}
      <div className="text-center text-zinc-500 text-xs sm:text-sm mt-4">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};
