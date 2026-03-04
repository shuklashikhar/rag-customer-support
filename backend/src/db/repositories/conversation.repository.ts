import { prisma } from '../../config/database'

export const conversationRepository = {

  async create(userId: string, title: string) {
    return prisma.conversation.create({
      data: { userId, title }
    })
  },

  async findById(id: string) {
    return prisma.conversation.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    })
  },

  async findByUserId(userId: string) {
    return prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      }
    })
  },

  async delete(id: string) {
    return prisma.conversation.delete({ where: { id } })
  },

  async countAll() {
    return prisma.conversation.count()
  }
}