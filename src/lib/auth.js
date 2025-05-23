import { verifyPhoneCode } from "@/app/api/auth/services/phone";
import {
  findUserByEmail,
  findUserByPhone,
  verifyUserPassword,
} from "@/app/api/users/services";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

const createDefaultTheme = async () => {
  return await prisma.theme.create({
    data: {
      name: "Default Theme",
      colors: {
        primary: "#000000",
        secondary: "#ffffff",
        accent: "#4a90e2",
      },
      design: {
        fontFamily: "Arial",
        borderRadius: "4px",
      },
      isCustom: false,
    },
  });
};

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

          const user = await findUserByEmail(credentials.email);

          if (!user) {
            throw new Error("Invalid email or password");
          }

          // Check if user has email verification
          if (!user.emailVerified) {
            throw new Error("Please verify your email first");
          }

          // Check if user has password set
          if (!user.password) {
            // If user just registered, allow them to proceed
            if (user.emailVerified && !user.phoneVerified) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
              };
            }
            throw new Error("No password set for this account ");
          }

          const isPasswordValid = await verifyUserPassword(
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

          const user = await findUserByPhone(credentials.phone);
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
          const existingUser = await findUserByEmail(user.email);

          if (!existingUser) {
            // Create default theme first
            const defaultTheme = await createDefaultTheme();

            // Create new user with theme
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || profile.name,
                lastName: profile.family_name || "",
                emailVerified: true,
                phoneVerified: false,
                language: "en",
                themeId: defaultTheme.id,
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
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Get user with theme from database using email
        let user = await prisma.user.findUnique({
          where: { email: token.email },
          include: { theme: true },
        });

        // If user exists but has no theme, create one
        if (user && !user.theme) {
          const defaultTheme = await createDefaultTheme();
          user = await prisma.user.update({
            where: { id: user.id },
            data: { themeId: defaultTheme.id },
            include: { theme: true },
          });
        }

        console.log("User data from database:", {
          email: user?.email,
          themeId: user?.themeId,
          theme: user?.theme,
        });

        session.user.id = user?.id || token.id;
        session.user.role = user?.role || token.role;
        session.user.phone = user?.phone || token.phone;
        session.user.email = token.email;
        session.user.theme = user?.theme || null;
        session.user.themeId = user?.themeId || null;
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
