import { z } from 'zod'

export const feedbackSchema = z.object({
  body: z.object({
    messageId: z.string().uuid('Invalid message ID'),
    rating: z.number().refine(v => v === 1 || v === -1, {
      message: 'Rating must be 1 or -1'
    }),
    comment: z.string().max(500).optional()
  })
})