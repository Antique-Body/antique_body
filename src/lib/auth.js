import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import crypto from "crypto";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

const prismaClient = new PrismaClient();

const handleEmailVerification = async (user) => {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  await prismaClient.user.update({
    where: { id: user.id },
    data: { emailVerificationToken: verificationToken },
  });

  try {
    const { sendVerificationEmail } = await import("@/app/utils/email");
    await sendVerificationEmail(user.email, verificationToken);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }

  throw new Error(
    "Email not verified. We've sent a verification email. Please check your inbox."
  );
};

export const authOptions = {
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
          include: {
            accounts: true,
            sessions: true,
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.password) {
          throw new Error("No password set for this user");
        }

        if (!user.emailVerified) {
          await handleEmailVerification(user);
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );
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
      if (account?.provider === "google" || account?.provider === "facebook") {
        const existingUser = await prismaClient.user.findUnique({
          where: { email: user.email },
          include: { preferences: true },
        });

        if (!existingUser) {
          const newUser = await prismaClient.user.create({
            data: {
              name: user.name,
              email: user.email,
              lastName: "",
              role: null,
              emailVerified: true,
              language: "en",
            },
          });

          user.id = newUser.id;
          user.role = newUser.role?.toLowerCase();
          user.hasCompletedTrainingSetup = false;
          user.language = newUser.language;
        } else {
          user.id = existingUser.id;
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
        session.user.hasCompletedTrainingSetup =
          token.hasCompletedTrainingSetup;
        session.user.language = token.language;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return {
          ...token,
          ...(session.role && { role: session.role.toLowerCase() }),
          ...(session.hasCompletedTrainingSetup !== undefined && {
            hasCompletedTrainingSetup: session.hasCompletedTrainingSetup,
          }),
          ...(session.language && { language: session.language }),
        };
      }

      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role?.toLowerCase(),
          hasCompletedTrainingSetup: user.hasCompletedTrainingSetup,
          language: user.language,
        };
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
