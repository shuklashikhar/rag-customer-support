import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export const connectDatabase = async () => {
  try {
    await prisma.$connect()
    logger.info('✅ Database connected')
  } catch (error) {
    logger.error('❌ Database connection failed')
    process.exit(1)
  }
}