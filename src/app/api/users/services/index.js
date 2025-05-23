import { formatPhoneNumber } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

/**
 * User Service - Handles all user-related operations
 */

// Find user by different identifiers
export async function findUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
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
    },
  });
}

export async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
    select: {
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
    },
  });
}

export async function findUserByPhone(phone) {
  const formattedPhone = formatPhoneNumber(phone);
  return await prisma.user.findFirst({
    where: { phone: formattedPhone },
    select: {
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
    },
  });
}

// User management operations
export async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id },
    data,
    select: {
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
    },
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
      select: {
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
      },
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
