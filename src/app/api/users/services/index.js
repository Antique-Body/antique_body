import { formatPhoneNumber } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Zajednički select objekat za korisnika
const userSelectFields = {
  id: true,
  email: true,
  phone: true,
  name: true,
  lastName: true,
  role: true,
  emailVerified: true,
  phoneVerified: true,
  language: true,
  createdAt: true,
  updatedAt: true,
};

/**
 * Generička funkcija za dohvat korisnika po bilo kojem polju
 */
export async function findUser(where) {
  return await prisma.user.findFirst({
    where,
    select: userSelectFields,
  });
}

// Specifične funkcije za backward compatibility (opciono)
export async function findUserById(id) {
  return await findUser({ id });
}

export async function findUserByEmail(email) {
  return await findUser({ email });
}

export async function findUserByPhone(phone) {
  const formattedPhone = formatPhoneNumber(phone);
  return await findUser({ phone: formattedPhone });
}

// User management operations
export async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id },
    data,
    select: userSelectFields,
  });
}

export async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id },
  });
}

export async function listUsers(page = 1, limit = 10) {
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
export async function resetPassword(token, newPassword) {
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

export async function verifyUserPassword(userId, password) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!user || !user.password) {
    return false;
  }

  return await bcrypt.compare(password, user.password);
}

export async function updateUserVerification(
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
export async function updateUserRole(where, role) {
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
