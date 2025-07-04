import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    log: ["error", "warn"],
  });
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    });
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
