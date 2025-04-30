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
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
        });

        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    },

    // Update user profile
    async updateUserProfile(userId, userData) {
        const { name, lastName, email } = userData;

        // Check if email is being changed and if it's already in use
        if (email) {
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser && existingUser.id !== userId) {
                throw new Error("Email already in use");
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(lastName && { lastName }),
                ...(email && { email }),
            },
        });

        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
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
};
