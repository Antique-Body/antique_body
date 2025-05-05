import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query'],
  })
}

const globalForPrisma = global

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prismaClientSingleton()
}

export const prisma = globalForPrisma.prisma 