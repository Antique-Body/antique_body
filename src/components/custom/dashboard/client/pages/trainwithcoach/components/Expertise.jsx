import { Icon } from "@iconify/react";

export const Expertise = ({ trainer }) => {
  // Use formatted specialties if available, otherwise use regular specialties
  const specialties =
    trainer?.formattedSpecialties ||
    trainer?.specialties?.map((s) => (typeof s === "string" ? s : s.name)) ||
    [];

  // If no specialties are available, show a placeholder message
  if (!specialties || specialties.length === 0) {
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

  // Group specialties by category
  const specialtyCategories = {
    strengthConditioning: specialties.filter((s) => {
      const specialtyName = s.toLowerCase();
      return (
        specialtyName.includes("strength") ||
        specialtyName.includes("conditioning") ||
        specialtyName.includes("weight") ||
        specialtyName.includes("power")
      );
    }),
    performance: specialties.filter((s) => {
      const specialtyName = s.toLowerCase();
      return (
        specialtyName.includes("performance") ||
        specialtyName.includes("sport") ||
        specialtyName.includes("athletic")
      );
    }),
    recovery: specialties.filter((s) => {
      const specialtyName = s.toLowerCase();
      return (
        specialtyName.includes("recovery") ||
        specialtyName.includes("mobility") ||
        specialtyName.includes("flexibility") ||
        specialtyName.includes("injury")
      );
    }),
    nutrition: specialties.filter((s) => {
      const specialtyName = s.toLowerCase();
      return (
        specialtyName.includes("nutrition") ||
        specialtyName.includes("diet") ||
        specialtyName.includes("food") ||
        specialtyName.includes("meal")
      );
    }),
  };

  return (
    <div>
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
                  <li key={index}>• {specialty}</li>
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
                <li key={index}>• {specialty}</li>
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
                <li key={index}>• {specialty}</li>
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
                <li key={index}>• {specialty}</li>
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
                  <h5 className="font-medium text-white">
                    {typeof cert === "string" ? cert : cert.name}
                  </h5>
                  {cert.issuer && (
                    <p className="text-sm text-gray-400">{cert.issuer}</p>
                  )}
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
