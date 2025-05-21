import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Finds a user by their ID
 * @param {string} id - The user's ID
 * @returns {Promise<Object|null>} - The user object or null if not found
 */
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

/**
 * Finds a user by their email
 * @param {string} email - The user's email
 * @returns {Promise<Object|null>} - The user object or null if not found
 */
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

/**
 * Updates a user's information
 * @param {string} id - The user's ID
 * @param {Object} data - The data to update
 * @returns {Promise<Object|null>} - The updated user object or null if not found
 */
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

/**
 * Deletes a user
 * @param {string} id - The user's ID
 * @returns {Promise<Object>} - The deleted user object
 */
export async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id },
  });
}

/**
 * Lists users with pagination
 * @param {number} page - The page number (1-based)
 * @param {number} limit - The number of items per page
 * @returns {Promise<Object>} - The paginated users and metadata
 */
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
