import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../../utils/generateToken'
import { AppError } from './errorHandler.middleware'

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('No token provided', 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = verifyToken(token)
    req.user = payload
    next()
  } catch (error) {
    throw new AppError('Invalid or expired token', 401)
  }
}