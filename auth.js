import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

import { verifyPhoneCode } from "@/app/api/auth/services/phone";
import { userService } from "@/app/api/users/services";

const prisma = new PrismaClient();

const mapGoogleProfile = (profile) => ({
  id: profile.sub,
  email: profile.email,
  name: profile.name,
  firstName: profile.given_name,
  lastName: profile.family_name,
  image: profile.picture,
});

const mapFacebookProfile = (profile) => ({
  id: profile.id,
  email: profile.email,
  name: profile.name,
  firstName: profile.first_name,
  lastName: profile.last_name,
  image: profile.picture?.data?.url,
});

const providers = [
  GoogleProvider({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    profile: mapGoogleProfile,
  }),
  FacebookProvider({
    clientId: process.env.AUTH_FACEBOOK_ID,
    clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    userinfo: {
      url: "https://graph.facebook.com/me?fields=id,email,first_name,last_name,name,picture",
    },
    profile: mapFacebookProfile,
  }),
  CredentialsProvider({
    id: "email",
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Email and password are required");
      }
      const user = await userService.findUserByEmail(credentials.email);
      if (!user) throw new Error("Invalid email or password");
      if (!user.emailVerified)
        throw new Error("Please verify your email first");
      if (!user.password) throw new Error("No password set for this account");
      const isPasswordValid = await userService.verifyUserPassword(
        user.id,
        credentials.password
      );
      if (!isPasswordValid) throw new Error("Invalid email or password");
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
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
      if (!credentials?.phone || !credentials?.code) {
        throw new Error("Phone number and verification code are required");
      }
      const user = await userService.findUserByPhone(credentials.phone);
      if (!user) throw new Error("User not found");
      if (!user.phoneVerified) throw new Error("Phone number is not verified");
      const isCodeValid = await verifyPhoneCode(
        credentials.phone,
        credentials.code
      );
      if (!isCodeValid) throw new Error("Invalid or expired verification code");
      return {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      };
    },
  }),
];

async function getUserByEmailOrPhone({ email, phone }) {
  if (email) return prisma.user.findUnique({ where: { email } });
  if (phone) return prisma.user.findUnique({ where: { phone } });
  return null;
}

export const authConfig = {
  providers,
  //this is change for stage server
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 15, // 15 minutes
      },
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (["google", "facebook"].includes(account?.provider)) {
        const existingUser = await userService.findUserByEmail(user.email);
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              emailVerified: true,
              phoneVerified: false,
              language: "en",
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const userFromDb = await getUserByEmailOrPhone({
          email: user.email,
          phone: user.phone,
        });
        if (userFromDb) {
          Object.assign(token, {
            id: userFromDb.id,
            role: userFromDb.role,
            trainerProfile: userFromDb.trainerProfile,
            clientProfile: userFromDb.clientProfile,
          });
        } else {
          Object.assign(token, { id: user.id, role: user.role });
        }
        token.email = user.email;
        token.phone = user.phone;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      if (token.id) {
        const userFromDb = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true, trainerProfile: true, clientProfile: true },
        });
        if (userFromDb) {
          Object.assign(token, userFromDb);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const userFromDb = await getUserByEmailOrPhone({
          email: token.email,
          phone: token.phone,
        });
        if (userFromDb) {
          Object.assign(session.user, {
            id: userFromDb.id,
            role: userFromDb.role,
            email: userFromDb.email,
            phone: userFromDb.phone,
            trainerProfile: userFromDb.trainerProfile,
            clientProfile: userFromDb.clientProfile,
          });
        } else {
          Object.assign(session.user, {
            id: token.id,
            role: token.role,
            email: token.email,
            phone: token.phone,
          });
        }
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
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
  secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
