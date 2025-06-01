"use client";
import { useEffect, useState } from "react";

export default function TrainerDashboard() {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrainer() {
      setLoading(true);
      const res = await fetch("/api/users/trainer");
      if (res.ok) {
        const data = await res.json();
        setTrainer(data);
      } else {
        const err = await res.json();
        setError(err.error || "Failed to load trainer profile");
      }
      setLoading(false);
    }
    fetchTrainer();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!trainer) return <div>No trainer profile found.</div>;

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Trainer Dashboard</h1>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Image */}
        <div>
          {trainer.profileImage ? (
            <img
              src={trainer.profileImage}
              alt="Profile"
              className="w-40 h-40 object-cover rounded-full border-4 border-orange-400 shadow-lg"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
        {/* Main Info */}
        <div className="flex-1 space-y-2">
          <div className="text-xl font-semibold">
            {trainer.firstName} {trainer.lastName}
          </div>
          <div className="text-gray-600">{trainer.professionalBio}</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {trainer.specialties?.map((s) => (
              <span
                key={s.id}
                className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs"
              >
                {s.name}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {trainer.languages?.map((l) => (
              <span
                key={l.id}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
              >
                {l.name}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {trainer.trainingEnvironments?.map((e) => (
              <span
                key={e.id}
                className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
              >
                {e.name}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {trainer.trainingTypes?.map((t) => (
              <span
                key={t.id}
                className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs"
              >
                {t.name}
              </span>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-700">
            <strong>Pricing:</strong> {trainer.pricingType}{" "}
            {trainer.pricePerSession
              ? `- ${trainer.pricePerSession} ${trainer.currency}`
              : ""}
          </div>
        </div>
      </div>
      {/* Certifications */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Certifications</h2>
        {trainer.certifications && trainer.certifications.length > 0 ? (
          <ul className="space-y-2">
            {trainer.certifications.map((cert) => (
              <li
                key={cert.id}
                className="bg-gray-50 border rounded p-3 flex flex-col md:flex-row md:items-center gap-2"
              >
                <div className="flex-1">
                  <div className="font-semibold">{cert.name}</div>
                  <div className="text-xs text-gray-500">
                    Issued by: {cert.issuer || "-"}
                  </div>
                  <div className="text-xs text-gray-500">
                    Expiry:{" "}
                    {cert.expiryDate
                      ? new Date(cert.expiryDate).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
                {cert.documentUrl && (
                  <a
                    href={cert.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 underline text-xs font-medium"
                  >
                    View Document
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No certifications added.</div>
        )}
      </div>
    </div>
  );
}
