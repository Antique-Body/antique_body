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

async function getUserWithAccounts(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      accounts: {
        select: {
          provider: true,
          type: true,
        },
      },
      trainerInfo: {
        include: {
          trainerProfile: true,
        },
      },
      clientInfo: {
        include: {
          clientProfile: true,
        },
      },
    },
  });
}

async function createOrUpdateAccount(userId, account) {
  try {
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        },
      },
      update: {
        access_token: account.access_token,
        refresh_token: account.refresh_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      },
      create: {
        userId: userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      },
    });
  } catch (error) {
    console.error("Error creating/updating account:", error);
  }
}

export const authConfig = {
  providers,
  debug: true,
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
        let existingUser = await userService.findUserByEmail(user.email);

        if (!existingUser) {
          // Create new user
          existingUser = await prisma.user.create({
            data: {
              email: user.email,
              emailVerified: new Date(),
              phoneVerified: null,
              language: "en",
            },
          });
        } else if (!existingUser.emailVerified) {
          // Update emailVerified if not set
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { emailVerified: new Date() },
          });
        }

        // Create or update Account record
        await createOrUpdateAccount(existingUser.id, account);
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
          include: {
            trainerInfo: {
              include: {
                trainerProfile: true,
              },
            },
            clientInfo: {
              include: {
                clientProfile: true,
              },
            },
          },
        });
        if (userFromDb) {
          Object.assign(token, {
            role: userFromDb.role,
            trainerProfile: userFromDb.trainerInfo?.trainerProfile || null,
            clientProfile: userFromDb.clientInfo?.clientProfile || null,
          });
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
          const userWithAccounts = await getUserWithAccounts(userFromDb.id);
          Object.assign(session.user, {
            id: userFromDb.id,
            role: userFromDb.role,
            email: userFromDb.email,
            phone: userFromDb.phone,
            trainerProfile:
              userWithAccounts?.trainerInfo?.trainerProfile || null,
            clientProfile: userWithAccounts?.clientInfo?.clientProfile || null,
            accounts: userWithAccounts?.accounts || [],
            provider: token.provider,
            accountType: token.accountType,
          });
        } else {
          // If user does not exist in DB, invalidate session
          return null;
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
