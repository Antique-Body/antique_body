import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import { getToken } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

import { verifyPhoneCode } from "@/app/api/auth/services/phone";
import { userService } from "@/app/api/users/services";

const prisma = new PrismaClient();

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      id: "email",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const user = await userService.findUserByEmail(credentials.email);

          if (!user) {
            throw new Error("Invalid email or password");
          }

          // Check if user has email verification
          if (!user.emailVerified) {
            throw new Error("Please verify your email first");
          }

          // Check if user has password set
          if (!user.password) {
            throw new Error("No password set for this account");
          }

          const isPasswordValid = await userService.verifyUserPassword(
            user.id,
            credentials.password
          );
          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
    CredentialsProvider({
      id: "phone",
      name: "Phone",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "Verification Code", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.phone || !credentials?.code) {
            throw new Error("Phone number and verification code are required");
          }

          const user = await userService.findUserByPhone(credentials.phone);
          if (!user) {
            throw new Error("User not found");
          }

          if (!user.phoneVerified) {
            throw new Error("Phone number is not verified");
          }

          const isCodeValid = await verifyPhoneCode(
            credentials.phone,
            credentials.code
          );
          if (!isCodeValid) {
            throw new Error("Invalid or expired verification code");
          }

          return {
            id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          // Check if user already exists
          const existingUser = await userService.findUserByEmail(user.email);

          if (!existingUser) {
            // Extract first and last name from the profile
            let firstName = "";
            let lastName = "";

            if (profile?.given_name && profile?.family_name) {
              firstName = profile.given_name;
              lastName = profile.family_name;
            } else if (user.name) {
              // Fallback: split the full name
              const nameParts = user.name.split(" ");
              firstName = nameParts[0] || "";
              lastName = nameParts.slice(1).join(" ") || "";
            }

            // Create new user if doesn't exist
            await prisma.user.create({
              data: {
                email: user.email,
                firstName: firstName,
                lastName: lastName,
                emailVerified: true,
                phoneVerified: false,
                language: "en",
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      if ((!token.role || !token.firstName || !token.lastName) && token.email) {
        const userFromDb = await prisma.user.findUnique({
          where: { email: token.email },
          select: {
            id: true,
            role: true,
            phone: true,
            firstName: true,
            lastName: true,
          },
        });
        if (userFromDb) {
          token.id = userFromDb.id;
          token.role = userFromDb.role;
          token.phone = userFromDb.phone;
          token.firstName = userFromDb.firstName;
          token.lastName = userFromDb.lastName;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        let userFromDb = null;
        if (token.email) {
          userFromDb = await prisma.user.findUnique({
            where: { email: token.email },
            select: {
              id: true,
              role: true,
              email: true,
              phone: true,
              firstName: true,
              lastName: true,
            },
          });
        } else if (token.phone) {
          userFromDb = await prisma.user.findUnique({
            where: { phone: token.phone },
            select: {
              id: true,
              role: true,
              email: true,
              phone: true,
              firstName: true,
              lastName: true,
            },
          });
        }
        if (userFromDb) {
          session.user.id = userFromDb.id;
          session.user.role = userFromDb.role;
          session.user.email = userFromDb.email;
          session.user.phone = userFromDb.phone;
          session.user.firstName = userFromDb.firstName;
          session.user.lastName = userFromDb.lastName;
        } else {
          // fallback from token if DB not found
          session.user.firstName = token.firstName;
          session.user.lastName = token.lastName;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Export for App Router
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Export for Pages Router
export const authOptions = authConfig;

// Check if the user is authenticated
export const isAuthenticated = async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return { authenticated: false };
  return { authenticated: true, user: token };
};

// Check if the user has a specific role
export const hasRole = async (req, allowedRoles) => {
  const { authenticated, user } = await isAuthenticated(req);

  if (!authenticated) {
    return { authorized: false, message: "Not authenticated" };
  }

  if (!user.role) {
    return { authorized: false, message: "User has no role assigned" };
  }

  if (allowedRoles.includes(user.role)) {
    return { authorized: true, user };
  }

  return {
    authorized: false,
    message: "You don't have permission to access this resource",
  };
};
