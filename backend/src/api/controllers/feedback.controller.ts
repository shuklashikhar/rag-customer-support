import type { Request, Response } from 'express'
import { feedbackRepository } from '../../db/repositories/feedback.repository'
import { AppError } from '../middlewares/errorHandler.middleware'
import { prisma } from '../../config/database'

export const feedbackController = {

  async create(req: Request, res: Response) {
    const { messageId, rating, comment } = req.body
    const userId = req.user!.userId

    // Check message exists
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    })
    if (!message) {
      throw new AppError('Message not found', 404)
    }

    const feedback = await feedbackRepository.create({
      messageId,
      userId,
      rating,
      comment
    })

    res.status(201).json({
      success: true,
      message: 'Feedback saved',
      data: { feedback }
    })
  }
}