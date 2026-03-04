import { z } from 'zod'

export const chatSchema = z.object({
  body: z.object({
    query: z.string().min(1, 'Query cannot be empty').max(1000),
    conversationId: z.string().uuid().optional()
  })
})