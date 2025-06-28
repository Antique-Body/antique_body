import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Creates a client with all details and relations.
 * Required fields validation happens at the API layer.
 * formData: {
 *   firstName, lastName, dateOfBirth, gender, height, weight,
 *   experienceLevel, previousActivities, languages, primaryGoal, secondaryGoal,
 *   goalDescription, preferredActivities, email, phone, location,
 *   profileImage, bio, medicalConditions, allergies
 * }
 */
async function createClientWithDetails(formData, userId) {
  const requiredFields = [
    "firstName",
    "lastName",
    "dateOfBirth",
    "gender",
    "height",
    "weight",
    "experienceLevel",
    "languages",
    "primaryGoal",
    "preferredActivities",
    "location",
  ];
  for (const field of requiredFields) {
    if (
      !formData[field] ||
      (Array.isArray(formData[field]) && formData[field].length === 0)
    ) {
      throw new Error(`Field '${field}' is required.`);
    }
  }
  if (!Array.isArray(formData.languages)) {
    throw new Error("Field 'languages' must be an array.");
  }
  if (!Array.isArray(formData.preferredActivities)) {
    throw new Error("Field 'preferredActivities' must be an array.");
  }
  const { location } = formData;
  if (!location.city || !location.country) {
    throw new Error("City and country are required.");
  }

  // Find or create location
  const dbLocation = await getOrCreateLocation(prisma, location);

  // Prvo kreiraj ClientInfo i unutar njega ClientProfile
  const clientInfo = await prisma.clientInfo.create({
    data: {
      userId,
      clientProfile: {
        create: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: new Date(formData.dateOfBirth),
          gender: formData.gender,
          height: Number(formData.height || 0),
          weight: Number(formData.weight || 0),
          experienceLevel: formData.experienceLevel,
          previousActivities: formData.previousActivities?.trim() || null,
          primaryGoal: formData.primaryGoal,
          secondaryGoal: formData.secondaryGoal?.trim() || null,
          goalDescription: formData.goalDescription?.trim() || null,
          locationId: dbLocation.id,
          profileImage: formData.profileImage?.trim() || null,
          medicalConditions: formData.medicalConditions?.trim() || null,
          allergies: formData.allergies?.trim() || null,
          languages: {
            create: formData.languages.map((name) => ({ name })),
          },
          preferredActivities: {
            create: formData.preferredActivities.map((name) => ({ name })),
          },
          email:
            formData.email && formData.email.trim() !== ""
              ? formData.email
              : undefined,
          phone:
            formData.phone && formData.phone.trim() !== ""
              ? formData.phone
              : undefined,
        },
      },
    },
    include: {
      clientProfile: {
        include: {
          location: true,
          languages: true,
          preferredActivities: true,
        },
      },
    },
  });
  return clientInfo.clientProfile;
}

async function getClientProfileByUserId(userId) {
  // Prvo nađi ClientInfo za userId
  const clientInfo = await prisma.clientInfo.findUnique({
    where: { userId },
    include: {
      clientProfile: {
        include: {
          languages: true,
          preferredActivities: true,
          location: true,
        },
      },
    },
  });
  // Vrati profil ako postoji
  return clientInfo?.clientProfile || null;
}

// Helper za dinamički where za lokaciju
function buildLocationWhere(location) {
  const where = {
    city: location.city,
    country: location.country,
    state: location.state && location.state.trim() !== "" ? location.state : "",
  };
  return where;
}

// Helper za dobijanje ili kreiranje lokacije
async function getOrCreateLocation(tx, location) {
  let dbLocation = null;
  // Ako je poslan id, provjeri da li se podaci poklapaju
  if (location.id) {
    dbLocation = await tx.location.findUnique({ where: { id: location.id } });
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
        state: location.state ?? "",
        lat: location.lat ?? null,
        lon: location.lon ?? null,
      };
      dbLocation = await tx.location.create({ data: locData });
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
  return dbLocation;
}

/**
 * Update client profile with all relations (languages, preferredActivities, location, etc).
 * Očekuje validiran input.
 */
