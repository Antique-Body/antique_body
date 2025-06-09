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

  // Find or create location (with lat/lon)
  let dbLocation = await prisma.location.findFirst({
    where: {
      city: location.city,
      state: location.state,
      country: location.country,
    },
  });
  if (!dbLocation) {
    dbLocation = await prisma.location.create({
      data: {
        city: location.city,
        state: location.state,
        country: location.country,
        lat: location.lat ?? null,
        lon: location.lon ?? null,
      },
    });
  } else {
    // Ako već postoji, ali nema lat/lon, ažuriraj
    if (
      (dbLocation.lat == null || dbLocation.lon == null) &&
      location.lat &&
      location.lon
    ) {
      dbLocation = await prisma.location.update({
        where: { id: dbLocation.id },
        data: {
          lat: location.lat,
          lon: location.lon,
        },
      });
    }
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
      locationId: dbLocation.id,
      pricingType: formData.pricingType,
      pricePerSession:
        formData.pricingType === "fixed" ||
        formData.pricingType === "package_deals"
          ? Number(formData.pricePerSession)
          : null,
      currency: formData.currency,
      contactEmail: formData.contactEmail || null,
      contactPhone: formData.contactPhone || null,
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
    include: {
      location: true,
      specialties: true,
      languages: true,
      trainingEnvironments: true,
      trainingTypes: true,
      certifications: true,
    },
  });
  return trainer;
}

async function createOrUpdateTrainerInfo(trainerProfileId, infoData) {
  const existing = await prisma.trainerInfo.findUnique({
    where: { trainerProfileId },
  });
  if (existing) {
    // Update
    return await prisma.trainerInfo.update({
      where: { trainerProfileId },
      data: infoData,
    });
  } else {
    // Create
    return await prisma.trainerInfo.create({
      data: {
        trainerProfileId,
        ...infoData,
      },
    });
  }
}

async function getTrainerInfoByProfileId(trainerProfileId) {
  return await prisma.trainerInfo.findUnique({
    where: { trainerProfileId },
  });
}

async function getTrainerProfileByUserId(userId) {
  const profile = await prisma.trainerProfile.findUnique({
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
      trainerInfo: true,
      location: true,
      trainerGyms: {
        take: 3,
        include: {
          gym: { include: { location: true } },
        },
      },
    },
  });
  return profile;
}

async function getTrainerInfoByUserId(userId) {
  // Prvo pronađi profil trenera
  const profile = await prisma.trainerProfile.findUnique({
    where: { userId },
  });
  if (!profile) return null;
  // Zatim pronađi TrainerInfo i ugniježdi kompletan TrainerProfile sa svim relacijama
  const trainerInfo = await prisma.trainerInfo.findUnique({
    where: { trainerProfileId: profile.id },
    include: {
      trainerProfile: {
        include: {
          certifications: { include: { documents: true } },
          specialties: true,
          languages: true,
          trainingEnvironments: true,
          trainingTypes: true,
          location: true,
        },
      },
    },
  });
  return trainerInfo;
}

export const trainerService = {
  createTrainerWithDetails,
  getTrainerProfileByUserId,
  createOrUpdateTrainerInfo,
  getTrainerInfoByProfileId,
  getTrainerInfoByUserId,
};
