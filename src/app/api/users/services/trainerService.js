import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Kreira trenera sa svim detaljima i relacijama.
 * Sva polja su required osim certifikata i description.
 * formData: {
 *   firstName, lastName, dateOfBirth, gender, trainingSince, specialties, languages, trainingEnvironment, trainingTypes,
 *   email, phone,  profileImage, location: { city, state, country },
 *   pricingType, pricePerSession, currency, certifications: [{ name, issuer, expiryDate, description, documentUrl }]
 * }
 */
async function createTrainerWithDetails(formData, userId) {
  const requiredFields = [
    "firstName",
    "lastName",
    "dateOfBirth",
    "gender",
    "trainingSince",
    "specialties",
    "languages",
    "trainingEnvironment",
    "trainingTypes",
    "location",
    "pricingType",
    "currency",
  ];
  for (const field of requiredFields) {
    if (
      !formData[field] ||
      (Array.isArray(formData[field]) && formData[field].length === 0)
    ) {
      throw new Error(`Field '${field}' is required.`);
    }
  }
  if (!formData.email && !formData.phone) {
    throw new Error("At least one of 'email' or 'phone' is required.");
  }
  if (
    formData.pricingType === "fixed" ||
    formData.pricingType === "package_deals"
  ) {
    if (!formData.pricePerSession || Number(formData.pricePerSession) <= 0) {
      throw new Error(
        "Field 'pricePerSession' is required for selected pricing type."
      );
    }
  }
  const { location } = formData;
  if (!location.city || !location.state || !location.country) {
    throw new Error("All location fields are required.");
  }
  const trainer = await prisma.trainerProfile.create({
    data: {
      userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: new Date(formData.dateOfBirth),
      gender: formData.gender,
      trainingSince: Number(formData.trainingSince),
      profileImage: formData.profileImage,
      professionalBio: formData.bio || null,
      city: location.city,
      state: location.state,
      country: location.country,
      pricingType: formData.pricingType,
      pricePerSession:
        formData.pricingType === "fixed" ||
        formData.pricingType === "package_deals"
          ? Number(formData.pricePerSession)
          : null,
      currency: formData.currency,
      specialties: {
        create: formData.specialties.map((name) => ({ name })),
      },
      languages: {
        create: formData.languages.map((name) => ({ name })),
      },
      trainingEnvironments: {
        create: [{ name: formData.trainingEnvironment }],
      },
      trainingTypes: {
        create: formData.trainingTypes.map((name) => ({ name })),
      },
      certifications:
        formData.certifications && formData.certifications.length > 0
          ? {
              create: formData.certifications.map((cert) => ({
                name: cert.name,
                issuer: cert.issuer || null,
                expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
                documents:
                  cert.documents && cert.documents.length > 0
                    ? {
                        create: cert.documents.map((doc) => ({
                          url: doc.url,
                          originalName: doc.originalName,
                          mimetype: doc.mimetype,
                        })),
                      }
                    : undefined,
              })),
            }
          : undefined,
    },
  });
  return trainer;
}

async function getTrainerProfileByUserId(userId) {
  return await prisma.trainerProfile.findUnique({
    where: { userId },
    include: {
      certifications: {
        include: {
          documents: true,
        },
      },
      specialties: true,
      languages: true,
      trainingEnvironments: true,
      trainingTypes: true,
    },
  });
}

export const trainerService = {
  createTrainerWithDetails,
  getTrainerProfileByUserId,
};
