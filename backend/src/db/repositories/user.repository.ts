import { prisma } from '../../config/database'

export const userRepository = {

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    })
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    })
  },

  async create(data: { email: string; password: string }) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    })
  },

  async countAll() {
    return prisma.user.count()
  }

}