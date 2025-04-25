import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        if (!user.password) {
          throw new Error("No password set for this user");
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
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create new user with default role
          const newUser = await prisma.user.create({
            data: {
              name: user.name,
              email: user.email,
              role: null,
            },
          });
          
          // Update the user object with the role
          user.role = newUser.role?.toLowerCase();
        } else {
          // Update the user object with existing user's role
          user.role = existingUser.role?.toLowerCase();
        }
      }
      
      return true;
    },
    async session({ session, token }) {

      
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role?.toLowerCase();
      }
      
      return session;
    },
    async jwt({ token, user, account, trigger, session }) {

      
      // Handle session update
      if (trigger === "update" && session?.role) {
        token.role = session.role?.toLowerCase();
      }
      
      // Handle initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role?.toLowerCase();
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
