import { prisma } from '../../config/database'

export const messageRepository = {

  async create(data: {
    conversationId: string
    role: string
    content: string
    sources?: any
  }) {
    return prisma.message.create({ data })
  },

  async countAll() {
    return prisma.message.count()
  }
}