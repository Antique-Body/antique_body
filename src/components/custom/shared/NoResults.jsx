import { Icon } from "@iconify/react";

import { Button } from "@/components/common/Button";

export const NoResults = ({
  onClearFilters,
  title = "No results found",
  message = "We couldn't find any matches for your current filters. Try adjusting your search criteria or clearing all filters.",
  variant = "blue", // 'blue' or 'orange'
}) => {
  const colorVariants = {
    blue: {
      accent: "#3E92CC",
      iconColor: "text-[#3E92CC]",
      buttonVariant: "blueOutline",
    },
    orange: {
      accent: "#FF6B00",
      iconColor: "text-[#FF6B00]",
      buttonVariant: "orangeOutline",
    },
  };

  const colors = colorVariants[variant];

  return (
    <div className="text-center py-12 sm:py-16 bg-gradient-to-b from-zinc-900/60 to-black/60 backdrop-blur-sm rounded-xl border border-zinc-800">
      <div className="flex flex-col items-center">
        <div className="mb-6 rounded-full bg-zinc-800/80 p-5">
          <Icon
            icon="mdi:account-search"
            className={`w-12 h-12 ${colors.iconColor} opacity-80`}
          />
        </div>

        <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>

        <p className="text-zinc-400 mb-6 max-w-md mx-auto px-4">{message}</p>

        <Button
          variant={colors.buttonVariant}
          size="medium"
          onClick={onClearFilters}
          className="min-w-[150px]"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