export async function updateClientProfile(userId, data) {
  return await prisma.$transaction(async (tx) => {
    // 1. Find ClientInfo by userId
    const clientInfo = await tx.clientInfo.findUnique({ where: { userId } });
    if (!clientInfo) throw new Error("Client info not found");

    // 2. Find ClientProfile by clientInfoId
    const profile = await tx.clientProfile.findUnique({
      where: { clientInfoId: clientInfo.id },
    });
    if (!profile) throw new Error("Client profile not found");

    // 3. Briši stare relacije
    await Promise.all([
      tx.clientLanguage.deleteMany({ where: { clientProfileId: profile.id } }),
      tx.clientActivity.deleteMany({ where: { clientProfileId: profile.id } }),
    ]);

    // 4. Kreiraj nove relacije (batch insert)
    if (data.languages?.length) {
      await tx.clientLanguage.createMany({
        data: data.languages.map((name) => ({
          clientProfileId: profile.id,
          name,
        })),
      });
    }
    if (data.preferredActivities?.length) {
      await tx.clientActivity.createMany({
        data: data.preferredActivities.map((name) => ({
          clientProfileId: profile.id,
          name,
        })),
      });
    }

    // 5. Update location if needed
    let locationId = profile.locationId;
    if (data.location && data.location.city && data.location.country) {
      const dbLocation = await getOrCreateLocation(tx, data.location);
      locationId = dbLocation.id;
    }

    // 6. Update profile (samo polja koja su direktno na modelu)
    const {
      languages: _languages,
      preferredActivities: _preferredActivities,
      location: _location,
      userId: _userId,
      locationId: _locationId,
      ...allowedProfileData
    } = data;

    const updated = await tx.clientProfile.update({
      where: { id: profile.id },
      data: {
        ...allowedProfileData,
        locationId,
        dateOfBirth: allowedProfileData.dateOfBirth
          ? new Date(allowedProfileData.dateOfBirth)
          : profile.dateOfBirth,
      },
      include: {
        location: true,
        languages: true,
        preferredActivities: true,
      },
    });
    return updated;
  });
}

// Basic profile for dashboard display - minimal data
async function getClientProfileBasic(userId) {
  const profile = await prisma.clientProfile.findFirst({
    where: {
      clientInfo: {
        userId: userId,
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
      primaryGoal: true,
      experienceLevel: true,
      clientInfo: {
        select: {
          id: true,
          totalSessions: true,
        },
      },
      // Empty arrays for compatibility
      languages: {
        select: { name: true },
        take: 0, // We don't show languages in basic view
      },
      preferredActivities: {
        select: { name: true },
        take: 0, // We don't show activities in basic view
      },
    },
  });
  return profile;
}

// Full profile for editing - all data needed for edit forms
async function getClientProfileForEdit(userId) {
  const clientInfo = await prisma.clientInfo.findUnique({
    where: { userId },
    include: {
      clientProfile: {
        include: {
          languages: true,
          preferredActivities: true,
          location: true,
        },
      },
    },
  });
  return clientInfo?.clientProfile || null;
}

// Settings data for client settings page
async function getClientSettings(userId) {
  const clientInfo = await prisma.clientInfo.findUnique({
    where: { userId },
    include: {
      clientSettings: true,
    },
  });

  if (!clientInfo) {
    return null;
  }

  // If client settings don't exist, create default ones
  if (!clientInfo.clientSettings) {
    const defaultSettings = await prisma.clientSettings.create({
      data: {
        clientInfoId: clientInfo.id,
        notifications: true,
        emailNotifications: true,
        smsNotifications: false,
        reminderTime: 24,
        privacyLevel: "public",
        shareProgress: true,
        timezone: "UTC",
        preferredLanguage: "en",
        measurementUnit: "metric",
      },
    });
    return defaultSettings;
  }

  return clientInfo.clientSettings;
}

export const clientService = {
  createClientWithDetails,
  getClientProfileByUserId,
  updateClientProfile,
  getClientProfileBasic,
  getClientProfileForEdit,
  getClientSettings,
};
