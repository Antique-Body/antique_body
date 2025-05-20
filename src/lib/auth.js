import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  deleteVerificationCode,
  findUserByPhone,
  verifyPhoneCode,
} from "./utils";

const prisma = new PrismaClient();

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("=== Starting Email Authentication ===");
        console.log("Received credentials:", {
          email: credentials?.email,
          hasPassword: !!credentials?.password,
        });

        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          console.log("Looking for user in database...");
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log("User found:", {
            exists: !!user,
            hasPassword: !!user?.password,
            id: user?.id,
            email: user?.email,
          });

          if (!user) {
            throw new Error("User not found");
          }

          if (!user.password) {
            throw new Error("User has no password set");
          }

          console.log("Comparing passwords...");
          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );
          console.log("Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          console.log("Authentication successful, returning user data");
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          console.error("Error stack:", error.stack);
          throw error;
        }
      },
    }),
    CredentialsProvider({
      name: "Phone",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "Verification Code", type: "text" },
      },
      async authorize(credentials) {
        console.log("=== Starting Phone Authentication ===");
        console.log("Received credentials:", {
          phone: credentials?.phone,
          hasCode: !!credentials?.code,
        });

        try {
          if (!credentials?.phone || !credentials?.code) {
            throw new Error("Phone number and verification code are required");
          }

          console.log("Verifying phone code...");
          const verification = await verifyPhoneCode(
            credentials.phone,
            credentials.code
          );
          console.log("Verification result:", !!verification);

          if (!verification) {
            throw new Error("Invalid or expired verification code");
          }

          console.log("Looking for user by phone...");
          const user = await findUserByPhone(credentials.phone);
          console.log("User found:", {
            exists: !!user,
            id: user?.id,
            phone: user?.phone,
          });

          if (!user) {
            throw new Error("User not found");
          }

          console.log("Deleting verification code...");
          await deleteVerificationCode(verification.id);

          console.log("Authentication successful, returning user data");
          return {
            id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          console.error("Error stack:", error.stack);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("=== JWT Callback ===");
      console.log("Token before:", token);
      console.log("User data:", user);

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
        token.email = user.email;
      }

      console.log("Token after:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("=== Session Callback ===");
      console.log("Session before:", session);
      console.log("Token:", token);

      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.phone = token.phone;
        session.user.email = token.email;
      }

      console.log("Session after:", session);
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
