import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcrypt";

const prisma = new PrismaClient();

export const userService = {
  // Create a new user
  async createUser(userData) {
    const { name, lastName, email, password } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already in use");
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Get user by ID
  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Get user by email
  async getUserByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Return full user with password for authentication
    return user;
  },

  // Get all users with pagination
  async getAllUsers(page = 1, limit = 10, role = null) {
    const skip = (page - 1) * limit;

    const whereClause = role ? { role } : {};

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      users,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  },

  // Update user role
  async updateUserRole(userId, role) {
    try {
      const user = await this.getUserById(userId);
      
      const updatedUser = await prisma.user.update({
        where: { email: user.email },
        data: { role },
        select: {
          id: true,
          name: true,
          email: true,
          lastName: true,
          role: true,
          language: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error("Error in updateUserRole:", error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(userId, userData) {
    try {
      const user = await this.getUserById(userId);
      const { name, lastName, email } = userData;

      // Check if email is being changed and if it's already in use
      if (email && email !== user.email) {
        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
          throw new Error("Email already in use");
        }
      }

      const updatedUser = await prisma.user.update({
        where: { email: user.email },
        data: {
          ...(name && { name }),
          ...(lastName && { lastName }),
          ...(email && { email }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          lastName: true,
          role: true,
          language: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error("Error in updateUserProfile:", error);
      throw error;
    }
  },

  async findUserByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },

  // Setup training profile
  async setupTrainingProfile(userId, trainingData) {
    // This would be implemented based on your specific requirements
    // for training setup

    // Example implementation:
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        trainingProfile: {
          create: trainingData,
        },
      },
      include: {
        trainingProfile: true,
      },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },

  // Verify password
  async verifyPassword(email, password) {
    try {
      const user = await this.getUserByEmail(email);

      if (!user || !user.password) {
        return false;
      }

      const isValid = await compare(password, user.password);
      return isValid;
    } catch (error) {
      console.error("Password verification error:", error);
      return false;
    }
  },

  // Delete user
  async deleteUser(userId) {
    await prisma.user.delete({
      where: { id: userId },
    });

    return { success: true };
  },

  // Update user language
  async updateUserLanguage(userId, language) {
    try {
      if (!userId || !language) {
        throw new Error("User ID and language are required");
      }

      // Get user by ID first to get their email
      const user = await this.getUserByEmail(userId);
      
      // Update using email
      const updatedUser = await prisma.user.update({
        where: { email: user.email },
        data: { language },
        select: {
          id: true,
          name: true,
          email: true,
          lastName: true,
          role: true,
          language: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return updatedUser;
    } catch (error) {
      console.error("Error in updateUserLanguage:", error);
      if (error.code === 'P2025') {
        throw new Error("User not found");
      }
      throw error;
    }
  },

  // Verify email
  async verifyEmail(email, token) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: email,
          emailVerificationToken: token
        }
      });

      if (!user) {
        throw new Error('Invalid verification token or email');
      }

      return await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailVerificationToken: null
        },
        select: {
          id: true,
          name: true,
          email: true,
          lastName: true,
          role: true,
          language: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        }
      });
    } catch (error) {
      console.error("Error in verifyEmail:", error);
      throw error;
    }
  },

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExpiry: {
            gt: new Date()
          }
        }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      const hashedPassword = await hash(newPassword, 12);
      
      return await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null
        },
        select: {
          id: true,
          name: true,
          email: true,
          lastName: true,
          role: true,
          language: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        }
      });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      throw error;
    }
  },

  // Initiate password reset
  async initiatePasswordReset(email) {
    try {
      const user = await this.findUserByEmail(email);
      
      if (!user) {
        return null; // Return null instead of throwing to maintain security
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 3600000);

      return await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry
        },
        select: {
          id: true,
          name: true,
          email: true,
          lastName: true,
          role: true,
          language: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        }
      });
    } catch (error) {
      console.error("Error in initiatePasswordReset:", error);
      throw error;
    }
  },
};
