import { prisma } from '../../config/database'

export const feedbackRepository = {

  async create(data: {
    messageId: string
    userId: string
    rating: number
    comment?: string
  }) {
    return prisma.feedback.create({ data })
  },

  async findAll() {
    return prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        message: {
          select: { content: true, conversationId: true }
        },
        user: {
          select: { email: true }
        }
      }
    })
  },

  async countAll() {
    return prisma.feedback.count()
  },

  async countPositive() {
    return prisma.feedback.count({ where: { rating: 1 } })
  },

  async countNegative() {
    return prisma.feedback.count({ where: { rating: -1 } })
  }
}