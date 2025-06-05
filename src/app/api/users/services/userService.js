import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import { formatPhoneNumber } from "@/lib/utils";

const prisma = new PrismaClient();

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

async function findUser(where) {
  return await prisma.user.findFirst({
    where,
    select: userSelectFields,
  });
}

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
    return false;
  }
  const result = await bcrypt.compare(password, user.password);
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

async function updateUserProfile(userId, data) {
  return await updateUser(userId, data);
}

async function updateUserLanguage(userId, language) {
  return await updateUser(userId, { language });
}

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
};
