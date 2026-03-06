import type { Request, Response } from 'express'
import { conversationRepository } from '../../db/repositories/conversation.repository'
import { feedbackRepository } from '../../db/repositories/feedback.repository'
import { documentRepository } from '../../db/repositories/document.repository'
import { userRepository } from '../../db/repositories/user.repository'
import { messageRepository } from '../../db/repositories/message.repository'
import { prisma } from '../../config/database'

export const adminController = {

  async getAllConversations(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true } },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' }
          }
        }
      }),
      conversationRepository.countAll()
    ])

    res.json({
      success: true,
      data: {
        conversations,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      }
    })
  },

  async getAllFeedback(req: Request, res: Response) {
    const feedback = await feedbackRepository.findAll()

    res.json({
      success: true,
      data: { feedback }
    })
  },

  async getStats(req: Request, res: Response) {
    const [
      totalUsers,
      totalConversations,
      totalMessages,
      totalDocuments,
      totalFeedback,
      positiveFeedback,
      negativeFeedback
    ] = await Promise.all([
      userRepository.countAll(),
      conversationRepository.countAll(),
      messageRepository.countAll(),
      documentRepository.countAll(),
      feedbackRepository.countAll(),
      feedbackRepository.countPositive(),
      feedbackRepository.countNegative()
    ])

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalConversations,
          totalMessages,
          totalDocuments,
          feedback: {
            total: totalFeedback,
            positive: positiveFeedback,
            negative: negativeFeedback
          }
        }
      }
    })
  }
}