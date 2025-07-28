import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

const DIFFICULTY_STYLES = {
  beginner: "bg-green-900/20 text-green-400",
  intermediate: "bg-yellow-900/20 text-yellow-400",
  advanced: "bg-red-900/20 text-red-400",
};

export const OverviewTab = ({ description, keyFeatures, difficultyLevel }) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
      <p className="text-gray-300">
        {description || "No description available."}
      </p>
    </div>
    {keyFeatures && keyFeatures.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {keyFeatures.map((feature, index) => (
            <div key={`keyfeature-${index}`} className="flex items-start gap-2">
              <Icon
                icon="heroicons:check-circle-20-solid"
                className="w-[18px] h-[18px] text-[#FF6B00] mt-0.5 flex-shrink-0"
              />
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    )}
    {difficultyLevel && (
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">
          Training Level
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            DIFFICULTY_STYLES[difficultyLevel.toLowerCase()] ||
            DIFFICULTY_STYLES.advanced
          }`}
        >
          {difficultyLevel}
        </span>
      </div>
    )}
  </div>
);

OverviewTab.propTypes = {
  description: PropTypes.string,
  keyFeatures: PropTypes.arrayOf(PropTypes.string),
  difficultyLevel: PropTypes.string,
};
