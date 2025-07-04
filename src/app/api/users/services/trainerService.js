import { exerciseService } from "./exerciseService";
import { mealService } from "./mealService";

import prisma from "@/lib/prisma";

// Helper za dinamički where za lokaciju
function buildLocationWhere(location) {
  const where = {
    city: location.city,
    country: location.country,
  };
  if (location.state) where.state = location.state;
  return where;
}

/**
 * Kreira trenera sa svim detaljima i relacijama.
 * Sva polja su required osim certifikata i description.
 * formData: {
 *   firstName, lastName, dateOfBirth, gender, trainerSince, specialties, languages, trainingEnvironment, trainingTypes,
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
    "trainerSince",
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
  if (!location.city || !location.country) {
    throw new Error("City and country are required.");
  }

  // Find or create location (with lat/lon)
  let dbLocation = null;
  if (location.id) {
    dbLocation = await prisma.location.findUnique({
      where: { id: location.id },
    });
  }
  if (!dbLocation) {
    dbLocation = await prisma.location.findFirst({
      where: buildLocationWhere(location),
    });
    if (!dbLocation) {
      const locData = {
        city: location.city,
        country: location.country,
        lat: location.lat ?? null,
        lon: location.lon ?? null,
      };
      if (
        location.state &&
        location.state.trim() !== "" &&
        location.state !== "String" &&
        typeof location.state === "string"
      ) {
        locData.state = location.state;
      }
      dbLocation = await prisma.location.create({ data: locData });
    }
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

  // Prvo kreiraj TrainerInfo i unutar njega TrainerProfile
  const trainerInfo = await prisma.trainerInfo.create({
    data: {
      userId,
      trainerProfile: {
        create: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: new Date(formData.dateOfBirth),
          gender: formData.gender,
          trainerSince: Number(formData.trainerSince),
          profileImage: formData.profileImage,
          description: formData.description || null,
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
          trainingEnvironment: formData.trainingEnvironment,
          specialties: {
            create: formData.specialties.map((name) => ({ name })),
          },
          languages: {
            create: formData.languages.map((name) => ({ name })),
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
                    expiryDate: cert.expiryDate
                      ? new Date(cert.expiryDate)
                      : null,
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
      },
    },
    include: {
      trainerProfile: {
        include: {
          location: true,
          specialties: true,
          languages: true,
          trainingTypes: true,
          certifications: true,
        },
      },
    },
  });

  // Create default exercises for new trainer
  await exerciseService.createDefaultExercises(trainerInfo.id);
  await mealService.createDefaultMeals(trainerInfo.id);

  return {
    trainerProfile: trainerInfo.trainerProfile,
    trainerInfoId: trainerInfo.id,
  };
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
    const trainerInfo = await prisma.trainerInfo.create({
      data: {
        trainerProfileId,
        ...infoData,
      },
    });

    // Create default exercises for new trainer
    await exerciseService.createDefaultExercises(trainerInfo.id);
    // Create default meals for new trainer
    await mealService.createDefaultMeals(trainerInfo.id);

    return trainerInfo;
  }
}

async function getTrainerInfoByProfileId(trainerProfileId) {
  return await prisma.trainerInfo.findUnique({
    where: { trainerProfileId },
    include: {
      exercises: {
        include: {
          muscleGroups: true,
          exerciseInfo: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

// Basic profile for dashboard display - minimal data
async function getTrainerProfileBasic(userId) {
  const profile = await prisma.trainerProfile.findFirst({
    where: {
      trainerInfo: {
        userId: userId,
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      description: true,
      trainerSince: true,
      gender: true,
      dateOfBirth: true,
      contactEmail: true,
      contactPhone: true,
      trainingEnvironment: true,
      pricingType: true,
      pricePerSession: true,
      currency: true,
      sessionDuration: true,
      cancellationPolicy: true,
      createdAt: true,
      location: {
        select: {
          city: true,
          country: true,
          state: true,
        },
      },
      specialties: {
        select: { name: true },
      },
      trainingTypes: {
        select: { name: true },
      },
      languages: {
        select: { name: true },
      },
      certifications: {
        select: {
          name: true,
          issuer: true,
          expiryDate: true,
          status: true,
        },
        where: {
          hidden: false,
        },
      },
      trainerInfo: {
        select: {
          id: true,
          createdAt: true,
          exercises: {
            select: { id: true },
          },
          meals: {
            select: { id: true },
          },
        },
      },
      availabilities: {
        select: {
          weekday: true,
          timeSlot: true,
        },
      },
      galleryImages: {
        select: {
          url: true,
          description: true,
          isHighlighted: true,
        },
        where: {
          isHighlighted: true,
        },
        take: 3,
        orderBy: {
          order: "asc",
        },
      },
    },
  });
  return profile;
}

// Full profile for editing - all data needed for edit forms
async function getTrainerProfileForEdit(userId) {
  const profile = await prisma.trainerProfile.findFirst({
    where: {
      trainerInfo: {
        userId: userId,
      },
    },
    include: {
      certifications: { include: { documents: true } },
      specialties: true,
      languages: true,
      trainingTypes: true,
      trainerInfo: true,
      location: true,
      trainerGyms: {
        take: 3,
        include: { gym: { include: { location: true } } },
      },
      availabilities: true,
      galleryImages: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });
  return profile;
}

// Settings data for trainer settings page
async function getTrainerSettings(userId) {
  const trainerInfo = await prisma.trainerInfo.findUnique({
    where: { userId },
    include: {
      trainerSettings: true,
      user: {
        select: {
          id: true,
          email: true,
          phone: true,
          role: true,
          language: true,
          emailVerified: true,
          phoneVerified: true,
          password: true,
          accounts: {
            select: {
              id: true,
              provider: true,
              type: true,
            },
          },
        },
      },
    },
  });

  if (!trainerInfo) {
    return null;
  }

  // Uvijek koristi upsert, bez if-a sa error handling
  try {
    const defaultSettings = await prisma.trainerSettings.upsert({
      where: { trainerInfoId: trainerInfo.id },
      update: {},
      create: {
        trainerInfoId: trainerInfo.id,
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        autoAcceptBookings: false,
        requireDeposit: false,
        depositAmount: null,
        timezone: "UTC",
        workingHours: null,
        blackoutDates: null,
      },
    });

    // Ukloni password iz user objekta
    const { password, ...userWithoutPassword } = trainerInfo.user;
    return {
      ...defaultSettings,
      user: {
        ...userWithoutPassword,
        hasPassword: Boolean(password),
      },
    };
  } catch (error) {
    // Ako je greška zbog unique constraint, pokušaj samo da preuzmeš postojeći zapis
    if (
      error.code === "P2002" &&
      error.meta?.target?.includes("trainerInfoId")
    ) {
      const existingSettings = await prisma.trainerSettings.findUnique({
        where: { trainerInfoId: trainerInfo.id },
      });

      if (existingSettings) {
        const { password, ...userWithoutPassword } = trainerInfo.user;
        return {
          ...existingSettings,
          user: {
            ...userWithoutPassword,
            hasPassword: Boolean(password),
          },
        };
      }
    }

    // Ako nije poznata greška, baci je dalje
    throw error;
  }
}

async function getTrainerProfileByUserId(userId) {
  const profile = await prisma.trainerProfile.findFirst({
    where: {
      trainerInfo: {
        userId: userId,
      },
    },
    include: {
      certifications: { include: { documents: true } },
      specialties: true,
      languages: true,
      trainingTypes: true,
      trainerInfo: true,
      location: true,
      trainerGyms: {
        take: 3,
        include: { gym: { include: { location: true } } },
      },
      availabilities: true,
      galleryImages: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });
  return profile;
}

async function getTrainerInfoByUserId(userId) {
  // 1. Pronađi TrainerInfo po userId
  const trainerInfo = await prisma.trainerInfo.findUnique({
    where: { userId },
    include: {
      trainerProfile: {
        include: {
          certifications: { include: { documents: true } },
          specialties: true,
          languages: true,
          trainingTypes: true,
          location: true,
          availabilities: true,
          galleryImages: {
            orderBy: {
              order: "asc",
            },
          },
        },
      },
      exercises: {
        include: {
          muscleGroups: true,
          exerciseInfo: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  return trainerInfo;
}

/**
 * Update trainer profile with all relations (specialties, languages, environments, types, certifications, gyms).
 * Očekuje validiran input.
 */
