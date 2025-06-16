import { Icon } from "@iconify/react";

export const About = ({ trainer }) => (
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
        <h4 className="mb-2 text-lg font-medium text-white">Certifications</h4>
        <ul className="list-disc space-y-2 pl-5 text-gray-300">
          {trainer.certifications.map((cert, index) => (
            <li key={index}>{cert}</li>
          ))}
        </ul>
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
                <Icon icon="mdi:check" width={16} height={16} color="#FF6B00" />
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
          {trainer?.specialties && trainer.specialties.length > 0 ? (
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
                    {typeof specialty === "string" ? specialty : specialty.name}
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
