import { Icon } from "@iconify/react";

export const About = ({ trainer }) => {
  // Format distance to display nicely
  const formatDistance = (distance) => {
    if (typeof distance !== "number") return null;

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    if (distance < 10) {
      return `${distance.toFixed(1)}km`;
    }
    return `${Math.round(distance)}km`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-xl font-semibold text-white">
          About {trainer?.name}
        </h3>
        <p className="leading-relaxed text-gray-300">
          {trainer?.description || "No description available."}
        </p>
      </div>

      {trainer?.certifications && trainer.certifications.length > 0 && (
        <div>
          <h4 className="mb-2 text-lg font-medium text-white">
            Certifications
          </h4>
          <ul className="list-disc space-y-2 pl-5 text-gray-300">
            {trainer.certifications.map((cert, index) => (
              <li key={index}>{typeof cert === "string" ? cert : cert.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Training Locations / Gyms */}
      {trainer?.trainerGyms && trainer.trainerGyms.length > 0 && (
        <div>
          <h4 className="mb-2 text-lg font-medium text-white">
            Training Locations
          </h4>
          <div className="space-y-3">
            {trainer.trainerGyms.map((gymData, index) => (
              <div
                key={index}
                className="rounded-lg border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.1)] p-3"
              >
                <div className="flex items-start gap-2">
                  <Icon
                    icon="mdi:dumbbell"
                    width={18}
                    height={18}
                    className="mt-0.5 text-[#FF6B00]"
                  />
                  <div>
                    <h5 className="font-medium text-white">
                      {gymData.gym?.name || "Unnamed Gym"}
                    </h5>
                    {gymData.gym?.address && (
                      <p className="text-sm text-gray-300">
                        {gymData.gym.address}
                      </p>
                    )}
                    {index === 0 &&
                      trainer.distanceSource === "gym" &&
                      typeof trainer.distance === "number" && (
                        <p className="mt-1 text-xs inline-block bg-[rgba(255,107,0,0.2)] text-[#FF6B00] px-2 py-0.5 rounded-full">
                          {formatDistance(trainer.distance)} away
                        </p>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {trainer?.services ? (
        <div>
          <h4 className="mb-2 text-lg font-medium text-white">Services</h4>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {trainer.services.map((service, index) => (
              <div
                key={index}
                className="rounded-lg border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.1)] p-3"
              >
                <div className="mb-1 flex items-center gap-2">
                  <Icon
                    icon="mdi:check"
                    width={16}
                    height={16}
                    color="#FF6B00"
                  />
                  <h5 className="font-medium text-white">{service.name}</h5>
                </div>
                <p className="text-sm text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h4 className="mb-2 text-lg font-medium text-white">Specialties</h4>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {trainer?.formattedSpecialties &&
            trainer.formattedSpecialties.length > 0 ? (
              trainer.formattedSpecialties.map((specialty, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.1)] p-3"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <Icon
                      icon="mdi:check"
                      width={16}
                      height={16}
                      color="#FF6B00"
                    />
                    <h5 className="font-medium text-white">{specialty}</h5>
                  </div>
                </div>
              ))
            ) : trainer?.specialties && trainer.specialties.length > 0 ? (
              trainer.specialties.map((specialty, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-[rgba(255,107,0,0.2)] bg-[rgba(255,107,0,0.1)] p-3"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <Icon
                      icon="mdi:check"
                      width={16}
                      height={16}
                      color="#FF6B00"
                    />
                    <h5 className="font-medium text-white">
                      {typeof specialty === "string"
                        ? specialty
                        : specialty.name}
                    </h5>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-4 text-gray-400">
                No specialties listed
              </div>
            )}
          </div>
        </div>
      )}

      {(trainer?.contactEmail || trainer?.contactPhone) && (
        <div>
          <h4 className="mb-2 text-lg font-medium text-white">
            Contact Information
          </h4>
          <ul className="space-y-2 text-gray-300">
            {trainer.contactEmail && (
              <li className="flex items-center gap-2">
                <Icon
                  icon="mdi:email"
                  width={16}
                  height={16}
                  className="text-[#FF6B00]"
                />
                <span>{trainer.contactEmail}</span>
              </li>
            )}
            {trainer.contactPhone && (
              <li className="flex items-center gap-2">
                <Icon
                  icon="mdi:phone"
                  width={16}
                  height={16}
                  className="text-[#FF6B00]"
                />
                <span>{trainer.contactPhone}</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
