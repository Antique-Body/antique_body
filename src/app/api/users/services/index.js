import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import { formatPhoneNumber } from "@/lib/utils";

const prisma = new PrismaClient();

// Zajednički select objekat za korisnika
const userSelectFields = {
  id: true,
  email: true,
  phone: true,
  role: true,
  emailVerified: true,
  phoneVerified: true,
  language: true,
  createdAt: true,
  updatedAt: true,
  password: true,
};

/**
 * Generička funkcija za dohvat korisnika po bilo kojem polju
 */
async function findUser(where) {
  return await prisma.user.findFirst({
    where,
    select: userSelectFields,
  });
}

// Specifične funkcije za backward compatibility (opciono)
async function findUserById(id) {
  return await findUser({ id });
}

async function findUserByEmail(email) {
  return await findUser({ email });
}

async function findUserByPhone(phone) {
  const formattedPhone = formatPhoneNumber(phone);
  return await findUser({ phone: formattedPhone });
}

// User management operations
async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id },
    data,
    select: userSelectFields,
  });
}

async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id },
  });
}

async function listUsers(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: userSelectFields,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// Authentication related operations
async function resetPassword(token, newPassword) {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return true;
}

async function verifyUserPassword(userId, password) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user || !user.password) {
    console.log("verifyUserPassword: user not found or no password");
    return false;
  }

  console.log(
    "verifyUserPassword: comparing",
    password,
    "with hash",
    user.password
  );
  const result = await bcrypt.compare(password, user.password);
  console.log("verifyUserPassword: bcrypt.compare result:", result);
  return result;
}

async function updateUserVerification(
  userId,
  { emailVerified, phoneVerified }
) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerified: emailVerified ?? undefined,
      phoneVerified: phoneVerified ?? undefined,
    },
  });
}

// Generička funkcija za update role
async function updateUserRole(where, role) {
  try {
    const result = await prisma.user.update({
      where,
      data: { role },
      select: userSelectFields,
    });
    return result;
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("User not found");
    }
    throw error;
  }
}

// Dodajem funkciju za ažuriranje profila korisnika
async function updateUserProfile(userId, data) {
  // Ovdje možeš dodati dodatnu logiku validacije ili filtriranja polja
  return await updateUser(userId, data);
}

// Dodajem funkciju za ažuriranje jezika korisnika
async function updateUserLanguage(userId, language) {
  return await updateUser(userId, { language });
}

// Dodajem funkciju za dohvatanje svih korisnika sa opcionalnim filterom po roli
async function getAllUsers(page = 1, limit = 10, role = null) {
  const skip = (page - 1) * limit;
  const where = role ? { role } : {};
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      where,
      select: userSelectFields,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);
  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Kreira trenera sa svim detaljima i relacijama.
 * Sva polja su required osim certifikata i description.
 * formData: {
 *   firstName, lastName, dateOfBirth, gender, trainingSince, specialties, languages, trainingEnvironment, trainingTypes,
 *   email, phone,  profileImage, location: { city, state, country, postalCode },
 *   pricingType, pricePerSession, currency, certifications: [{ name, issuer, expiryDate, description, documentUrl }]
 * }
 */
async function createTrainerWithDetails(formData, userId) {
  // Validacija required polja
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
    "profileImage",
    "location",
    "pricingType",
    // pricePerSession will be conditionally required below
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
  // Bar jedno od email ili phone mora biti popunjeno
  if (!formData.email && !formData.phone) {
    throw new Error("At least one of 'email' or 'phone' is required.");
  }
  // Conditionally require pricePerSession
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
  if (
    !location.city ||
    !location.state ||
    !location.country ||
    !location.postalCode
  ) {
    throw new Error("All location fields are required.");
  }
  // Kreiraj glavnu TrainerPersonalInfo
  const trainer = await prisma.trainerPersonalInfo.create({
    data: {
      userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: new Date(formData.dateOfBirth),
      gender: formData.gender,
      trainingSince: Number(formData.trainingSince),
      profileImage: formData.profileImage, // url ili path
      professionalBio: formData.bio || null,
      city: location.city,
      state: location.state,
      country: location.country,
      postalCode: location.postalCode,
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

/**
 * Fetch the full trainer profile for a user, including all relations.
 */
async function getTrainerProfileByUserId(userId) {
  return await prisma.trainerPersonalInfo.findUnique({
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

// Exportujem userService objekat sa svim funkcijama
export const userService = {
  findUser,
  findUserById,
  findUserByEmail,
  findUserByPhone,
  updateUser,
  deleteUser,
  listUsers,
  resetPassword,
  verifyUserPassword,
  updateUserVerification,
  updateUserRole,
  updateUserProfile,
  updateUserLanguage,
  getAllUsers,
  createTrainerWithDetails,
  getTrainerProfileByUserId,
};
