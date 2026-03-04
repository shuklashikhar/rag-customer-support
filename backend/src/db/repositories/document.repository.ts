import { prisma } from '../../config/database'

export const documentRepository = {

  async create(data: {
    id: string
    name: string
    fileType: string
    uploadedBy: string
  }) {
    return prisma.document.create({ data })
  },

  async updateStatus(id: string, status: string, chunkCount?: number) {
    return prisma.document.update({
      where: { id },
      data: {
        status,
        ...(chunkCount !== undefined && { chunkCount })
      }
    })
  },

  async findAll() {
    return prisma.document.findMany({
      orderBy: { createdAt: 'desc' }
    })
  },

  async findById(id: string) {
    return prisma.document.findUnique({ where: { id } })
  },

  async delete(id: string) {
    return prisma.document.delete({ where: { id } })
  },

  async countAll() {
    return prisma.document.count()
  }

}