export async function updateTrainerProfile(userId, data) {
  return await prisma.$transaction(async (tx) => {
    // Prvo pronađi TrainerInfo po userId
    const trainerInfo = await tx.trainerInfo.findUnique({ where: { userId } });
    if (!trainerInfo) throw new Error("Trainer info not found");
    // Zatim pronađi TrainerProfile po trainerInfoId
    const profile = await tx.trainerProfile.findUnique({
      where: { trainerInfoId: trainerInfo.id },
    });
    if (!profile) throw new Error("Trainer profile not found");
    let locationId = profile.locationId;
    await Promise.all([
      tx.trainerSpecialty.deleteMany({
        where: { trainerProfileId: profile.id },
      }),
      tx.trainerLanguage.deleteMany({
        where: { trainerProfileId: profile.id },
      }),
      tx.trainerType.deleteMany({ where: { trainerProfileId: profile.id } }),
      tx.certification.deleteMany({ where: { trainerProfileId: profile.id } }),
      tx.trainerAvailability.deleteMany({
        where: { trainerProfileId: profile.id },
      }),
      tx.trainerGalleryImage.deleteMany({
        where: { trainerProfileId: profile.id },
      }),
    ]);
    // 3. Kreiraj nove relacije (batch insert, NIKAD ne šalji u .update())
    if (data.specialties?.length) {
      await tx.trainerSpecialty.createMany({
        data: data.specialties.map((name) => ({
          trainerProfileId: profile.id,
          name,
        })),
      });
    }
    if (data.languages?.length) {
      await tx.trainerLanguage.createMany({
        data: data.languages.map((name) => ({
          trainerProfileId: profile.id,
          name,
        })),
      });
    }
    if (data.trainingTypes?.length) {
      await tx.trainerType.createMany({
        data: data.trainingTypes.map((name) => ({
          trainerProfileId: profile.id,
          name,
        })),
      });
    }
    if (data.galleryImages?.length) {
      await tx.trainerGalleryImage.createMany({
        data: data.galleryImages.map((img) => ({
          trainerProfileId: profile.id,
          url: img.url,
          order: img.order,
          isHighlighted: img.isHighlighted,
          description: img.description,
        })),
      });
    }

    // 4. Kreiraj certifikate i dokumente
    if (data.certifications && data.certifications.length > 0) {
      for (const cert of data.certifications) {
        const newCert = await tx.certification.create({
          data: {
            trainerProfileId: profile.id,
            name: cert.name,
            issuer: cert.issuer || null,
            expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
            hidden: cert.hidden !== undefined ? cert.hidden : false,
          },
        });
        if (
          cert.documents &&
          Array.isArray(cert.documents) &&
          cert.documents.length > 0
        ) {
          await tx.certificationDocument.createMany({
            data: cert.documents.map((file) => ({
              certificationId: newCert.id,
              url: file.url,
              originalName: file.originalName || "document",
              mimetype: file.mimetype || "application/octet-stream",
            })),
          });
        }
      }
    }

    // 5. Update profile (samo polja koja su direktno na modelu)
    const {
      location,
      userId: _userId,
      locationId: _locationId,
      specialties: _specialties,
      languages: _languages,
      trainingTypes: _trainingTypes,
      certifications: _certifications,
      availabilities: _availabilities,
      galleryImages: _galleryImages,
      ...allowedProfileData
    } = data;

    let pricePerSession = null;
    if (
      allowedProfileData.pricePerSession !== undefined &&
      allowedProfileData.pricePerSession !== null &&
      allowedProfileData.pricePerSession !== ""
    ) {
      pricePerSession = Number(allowedProfileData.pricePerSession);
      if (isNaN(pricePerSession)) pricePerSession = null;
    }

    // Osiguraj da je trainerSince broj
    let trainerSince = data.trainerSince;
    if (typeof trainerSince === "string" && trainerSince !== "") {
      trainerSince = Number(trainerSince);
      if (isNaN(trainerSince)) trainerSince = null;
    }

    if (location && location.city && location.country) {
      let dbLocation = null;
      // Ako je poslan id, provjeri da li se podaci poklapaju
      if (location.id) {
        dbLocation = await tx.location.findUnique({
          where: { id: location.id },
        });
        if (
          dbLocation &&
          (dbLocation.city !== location.city ||
            dbLocation.country !== location.country ||
            (dbLocation.state || "") !== (location.state || ""))
        ) {
          dbLocation = null;
        }
      }
      if (!dbLocation) {
        dbLocation = await tx.location.findFirst({
          where: buildLocationWhere(location),
        });
        if (!dbLocation) {
          const locData = {
            city: location.city,
            country: location.country,
            lat: location.lat ?? null,
            lon: location.lon ?? null,
          };
          if (
            location.state &&
            location.state.trim() !== "" &&
            location.state !== "String" &&
            typeof location.state === "string"
          ) {
            locData.state = location.state;
          }
          dbLocation = await tx.location.create({
            data: locData,
          });
        } else {
          // Update lat/lon if missing
          if (
            (dbLocation.lat == null || dbLocation.lon == null) &&
            location.lat &&
            location.lon
          ) {
            dbLocation = await tx.location.update({
              where: { id: dbLocation.id },
              data: {
                lat: location.lat,
                lon: location.lon,
              },
            });
          }
        }
      }
      locationId = dbLocation.id;
    }

    // Availabilities
    if (Array.isArray(data.availabilities)) {
      await tx.trainerAvailability.createMany({
        data: data.availabilities.map((a) => ({
          trainerProfileId: profile.id,
          weekday: a.weekday,
          timeSlot: a.timeSlot,
        })),
      });
    }

    const updated = await tx.trainerProfile.update({
      where: { id: profile.id },
      data: {
        ...allowedProfileData,
        pricePerSession,
        trainerSince,
        dateOfBirth: allowedProfileData.dateOfBirth
          ? new Date(allowedProfileData.dateOfBirth)
          : profile.dateOfBirth,
        locationId,
      },
      include: {
        certifications: { include: { documents: true } },
        specialties: true,
        languages: true,
        trainingTypes: true,
        location: true,
        trainerGyms: { include: { gym: true } },
        availabilities: true,
        galleryImages: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    // 6. Gym relacije
    if (location && Array.isArray(location.gyms)) {
      await tx.trainerGym.deleteMany({ where: { trainerId: profile.id } });
      for (const gym of location.gyms) {
        let dbGym = await tx.gym.findUnique({ where: { placeId: gym.value } });
        if (!dbGym) {
          dbGym = await tx.gym.create({
            data: {
              name: gym.label,
              address: gym.address,
              lat: gym.lat,
              lon: gym.lon,
              placeId: gym.value,
            },
          });
        }
        await tx.trainerGym.create({
          data: {
            trainerId: profile.id,
            gymId: dbGym.id,
          },
        });
      }
    }

    // 7. Vraćamo ažurirani profil
    return updated;
  });
}

export const trainerService = {
  createTrainerWithDetails,
  getTrainerProfileByUserId,
  createOrUpdateTrainerInfo,
  getTrainerInfoByProfileId,
  getTrainerInfoByUserId,
  updateTrainerProfile,
  getTrainerProfileBasic,
  getTrainerProfileForEdit,
  getTrainerSettings,
};
