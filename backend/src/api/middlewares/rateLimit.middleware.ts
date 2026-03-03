import rateLimit from 'express-rate-limit'

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,   // 1 minute
  max: 20,                    // 20 requests per minute per IP
  message: {
    success: false,
    message: 'Too many requests, please slow down'
  },
  standardHeaders: true,
  legacyHeaders: false
})