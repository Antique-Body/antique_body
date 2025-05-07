import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const prismaClient = new PrismaClient();

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            httpOptions: {
                timeout: 10000 // Increase timeout to 10 seconds
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                const user = await prismaClient.user.findUnique({
                    where: { email: credentials.email },
                    include: { preferences: true },
                });

                if (!user) {
                    throw new Error("User not found");
                }

                if (!user.password) {
                    throw new Error("No password set for this user");
                }

                // Only enforce email verification if there is a token
                if (!user.emailVerified && user.emailVerificationToken) {
                    // Generate new verification token if needed
                    const crypto = require("crypto");
                    const verificationToken = crypto.randomBytes(32).toString("hex");
                    await prismaClient.user.update({
                        where: { id: user.id },
                        data: { emailVerificationToken: verificationToken },
                    });

                    // Send verification email
                    try {
                        const { sendVerificationEmail } = await import("@/app/utils/email");
                        await sendVerificationEmail(user.email, verificationToken);
                    } catch (error) {
                        console.error("Error sending verification email during login:", error);
                    }

                    throw new Error("Email not verified. We've sent a new verification email. Please check your inbox.");
                }

                // Don't auto-fix verification status - require proper verification
                if (!user.emailVerified) {
                    // Generate new verification token
                    const crypto = require("crypto");
                    const verificationToken = crypto.randomBytes(32).toString("hex");
                    await prismaClient.user.update({
                        where: { id: user.id },
                        data: { emailVerificationToken: verificationToken },
                    });

                    // Send verification email
                    try {
                        const { sendVerificationEmail } = await import("@/app/utils/email");
                        await sendVerificationEmail(user.email, verificationToken);
                    } catch (error) {
                        console.error("Error sending verification email during login:", error);
                    }

                    throw new Error("Email not verified. We've sent a verification email. Please check your inbox.");
                }

                const isPasswordValid = await compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role?.toLowerCase(),
                    hasCompletedTrainingSetup: !!user.preferences,
                    language: user.language,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                const existingUser = await prismaClient.user.findUnique({
                    where: { email: user.email },
                    include: { preferences: true },
                });

                if (!existingUser) {
                    // Create new user with default role and verified email (since Google auth is verified)
                    const newUser = await prismaClient.user.create({
                        data: {
                            name: user.name,
                            email: user.email,
                            lastName: "",
                            role: null,
                            emailVerified: true,
                            language: "en", // Default language
                        },
                    });

                    user.role = newUser.role?.toLowerCase();
                    user.hasCompletedTrainingSetup = false;
                    user.language = newUser.language;
                } else {
                    user.role = existingUser.role?.toLowerCase();
                    user.hasCompletedTrainingSetup = !!existingUser.preferences;
                    user.language = existingUser.language;
                }
            }

            return true;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role?.toLowerCase();
                session.user.hasCompletedTrainingSetup = token.hasCompletedTrainingSetup;
                session.user.language = token.language;
            }

            return session;
        },
        async jwt({ token, user, trigger, session }) {
            // Handle session update
            if (trigger === "update" && session) {
                if (session.role) {
                    token.role = session.role.toLowerCase();
                }
                if (session.hasCompletedTrainingSetup !== undefined) {
                    token.hasCompletedTrainingSetup = session.hasCompletedTrainingSetup;
                }
                if (session.language) {
                    token.language = session.language;
                }
            }

            // Handle initial sign in
            if (user) {
                token.id = user.id;
                token.role = user.role?.toLowerCase();
                token.hasCompletedTrainingSetup = user.hasCompletedTrainingSetup;
                token.language = user.language;
            }

            return token;
        },
    },
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
