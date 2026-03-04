import type { Request, Response, NextFunction } from 'express'
import { AppError } from './errorHandler.middleware'

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Not authenticated', 401)
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Not authorized', 403)
    }

    next()
  }
}