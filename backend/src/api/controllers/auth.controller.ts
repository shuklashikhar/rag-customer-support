import type { Request, Response } from 'express'
import { userRepository } from '../../db/repositories/user.repository'
import { hashPassword, comparePassword } from '../../utils/hashPassword'
import { generateToken } from '../../utils/generateToken'
import { AppError } from '../middlewares/errorHandler.middleware'

export const authController = {

  async register(req: Request, res: Response) {
    const { email, password } = req.body

    // Check if user already exists
    const existing = await userRepository.findByEmail(email)
    if (existing) {
      throw new AppError('Email already registered', 409)
    }

    // Hash password
    const hashed = await hashPassword(password)

    // Create user
    const user = await userRepository.create({ email, password: hashed })

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user, token }
    })
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body

    // Find user
    const user = await userRepository.findByEmail(email)
    if (!user) {
      throw new AppError('Invalid email or password', 401)
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401)
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        },
        token
      }
    })
  },

  async logout(req: Request, res: Response) {
    // JWT is stateless — client just deletes the token
    // If you want server-side logout later, use a token blacklist in Redis
    res.json({
      success: true,
      message: 'Logged out successfully'
    })
  },

  async me(req: Request, res: Response) {
    const user = await userRepository.findById(req.user!.userId)
    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.json({
      success: true,
      data: { user }
    })
  }

}