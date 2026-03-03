import express from 'express'
import helmet from 'helmet'
import cors from 'cors'


import { config } from './config/index'
import { errorHandler } from './api/middlewares/errorHandler.middleware'
import { rateLimiter } from './api/middlewares/rateLimit.middleware'
import { logger } from './utils/logger'

import healthRouter from './api/routes/health.routes'
import authRouter from './api/routes/auth.routes'
import chatRouter from './api/routes/chat.routes'
import documentRouter from './api/routes/document.routes'
import conversationRouter from './api/routes/conversation.routes'
import feedbackRouter from './api/routes/feedback.routes'
import adminRouter from './api/routes/admin.routes'

const app = express()

// Security
app.use(helmet())
app.use(cors({ origin: config.FRONTEND_URL, credentials: true }))

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting
app.use(rateLimiter)

// Request logging
app.use((req, res, next) => {
  logger.info({ method: req.method, path: req.path }, 'Incoming request')
  next()
})

// Routes
app.use('/api/v1/health', healthRouter)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/chat', chatRouter)
app.use('/api/v1/documents', documentRouter)
app.use('/api/v1/conversations', conversationRouter)
app.use('/api/v1/feedback', feedbackRouter)
app.use('/api/v1/admin', adminRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Global error handler (must be last)
app.use(errorHandler)

export default app