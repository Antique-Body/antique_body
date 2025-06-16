import { Icon } from "@iconify/react";

export const Expertise = ({ trainer }) => {
  // If no specialties are available, show a placeholder message
  if (!trainer?.specialties || trainer.specialties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-[rgba(255,107,0,0.1)] p-4">
          <Icon
            icon="mdi:dumbbell"
            width={40}
            height={40}
            className="text-[#FF6B00]"
          />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-white">
          No Expertise Information
        </h3>
        <p className="mb-6 max-w-md text-gray-400">
          This trainer hasn't added detailed expertise information yet.
        </p>
      </div>
    );
  }

  // Map specialties to expertise areas with default proficiency levels
  const expertise = trainer.specialties
    .map((specialty, index) => ({
      area: typeof specialty === "string" ? specialty : specialty.name,
      level: 80 + (index % 3) * 5, // Generate varying levels between 80-90%
    }))
    .slice(0, 5); // Limit to 5 specialties

  // Group specialties by category
  const specialtyCategories = {
    strengthConditioning: trainer.specialties.filter((s) => {
      const specialtyName = typeof s === "string" ? s : s.name;
      return (
        specialtyName.toLowerCase().includes("strength") ||
        specialtyName.toLowerCase().includes("conditioning") ||
        specialtyName.toLowerCase().includes("weight") ||
        specialtyName.toLowerCase().includes("power")
      );
    }),
    performance: trainer.specialties.filter((s) => {
      const specialtyName = typeof s === "string" ? s : s.name;
      return (
        specialtyName.toLowerCase().includes("performance") ||
        specialtyName.toLowerCase().includes("sport") ||
        specialtyName.toLowerCase().includes("athletic")
      );
    }),
    recovery: trainer.specialties.filter((s) => {
      const specialtyName = typeof s === "string" ? s : s.name;
      return (
        specialtyName.toLowerCase().includes("recovery") ||
        specialtyName.toLowerCase().includes("mobility") ||
        specialtyName.toLowerCase().includes("flexibility") ||
        specialtyName.toLowerCase().includes("injury")
      );
    }),
    nutrition: trainer.specialties.filter((s) => {
      const specialtyName = typeof s === "string" ? s : s.name;
      return (
        specialtyName.toLowerCase().includes("nutrition") ||
        specialtyName.toLowerCase().includes("diet") ||
        specialtyName.toLowerCase().includes("food") ||
        specialtyName.toLowerCase().includes("meal")
      );
    }),
  };

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-white">
        Areas of Expertise
      </h3>

      <div className="mb-6 space-y-4">
        {expertise.map((item, index) => (
          <div key={index}>
            <div className="mb-1 flex justify-between">
              <span className="text-gray-300">{item.area}</span>
              <span className="text-[#FF6B00]">{item.level}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#333]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF9A00]"
                style={{ width: `${item.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-lg font-semibold text-white">
        Specialization Details
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Only show categories that have specialties */}
        {specialtyCategories.strengthConditioning.length > 0 && (
          <div className="rounded-lg border border-[#333] bg-[#1A1A1A] p-4">
            <div className="mb-2 flex items-center">
              <Icon
                icon="mdi:weight-lifter"
                size={18}
                className="mr-2 text-[#FF6B00]"
              />
              <h4 className="text-md font-semibold text-[#FF6B00]">
                Strength & Conditioning
              </h4>
            </div>
            <ul className="space-y-1 text-gray-300">
              {specialtyCategories.strengthConditioning.map(
                (specialty, index) => (
                  <li key={index}>
                    •{" "}
                    {typeof specialty === "string" ? specialty : specialty.name}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {specialtyCategories.performance.length > 0 && (
          <div className="rounded-lg border border-[#333] bg-[#1A1A1A] p-4">
            <div className="mb-2 flex items-center">
              <Icon
                icon="mdi:run-fast"
                size={18}
                className="mr-2 text-[#FF6B00]"
              />
              <h4 className="text-md font-semibold text-[#FF6B00]">
                Sports Performance
              </h4>
            </div>
            <ul className="space-y-1 text-gray-300">
              {specialtyCategories.performance.map((specialty, index) => (
                <li key={index}>
                  • {typeof specialty === "string" ? specialty : specialty.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {specialtyCategories.recovery.length > 0 && (
          <div className="rounded-lg border border-[#333] bg-[#1A1A1A] p-4">
            <div className="mb-2 flex items-center">
              <Icon
                icon="mdi:heart-pulse"
                size={18}
                className="mr-2 text-[#FF6B00]"
              />
              <h4 className="text-md font-semibold text-[#FF6B00]">
                Recovery & Mobility
              </h4>
            </div>
            <ul className="space-y-1 text-gray-300">
              {specialtyCategories.recovery.map((specialty, index) => (
                <li key={index}>
                  • {typeof specialty === "string" ? specialty : specialty.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {specialtyCategories.nutrition.length > 0 && (
          <div className="rounded-lg border border-[#333] bg-[#1A1A1A] p-4">
            <div className="mb-2 flex items-center">
              <Icon
                icon="mdi:food-apple"
                size={18}
                className="mr-2 text-[#FF6B00]"
              />
              <h4 className="text-md font-semibold text-[#FF6B00]">
                Nutrition Planning
              </h4>
            </div>
            <ul className="space-y-1 text-gray-300">
              {specialtyCategories.nutrition.map((specialty, index) => (
                <li key={index}>
                  • {typeof specialty === "string" ? specialty : specialty.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* If none of the categories have specialties, show a message */}
        {Object.values(specialtyCategories).every(
          (arr) => arr.length === 0
        ) && (
          <div className="col-span-2 rounded-lg border border-[#333] bg-[#1A1A1A] p-4 text-center">
            <p className="text-gray-400">
              No detailed specializations available
            </p>
          </div>
        )}
      </div>

      {/* Education & Certifications */}
      {trainer.certifications && trainer.certifications.length > 0 && (
        <div>
          <h3 className="mb-3 mt-6 text-lg font-semibold text-white">
            Certifications
          </h3>
          <ul className="space-y-3">
            {trainer.certifications.map((cert, index) => (
              <li key={index} className="flex">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,107,0,0.15)] p-2 text-[#FF6B00]">
                  <Icon icon="mdi:certificate" width={16} height={16} />
                </div>
                <div>
                  <h5 className="font-medium text-white">{cert}</h5>
                  {trainer.certificationDates &&
                    trainer.certificationDates[index] && (
                      <p className="text-sm text-gray-400">
                        {trainer.certificationDates[index]}
                      </p>
                    )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
