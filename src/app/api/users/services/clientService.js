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
  if (!location.city || !location.state || !location.country) {
    throw new Error("All location fields are required.");
  }
  const data = {
    userId,
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
    city: location.city,
    state: location.state,
    country: location.country,
    profileImage: formData.profileImage?.trim() || null,
    bio: formData.bio?.trim() || null,
    medicalConditions: formData.medicalConditions?.trim() || null,
    allergies: formData.allergies?.trim() || null,
    languages: {
      create: formData.languages.map((name) => ({ name })),
    },
    preferredActivities: {
      create: formData.preferredActivities.map((name) => ({ name })),
    },
  };
  if (formData.email && formData.email.trim() !== "") {
    data.email = formData.email;
  }
  if (formData.phone && formData.phone.trim() !== "") {
    data.phone = formData.phone;
  }
  try {
    const client = await prisma.clientProfile.create({
      data,
    });
    return client;
  } catch (error) {
    console.error("Error creating client profile:", error);
    throw new Error(`Failed to create client profile: ${error.message}`);
  }
}

async function getClientProfileByUserId(userId) {
  return await prisma.clientProfile.findUnique({
    where: { userId },
    include: {
      languages: true,
      preferredActivities: true,
    },
  });
}

export const clientService = {
  createClientWithDetails,
  getClientProfileByUserId,
};
