import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { AppError } from './errorHandler.middleware'

export const validate = (schema: z.ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    })

    if (!result.success) {
      const message = result.error.issues   
        .map(e => e.message)
        .join(', ')
      throw new AppError(message, 400)
    }

    next()
  }
}