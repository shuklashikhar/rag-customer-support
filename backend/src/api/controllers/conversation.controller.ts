import type { Request, Response } from 'express'
import { conversationRepository } from '../../db/repositories/conversation.repository'
import { AppError } from '../middlewares/errorHandler.middleware'

export const conversationController = {

  async list(req: Request, res: Response) {
    const userId = req.user!.userId
    const conversations = await conversationRepository.findByUserId(userId)

    res.json({
      success: true,
      data: { conversations }
    })
  },

  async getOne(req: Request<{id: string}>, res: Response) {
    const { id } = req.params
    const userId = req.user!.userId

    const conversation = await conversationRepository.findById(id)

    if (!conversation) {
      throw new AppError('Conversation not found', 404)
    }

    // Make sure user owns this conversation
    if (conversation.userId !== userId) {
      throw new AppError('Not authorized', 403)
    }

    res.json({
      success: true,
      data: { conversation }
    })
  },

  async delete(req: Request< { id: string }>, res: Response) {
    const { id } = req.params
    const userId = req.user!.userId

    const conversation = await conversationRepository.findById(id)

    if (!conversation) {
      throw new AppError('Conversation not found', 404)
    }

    if (conversation.userId !== userId) {
      throw new AppError('Not authorized', 403)
    }

    await conversationRepository.delete(id)

    res.json({
      success: true,
      message: 'Conversation deleted'
    })
  }
}